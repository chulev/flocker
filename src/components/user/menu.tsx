'use client'

import { signOut } from 'next-auth/react'

import ExploreIcon from 'public/explore.svg'
import HomeIcon from 'public/home.svg'
import LogoutIcon from 'public/logout.svg'
import MyProfileIcon from 'public/my-profile.svg'
import BookmarksIcon from 'public/save.svg'
import SettingsIcon from 'public/settings.svg'
import TrendingIcon from 'public/trending.svg'

import { SIGN_IN_PATH } from '@/routes'

import { ActiveLink } from '../active-link'
import { Avatar } from '../avatar'
import { Button } from '../button'
import { Divider } from '../divider'
import { Dropdown } from '../dropdown'
import { Link } from '../link'

type Props = {
  name: string
  handle: string
  image: string | null
}

const ACTIVE_CLASS_NAME = 'text-verdant'

export const UserMenu = ({ name, handle, image }: Props) => {
  return (
    <Dropdown className='right-0 w-40' closeOnSelect>
      <Dropdown.Trigger>
        <Button
          variant='secondary'
          className='m-2 flex cursor-pointer items-center justify-center p-1 max-sm:w-fit'
        >
          <Avatar variant='sm' src={image} alt='Current user' />
          <span className='ml-2 w-24 truncate text-sm text-charcoal max-sm:hidden'>
            {name}
          </span>
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <div className='md:hidden'>
          <span className='text-bold text-sm text-charcoal'>{name}</span>
          <Divider />
        </div>
        <nav className='w-full'>
          <Link href={`/user/${handle}`}>
            <MyProfileIcon />
            <span className='ml-2'>My profile</span>
          </Link>
          <Link href='/settings'>
            <SettingsIcon />
            <span className='ml-2'>Settings</span>
          </Link>
          <Divider />
          <Button
            className='w-full'
            variant='warning'
            onClick={() =>
              signOut({
                callbackUrl: SIGN_IN_PATH,
              })
            }
          >
            <LogoutIcon />
            <span className='ml-2'>Logout</span>
          </Button>
        </nav>
        <section className='mt-4 md:hidden'>
          <span className='text-bold text-sm text-charcoal'>Navigation</span>
          <Divider />
          <nav>
            <ActiveLink className={ACTIVE_CLASS_NAME} href='/'>
              <HomeIcon />
              <span className='ml-2'>Home</span>
            </ActiveLink>
            <ActiveLink
              className={ACTIVE_CLASS_NAME}
              href='/explore'
              matchPartialPath
            >
              <ExploreIcon />
              <span className='ml-2'>Explore</span>
            </ActiveLink>
            <ActiveLink
              className={ACTIVE_CLASS_NAME}
              href='/bookmarks'
              matchPartialPath
            >
              <BookmarksIcon />
              <span className='ml-2'>Bookmarks</span>
            </ActiveLink>
            <ActiveLink className={ACTIVE_CLASS_NAME} href='/trending'>
              <TrendingIcon />
              <span className='ml-2'>Trending</span>
            </ActiveLink>
          </nav>
        </section>
      </Dropdown.Content>
    </Dropdown>
  )
}
