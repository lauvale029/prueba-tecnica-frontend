import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
         Gestión Académica
      </Link>
      <div className="nav-links">
        <Link to="/alumnos" className="nav-link"> Alumnos</Link>
        <Link to="/materias" className="nav-link"> Materias</Link>
        <Link to="/notas" className="nav-link"> Notas</Link>
      </div>
    </nav>
  );
}