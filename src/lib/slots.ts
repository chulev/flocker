import { Children, isValidElement } from 'react'

type Components<T> = {
  [k in keyof T]: T[k]
}

type Slots<T> = {
  [key in keyof T]?: React.ReactNode
}

export const getSlots = <T>(
  children: React.ReactNode,
  components: Components<T>
) => {
  const slots: Slots<T> = {}

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return

    if (typeof child.type === 'function') {
      const type = child.type as React.FunctionComponent
      const key = type?.displayName?.toLowerCase()

      if (components[key as keyof typeof components]) {
        slots[key as keyof typeof components] = child
      }
    }
  })

  return slots
}
