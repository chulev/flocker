import * as matchers from '@testing-library/jest-dom/matchers'
import { plugin } from 'bun'
import { expect } from 'bun:test'

expect.extend(matchers)

plugin({
  name: 'SVG',
  async setup(build) {
    const { transform } = await import('@svgr/core')
    const { readFileSync } = await import('fs')

    build.onLoad({ filter: /\.(svg)$/ }, async (args) => {
      const text = readFileSync(args.path, 'utf8')
      let contents = await transform(
        text,
        {
          icon: true,
          exportType: 'default',
          plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        },
        { componentName: 'ReactComponent' }
      )

      return {
        contents,
        loader: 'js',
      }
    })
  },
})
