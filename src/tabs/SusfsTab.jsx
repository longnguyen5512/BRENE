import { useEffect, useState } from 'react'
import { ListFilter } from 'lucide-react'
import { AppPickerDialog } from '../components/AppPickerDialog.jsx'
import {
	CardGroup,
	CardRow,
	ExperimentalChip,
	M3Button,
	M3Switch,
	M3TextField,
	SectionLabel,
} from '../components/M3.jsx'
import { PERSISTENT_DIR, setFeature, updateConfig2, writePersistentFile } from '../lib/brene.js'
import { useI18n } from '../lib/i18n.jsx'
import { exec, toast } from '../lib/kernelsu.js'

const MANUAL_TABS = [
	{ id: 'map', label: 'Map', fieldLabel: 'SUS Map', file: 'custom_sus_map.txt' },
	{ id: 'path', label: 'Path', fieldLabel: 'SUS Path', file: 'custom_sus_path.txt' },
	{ id: 'loop', label: 'Path Loop', fieldLabel: 'SUS Path Loop', file: 'custom_sus_path_loop.txt' },
	{
		id: 'redirect',
		label: 'Open Redirect',
		fieldLabel: 'Open Redirect',
		file: 'custom_open_redirect.txt',
	},
	{
		id: 'uid',
		label: 'SUS Path UID Filter',
		fieldLabel: 'SUS Path UID Filter',
		file: 'custom_sus_path_uid_filter.txt',
	},
	{
		id: 'usb',
		label: 'USB Debug Allow Apps',
		fieldLabel: 'USB Debug Allow Apps (1 package/line)',
		file: 'usb_debug_allow_apps.txt',
	},
]

