'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Mail, Menu, Package, Phone, X } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Parcel', href: '/track' },
]

const languages = [
  { value: 'af', label: 'Afrikaans', flag: '🌐', rtl: false },
  { value: 'sq', label: 'Albanian', flag: '🌐', rtl: false },
  { value: 'am', label: 'Amharic', flag: '🌐', rtl: false },
  { value: 'hy', label: 'Armenian', flag: '🌐', rtl: false },
  { value: 'az', label: 'Azerbaijani', flag: '🌐', rtl: false },
  { value: 'eu', label: 'Basque', flag: '🌐', rtl: false },
  { value: 'be', label: 'Belarusian', flag: '🌐', rtl: false },
  { value: 'bn', label: 'Bengali', flag: '🇧🇩', rtl: false },
  { value: 'bs', label: 'Bosnian', flag: '🌐', rtl: false },
  { value: 'bg', label: 'Bulgarian', flag: '🇧🇬', rtl: false },
  { value: 'ca', label: 'Catalan', flag: '🌐', rtl: false },
  { value: 'ceb', label: 'Cebuano', flag: '🌐', rtl: false },
  { value: 'ny', label: 'Chichewa', flag: '🌐', rtl: false },
  { value: 'co', label: 'Corsican', flag: '🌐', rtl: false },
  { value: 'hr', label: 'Croatian', flag: '🇭🇷', rtl: false },
  { value: 'cs', label: 'Czech', flag: '🇨🇿', rtl: false },
  { value: 'da', label: 'Danish', flag: '🇩🇰', rtl: false },
  { value: 'nl', label: 'Dutch', flag: '🇳🇱', rtl: false },
  { value: 'en', label: 'English', flag: '🇺🇸', rtl: false },
  { value: 'eo', label: 'Esperanto', flag: '🌐', rtl: false },
  { value: 'et', label: 'Estonian', flag: '🇪🇪', rtl: false },
  { value: 'tl', label: 'Filipino', flag: '🇵🇭', rtl: false },
  { value: 'fi', label: 'Finnish', flag: '🇫🇮', rtl: false },
  { value: 'fy', label: 'Frisian', flag: '🌐', rtl: false },
  { value: 'gl', label: 'Galician', flag: '🌐', rtl: false },
  { value: 'ka', label: 'Georgian', flag: '🇬🇪', rtl: false },
  { value: 'el', label: 'Greek', flag: '🇬🇷', rtl: false },
  { value: 'gu', label: 'Gujarati', flag: '🇮🇳', rtl: false },
  { value: 'ht', label: 'Haitian Creole', flag: '🇭🇹', rtl: false },
  { value: 'ha', label: 'Hausa', flag: '🌐', rtl: false },
  { value: 'haw', label: 'Hawaiian', flag: '🇺🇸', rtl: false },
  { value: 'he', label: 'Hebrew', flag: '🇮🇱', rtl: true },
  { value: 'hi', label: 'Hindi', flag: '🇮🇳', rtl: false },
  { value: 'hmn', label: 'Hmong', flag: '🌐', rtl: false },
  { value: 'hu', label: 'Hungarian', flag: '🇭🇺', rtl: false },
  { value: 'is', label: 'Icelandic', flag: '🇮🇸', rtl: false },
  { value: 'ig', label: 'Igbo', flag: '🇳🇬', rtl: false },
  { value: 'id', label: 'Indonesian', flag: '🇮🇩', rtl: false },
  { value: 'ga', label: 'Irish', flag: '🇮🇪', rtl: false },
  { value: 'it', label: 'Italian', flag: '🇮🇹', rtl: false },
  { value: 'ja', label: 'Japanese', flag: '🇯🇵', rtl: false },
  { value: 'jw', label: 'Javanese', flag: '🌐', rtl: false },
  { value: 'kn', label: 'Kannada', flag: '🇮🇳', rtl: false },
  { value: 'kk', label: 'Kazakh', flag: '🇰🇿', rtl: false },
  { value: 'km', label: 'Khmer', flag: '🇰🇭', rtl: false },
  { value: 'rw', label: 'Kinyarwanda', flag: '🇷🇼', rtl: false },
  { value: 'ko', label: 'Korean', flag: '🇰🇷', rtl: false },
  { value: 'ku', label: 'Kurdish (Kurmanji)', flag: '🌐', rtl: false },
  { value: 'ky', label: 'Kyrgyz', flag: '🇰🇬', rtl: false },
  { value: 'lo', label: 'Lao', flag: '🇱🇦', rtl: false },
  { value: 'la', label: 'Latin', flag: '🌐', rtl: false },
  { value: 'lv', label: 'Latvian', flag: '🇱🇻', rtl: false },
  { value: 'lt', label: 'Lithuanian', flag: '🇱🇹', rtl: false },
  { value: 'lb', label: 'Luxembourgish', flag: '🇱🇺', rtl: false },
  { value: 'mk', label: 'Macedonian', flag: '🇲🇰', rtl: false },
  { value: 'mg', label: 'Malagasy', flag: '🇲🇬', rtl: false },
  { value: 'ms', label: 'Malay', flag: '🇲🇾', rtl: false },
  { value: 'ml', label: 'Malayalam', flag: '🇮🇳', rtl: false },
  { value: 'mt', label: 'Maltese', flag: '🇲🇹', rtl: false },
  { value: 'mi', label: 'Maori', flag: '🇳🇿', rtl: false },
  { value: 'mr', label: 'Marathi', flag: '🇮🇳', rtl: false },
  { value: 'mn', label: 'Mongolian', flag: '🇲🇳', rtl: false },
  { value: 'my', label: 'Myanmar (Burmese)', flag: '🇲🇲', rtl: false },
  { value: 'ne', label: 'Nepali', flag: '🇳🇵', rtl: false },
  { value: 'no', label: 'Norwegian', flag: '🇳🇴', rtl: false },
  { value: 'or', label: 'Odia', flag: '🇮🇳', rtl: false },
  { value: 'ps', label: 'Pashto', flag: '🇦🇫', rtl: true },
  { value: 'fa', label: 'Persian', flag: '🇮🇷', rtl: true },
  { value: 'pl', label: 'Polish', flag: '🇵🇱', rtl: false },
  { value: 'pa', label: 'Punjabi', flag: '🇮🇳', rtl: false },
  { value: 'ro', label: 'Romanian', flag: '🇷🇴', rtl: false },
  { value: 'sm', label: 'Samoan', flag: '🇼🇸', rtl: false },
  { value: 'gd', label: 'Scots Gaelic', flag: '🌐', rtl: false },
  { value: 'sr', label: 'Serbian', flag: '🇷🇸', rtl: false },
  { value: 'st', label: 'Sesotho', flag: '🇱🇸', rtl: false },
  { value: 'sn', label: 'Shona', flag: '🇿🇼', rtl: false },
  { value: 'sd', label: 'Sindhi', flag: '🌐', rtl: false },
  { value: 'si', label: 'Sinhala', flag: '🇱🇰', rtl: false },
  { value: 'sk', label: 'Slovak', flag: '🇸🇰', rtl: false },
  { value: 'sl', label: 'Slovenian', flag: '🇸🇮', rtl: false },
  { value: 'so', label: 'Somali', flag: '🇸🇴', rtl: false },
  { value: 'su', label: 'Sundanese', flag: '🇮🇩', rtl: false },
  { value: 'sw', label: 'Swahili', flag: '🇰🇪', rtl: false },
  { value: 'sv', label: 'Swedish', flag: '🇸🇪', rtl: false },
  { value: 'tg', label: 'Tajik', flag: '🇹🇯', rtl: false },
  { value: 'ta', label: 'Tamil', flag: '🇮🇳', rtl: false },
  { value: 'te', label: 'Telugu', flag: '🇮🇳', rtl: false },
  { value: 'th', label: 'Thai', flag: '🇹🇭', rtl: false },
  { value: 'tr', label: 'Turkish', flag: '🇹🇷', rtl: false },
  { value: 'uk', label: 'Ukrainian', flag: '🇺🇦', rtl: false },
  { value: 'uz', label: 'Uzbek', flag: '🇺🇿', rtl: false },
  { value: 'vi', label: 'Vietnamese', flag: '🇻🇳', rtl: false },
  { value: 'cy', label: 'Welsh', flag: '🌐', rtl: false },
  { value: 'xh', label: 'Xhosa', flag: '🌐', rtl: false },
  { value: 'yi', label: 'Yiddish', flag: '🌐', rtl: false },
  { value: 'yo', label: 'Yoruba', flag: '🌐', rtl: false },
  { value: 'zu', label: 'Zulu', flag: '🌐', rtl: false },
]

