import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import languageEN from './localization/en.json'
import languagePT from './localization/pt.json'

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: languageEN,
            pt: languagePT
        },
        supportedLngs: ['en', 'pt'],
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        keySeparator: '.',
        interpolation: {
            formatSeparator: ','
        },
        react: {
            wait: true,
            bindI18n: 'languageChanged loaded',
            bindI18nStore: 'added removed',
            nsMode: 'default',
            useSuspense: true,
        }
    })

export default i18n