export function SusfsTab({ status, config, onToggle, uname, setUname }) {
	const { t } = useI18n()
	const [subTab, setSubTab] = useState('map')
	const [pickerOpen, setPickerOpen] = useState(false)
	const [texts, setTexts] = useState({
		map: '',
		path: '',
		loop: '',
		redirect: '',
		uid: '',
		usb: '',
	})

	useEffect(() => {
		Promise.all(
			MANUAL_TABS.map((item) =>
				exec(`cat ${PERSISTENT_DIR}/${item.file}`).then((res) => [
					item.id,
					res.errno === 0 ? res.stdout : '',
				]),
			),
		).then((entries) => {
			setTexts(Object.fromEntries(entries))
		})
	}, [])

	const saveUsbDebugApps = (content) => {
		exec(`
cat <<'UNIQUE_EOF' > ${PERSISTENT_DIR}/usb_debug_allow_apps.txt
${content}
UNIQUE_EOF
. /data/adb/modules/brene/utils.sh 2>/dev/null || true
PERSISTENT_DIR=${PERSISTENT_DIR} apply_usb_debug_allow_apps
		`).then((result) => {
			toast(result.errno === 0 ? t('Saved and applied') : result.stderr)
		})
	}

	const handleManualApply = async () => {
		const active = MANUAL_TABS.find((x) => x.id === subTab)
		if (!active) return
		const content = texts[active.id] || ''

		if (active.id === 'usb') {
			saveUsbDebugApps(content)
			return
		}

		if (active.id === 'uid') {
			const normalized = content === '' ? ' ' : content.replaceAll('\n', ',')
			const res = await exec(`echo "${normalized}" > ${PERSISTENT_DIR}/${active.file}`)
			if (res.errno === 0) {
				const applyRes = await exec(`susfs set_sus_path_uid_filter "${normalized}"`)
				toast(applyRes.errno === 0 ? t('Saved and applied') : applyRes.stderr)
			} else {
				toast(res.stderr)
			}
			return
		}

		const normalized = content === '' ? '' : content.replaceAll('/sdcard', '/storage/emulated/0')
		await writePersistentFile(active.file, normalized, t('Success, reboot to apply'))
	}

	const activeMeta = MANUAL_TABS.find((x) => x.id === subTab) || MANUAL_TABS[0]

	return (
		<div className="flex flex-col">
			<SectionLabel>{t('Status')}</SectionLabel>
			<CardGroup>
				<CardRow title={t('SUSFS variant')} subtitle={status.susfsVariant} />
				<CardRow title={t('..5.u.S status')} subtitle={status.susStatus} />
				<CardRow title={t('Enabled kernel features')} />
				<div className="px-4 py-3 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap break-all text-[var(--md-sys-color-on-surface-variant)] bg-[var(--md-sys-color-surface-container)]">
					{status.kernelFeatures}
				</div>
			</CardGroup>

			<SectionLabel>{t('Built-in features')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Hide suspicious mounts for non-su processes')}
					right={
						<M3Switch
							checked={!!config.hide_sus_mnts_for_non_su_procs}
							onChange={(v) => onToggle('hide_sus_mnts_for_non_su_procs', v)}
						/>
					}
				/>
				<CardRow
					title={t('AVC log spoofing')}
					right={
						<M3Switch
							checked={!!config.enable_avc_log_spoofing}
							onChange={(v) => onToggle('enable_avc_log_spoofing', v)}
						/>
					}
				/>
				<CardRow
					title={t('SUSFS logs')}
					subtitle={t('Enable or disable SUSFS logs in kernel')}
					right={<M3Switch checked={!!config.enable_log} onChange={(v) => onToggle('enable_log', v)} />}
				/>
				<CardRow
					title={t('Spoof uname')}
					badge={<ExperimentalChip />}
					subtitle={t('Spoof uname for all processes')}
					right={
						<M3Switch
							checked={!!config.custom_spoof_uname}
							onChange={(v) => onToggle('custom_spoof_uname', v)}
						/>
					}
				/>
				<div className="p-4 flex flex-col gap-3">
					<M3TextField
						label={t('Kernel release')}
						placeholder="e.g. 5.10.214-android12-9-00001-g123456"
						value={uname.release}
						onChange={(v) => setUname((u) => ({ ...u, release: v }))}
					/>
					<M3TextField
						label={t('Kernel version')}
						placeholder="e.g. #1 SMP PREEMPT Wed Jun 9 03:20:30 UTC 2025"
						value={uname.version}
						onChange={(v) => setUname((u) => ({ ...u, version: v }))}
					/>
					<div className="flex justify-end gap-2">
						<M3Button
							variant="outlined"
							onClick={() => {
								updateConfig2('config_custom_uname_kernel_release', 'default')
								updateConfig2('config_custom_uname_kernel_version', 'default')
								setFeature(`susfs set_uname "default" "default"`)
								setUname({ release: 'default', version: 'default' })
							}}
						>
							{t('Reset')}
						</M3Button>
						<M3Button
							variant="filled"
							onClick={() => {
								if (uname.release && uname.version) {
									updateConfig2('config_custom_uname_kernel_release', uname.release)
									updateConfig2('config_custom_uname_kernel_version', uname.version)
									setFeature(`susfs set_uname "${uname.release}" "${uname.version}"`)
								}
							}}
						>
							{t('Apply')}
						</M3Button>
					</div>
				</div>
			</CardGroup>

			<SectionLabel>{t('Manual mode')}</SectionLabel>
			<CardGroup>
				<div className="px-4 py-3 flex flex-col gap-1.5 text-[12px] text-[var(--md-sys-color-on-surface-variant)]">
					<div>
						<span className="font-semibold text-[var(--md-sys-color-on-surface)]">
							{t('Map')}:{' '}
						</span>
						<span className="font-mono">/data/adb/modules/zygisksu/lib/arm64/libzygisk.so</span>
					</div>
					<div>
						<span className="font-semibold text-[var(--md-sys-color-on-surface)]">
							{t('Path')}:{' '}
						</span>
						<span className="font-mono">/system/addon.d</span>
					</div>
					<div>
						<span className="font-semibold text-[var(--md-sys-color-on-surface)]">
							{t('Path Loop')}:{' '}
						</span>
						<span className="font-mono">/data/local/tmp/my_file</span>
					</div>
					<div>
						<span className="font-semibold text-[var(--md-sys-color-on-surface)]">
							{t('Open Redirect')}:{' '}
						</span>
						<span className="font-mono">/proc/cpuinfo /data/local/tmp/fake_cpuinfo all</span>
					</div>
					<div>
						<span className="font-semibold text-[var(--md-sys-color-on-surface)]">
							{t('SUS Path UID Filter')}:{' '}
						</span>
						<span className="font-mono">com.example.app</span>
					</div>
					<div>
						<span className="font-semibold text-[var(--md-sys-color-on-surface)]">
							{t('USB Debug Allow Apps')}:{' '}
						</span>
						<span className="font-mono">com.android.shell</span>
					</div>
				</div>

				<div className="p-3 flex gap-1.5 overflow-x-auto no-scrollbar bg-[var(--md-sys-color-surface-container)]">
					{MANUAL_TABS.map((item) => {
						const active = item.id === subTab
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => setSubTab(item.id)}
								className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors cursor-pointer ${
									active
										? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]'
										: 'text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-on-surface)]/6'
								}`}
							>
								{t(item.label)}
							</button>
						)
					})}
				</div>

				<div className="p-4 flex flex-col gap-3">
					{activeMeta.id === 'usb' && (
						<M3Button
							variant="outlined"
							onClick={() => setPickerOpen(true)}
							className="w-full"
						>
							<ListFilter className="w-4 h-4" />
							{t('Select Apps')}
						</M3Button>
					)}
					<M3TextField
						multiline
						rows={10}
						label={t(activeMeta.fieldLabel)}
						value={texts[activeMeta.id] || ''}
						onChange={(v) => setTexts((prev) => ({ ...prev, [activeMeta.id]: v }))}
					/>
					<div className="flex justify-end">
						<M3Button variant="filled" onClick={handleManualApply}>
							{t('Apply')}
						</M3Button>
					</div>
				</div>
			</CardGroup>

			<AppPickerDialog
				open={pickerOpen}
				onClose={() => setPickerOpen(false)}
				initialText={texts.usb}
				onConfirm={(content) => {
					setTexts((prev) => ({ ...prev, usb: content }))
					setPickerOpen(false)
					saveUsbDebugApps(content)
				}}
			/>
		</div>
	)
}