const defaultLanguage = 'en'

const getBrowserLanguage = () => {
  if (typeof window === 'undefined') return defaultLanguage

  const browserLocale = window.navigator.language?.toLowerCase() || defaultLanguage
  const matched = languages.find((language) => {
    const langCode = language.value.toLowerCase()
    return browserLocale === langCode || browserLocale.startsWith(langCode.split('-')[0])
  })

  return matched?.value ?? defaultLanguage
}

const isRtl = (language: string) => language === 'ar'

const setDocumentDirection = (language: string) => {
  if (typeof document === 'undefined') return
  document.documentElement.lang = language
  document.documentElement.dir = isRtl(language) ? 'rtl' : 'ltr'
  document.body.dir = isRtl(language) ? 'rtl' : 'ltr'
}

const loadGoogleTranslateScript = () => {
  if (typeof window === 'undefined') {
    return
  }

  if ((window as any).google?.translate) {
    return
  }

  ;(window as any).googleTranslateElementInit = () => {
    new (window as any).google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        autoDisplay: false,
      },
      'google_translate_element'
    )
  }

  const script = document.createElement('script')
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  script.async = true
  document.body.appendChild(script)
}

const applyTranslationLanguage = (language: string) => {
  if (typeof window === 'undefined') {
    return
  }

  const interval = window.setInterval(() => {
    const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo')
    if (!combo) {
      return
    }

    combo.value = language
    combo.dispatchEvent(new Event('change'))
    window.clearInterval(interval)
  }, 300)

  window.setTimeout(() => window.clearInterval(interval), 5000)
}

