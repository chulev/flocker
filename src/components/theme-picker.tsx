'use client'

import { cx } from 'class-variance-authority'
import { useCallback, useState } from 'react'

import DarkIcon from 'public/dark.svg'
import LightIcon from 'public/light.svg'

import { changeTheme } from '@/actions/theme'
import type { Theme } from '@/lib/types'

import { Button } from './button'
import { Divider } from './divider'
import { Dropdown } from './dropdown'

type Props = {
  theme: Theme
}

const ICONS = {
  light: <LightIcon />,
  dark: <DarkIcon />,
}

export const ThemePicker = ({ theme }: Props) => {
  const [currentTheme, setTheme] = useState<Theme>(theme)

  const pickTheme = useCallback(async (theme: Theme) => {
    try {
      await changeTheme(theme)
      document.documentElement.setAttribute('data-theme', theme)
      setTheme(theme)
    } catch (_) {
      console.error('Could not change theme')
    }
  }, [])

  return (
    <Dropdown className='right-0 w-32' closeOnSelect>
      <Dropdown.Trigger>
        <Button
          className='w-fit'
          size='md'
          variant='highlight'
          aria-label='Theme picker'
        >
          {ICONS[currentTheme]}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <span className='text-bold text-sm text-charcoal'>Pick a theme</span>
        <Divider />
        <div>
          <Button
            className={cx(
              'w-full',
              currentTheme === 'light' && 'pointer-events-none'
            )}
            variant={currentTheme === 'light' ? 'highlight' : 'secondary'}
            onClick={() => pickTheme('light')}
          >
            <LightIcon />
            <span className='ml-2'>Light</span>
          </Button>
          <Button
            className={cx(
              'w-full',
              currentTheme === 'dark' && 'pointer-events-none'
            )}
            variant={currentTheme === 'dark' ? 'highlight' : 'secondary'}
            onClick={() => pickTheme('dark')}
          >
            <DarkIcon />
            <span className='ml-2'>Dark</span>
          </Button>
        </div>
      </Dropdown.Content>
    </Dropdown>
  )
}
