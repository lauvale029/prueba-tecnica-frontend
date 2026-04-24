import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="hero-container">
      <h1 className="hero-title">Gestión Académica Inteligente</h1>
      <p className="hero-subtitle">
        Administra alumnos, materias y notas en una plataforma rápida, segura y diseñada para la excelencia académica. 
        Potenciado por React, Spring Boot y PostgreSQL.
      </p>
      <Link to="/alumnos" className="btn-primary">
         Comenzar ahora
      </Link>
    </div>
  );
}