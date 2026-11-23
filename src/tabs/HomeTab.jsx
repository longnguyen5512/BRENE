import { ExternalLink, ShieldCheck } from 'lucide-react'
import { CardGroup, CardRow, M3Button, SectionLabel, openUrl } from '../components/M3.jsx'
import { INCOMPATIBLE_MODULES, RECOMMENDED_MODULES } from '../lib/brene.js'
import { useI18n } from '../lib/i18n.jsx'
import { exec } from '../lib/kernelsu.js'

export function HomeTab({ status, installedModules, hasIntegrityBox, hasTaUtl }) {
	const { t } = useI18n()

	const checkPiApi = () => {
		const pkg = 'gr.nikolasspyr.integritycheck'
		exec(`cmd package path ${pkg}`).then((result) => {
			const url = `https://play.google.com/store/apps/details?id=${pkg}`
			if (result.stdout.includes('package:')) {
				exec(`
					cmd activity force-stop ${pkg}
					cmd activity start ${pkg}/.MainActivity
					input keyevent KEYCODE_TAB
					input keyevent KEYCODE_ENTER
				`)
			} else {
				exec(`cmd activity start -a android.intent.action.VIEW -d ${url}`)
			}
		})
	}

	return (
		<div className="flex flex-col">
			<SectionLabel>{t('General')}</SectionLabel>
			<CardGroup>
				<CardRow title={t('Device model')} subtitle={status.deviceModel} />
				<CardRow title={t('Kernel version')} subtitle={status.kernelVersion} />
				<CardRow title={t('Android version')} subtitle={status.androidVersion} />
				<CardRow title={t('Custom ROM')} subtitle={status.customRom} />
				<CardRow
					title={t('Check Play Integrity API')}
					onClick={checkPiApi}
					right={
						<M3Button variant="tonal" onClick={checkPiApi} className="!px-3.5 !min-h-[34px]">
							<ShieldCheck className="w-4 h-4" />
						</M3Button>
					}
				/>
			</CardGroup>

			<SectionLabel>{t('Recommendations')}</SectionLabel>
			<CardGroup className="mb-3">
				<div className="px-4 py-2.5 text-[12.5px] font-semibold text-[var(--md-sys-color-on-surface-variant)] bg-[var(--md-sys-color-surface-container)]">
					{t('Recommended modules')}
				</div>
				{RECOMMENDED_MODULES.map((mod) => {
					const isInstalled =
						installedModules.has(mod.id) || (mod.id === 'tricky_addon' && hasTaUtl)
					return (
						<CardRow
							key={mod.id}
							title={mod.name}
							onClick={() => openUrl(mod.href)}
							subtitle={isInstalled ? 'Status: Installed' : undefined}
							right={
								<span className="flex items-center gap-2">
									{isInstalled && (
										<span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#4CAF50]/15 text-[#4CAF50]">
											Installed
										</span>
									)}
									<ExternalLink className="w-4 h-4 text-[var(--md-sys-color-on-surface-variant)]" />
								</span>
							}
						/>
					)
				})}
			</CardGroup>

			<CardGroup>
				<div className="px-4 py-2.5 text-[12.5px] font-semibold text-[var(--md-sys-color-on-surface-variant)] bg-[var(--md-sys-color-surface-container)]">
					{t('Incompatible/Untested modules')}
				</div>
				{INCOMPATIBLE_MODULES.map((mod) => {
					const isInstalled =
						mod.id === 'playintegrityfix'
							? hasIntegrityBox
							: installedModules.has(mod.id)
					return (
						<CardRow
							key={mod.id}
							title={mod.name}
							onClick={mod.href ? () => openUrl(mod.href) : undefined}
							right={
								<span className="flex items-center gap-2">
									{isInstalled && (
										<span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)]">
											Installed
										</span>
									)}
									{mod.href && (
										<ExternalLink className="w-4 h-4 text-[var(--md-sys-color-on-surface-variant)]" />
									)}
								</span>
							}
						/>
					)
				})}
			</CardGroup>
		</div>
	)
}
