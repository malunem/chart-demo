import { useLanguage } from '../hooks/useLanguage'
import { LABELS } from '../i18n'

/**
 * Renders top navigation bar with links to pages
 */
export const Navbar = () => {
  const [lang] = useLanguage()
  const langLabels = LABELS[lang]

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary mb-4">
      <div className="container-fluid">
        <div className="navbar-brand">
          Brainomix
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/chart">
                {langLabels.chart}
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/settings">
                {langLabels.settings}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
