'use strict'

import { format } from 'date-fns'

import locales from '../locales'

export function getFormattedTimestamp (timestamp) {
  return format(new Date(timestamp), 'HH:mm:ss')
}

export function getFormattedDateString (date, localeKey = 'en') {
  return format(date, 'dddd MMMM Do YYYY', { locale: locales[localeKey].dateLocale })
}
