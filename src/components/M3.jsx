import { useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { exec } from '../lib/kernelsu.js'

export function openUrl(url) {
	exec(`cmd activity start -a android.intent.action.VIEW -d ${url}`)
}

export function SectionLabel({ children }) {
	return (
		<p className="px-1 pt-4 pb-2 text-[13px] font-semibold tracking-wide text-[var(--md-sys-color-primary)]">
			{children}
		</p>
	)
}

export function CardGroup({ children, className = '' }) {
	return (
		<div
			className={`overflow-hidden rounded-[20px] border border-[var(--md-sys-color-outline-variant)]/60 bg-[var(--md-sys-color-surface-container-low)] divide-y divide-[var(--md-sys-color-outline-variant)]/40 ${className}`}
		>
			{children}
		</div>
	)
}

export function CardRow({
	title,
	subtitle,
	tags,
	badge,
	right,
	onClick,
	className = '',
}) {
	const clickable = typeof onClick === 'function'
	return (
		<div
			onClick={onClick}
			role={clickable ? 'button' : undefined}
			tabIndex={clickable ? 0 : undefined}
			onKeyDown={
				clickable
					? (e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault()
								onClick(e)
							}
					  }
					: undefined
			}
			className={`flex items-center justify-between gap-3 px-4 py-3.5 min-h-[56px] transition-colors duration-150 ${
				clickable
					? 'cursor-pointer active:bg-[var(--md-sys-color-on-surface)]/8 hover:bg-[var(--md-sys-color-on-surface)]/4'
					: ''
			} ${className}`}
		>
			<div className="flex-1 min-w-0 flex flex-col gap-0.5">
				<div className="flex items-center flex-wrap gap-1.5">
					<span className="text-[15px] font-medium text-[var(--md-sys-color-on-surface)] leading-snug">
						{title}
					</span>
					{badge}
				</div>
				{subtitle && (
					<span className="text-[12.5px] text-[var(--md-sys-color-on-surface-variant)] leading-relaxed whitespace-pre-line">
						{subtitle}
					</span>
				)}
				{tags && tags.length > 0 && (
					<div className="flex flex-col gap-1 mt-1">
						{tags.map((tag, i) => (
							<span
								key={i}
								className="inline-block w-fit max-w-full break-all font-mono text-[11.5px] px-2 py-0.5 rounded-md bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)]"
							>
								{tag}
							</span>
						))}
					</div>
				)}
			</div>
			{right && <div className="shrink-0 flex items-center">{right}</div>}
		</div>
	)
}

export function ExperimentalChip({ label = 'Experimental' }) {
	return (
		<span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[var(--md-sys-color-tertiary-container)] text-[var(--md-sys-color-on-tertiary-container)]">
			{label}
		</span>
	)
}

export function M3Switch({ checked, onChange, disabled = false, id }) {
	return (
		<button
			id={id}
			type="button"
			role="switch"
			aria-checked={checked}
			disabled={disabled}
			onClick={(e) => {
				e.stopPropagation()
				if (!disabled) onChange?.(!checked)
			}}
			className={`relative inline-flex items-center shrink-0 w-[52px] h-[32px] rounded-full border-2 transition-all duration-200 cursor-pointer disabled:opacity-40 ${
				checked
					? 'bg-[var(--md-sys-color-primary)] border-[var(--md-sys-color-primary)]'
					: 'bg-[var(--md-sys-color-surface-container-highest)] border-[var(--md-sys-color-outline)]'
			}`}
		>
			<span
				className={`flex items-center justify-center rounded-full transition-all duration-200 ${
					checked
						? 'w-6 h-6 translate-x-[22px] bg-[var(--md-sys-color-on-primary)] text-[var(--md-sys-color-on-primary-container)]'
						: 'w-4 h-4 translate-x-[6px] bg-[var(--md-sys-color-outline)] text-[var(--md-sys-color-surface-container-highest)]'
				}`}
			>
				{checked ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <X className="w-2.5 h-2.5 stroke-[2.5]" />}
			</span>
		</button>
	)
}

export function M3Button({
	children,
	variant = 'filled',
	onClick,
	className = '',
	type = 'button',
	disabled = false,
	id,
}) {
	const styles = {
		filled:
			'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:brightness-105 active:scale-[0.98]',
		tonal:
			'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] hover:brightness-95 active:scale-[0.98]',
		outlined:
			'border border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] bg-transparent hover:bg-[var(--md-sys-color-primary)]/8 active:scale-[0.98]',
		text: 'text-[var(--md-sys-color-primary)] bg-transparent hover:bg-[var(--md-sys-color-primary)]/8 active:scale-[0.98]',
		danger:
			'bg-[var(--md-sys-color-error-container)] text-[var(--md-sys-color-on-error-container)] hover:brightness-95 active:scale-[0.98]',
	}
	return (
		<button
			id={id}
			type={type}
			disabled={disabled}
			onClick={onClick}
			className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-5 py-2 rounded-full text-[13.5px] font-medium transition-all duration-150 cursor-pointer disabled:opacity-45 ${styles[variant] || styles.filled} ${className}`}
		>
			{children}
		</button>
	)
}

export function M3TextField({
	label,
	value,
	onChange,
	placeholder = '',
	multiline = false,
	rows = 6,
	id,
	className = '',
}) {
	const shared =
		'w-full rounded-xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container-highest)]/60 px-3.5 py-2.5 text-[13.5px] font-mono text-[var(--md-sys-color-on-surface)] placeholder:text-[var(--md-sys-color-on-surface-variant)]/60 focus:outline-none focus:border-[var(--md-sys-color-primary)] focus:ring-1 focus:ring-[var(--md-sys-color-primary)] transition-colors'
	return (
		<label className={`block w-full ${className}`}>
			{label && (
				<span className="block text-[12px] font-medium text-[var(--md-sys-color-on-surface-variant)] mb-1.5 px-0.5">
					{label}
				</span>
			)}
			{multiline ? (
				<textarea
					id={id}
					rows={rows}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className={`${shared} resize-y leading-relaxed`}
				/>
			) : (
				<input
					id={id}
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className={shared}
				/>
			)}
		</label>
	)
}

export function M3Dialog({ open, onClose, title, children, actions, maxWidth = 'max-w-[440px]' }) {
	useEffect(() => {
		if (!open) return
		const prev = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		return () => {
			document.body.style.overflow = prev
		}
	}, [open])

	if (!open) return null

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-[2px] animate-fadeIn"
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				onClick={(e) => e.stopPropagation()}
				className={`w-full ${maxWidth} max-h-[85dvh] flex flex-col rounded-[28px] bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] shadow-2xl border border-[var(--md-sys-color-outline-variant)]/40 overflow-hidden`}
			>
				{title && (
					<div className="px-6 pt-5 pb-3 text-[18px] font-semibold tracking-tight shrink-0">
						{title}
					</div>
				)}
				<div className="px-6 pb-2 overflow-y-auto overscroll-contain flex-1 min-h-0">
					{children}
				</div>
				{actions && (
					<div className="px-6 py-4 flex items-center justify-end gap-2 shrink-0 border-t border-[var(--md-sys-color-outline-variant)]/30">
						{actions}
					</div>
				)}
			</div>
		</div>
	)
}
