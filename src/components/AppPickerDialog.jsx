import { useEffect, useMemo, useState } from 'react'
import { Check, Search } from 'lucide-react'
import { getPackagesInfo, listPackages } from '../lib/kernelsu.js'
import { useI18n } from '../lib/i18n.jsx'
import { M3Button, M3Dialog, M3Switch } from './M3.jsx'

const APP_CACHE_KEY = 'brene_user_apps_cache'

let memUserApps = null
let memSystemApps = null

try {
	const raw = localStorage.getItem(APP_CACHE_KEY)
	if (raw) memUserApps = JSON.parse(raw)
} catch {}

export function preloadUserApps() {
	const schedule = window.requestIdleCallback || ((fn) => setTimeout(fn, 300))
	schedule(async () => {
		try {
			const pkgs = await listPackages('user')
			const infos = await getPackagesInfo(pkgs)
			memUserApps = (infos || []).map((i) => ({
				packageName: i.packageName,
				appLabel: i.appLabel || i.packageName,
				isSystem: false,
			}))
			localStorage.setItem(APP_CACHE_KEY, JSON.stringify(memUserApps))
		} catch {}
	})
}

export function AppPickerDialog({ open, onClose, initialText, onConfirm }) {
	const { t } = useI18n()
	const [query, setQuery] = useState('')
	const [showSystem, setShowSystem] = useState(false)
	const [apps, setApps] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [selected, setSelected] = useState(() => new Set())

	useEffect(() => {
		if (!open) return
		setQuery('')
		setError('')
		setSelected(
			new Set(
				(initialText || '')
					.split('\n')
					.map((s) => s.trim())
					.filter((s) => s && !s.startsWith('#')),
			),
		)
	}, [open, initialText])

	useEffect(() => {
		if (!open) return
		let cancelled = false
		async function load() {
			setLoading(true)
			setError('')
			try {
				if (!memUserApps) {
					const pkgs = await listPackages('user')
					const infos = await getPackagesInfo(pkgs)
					memUserApps = (infos || []).map((i) => ({
						packageName: i.packageName,
						appLabel: i.appLabel || i.packageName,
						isSystem: false,
					}))
					try {
						localStorage.setItem(APP_CACHE_KEY, JSON.stringify(memUserApps))
					} catch {}
				}
				if (showSystem && !memSystemApps) {
					const sysPkgs = await listPackages('system')
					const sysInfos = await getPackagesInfo(sysPkgs)
					memSystemApps = (sysInfos || []).map((i) => ({
						packageName: i.packageName,
						appLabel: i.appLabel || i.packageName,
						isSystem: true,
					}))
				}
				const combined = showSystem
					? [...memUserApps, ...(memSystemApps || [])]
					: [...memUserApps]
				combined.sort((a, b) => a.appLabel.localeCompare(b.appLabel))
				if (!cancelled) setApps(combined)
			} catch (err) {
				if (!cancelled) setError(err?.message || String(err))
			} finally {
				if (!cancelled) setLoading(false)
			}
		}
		load()
		return () => {
			cancelled = true
		}
	}, [open, showSystem])

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase()
		if (!q) return apps
		return apps.filter(
			(a) =>
				a.appLabel.toLowerCase().includes(q) ||
				a.packageName.toLowerCase().includes(q),
		)
	}, [apps, query])

	const togglePkg = (pkg) => {
		setSelected((prev) => {
			const next = new Set(prev)
			if (next.has(pkg)) next.delete(pkg)
			else next.add(pkg)
			return next
		})
	}

	return (
		<M3Dialog
			open={open}
			onClose={onClose}
			title={t('USB Debug Allow Apps')}
			actions={
				<>
					<M3Button variant="text" onClick={onClose}>
						{t('Cancel')}
					</M3Button>
					<M3Button
						variant="filled"
						onClick={() => onConfirm(Array.from(selected).sort().join('\n'))}
					>
						{t('Apply')}
					</M3Button>
				</>
			}
		>
			<div className="flex flex-col gap-3">
				<div className="relative">
					<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--md-sys-color-on-surface-variant)]" />
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder={t('Search app or package')}
						className="w-full pl-9 pr-3.5 py-2.5 rounded-full border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-highest)] text-[13.5px] text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]/70 focus:outline-none focus:border-[var(--md-sys-color-primary)]"
					/>
				</div>

				<div className="flex items-center justify-between px-1 py-1">
					<span className="text-[13.5px] text-[var(--md-sys-color-on-surface)]">
						{t('Show system apps')}
					</span>
					<M3Switch checked={showSystem} onChange={setShowSystem} />
				</div>

				<div className="max-h-[45dvh] overflow-y-auto overscroll-contain -mx-2 px-2 flex flex-col gap-1">
					{loading && apps.length === 0 ? (
						<div className="py-6 text-center text-[13px] text-[var(--md-sys-color-on-surface-variant)]">
							{t('Loading apps...')}
						</div>
					) : error ? (
						<div className="py-4 text-[13px] text-[var(--md-sys-color-error)]">
							{error}
						</div>
					) : (
						filtered.map((app) => {
							const isChecked = selected.has(app.packageName)
							return (
								<button
									key={app.packageName}
									type="button"
									onClick={() => togglePkg(app.packageName)}
									className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors cursor-pointer ${
										isChecked
											? 'bg-[var(--md-sys-color-primary-container)]/50'
											: 'hover:bg-[var(--md-sys-color-on-surface)]/5'
									}`}
								>
									<img
										src={`ksu://icon/${app.packageName}`}
										alt=""
										loading="lazy"
										onError={(e) => {
											e.currentTarget.style.visibility = 'hidden'
										}}
										className="w-9 h-9 rounded-xl shrink-0 bg-[var(--md-sys-color-surface-container-highest)] object-cover"
									/>
									<div className="flex-1 min-w-0">
										<div className="text-[13.5px] font-medium truncate text-[var(--md-sys-color-on-surface)]">
											{app.appLabel}
										</div>
										<div className="text-[11.5px] font-mono truncate text-[var(--md-sys-color-on-surface-variant)]">
											{app.packageName}
										</div>
									</div>
									<span
										className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
											isChecked
												? 'bg-[var(--md-sys-color-primary)] border-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)]'
												: 'border-[var(--md-sys-color-outline)]'
										}`}
									>
										{isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
									</span>
								</button>
							)
						})
					)}
				</div>
			</div>
		</M3Dialog>
	)
}
