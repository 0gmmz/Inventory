import { NavLink, Outlet } from 'react-router-dom'

const Icono = ({ d }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)

export default function Layout() {
  return (
    <div className="app-shell">
      <nav className="tabbar" aria-label="Navegación principal">
        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
          <Icono d="M3 12l9-8 9 8M5 10v10h5v-6h4v6h5V10" />
          <span>Tablero</span>
        </NavLink>
        <NavLink to="/hardware" className={({isActive}) => isActive ? 'active' : ''}>
          <Icono d="M4 5h16v10H4zM8 19h8M12 15v4" />
          <span>Hardware</span>
        </NavLink>
        <NavLink to="/licencias" className={({isActive}) => isActive ? 'active' : ''}>
          <Icono d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6" />
          <span>Licencias</span>
        </NavLink>
        <NavLink to="/asignaciones" className={({isActive}) => isActive ? 'active' : ''}>
          <Icono d="M16 11a4 4 0 10-8 0M4 21v-1a6 6 0 0112 0v1M19 8v6M22 11h-6" />
          <span>Asignar</span>
        </NavLink>
      </nav>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
