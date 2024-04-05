'use client'

import { useState } from 'react'

import BinocularsIcon from 'public/binoculars.svg'

import { useInfiniteLoader } from '@/hooks/use-infinite-loader'
import { useSSE } from '@/hooks/use-sse'
import { getCurrentUserOrThrow } from '@/lib/auth'
import { findHashtags, generateHashtagRoutes } from '@/lib/hashtag'
import type { EnrichedTweet, PaginatedResponse } from '@/lib/types'

import { Tweet } from '.'
import { Button } from '../button'
import { LoadNew } from '../load-new'
import { TweetSkeleton } from './skeleton'

type Props<T> = {
  route: string
  limit?: number
  manual?: boolean
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>
  initialTweets: PaginatedResponse<T>
}

export const TweetList = <T extends EnrichedTweet>({
  route,
  limit,
  manual,
  currentUser,
  initialTweets,
}: Props<T>) => {
  const {
    data: tweets,
    setData: setTweets,
    isLoading,
    isError,
    hasMore,
    sentryRef,
    fetchMore,
  } = useInfiniteLoader<T>({
    initialData: initialTweets,
    route,
    limit,
    manual,
  })
  const [newTweets, setNewTweets] = useState<T[]>([])

  useSSE({
    TWEET: async (tweet) => {
      if (
        [
          '/api/tweets?filter=latest',
          `/api/${tweet.userHandle}/tweets/?filter=tweets`,
          ...generateHashtagRoutes(findHashtags(tweet.content)),
        ].includes(route)
      ) {
        setNewTweets((prevTweets) => [tweet, ...prevTweets] as T[])
      } else if (
        [
          '/api/tweets?filter=media',
          `/api/${tweet.userHandle}/tweets/?filter=media`,
        ].includes(route)
      ) {
        if (tweet.imgPath)
          setNewTweets((prevTweets) => [tweet, ...prevTweets] as T[])
      } else if (route === '/api/tweets?filter=home') {
        const follow = await fetch(`/api/${tweet.userHandle}/follow`).then(
          (res) => res.json()
        )

        if (follow.isFollowing) {
          setNewTweets((prevTweets) => [tweet, ...prevTweets] as T[])
        }
      }
    },
    REPLY: (reply) => {
      const tweet = tweets.find((tweet) => tweet.id === reply.tweetId)

      if (tweet) {
        const newTweets = tweets.map((tweet) =>
          tweet.id === reply.tweetId
            ? {
                ...tweet,
                replyCount: `${parseInt(tweet.replyCount, 10) + 1}`,
              }
            : tweet
        )
        setTweets(newTweets)
      }
    },
    RETWEET: async (retweet) => {
      if (
        [
          '/api/tweets?filter=latest',
          `/api/${retweet.retweeterHandle}/tweets/?filter=tweets`,
          ...generateHashtagRoutes(findHashtags(retweet.content)),
        ].includes(route)
      ) {
        setNewTweets((prevTweets) => [retweet, ...prevTweets] as T[])
      } else if (
        [
          '/api/tweets?filter=media',
          `/api/${retweet.retweeterHandle}/tweets/?filter=media`,
        ].includes(route) &&
        retweet.imgPath
      ) {
        setNewTweets((prevTweets) => [retweet, ...prevTweets] as T[])
      } else if (route === '/api/tweets?filter=home') {
        const follow = await fetch(
          `/api/${retweet.retweeterHandle}/follow`
        ).then((res) => res.json())

        if (follow.isFollowing) {
          setNewTweets((prevTweets) => [retweet, ...prevTweets] as T[])
        }
      }

      const originalTweet = tweets.find(
        (tweet) => tweet.id === retweet.retweetId
      )

      if (originalTweet) {
        const newTweets = tweets.map((tweet) =>
          tweet.id === originalTweet.id
            ? {
                ...tweet,
                retweetCount: `${parseInt(tweet.retweetCount, 10) + 1}`,
                ...(currentUser.handle === retweet.retweeterHandle && {
                  reactions: {
                    ...tweet.reactions,
                    retweeted: true,
                  },
                }),
              }
            : tweet
        )
        setTweets(newTweets)
      }
    },
    UNDO_RETWEET: (retweet) => {
      const deletedRetweet = tweets.find((tweet) => tweet.id === retweet.id)
      const originalTweet = tweets.find(
        (tweet) => tweet.id === retweet.retweetId
      )
      const newTweets = tweets.map((tweet) =>
        tweet.id === retweet.id
          ? {
              ...tweet,
              ...(deletedRetweet && { deleted: true }),
            }
          : tweet.id === retweet.retweetId
            ? {
                ...tweet,
                ...(originalTweet && {
                  retweetCount: `${parseInt(tweet.retweetCount, 10) - 1}`,
                  ...(currentUser.handle === retweet.handle && {
                    reactions: {
                      ...tweet.reactions,
                      retweeted: false,
                    },
                  }),
                }),
              }
            : tweet
      )

      if (deletedRetweet || originalTweet) setTweets(newTweets)
      if (!deletedRetweet) {
        setNewTweets((prevTweets) =>
          prevTweets.filter((tweet) => tweet.id !== retweet.id)
        )
      }
    },
    TWEET_LIKE: (like) => {
      const tweet = tweets.find((tweet) => tweet.id === like.tweetId)

      if (tweet) {
        const newTweets = tweets.map((tweet) =>
          tweet.id === like.tweetId
            ? {
                ...tweet,
                likeCount: `${parseInt(tweet.likeCount, 10) + 1}`,
                ...(currentUser.handle === like.handle && {
                  reactions: {
                    ...tweet.reactions,
                    liked: true,
                  },
                }),
              }
            : tweet
        )
        setTweets(newTweets)
      }
    },
    TWEET_UNDO_LIKE: (like) => {
      const tweet = tweets.find((tweet) => tweet.id === like.tweetId)

      if (tweet) {
        const newTweets = tweets.map((tweet) =>
          tweet.id === like.tweetId
            ? {
                ...tweet,
                likeCount: `${parseInt(tweet.likeCount, 10) - 1}`,
                ...(currentUser.handle === like.handle && {
                  reactions: {
                    ...tweet.reactions,
                    liked: false,
                  },
                }),
              }
            : tweet
        )
        setTweets(newTweets)
      }
    },
    SAVE: (save) => {
      const tweet = tweets.find((tweet) => tweet.id === save.tweet.id)

      if (tweet) {
        const newTweets = tweets.map((tweet) =>
          tweet.id === save.tweet.id
            ? {
                ...tweet,
                bookmarkCount: `${parseInt(tweet.bookmarkCount, 10) + 1}`,
                ...(currentUser.handle === save.handle && {
                  reactions: {
                    ...tweet.reactions,
                    saved: true,
                  },
                }),
              }
            : tweet
        )
        setTweets(newTweets)
      }

      if (
        route === '/api/tweets/?filter=bookmarks' &&
        save.handle === currentUser.handle &&
        !tweets.find((tweet) => tweet.id === save.tweet.id)
      ) {
        setNewTweets((prevTweets) => [save.tweet, ...prevTweets] as T[])
      }
    },
    UNDO_SAVE: (save) => {
      const tweet = tweets.find((tweet) => tweet.id === save.tweetId)

      if (tweet) {
        const newTweets = tweets.map((tweet) =>
          tweet.id === save.tweetId
            ? {
                ...tweet,
                bookmarkCount: `${parseInt(tweet.bookmarkCount, 10) - 1}`,
                ...(currentUser.handle === save.handle && {
                  reactions: {
                    ...tweet.reactions,
                    saved: false,
                  },
                }),
              }
            : tweet
        )

        setTweets(newTweets)
      }

      if (
        route === '/api/tweets/?filter=bookmarks' &&
        save.handle === currentUser.handle
      ) {
        setNewTweets((prevTweets) =>
          prevTweets.filter((tweet) => tweet.id !== save.tweetId)
        )
      }
    },
  })

  return (
    <section className='grid gap-3'>
      {newTweets.length > 0 && (
        <LoadNew
          className='top-[80px]'
          onLoadNew={() => {
            setTweets([...newTweets, ...tweets])
            setNewTweets([])
          }}
          newCount={newTweets.length}
          singular='new tweet'
          plural='new tweets'
        />
      )}
      {tweets.map((tweet, idx) => (
        <Tweet key={tweet.id} currentUser={currentUser} {...tweet} />
      ))}
      {hasMore && !manual && <div ref={sentryRef} />}
      {isLoading && <TweetSkeleton count={5} />}
      {isError && (
        <div className='flex flex-col items-center justify-center text-sm text-ashen'>
          An error has occured
          <Button className='mt-1' onClick={() => fetchMore()}>
            Retry
          </Button>
        </div>
      )}
      {tweets.length === 0 && (
        <div className='flex items-center justify-center text-sm text-ashen'>
          <BinocularsIcon />
          <span className='ml-2'>No tweets found</span>
        </div>
      )}
      {((!hasMore && tweets.length > 0) || (manual && tweets.length > 0)) && (
        <div className='flex justify-center text-sm text-ashen'>
          End of results
        </div>
      )}
    </section>
  )
}
