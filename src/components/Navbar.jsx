import './Navbar.css'

const links = [
  { label: 'WORK', href: '#expertise' },
  { label: 'MAP', href: '#world-map' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
]

export default function Navbar() {
  return (
    <nav className="navbar" id="navbar">
      <ul className="navbar__links">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a className="navbar__link" href={href}>{label}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
