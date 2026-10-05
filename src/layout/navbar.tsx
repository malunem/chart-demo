import { Link } from 'react-router'
import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'
import { useState } from 'react'

/**
 * Renders top navigation bar with links to pages
 */
export const Navbar = () => {
  const [lang] = useLanguage()
  const langLabels = LABELS[lang]
  const [isOpen, setOpen] = useState(false)

  return (
    <nav
      className="navbar"
      style={{
        borderBottom: '1px solid'
      }}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}>
        <div
          style={{
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
          Brainomix
        </div>
        <button
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!isOpen)}
          style={{
            background: 'transparent',
            color: 'inherit',
            border: '1px solid lightgrey',
            borderRadius: '10%',
            font: 'inherit',
            padding: '0.5rem'
          }}>
          Menu
        </button>
      </div>
      {isOpen && (
        <div
          className=" menu-border"
          style={{
            width: '100%',
            display: 'block',
            textAlign: 'right'
          }}
          onClick={() => setOpen(false)}>
          <ul>
            <li>
              <Link to="/chart">{langLabels.chart}</Link>
            </li>
            <li>
              <Link to="/settings">{langLabels.settings}</Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
