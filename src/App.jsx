import { useCallback, useEffect, useRef, useState } from 'react'
import { Globe } from 'lucide-react'
import { preloadUserApps } from './components/AppPickerDialog.jsx'
import { LanguageDialog } from './components/LanguageDialog.jsx'
import { openUrl } from './components/M3.jsx'
import {
	MODDIR,
	PERSISTENT_DIR,
	SWITCH_ACTIONS,
	parseConfigSh,
	updateConfig,
} from './lib/brene.js'
import { useI18n } from './lib/i18n.jsx'
import { enableInsets, exec, toast } from './lib/kernelsu.js'
import {
	AdvancedTab,
	AndroidTab,
	HidingTab,
	InfoTab,
	KsuTab,
	RomTab,
	SpoofingTab,
} from './tabs/BasicTabs.jsx'
import { HomeTab } from './tabs/HomeTab.jsx'
import { SusfsTab } from './tabs/SusfsTab.jsx'

const TABS = [
	{ id: 'home', label: 'Home' },
	{ id: 'android', label: 'Android' },
	{ id: 'hiding', label: 'Hiding' },
	{ id: 'spoofing', label: 'Spoofing' },
	{ id: 'susfs', label: 'SUSFS' },
	{ id: 'ksu', label: 'KSU' },
	{ id: 'rom', label: 'ROM' },
	{ id: 'advanced', label: 'Advanced' },
	{ id: 'info', label: 'Info' },
]

