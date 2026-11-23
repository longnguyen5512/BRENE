import { Check } from 'lucide-react'
import { M3Button, M3Dialog } from './M3.jsx'
import { useI18n } from '../lib/i18n.jsx'

export function LanguageDialog({ open, onClose }) {
	const { lang, setLang, languages, t } = useI18n()

	return (
		<M3Dialog
			open={open}
			onClose={onClose}
			title={t('Language')}
			actions={
				<M3Button variant="text" onClick={onClose}>
					{t('Cancel')}
				</M3Button>
			}
		>
			<div className="flex flex-col gap-1 pb-2">
				{Object.entries(languages).map(([code, name]) => {
					const active = code === lang
					return (
						<button
							key={code}
							type="button"
							onClick={() => {
								setLang(code)
								onClose()
							}}
							className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
								active
									? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)] font-semibold'
									: 'hover:bg-[var(--md-sys-color-on-surface)]/6 text-[var(--md-sys-color-on-surface)]'
							}`}
						>
							<span className="text-[14px]">{name}</span>
							<span className="flex items-center gap-2 text-[11.5px] font-mono opacity-75">
								{code.toUpperCase()}
								{active && <Check className="w-4 h-4" />}
							</span>
						</button>
					)
				})}
			</div>
		</M3Dialog>
	)
}
