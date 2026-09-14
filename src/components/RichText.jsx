import { Fragment } from 'react'

const TOKEN_PATTERN = /(<br\s*\/?\s*>|<\/?em>)/gi

function renderAllowedMarkup(value) {
  let emphasized = false

  return String(value || '')
    .split(TOKEN_PATTERN)
    .map((part, index) => {
      if (/^<em>$/i.test(part)) {
        emphasized = true
        return null
      }

      if (/^<\/em>$/i.test(part)) {
        emphasized = false
        return null
      }

      if (/^<br\s*\/?\s*>$/i.test(part)) {
        return <br key={`br-${index}`} />
      }

      if (!part) return null

      return emphasized
        ? <em key={`em-${index}`}>{part}</em>
        : <Fragment key={`text-${index}`}>{part}</Fragment>
    })
}

export default function RichText({ as: Component = 'span', children, ...props }) {
  return <Component {...props}>{renderAllowedMarkup(children)}</Component>
}

