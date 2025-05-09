import { format } from 'date-fns-tz'
import { de } from 'date-fns/locale'

export function formatDate(
  date: string | Date,
  timeZone = 'Europe/Berlin',
  formatStr = "dd.MM.yyyy, HH:mm 'Uhr'"
) {
  return format(new Date(date), formatStr, {
    timeZone,
    locale: de
  })
}