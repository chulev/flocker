import { uuidv7 } from 'uuidv7'

export const getRandomNumberInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const getRandomElement = (array: string[]) =>
  array[Math.floor(Math.random() * array.length)]

const delay = (milliseconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}

export const generateEntitiesWithUniqueTimestamp = async (entities: any[]) => {
  const generatedEntities: any[] = []

  for (const entity of entities) {
    // HACK: uuidv7 implementation has only millisecond precision, so we need to delay the uuidv7 generation
    await delay(1).then(() =>
      generatedEntities.push({ ...entity, id: uuidv7() })
    )
  }

  return generatedEntities
}
