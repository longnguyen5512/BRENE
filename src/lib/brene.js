import { exec, toast } from './kernelsu.js'

export const MODDIR = '/data/adb/modules/brene'
export const PERSISTENT_DIR = '/data/adb/brene'

export const SWITCH_ACTIONS = {
	hide_sus_mnts_for_non_su_procs: (enabled) =>
		setFeature(`susfs hide_sus_mnts_for_non_su_procs ${enabled ? 1 : 0}`),
	su_compat: (enabled) =>
		setFeature(`ksud feature set su_compat ${enabled ? 1 : 0} && ksud feature save`),
	kernel_umount: (enabled) =>
		setFeature(`ksud feature set kernel_umount ${enabled ? 1 : 0} && ksud feature save`),
	selinux_hide: (enabled) =>
		setFeature(`ksud feature set selinux_hide ${enabled ? 1 : 0} && ksud feature save`),
	developer_options: (enabled) =>
		setFeature(`settings put global development_settings_enabled ${enabled ? 1 : 0}`),
	usb_debugging: (enabled) =>
		setFeature(
			`settings put global adb_enabled ${enabled ? 1 : 0} && . /data/adb/modules/brene/utils.sh 2>/dev/null; PERSISTENT_DIR=${PERSISTENT_DIR} apply_usb_debug_allow_apps`,
		),
	wireless_debugging: (enabled) =>
		setFeature(
			`settings put global adb_wifi_enabled ${enabled ? 1 : 0} && sleep 1 && . /data/adb/modules/brene/utils.sh 2>/dev/null; PERSISTENT_DIR=${PERSISTENT_DIR} apply_usb_debug_allow_apps`,
		),
	saturation: (enabled) =>
		setFeature(`service call SurfaceFlinger 1022 f ${enabled ? 2.0 : 1.0}`),
	show_refresh_rate: (enabled) =>
		setFeature(`service call SurfaceFlinger 1034 i32 ${enabled ? 1 : 0}`),
	hide_oem_unlocking_toggle: (enabled) =>
		setFeature(`resetprop -n ro.oem_unlock_supported ${enabled ? 0 : 1}`),
	disable_child_process_restrictions: (enabled) =>
		setFeature(
			`resetprop -n persist.sys.fflag.override.settings_enable_monitor_phantom_procs ${enabled ? false : true}`,
		),
}

export function updateConfig(configKey, value) {
	exec(`sed -i "s/^${configKey}=.*/${configKey}=${value}/" ${PERSISTENT_DIR}/config.sh`).then(
		(result) => {
			if (result.errno !== 0) toast('Failed to update config')
		},
	)
}

export function updateConfig2(configKey, value) {
	exec(`sed -i "s/^${configKey}=.*/${configKey}='${value}'/" ${PERSISTENT_DIR}/config.sh`).then(
		(result) => {
			if (result.errno !== 0) toast('Failed to update config')
		},
	)
}

export function setFeature(cmd) {
	exec(cmd).then((result) => {
		toast(result.errno === 0 ? 'Reboot not required' : result.stderr)
	})
}