export function App() {
	const { lang, t } = useI18n()
	const [activeTab, setActiveTab] = useState(() => {
		try {
			const saved = sessionStorage.getItem('brene_tab')
			if (saved && TABS.some((x) => x.id === saved)) return saved
		} catch {}
		return 'home'
	})
	const [langOpen, setLangOpen] = useState(false)

	const [versions, setVersions] = useState({ brene: 'v0.0.00', susfs: 'v0.0.0' })
	const [status, setStatus] = useState({
		deviceModel: 'Loading...',
		kernelVersion: 'Loading...',
		androidVersion: 'Loading...',
		customRom: 'Loading...',
		susfsVariant: 'Loading...',
		susStatus: 'Loading...',
		kernelFeatures: 'Loading...',
		suspiciousMounts: 'Loading...',
		logs: '',
	})
	const [installedModules, setInstalledModules] = useState(() => new Set())
	const [hasIntegrityBox, setHasIntegrityBox] = useState(false)
	const [hasTaUtl, setHasTaUtl] = useState(false)

	const [config, setConfig] = useState({})
	const [uname, setUname] = useState({ release: '', version: '' })
	const [vbh, setVbh] = useState('')

	const tabBtnRefs = useRef({})
	const touchStart = useRef({ x: 0, y: 0 })

	const loadConfig = useCallback(() => {
		exec(`cat ${PERSISTENT_DIR}/config.sh`).then((result) => {
			if (result.errno !== 0) {
				toast('Failed to load')
				return
			}
			const parsed = parseConfigSh(result.stdout)
			const boolConfig = {}
			for (const [k, v] of Object.entries(parsed)) {
				if (k.startsWith('config_')) {
					boolConfig[k.slice('config_'.length)] = parseInt(v, 10) === 1
				}
			}
			setConfig(boolConfig)
			setUname({
				release: parsed.config_custom_uname_kernel_release || '',
				version: parsed.config_custom_uname_kernel_version || '',
			})
			setVbh(parsed.config_spoof_verified_boot_hash || '')
		})
	}, [])

	useEffect(() => {
		enableInsets(true)
		preloadUserApps()
		loadConfig()

		exec(`grep "^version=" ${MODDIR}/module.prop | cut -d'=' -f2`).then((r) => {
			setVersions((v) => ({ ...v, brene: r.errno === 0 ? r.stdout : 'unknown' }))
		})
		exec('susfs show version').then((r) => {
			setVersions((v) => ({ ...v, susfs: r.errno === 0 ? r.stdout : 'unknown' }))
		})

		exec('resetprop ro.build.version.release && resetprop ro.build.version.sdk').then((r) => {
			if (r.errno !== 0) {
				setStatus((s) => ({ ...s, androidVersion: 'Failed to load' }))
				return
			}
			const splits = r.stdout.replaceAll('\n', ' ').split(' ')
			setStatus((s) => ({
				...s,
				androidVersion: `${splits[0]} (API ${splits[1]}) | SDK ${splits[1]}`,
			}))
		})

		exec('susfs show variant').then((r) => {
			setStatus((s) => ({
				...s,
				susfsVariant: r.errno === 0 ? r.stdout : 'Failed to load',
			}))
		})

		exec("cat /proc/version | awk '{print $3}' && uname -r").then((r) => {
			if (r.errno !== 0) {
				setStatus((s) => ({ ...s, kernelVersion: 'Failed to load' }))
				return
			}
			const [procVer, unameR] = r.stdout.split('\n')
			setStatus((s) => ({
				...s,
				kernelVersion:
					procVer === unameR ? `Default: ${procVer}` : `Default: ${procVer}\nSpoofed: ${unameR}`,
			}))
		})

		exec(
			'resetprop ro.product.manufacturer && resetprop ro.product.model && resetprop ro.product.device',
		).then(async (r) => {
			if (r.errno !== 0) {
				setStatus((s) => ({ ...s, deviceModel: 'Failed to load' }))
				return
			}
			const splits = r.stdout.split('\n')
			const mk = await exec('resetprop ro.product.marketname')
			const model = (mk.errno === 0 && mk.stdout) || splits[1]
			setStatus((s) => ({ ...s, deviceModel: `${splits[0]} ${model} | ${splits[2]}` }))
		})

		exec('[[ -n "$(find /system -iname "*lineage*")" ]] && echo "Yes" || echo "No"').then((r) => {
			setStatus((s) => ({ ...s, customRom: r.errno === 0 ? r.stdout : 'Failed to load' }))
		})

		exec('[[ -e /storage/emulated/0/..5.u.S ]] && echo "Abnormal" || echo "Normal"').then((r) => {
			setStatus((s) => ({ ...s, susStatus: r.errno === 0 ? r.stdout : 'Failed to load' }))
		})

		exec('susfs show enabled_features').then((r) => {
			setStatus((s) => ({
				...s,
				kernelFeatures:
					r.errno === 0 ? r.stdout.replaceAll('CONFIG_KSU_SUSFS_', '') : 'Failed to load',
			}))
		})

		exec(`cat /proc/1/mountinfo | grep -E "^2[0-9]{9,} .*$|KSU" | awk '{print $5}'`).then((r) => {
			setStatus((s) => ({
				...s,
				suspiciousMounts:
					r.errno !== 0 ? 'Failed to load' : r.stdout.length > 0 ? r.stdout : 'No mounts',
			}))
		})

		Promise.all([exec(`cat ${PERSISTENT_DIR}/log.txt`), exec(`cat ${PERSISTENT_DIR}/logs.txt`)]).then(
			([r1, r2]) => {
				const part1 = r1.errno === 0 ? r1.stdout : 'Failed to load'
				const part2 = r2.errno === 0 ? r2.stdout : 'Failed to load'
				setStatus((s) => ({ ...s, logs: `${part1}\n${part2}` }))
			},
		)

		exec('ksud module list').then((r) => {
			if (r.errno !== 0) return
			try {
				const mods = JSON.parse(r.stdout)
				setInstalledModules(new Set(mods.map((m) => m.id)))
				setHasIntegrityBox(r.stdout.includes('Integrity-Box'))
			} catch {}
		})

		exec('[[ -e /data/adb/modules/TA_utl ]]').then((r) => {
			if (r.errno === 0) setHasTaUtl(true)
		})
	}, [loadConfig])

	const selectTab = (id) => {
		setActiveTab(id)
		try {
			sessionStorage.setItem('brene_tab', id)
		} catch {}
		tabBtnRefs.current[id]?.scrollIntoView({
			behavior: 'smooth',
			block: 'nearest',
			inline: 'center',
		})
	}

	const handleToggle = (id, enabled) => {
		setConfig((prev) => ({ ...prev, [id]: enabled }))
		updateConfig(`config_${id}`, enabled ? 1 : 0)
		SWITCH_ACTIONS[id]?.(enabled)
		if (id === 'brene_logs' && enabled) {
			toast(t('Success, reboot to apply'))
		}
	}

	const handleTouchStart = (e) => {
		if (e.target.closest('nav')) return
		touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
	}

	const handleTouchEnd = (e) => {
		if (e.target.closest('nav')) return
		const dx = touchStart.current.x - e.changedTouches[0].clientX
		const dy = touchStart.current.y - e.changedTouches[0].clientY
		if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 3) {
			const idx = TABS.findIndex((x) => x.id === activeTab)
			const nextIdx = dx > 0 ? idx + 1 : idx - 1
			if (nextIdx >= 0 && nextIdx < TABS.length) {
				selectTab(TABS[nextIdx].id)
			}
		}
	}

	return (
		<div
			className="min-h-dvh flex flex-col safe-x safe-bottom bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]"
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			<div className="sticky top-0 z-30 safe-top bg-[var(--md-sys-color-surface-container-low)] border-b border-[var(--md-sys-color-outline-variant)]/70">
				<header className="max-w-[680px] mx-auto px-4 pt-3 pb-2 flex items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-3 min-w-0">
						<div className="flex items-baseline gap-1.5">
							<button
								type="button"
								onClick={() => openUrl('https://github.com/rrr333nnn333/BRENE')}
								className="text-[18px] font-bold tracking-tight text-[var(--md-sys-color-on-surface)] cursor-pointer"
							>
								BRENE
							</button>
							<span className="text-[11.5px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]">
								{versions.brene}
							</span>
						</div>
						<div className="flex items-baseline gap-1.5">
							<button
								type="button"
								onClick={() => openUrl('https://gitlab.com/simonpunk/susfs4ksu')}
								className="text-[14px] font-semibold text-[var(--md-sys-color-on-surface-variant)] cursor-pointer"
							>
								SUSFS
							</button>
							<span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]">
								{versions.susfs}
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={() => setLangOpen(true)}
						aria-label={t('Language')}
						className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] text-[12px] font-semibold border border-[var(--md-sys-color-outline-variant)]/50 cursor-pointer active:scale-95 transition-transform shrink-0"
					>
						<Globe className="w-3.5 h-3.5 text-[var(--md-sys-color-primary)]" />
						<span>{lang.toUpperCase()}</span>
					</button>
				</header>

				<nav className="max-w-[680px] mx-auto px-3 pb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
					{TABS.map((tab) => {
						const active = tab.id === activeTab
						return (
							<button
								key={tab.id}
								ref={(el) => {
									tabBtnRefs.current[tab.id] = el
								}}
								type="button"
								onClick={() => selectTab(tab.id)}
								className={`shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 cursor-pointer ${
									active
										? 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]'
										: 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/8'
								}`}
							>
								{t(tab.label)}
							</button>
						)
					})}
				</nav>
			</div>

			<main className="w-full max-w-[680px] mx-auto px-4 pb-6 flex-1">
				{activeTab === 'home' && (
					<HomeTab
						status={status}
						installedModules={installedModules}
						hasIntegrityBox={hasIntegrityBox}
						hasTaUtl={hasTaUtl}
					/>
				)}
				{activeTab === 'android' && <AndroidTab config={config} onToggle={handleToggle} />}
				{activeTab === 'hiding' && <HidingTab config={config} onToggle={handleToggle} />}
				{activeTab === 'spoofing' && (
					<SpoofingTab config={config} onToggle={handleToggle} vbh={vbh} setVbh={setVbh} />
				)}
				{activeTab === 'susfs' && (
					<SusfsTab
						status={status}
						config={config}
						onToggle={handleToggle}
						uname={uname}
						setUname={setUname}
					/>
				)}
				{activeTab === 'ksu' && <KsuTab config={config} onToggle={handleToggle} />}
				{activeTab === 'rom' && <RomTab config={config} onToggle={handleToggle} />}
				{activeTab === 'advanced' && (
					<AdvancedTab config={config} onToggle={handleToggle} onReloadConfig={loadConfig} />
				)}
				{activeTab === 'info' && (
					<InfoTab status={status} config={config} onToggle={handleToggle} />
				)}
			</main>

			<LanguageDialog open={langOpen} onClose={() => setLangOpen(false)} />
		</div>
	)
}
