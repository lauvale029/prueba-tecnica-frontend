import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import type { Nota, Alumno, Materia } from '../types';

export default function NotasList() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para los filtros
  const [filtroAlumno, setFiltroAlumno] = useState('');
  const [filtroMateria, setFiltroMateria] = useState('');

  // 1. Cargar todos los datos una sola vez al inicio
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resNotas, resAlumnos, resMaterias] = await Promise.all([
          api.get('/notas'), 
          api.get('/alumnos'), 
          api.get('/materias')
        ]);
        setNotas(resNotas.data);
        setAlumnos(resAlumnos.data);
        setMaterias(resMaterias.data);
      } catch (err) {
        toast.error('Error al cargar datos del servidor.');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []); // El array vacío significa que solo se ejecuta al entrar a la pantalla

  // 2. Magia de React: Filtramos los datos en tiempo real
  const notasFiltradas = notas.filter((nota) => {
    // Verificamos el ID de alumno/materia (soporta si Java lo envía plano o como objeto)
    const idAlumno = nota.alumno?.id?.toString() || nota.alumnoId?.toString();
    const idMateria = nota.materia?.id?.toString() || nota.materiaId?.toString();

    const coincideAlumno = filtroAlumno === '' || idAlumno === filtroAlumno;
    const coincideMateria = filtroMateria === '' || idMateria === filtroMateria;

    return coincideAlumno && coincideMateria;
  });

  const getNombreAlumno = (id: number | string | undefined) => {
    if (!id) return 'Desconocido';
    const alumno = alumnos.find(a => a.id?.toString() === id.toString());
    return alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Desconocido';
  };

  const getNombreMateria = (id: number | string | undefined) => {
    if (!id) return 'Desconocida';
    const materia = materias.find(m => m.id?.toString() === id.toString());
    return materia ? materia.nombre : 'Desconocida';
  };

  return (
    <>
      <Toaster position="bottom-right" />
      
      {/* Sección de Filtros */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#374151' }}>🔍 Filtrar calificaciones</h3>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select value={filtroAlumno} onChange={(e) => setFiltroAlumno(e.target.value)} className="form-input" style={{ flex: 1 }}>
            <option value="">Todos los alumnos</option>
            {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
          </select>
          
          <select value={filtroMateria} onChange={(e) => setFiltroMateria(e.target.value)} className="form-input" style={{ flex: 1 }}>
            <option value="">Todas las materias</option>
            {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </div>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Materia</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>Cargando...</td></tr>
          ) : notasFiltradas.length === 0 ? (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>No se encontraron notas para esta búsqueda.</td></tr>
          ) : (
            notasFiltradas.map((nota) => (
              <tr key={nota.id}>
                {/* Aseguramos que lea el ID correctamente sin importar cómo lo envíe el backend */}
                <td><strong>{getNombreAlumno(nota.alumno?.id || nota.alumnoId)}</strong></td>
                <td>{getNombreMateria(nota.materia?.id || nota.materiaId)}</td>
                <td>
                  <span style={{ 
                    background: Number(nota.calificacion) >= 3.0 ? '#d1fae5' : '#fee2e2', 
                    color: Number(nota.calificacion) >= 3.0 ? '#059669' : '#dc2626',
                    padding: '4px 12px', borderRadius: '20px', fontWeight: 'bold' 
                  }}>
                    {Number(nota.calificacion).toFixed(1)}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}