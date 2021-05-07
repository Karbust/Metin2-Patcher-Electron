import i18n from 'i18next'
import * as isDev from 'electron-is-dev'

import * as languageEN from '../src/localization/en.json'
import * as languagePT from '../src/localization/pt.json'

i18n.init({
    resources: {
        en: languageEN,
        pt: languagePT
    },
    supportedLngs: ['en', 'pt'],
    fallbackLng: 'en',
    debug: isDev,
    keySeparator: '.',
    interpolation: {
        formatSeparator: ','
    },
})

export default i18n