export function parseConfigSh(raw) {
	return Object.fromEntries(
		(raw || '')
			.split('\n')
			.filter((line) => line.includes('='))
			.map((line) => {
				const [key, ...val] = line.split('=')
				return [
					key.trim(),
					val
						.join('=')
						.trim()
						.replace(/^['"](.*)['"]$/, '$1'),
				]
			}),
	)
}

export async function writePersistentFile(filename, content, toastMsg) {
	const path = `${PERSISTENT_DIR}/${filename}`
	const cmd =
		content === ''
			? `printf '' > ${path}`
			: `cat <<'UNIQUE_EOF' > ${path}\n${content}\nUNIQUE_EOF`
	const result = await exec(cmd)
	toast(result.errno === 0 ? toastMsg : result.stderr)
	return result
}

export const RECOMMENDED_MODULES = [
	{ id: 'rezygisk', name: 'BreZygisk', href: 'https://github.com/rrr333nnn333/BreZygisk' },
	{ id: 'treat_wheel', name: 'BreWheel', href: 'https://github.com/rrr333nnn333/BreWheel' },
	{ id: 'hma_oss_zygisk', name: 'HMA-OSS', href: 'https://github.com/frknkrc44/HMA-OSS' },
	{ id: 'zygisk_vector', name: 'Vector', href: 'https://github.com/JingMatrix/Vector' },
	{ id: 'teesim', name: 'TEESimulator', href: 'https://github.com/JingMatrix/TEESimulator' },
	{
		id: 'tricky_addon',
		name: 'Tricky Addon',
		href: 'https://github.com/KOWX712/Tricky-Addon-Update-Target-List',
	},
	{
		id: 'playintegrityfork',
		name: 'Play Integrity Fork',
		href: 'https://github.com/osm0sis/PlayIntegrityFork',
	},
	{ id: 'nomount', name: 'NoMount', href: 'https://github.com/maxsteeel/nomount' },
	{ id: 'Re-Malwack', name: 'Re-Malwack', href: 'https://github.com/ZG089/Re-Malwack' },
]

export const INCOMPATIBLE_MODULES = [
	{
		id: 'susfs4ksu',
		name: 'susfs4ksu-module',
		href: 'https://github.com/sidex15/susfs4ksu-module',
	},
	{
		id: 'susfs_manager',
		name: 'SUSFS Manager',
		href: 'https://github.com/sidex15/susfs4ksu-module',
	},
	{
		id: 'zygisksu',
		name: 'Zygisk Next, NeoZygisk, NyaZygisk',
		href: 'https://github.com/Dr-TSNG/ZygiskNext',
	},
	{
		id: 'zygisk_lsposed',
		name: 'LSPosed, ReLSPosed, LSPosed-Irena',
		href: 'https://github.com/LSPosed/LSPosed',
	},
	{
		id: 'tricky_store',
		name: 'Tricky Store, TEESimulator-RS, Tricky Store OSS, AlwaysStrong',
		href: 'https://github.com/5ec1cff/TrickyStore',
	},
	{
		id: 'fgetpriority',
		name: 'fgetpriority',
		href: 'https://github.com/aerath-stuff/fgetpriority',
	},
	{
		id: 'oh_my_keymint',
		name: 'Oh My Keymint',
		href: 'https://github.com/qwq233/OhMyKeymint',
	},
	{
		id: 'Yurikey',
		name: 'Yurikey Manager',
		href: 'https://github.com/Yurii0307/yurikey',
	},
	{
		id: 'playintegrityfix',
		name: 'Integrity Box',
		href: 'https://github.com/MeowDump/Integrity-Box',
	},
	{
		id: 'onyxzygisk',
		name: 'OnyxZygisk (AI Slop)',
		href: 'https://github.com/OnyxZygisk/OnyxZygisk/commit/5b1abb30f4e675af26bd7608752f2a508f1a3595',
	},
	{
		id: 'yukizygisk',
		name: 'YukiZygisk',
		href: 'https://github.com/Rouyashiki/YukiZygisk',
	},
	{
		id: 'zygisknextsu',
		name: 'ZNNext',
		href: 'https://github.com/VeryBaaad/ZNNext',
	},
	{
		id: 'zygisk-assistant',
		name: 'Zygisk Assistant',
		href: 'https://github.com/snake-4/Zygisk-Assistant',
	},
	{
		id: 'zygisk-detach',
		name: 'zygisk-detach',
		href: 'https://github.com/j-hc/zygisk-detach',
	},
	{
		id: 'zygisk_nohello',
		name: 'Nohello',
		href: 'https://github.com/MhmRdd/NoHello',
	},
	{
		id: 'meta-nomount',
		name: 'NoMount Suite',
		href: 'https://github.com/Bouteillepleine/NoMount-Suite',
	},
	{
		id: 'hybrid_mount',
		name: 'Hybrid Mount',
		href: 'https://github.com/Hybrid-Mount/meta-hybrid_mount',
	},
	{
		id: 'magic_mount_rs',
		name: 'Magic Mount-rs',
		href: 'https://github.com/KernelSU-Modules-Repo/magic_mount_rs',
	},
	{
		id: 'zygisk_fusehide',
		name: 'FuseHide',
		href: 'https://github.com/XiaoTong6666/FuseHide',
	},
]