export default function Navbar() {
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage)
  const [languageFilter, setLanguageFilter] = useState('')
  const [languagePopoverOpen, setLanguagePopoverOpen] = useState(false)
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const languageMenuRef = useRef<HTMLDivElement | null>(null)

  const selectedLanguageData = languages.find((language) => language.value === selectedLanguage) ?? { value: defaultLanguage, label: 'English', flag: '🇺🇸', rtl: false }
  const selectedLanguageLabel = [selectedLanguageData.flag, selectedLanguageData.label].filter(Boolean).join(' ')
  const filteredLanguages = languages.filter((language) =>
    language.label.toLowerCase().includes(languageFilter.toLowerCase()) ||
    language.value.toLowerCase().includes(languageFilter.toLowerCase())
  )

  const handleLanguageChange = (value: string, persist = true) => {
    setSelectedLanguage(value)
    setDocumentDirection(value)

    if (typeof window !== 'undefined' && persist) {
      localStorage.setItem('selectedLanguage', value)
    }

    if (value === defaultLanguage) {
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
      return
    }

    loadGoogleTranslateScript()
    applyTranslationLanguage(value)
  }

  useEffect(() => {
    const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('selectedLanguage') : null
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage)
      setDocumentDirection(storedLanguage)
      if (storedLanguage !== defaultLanguage) {
        loadGoogleTranslateScript()
        applyTranslationLanguage(storedLanguage)
      }
      return
    }

    const browserLanguage = getBrowserLanguage()
    if (browserLanguage !== defaultLanguage) {
      setSelectedLanguage(browserLanguage)
      handleLanguageChange(browserLanguage, true)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 24)
    handleScroll()
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguagePopoverOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition duration-500 ${hasScrolled ? 'bg-white shadow-sm shadow-slate-200/40 backdrop-blur-xl' : 'bg-white'}`}>
      <div className="border-b border-slate-200 bg-white text-slate-700">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-[0.75rem] uppercase tracking-[0.3em]">
          <div className="flex flex-wrap items-center gap-4 text-slate-700">
            <a href="tel:+12397468728" className="inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-brand-500">
              <Phone className="h-3.5 w-3.5 text-brand-500" /> +1 239-746-8728
            </a>
            <a href="mailto:info.midwestshipment@gmail.com" className="inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-brand-500">
              <Mail className="h-3.5 w-3.5 text-brand-300" /> info.midwestshipment@gmail.com
            </a>
            <span className="hidden items-center gap-2 text-slate-400 sm:inline-flex">
              Office hours: Mon - Fri 8:00 AM - 7:00 PM
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <div className="language-switcher shrink-0 relative" ref={languageMenuRef}>
            <button
              type="button"
              aria-expanded={languagePopoverOpen}
              onClick={() => setLanguagePopoverOpen((open) => !open)}
              className="inline-flex min-w-0 max-w-[12rem] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[0.75rem] font-bold text-brand-500 shadow-sm transition hover:border-brand-500 hover:text-brand-600"
            >
              <span className="language-switcher__icon">🌐</span>
              <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">{selectedLanguageLabel}</span>
              <span className="text-xs">▼</span>
            </button>

            {languagePopoverOpen ? (
              <div className="language-dropdown absolute left-0 right-auto z-50 mt-3 w-[18rem] max-w-[92vw] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:left-auto sm:right-0">
                <div className="language-dropdown__search border-b border-slate-200 px-4 py-3">
                  <label htmlFor="language-filter" className="sr-only">
                    Search languages
                  </label>
                  <input
                    id="language-filter"
                    type="search"
                    value={languageFilter}
                    onChange={(event) => setLanguageFilter(event.target.value)}
                    placeholder="Search language..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <ul className="max-h-72 overflow-y-auto px-2 py-2">
                  {filteredLanguages.length === 0 ? (
                    <li className="px-3 py-2 text-sm text-slate-500">No languages found.</li>
                  ) : (
                    filteredLanguages.map((language) => (
                      <li key={language.value} className="rounded-2xl px-2 py-2 hover:bg-brand-50">
                        <button
                          type="button"
                          className="w-full rounded-2xl px-3 py-2 text-left text-sm font-medium text-slate-800 whitespace-normal break-words"
                          onClick={() => {
                            handleLanguageChange(language.value)
                            setLanguagePopoverOpen(false)
                          }}
                        >
                          <span className="mr-2 inline-block align-middle">{language.flag}</span>
                          <span className="inline-block align-middle">{language.label}</span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ) : null}

            <div id="google_translate_element" className="hidden" aria-hidden="true" />
            <p className="sr-only">Powered by Google Translate</p>
            </div>
            <div className="hidden items-center gap-3 md:flex">
              <Link href="/admin/dashboard" className="rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-brand-400">
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 bg-white">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-full bg-brand-500 p-2 shadow-sm shadow-brand-500/20">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-lg font-bold uppercase tracking-[0.2em] text-slate-900">Midwest</div>
            <div className="text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-brand-500">Shipment Company</div>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[0.8rem] font-semibold uppercase tracking-[0.24em] text-slate-700 transition hover:text-brand-500"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/track" className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-900 transition hover:border-brand-400 hover:bg-slate-50">
            Track Package
          </Link>
          <Link href="/contact" className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-brand-400">
            Get Quote
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 md:hidden"
          onClick={() => setIsNavbarOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          {isNavbarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {isNavbarOpen ? (
          <div className="absolute inset-x-0 top-full z-40 rounded-b-[2rem] border border-slate-200 bg-white p-4 shadow-2xl md:hidden">
            <nav className="flex flex-col gap-3 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-3xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 transition hover:bg-slate-50"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/track" className="rounded-3xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-brand-400">
                Track Package
              </Link>
              <Link href="/contact" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 text-center transition hover:bg-slate-100">
                Get Quote
              </Link>
              <Link href="/admin/dashboard" className="rounded-3xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white text-center transition hover:bg-brand-400">
                Admin Portal
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
