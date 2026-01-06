import { expect } from 'bun:test'
import * as matchers from '@testing-library/jest-dom/matchers'
import { plugin } from 'bun'

expect.extend(matchers)

plugin({
  name: 'svg-component-mock',
  setup(build) {
    // Intercept any import ending in .svg
    build.onLoad({ filter: /\.svg$/ }, () => {
      // Return a mock React component (TSX)
      return {
        contents: `
          export default function SVGIcon(props) {
            return <svg {...props} data-testid="svg-icon" />;
          }
        `,
        loader: 'tsx',
      }
    })
  },
})
