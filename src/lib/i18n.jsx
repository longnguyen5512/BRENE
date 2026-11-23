import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { CORE, LANGUAGES } from './i18nData.js'

const LANG_KEY = 'brene_lang'

function detectInitialLang() {
	try {
		const saved = localStorage.getItem(LANG_KEY)
		if (saved && saved in LANGUAGES) return saved
	} catch {}
	const langs = [navigator.language, ...(navigator.languages || [])].filter(Boolean)
	for (const l of langs) {
		const code = l.toLowerCase().split(/[-_]/)[0]
		if (code in LANGUAGES) return code
	}
	return 'en'
}

const I18nContext = createContext({
	lang: 'en',
	setLang: () => {},
	t: (k) => k,
	languages: LANGUAGES,
})

export function I18nProvider({ children }) {
	const [lang, setLangState] = useState(detectInitialLang)

	const setLang = useCallback((next) => {
		const valid = next in LANGUAGES ? next : 'en'
		setLangState(valid)
		try {
			localStorage.setItem(LANG_KEY, valid)
		} catch {}
	}, [])

	useEffect(() => {
		document.documentElement.lang = lang
		document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
	}, [lang])

	const t = useCallback(
		(key) => {
			if (!key || lang === 'en') return key
			return CORE[lang]?.[key] || key
		},
		[lang],
	)

	return (
		<I18nContext.Provider value={{ lang, setLang, t, languages: LANGUAGES }}>
			{children}
		</I18nContext.Provider>
	)
}

export function useI18n() {
	return useContext(I18nContext)
}

export { LANGUAGES }
