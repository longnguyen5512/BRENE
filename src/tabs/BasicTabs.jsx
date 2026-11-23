import { useEffect, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import {
	CardGroup,
	CardRow,
	ExperimentalChip,
	M3Button,
	M3Dialog,
	M3Switch,
	M3TextField,
	SectionLabel,
} from '../components/M3.jsx'
import { MODDIR, PERSISTENT_DIR, updateConfig2, writePersistentFile } from '../lib/brene.js'
import { useI18n } from '../lib/i18n.jsx'
import { exec, toast } from '../lib/kernelsu.js'

export function AndroidTab({ config, onToggle }) {
	const { t } = useI18n()
	return (
		<div className="flex flex-col">
			<SectionLabel>{t('Developer options')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Developer options')}
					subtitle={t('Options for developers')}
					right={
						<M3Switch
							checked={!!config.developer_options}
							onChange={(v) => onToggle('developer_options', v)}
						/>
					}
				/>
				<CardRow
					title={t('USB debugging')}
					subtitle={t('Debug mode when USB is connected')}
					right={
						<M3Switch
							checked={!!config.usb_debugging}
							onChange={(v) => onToggle('usb_debugging', v)}
						/>
					}
				/>
				<CardRow
					title={t('Wireless debugging')}
					subtitle={t('Debug mode when Wi-Fi is connected')}
					right={
						<M3Switch
							checked={!!config.wireless_debugging}
							onChange={(v) => onToggle('wireless_debugging', v)}
						/>
					}
				/>
			</CardGroup>

			<SectionLabel>{t('Features')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Show refresh rate')}
					subtitle={t('Show the current display refresh rate')}
					right={
						<M3Switch
							checked={!!config.show_refresh_rate}
							onChange={(v) => onToggle('show_refresh_rate', v)}
						/>
					}
				/>
				<CardRow
					title={t('Max color saturation')}
					subtitle={t('Force maximum color saturation via SurfaceFlinger')}
					right={
						<M3Switch
							checked={!!config.saturation}
							onChange={(v) => onToggle('saturation', v)}
						/>
					}
				/>
				<CardRow
					title={t('Set logcat buffer to 64KiB')}
					subtitle={t('Reduce CPU overhead and battery drain by shrinking buffer size')}
					right={
						<M3Switch
							checked={!!config.shrink_buffer_size}
							onChange={(v) => onToggle('shrink_buffer_size', v)}
						/>
					}
				/>
				<CardRow
					title={t('Disable child process restrictions')}
					subtitle={t('Disable restrictions on the system resource usage of the app child processes')}
					right={
						<M3Switch
							checked={!!config.disable_child_process_restrictions}
							onChange={(v) => onToggle('disable_child_process_restrictions', v)}
						/>
					}
				/>
			</CardGroup>
		</div>
	)
}

export function HidingTab({ config, onToggle }) {
	const { t } = useI18n()
	const [exceptions, setExceptions] = useState('')
	const [sdcardExceptions, setSdcardExceptions] = useState('')

	useEffect(() => {
		exec(`cat ${PERSISTENT_DIR}/hide_data_local_tmp_exceptions.txt`).then((res) => {
			if (res.errno === 0) setExceptions(res.stdout)
		})
		exec(`cat ${PERSISTENT_DIR}/hide_non_standard_sdcard_paths_exceptions.txt`).then((res) => {
			if (res.errno === 0) setSdcardExceptions(res.stdout)
		})
	}, [])

	return (
		<div className="flex flex-col">
			<SectionLabel>{t('Features')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Hide KernelSU directories')}
					right={
						<M3Switch
							checked={!!config.hide_ksu_directories}
							onChange={(v) => onToggle('hide_ksu_directories', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide custom recovery')}
					right={
						<M3Switch
							checked={!!config.hide_custom_recovery}
							onChange={(v) => onToggle('hide_custom_recovery', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide third party apps')}
					badge={<ExperimentalChip />}
					right={
						<M3Switch
							checked={!!config.hide_third_party_apps}
							onChange={(v) => onToggle('hide_third_party_apps', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide all apps with uid >= 10000')}
					subtitle={t(
						'Hide them using PRIORITY_UID_FILTER feature, HMA-OSS is needed for userspace side',
					)}
					right={
						<M3Switch
							checked={!!config.hide_all_apps_with_uid_10000_and_above}
							onChange={(v) => onToggle('hide_all_apps_with_uid_10000_and_above', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide OEM unlocking toggle')}
					right={
						<M3Switch
							checked={!!config.hide_oem_unlocking_toggle}
							onChange={(v) => onToggle('hide_oem_unlocking_toggle', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide Accessibility')}
					subtitle={t('Hide Accessibility Services from apps (Settings.Secure & AccessibilityManager)')}
					right={
						<M3Switch
							checked={!!config.hide_accessibility}
							onChange={(v) => onToggle('hide_accessibility', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide Vector Injection (Xposed Framework)')}
					right={
						<M3Switch
							checked={!!config.hide_vector_injection}
							onChange={(v) => onToggle('hide_vector_injection', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide suspicious PTYs')}
					right={
						<M3Switch
							checked={!!config.hide_suspicious_pty}
							onChange={(v) => onToggle('hide_suspicious_pty', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide /data/local/tmp paths')}
					right={
						<M3Switch
							checked={!!config.paths_hiding__data_local_tmp}
							onChange={(v) => onToggle('paths_hiding__data_local_tmp', v)}
						/>
					}
				/>
				<div className="p-4 flex flex-col gap-3">
					<div className="text-[13.5px] font-medium text-[var(--md-sys-color-on-surface)]">
						{t('/data/local/tmp hiding exceptions')}
					</div>
					<M3TextField
						multiline
						rows={5}
						label={t('EXCEPTIONS')}
						value={exceptions}
						onChange={setExceptions}
					/>
					<div className="flex justify-end">
						<M3Button
							variant="filled"
							onClick={() =>
								writePersistentFile(
									'hide_data_local_tmp_exceptions.txt',
									exceptions,
									t('Success, reboot to apply'),
								)
							}
						>
							{t('Apply')}
						</M3Button>
					</div>
				</div>
				<CardRow
					title={t('Hide non-standard /sdcard paths')}
					right={
						<M3Switch
							checked={!!config.paths_hiding__non_standard_sdcard}
							onChange={(v) => onToggle('paths_hiding__non_standard_sdcard', v)}
						/>
					}
				/>
				<div className="flex flex-col gap-3 px-4 pb-4">
					<M3TextField
						multiline
						rows={5}
						label={t('EXCEPTIONS')}
						value={sdcardExceptions}
						onChange={setSdcardExceptions}
					/>
					<div className="flex justify-end">
						<M3Button
							variant="filled"
							onClick={() =>
								writePersistentFile(
									'hide_non_standard_sdcard_paths_exceptions.txt',
									sdcardExceptions,
									t('Success, reboot to apply'),
								)
							}
						>
							{t('Apply')}
						</M3Button>
					</div>
				</div>
				<CardRow
					title={t('Hide non-standard /sdcard/Android paths')}
					right={
						<M3Switch
							checked={!!config.paths_hiding__non_standard_sdcard_android}
							onChange={(v) => onToggle('paths_hiding__non_standard_sdcard_android', v)}
						/>
					}
				/>
			</CardGroup>
		</div>
	)
}

export function SpoofingTab({ config, onToggle, vbh, setVbh }) {
	const { t } = useI18n()
	return (
		<div className="flex flex-col">
			<SectionLabel>{t('Features')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Spoof uname')}
					right={
						<M3Switch
							checked={!!config.spoof_uname}
							onChange={(v) => onToggle('spoof_uname', v)}
						/>
					}
				/>
				<CardRow
					title={t('Spoof /proc/cmdline or /proc/bootconfig')}
					right={
						<M3Switch
							checked={!!config.spoof_cmdline_or_bootconfig}
							onChange={(v) => onToggle('spoof_cmdline_or_bootconfig', v)}
						/>
					}
				/>
			</CardGroup>

			<SectionLabel>{t('Property spoofing')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Spoof system properties')}
					subtitle={t('Spoof some system properties')}
					right={
						<M3Switch
							checked={!!config.spoof_system_properties}
							onChange={(v) => onToggle('spoof_system_properties', v)}
						/>
					}
				/>
				<CardRow
					title={t('Spoof OS security patch level property')}
					right={
						<M3Switch
							checked={!!config.spoof_os_security_patch_level_property}
							onChange={(v) => onToggle('spoof_os_security_patch_level_property', v)}
						/>
					}
				/>
				<CardRow
					title={t('Spoof vendor security patch level property')}
					right={
						<M3Switch
							checked={!!config.spoof_vendor_security_patch_level_property}
							onChange={(v) => onToggle('spoof_vendor_security_patch_level_property', v)}
						/>
					}
				/>
				<div className="p-4 flex flex-col gap-3">
					<M3TextField
						label={t('Spoof verified boot hash property')}
						placeholder="e.g. df2352c282aj56e1489a3e220305hb827e54ba65a1293ab7409f2d46a3666b5a (64 digits)"
						value={vbh}
						onChange={setVbh}
					/>
					<div className="flex justify-end">
						<M3Button
							variant="filled"
							onClick={() => {
								updateConfig2('config_spoof_verified_boot_hash', vbh)
								exec(`resetprop -n ro.boot.vbmeta.digest ${vbh}`).then((res) => {
									toast(res.errno === 0 ? 'Reboot not required' : 'Failed to update prop')
								})
							}}
						>
							{t('Apply')}
						</M3Button>
					</div>
				</div>
			</CardGroup>
		</div>
	)
}

export function RomTab({ config, onToggle }) {
	const { t } = useI18n()
	return (
		<div className="flex flex-col">
			<SectionLabel>{t('Custom ROM')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Hide Gapps')}
					right={
						<M3Switch
							checked={!!config.hide_gapps}
							onChange={(v) => onToggle('hide_gapps', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide Custom ROM paths')}
					right={
						<M3Switch
							checked={!!config.hide_custom_rom_paths}
							onChange={(v) => onToggle('hide_custom_rom_paths', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide Custom ROM paths (Extended)')}
					right={
						<M3Switch
							checked={!!config.hide_custom_rom_paths_2}
							onChange={(v) => onToggle('hide_custom_rom_paths_2', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide LineageOS strings')}
					right={
						<M3Switch
							checked={!!config.hide_lineage_strings}
							onChange={(v) => onToggle('hide_lineage_strings', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide /system/addon.d')}
					right={
						<M3Switch
							checked={!!config.hide_addon_d}
							onChange={(v) => onToggle('hide_addon_d', v)}
						/>
					}
				/>
				<CardRow
					title={t('Spoof /system/etc/hosts')}
					subtitle={t('Some custom ROMs use a custom hosts file')}
					right={
						<M3Switch
							checked={!!config.spoof_hosts}
							onChange={(v) => onToggle('spoof_hosts', v)}
						/>
					}
				/>
				<CardRow
					title={t('Spoof /system/lib64/libstagefright.so')}
					subtitle={t('Some custom ROMs use a custom libstagefright.so file')}
					right={
						<M3Switch
							checked={!!config.spoof_libstagefright}
							onChange={(v) => onToggle('spoof_libstagefright', v)}
						/>
					}
				/>
				<CardRow
					title={t('Remove Custom ROM properties')}
					right={
						<M3Switch
							checked={!!config.rom_props}
							onChange={(v) => onToggle('rom_props', v)}
						/>
					}
				/>
				<CardRow
					title={t('Remove Play Integrity Fix properties')}
					right={
						<M3Switch
							checked={!!config.pif_props}
							onChange={(v) => onToggle('pif_props', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide framework-res.apk')}
					right={
						<M3Switch
							checked={!!config.hide_framework_res_apk}
							onChange={(v) => onToggle('hide_framework_res_apk', v)}
						/>
					}
				/>
			</CardGroup>
		</div>
	)
}

export function KsuTab({ config, onToggle }) {
	const { t } = useI18n()
	const [mounts, setMounts] = useState('')

	useEffect(() => {
		exec(`cat ${PERSISTENT_DIR}/custom_kernel_umount.txt`).then((res) => {
			if (res.errno === 0) setMounts(res.stdout)
		})
	}, [])

	const toggleAllModules = (enable) => {
		exec(`
			for i in /data/adb/modules/*; do
				${enable ? 'rm -f' : 'touch'} "$i/disable"
			done
		`).then((res) => toast(res.errno === 0 ? 'Success' : res.stderr))
	}

	return (
		<div className="flex flex-col">
			<SectionLabel>{t('Module control')}</SectionLabel>
			<CardGroup>
				<div className="p-4 flex gap-2.5 flex-wrap">
					<M3Button variant="danger" onClick={() => toggleAllModules(false)} className="flex-1">
						{t('Disable all modules')}
					</M3Button>
					<M3Button variant="tonal" onClick={() => toggleAllModules(true)} className="flex-1">
						{t('Enable all modules')}
					</M3Button>
				</div>
			</CardGroup>

			<SectionLabel>{t('Features')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('SU compat')}
					subtitle={t(
						"SU Compatibility Mode - allows authorized apps to gain root via traditional 'su' command",
					)}
					right={
						<M3Switch
							checked={!!config.su_compat}
							onChange={(v) => onToggle('su_compat', v)}
						/>
					}
				/>
				<CardRow
					title={t('Kernel umount')}
					subtitle={t(
						'Kernel Umount - controls whether kernel automatically unmounts modules when not needed',
					)}
					right={
						<M3Switch
							checked={!!config.kernel_umount}
							onChange={(v) => onToggle('kernel_umount', v)}
						/>
					}
				/>
				<CardRow
					title={t('Hide SELinux modification')}
					subtitle={t('SELinux Hide - sanitize /sys/fs/selinux access results for app UIDs')}
					right={
						<M3Switch
							checked={!!config.selinux_hide}
							onChange={(v) => onToggle('selinux_hide', v)}
						/>
					}
				/>
			</CardGroup>

			<SectionLabel>{t('Manual mode')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Kernel umount')}
					subtitle={t('Adding sus mounts to umount list via built-in KernelSU kernel umount')}
					tags={[t('Example:'), '/system/etc/hosts']}
				/>
				<div className="p-4 flex flex-col gap-3">
					<M3TextField
						multiline
						rows={8}
						label={t('Mounts')}
						value={mounts}
						onChange={setMounts}
					/>
					<div className="flex justify-end">
						<M3Button
							variant="filled"
							onClick={() => writePersistentFile('custom_kernel_umount.txt', mounts, 'Success')}
						>
							{t('Apply')}
						</M3Button>
					</div>
				</div>
			</CardGroup>
		</div>
	)
}

export function AdvancedTab({ config, onToggle, onReloadConfig }) {
	const { t } = useI18n()
	const [removeDirs, setRemoveDirs] = useState('')
	const [resetOpen, setResetOpen] = useState(false)

	useEffect(() => {
		exec(`cat ${PERSISTENT_DIR}/remove_sus_dir_sdcard_android_data_media_obb.txt`).then((res) => {
			if (res.errno === 0) setRemoveDirs(res.stdout)
		})
	}, [])

	const handleReset = async () => {
		const res = await exec(`cp -f ${MODDIR}/config.sh ${PERSISTENT_DIR}`)
		setResetOpen(false)
		toast(res.errno === 0 ? 'Success' : res.stderr)
		if (res.errno === 0) onReloadConfig()
	}

	return (
		<div className="flex flex-col">
			<SectionLabel>{t('Features')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('Remove suspicious directories in /sdcard/Android/[data | media | obb]')}
					subtitle={t('Enter one package name per line')}
				/>
				<div className="p-4 flex flex-col gap-3">
					<M3TextField
						multiline
						rows={6}
						label={t('Package names')}
						value={removeDirs}
						onChange={setRemoveDirs}
					/>
					<div className="flex justify-end">
						<M3Button
							variant="filled"
							onClick={() =>
								writePersistentFile(
									'remove_sus_dir_sdcard_android_data_media_obb.txt',
									removeDirs,
									t('Success, reboot to apply'),
								)
							}
						>
							{t('Apply')}
						</M3Button>
					</div>
				</div>
				<CardRow
					title={t('Fix /data/local/tmp inconsistencies')}
					right={
						<M3Switch
							checked={!!config.fix_data_local_tmp_inconsistencies}
							onChange={(v) => onToggle('fix_data_local_tmp_inconsistencies', v)}
						/>
					}
				/>
				<CardRow
					title={t('Reset settings')}
					onClick={() => setResetOpen(true)}
					right={<RotateCcw className="w-4 h-4 text-[var(--md-sys-color-error)]" />}
				/>
			</CardGroup>

			<M3Dialog
				open={resetOpen}
				onClose={() => setResetOpen(false)}
				title={t('Reset settings')}
				actions={
					<>
						<M3Button variant="text" onClick={() => setResetOpen(false)}>
							{t('Cancel')}
						</M3Button>
						<M3Button variant="danger" onClick={handleReset}>
							{t('Reset')}
						</M3Button>
					</>
				}
			>
				<p className="text-[14px] text-[var(--md-sys-color-on-surface-variant)] pb-2">
					Restore default config.sh settings?
				</p>
			</M3Dialog>
		</div>
	)
}

export function InfoTab({ status, config, onToggle }) {
	const { t } = useI18n()
	return (
		<div className="flex flex-col">
			<SectionLabel>{t('Suspicious mounts')}</SectionLabel>
			<CardGroup>
				<div className="p-4 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap break-all text-[var(--md-sys-color-on-surface-variant)]">
					{status.suspiciousMounts}
				</div>
			</CardGroup>

			<SectionLabel>{t('BRENE logs')}</SectionLabel>
			<CardGroup>
				<CardRow
					title={t('BRENE logs')}
					subtitle={t('Enable or disable BRENE logs')}
					right={
						<M3Switch
							checked={!!config.brene_logs}
							onChange={(v) => onToggle('brene_logs', v)}
						/>
					}
				/>
				<div className="p-4 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap break-all text-[var(--md-sys-color-on-surface-variant)] bg-[var(--md-sys-color-surface-container)]">
					{status.logs?.trim()
						? status.logs.trim()
						: t('No logs yet (enable BRENE logs and reboot to apply)')}
				</div>
			</CardGroup>
		</div>
	)
}
