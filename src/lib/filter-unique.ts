export const filterUnique = <T extends { id?: string; handle?: string }>(
  data: T[]
) => [
  ...data
    .reduce((acc, c) => {
      acc.set(c.id, c)
      return acc
    }, new Map())
    .values(),
]
