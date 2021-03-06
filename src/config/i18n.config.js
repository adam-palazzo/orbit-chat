'use strict'

import i18n from 'i18next'

import locales from 'locales'

i18n.init({
  resources: locales,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // react already handles xss
  }
})

export default i18n
