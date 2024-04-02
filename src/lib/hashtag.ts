export const isHashtag = (word: string) => word.startsWith('#')
export const getHashtag = (hashtag: string) => hashtag.slice(1)
export const findHashtags = (content: string) =>
  content.split(' ').filter(isHashtag)
export const generateHashtagRoutes = (hashtags: string[]) =>
  hashtags.map((hashtag) => `/api/tweets/${getHashtag(hashtag)}?f=1`)
