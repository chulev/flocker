const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const extractDateFromUUID = (uuid: string) => {
  const timestampHex = uuid.slice(0, 13).replace(`-`, ``)
  const timestamp = Number.parseInt(timestampHex, 16)

  const date = new Date(timestamp)
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const hours = date.getHours()
  const minutes = date.getMinutes()

  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `${day} ${month} at ${hours}:${paddedMinutes}`
}
