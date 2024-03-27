export const pluralize = (count: number, singular: string, plural: string) => {
  if (count === 1) return `${count} ${singular}`

  if (count < 1000) return `${count} ${plural}`

  const thousands = count / 1000

  return `${
    thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)
  }k ${plural}`
}
