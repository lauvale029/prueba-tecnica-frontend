import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import AlumnosList from './components/AlumnosList';
import AlumnoForm from './components/AlumnoForm';
import MateriasList from './components/MateriasList';
import MateriaForm from './components/MateriaForm';
import type { Alumno, Materia, Nota } from './types';
import NotasList from './components/NotasList';
import NotaForm from './components/NotaForm';


function VistaAlumnos() {
  const [refresh, setRefresh] = useState(0);
  const [alumnoEnEdicion, setAlumnoEnEdicion] = useState<Alumno | null>(null);

  const handleGuardadoExitoso = () => {
    setRefresh(refresh + 1);
    setAlumnoEnEdicion(null);
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#111827' }}> Gestión de Alumnos</h1>
      </div>
      <AlumnoForm onGuardadoExitoso={handleGuardadoExitoso} alumnoAEditar={alumnoEnEdicion} onCancelar={() => setAlumnoEnEdicion(null)} />
      <div className="card">
        <AlumnosList key={refresh} onEditar={(alumno) => setAlumnoEnEdicion(alumno)} />
      </div>
    </div>
  );
}

function VistaMaterias() {
  const [refresh, setRefresh] = useState(0);
  const [materiaEnEdicion, setMateriaEnEdicion] = useState<Materia | null>(null);

  const handleGuardadoExitoso = () => {
    setRefresh(refresh + 1);
    setMateriaEnEdicion(null);
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#111827' }}> Gestión de Materias</h1>
      </div>
      <MateriaForm onGuardadoExitoso={handleGuardadoExitoso} materiaAEditar={materiaEnEdicion} onCancelar={() => setMateriaEnEdicion(null)} />
      <div className="card">
        <MateriasList key={refresh} onEditar={(materia) => setMateriaEnEdicion(materia)} />
      </div>
    </div>
  );
}

function VistaNotas() {
  const [refresh, setRefresh] = useState(0);

  const handleGuardadoExitoso = () => {
    setRefresh(refresh + 1);
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#111827' }}>Gestión de Notas</h1>
      </div>
      <NotaForm onGuardadoExitoso={handleGuardadoExitoso} />
      <div className="card">
        <NotasList key={refresh} />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/alumnos" element={<VistaAlumnos />} />
        <Route path="/materias" element={<VistaMaterias />} />
        <Route path="/notas" element={<VistaNotas />} />
        <Route path="/notas" element={<div className="dashboard-container"><h2 style={{textAlign: 'center'}}>📝 Módulo de Notas (Próximamente)</h2></div>} />
      </Routes>
    </Router>
  );
}

export default App;