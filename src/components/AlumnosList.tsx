import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import type { Alumno } from '../types';
import Swal from 'sweetalert2';

interface AlumnosListProps {
  onEditar: (alumno: Alumno) => void;
}

export default function AlumnosList({ onEditar }: AlumnosListProps) {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState('');
  
  
  const [isDbOnline, setIsDbOnline] = useState<boolean>(true);

  const cargarAlumnos = async () => {
    try {
      const response = await api.get('/alumnos');
      setAlumnos(response.data);
      
      setIsDbOnline(true);
    } catch (err) {
      console.error(err);
      
      setIsDbOnline(false);
      toast.error('Error de conexión con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      await cargarAlumnos();
    };
    
    inicializar();
  }, []);

  const eliminarAlumno = async (id?: number) => {
    if (!id) return;

    
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer y el alumno será eliminado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#9ca3af',  
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

  
    if (result.isConfirmed) {
      try {
        await api.delete(`/alumnos/${id}`);
        toast.success('Alumno eliminado correctamente');
        cargarAlumnos();
      } catch (err) {
        console.error(err);
        toast.error('Error al intentar eliminar el alumno.');
      }
    }
  };

  const obtenerIniciales = (nombre: string, apellido: string) => {
    return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
  };

  const alumnosFiltrados = alumnos.filter((alumno) => {
    const nombreCompleto = `${alumno.nombre} ${alumno.apellido}`.toLowerCase();
    return nombreCompleto.includes(busqueda.toLowerCase()) || 
           alumno.email.toLowerCase().includes(busqueda.toLowerCase());
  });

  if (loading) return <div className="loading-text">Cargando alumnos...</div>;

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        
        {}
        <div className="card" style={{ padding: '20px', flex: 1, display: 'flex', alignItems: 'center', gap: '20px', borderLeft: '5px solid #4f46e5' }}>
          <div style={{ fontSize: '2.5rem', background: '#e0e7ff', padding: '10px', borderRadius: '12px' }}>👥</div>
          <div>
            <h4 style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Registrados</h4>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b' }}>{alumnos.length}</span>
          </div>
        </div>

        {}
        <div className="card" style={{ 
          padding: '20px', 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px', 
          borderLeft: `5px solid ${isDbOnline ? '#10b981' : '#ef4444'}`,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            background: isDbOnline ? '#d1fae5' : '#fee2e2', 
            padding: '10px', 
            borderRadius: '12px' 
          }}>
            {isDbOnline ? '📈' : '⚠️'}
          </div>
          <div>
            <h4 style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Estado del Sistema</h4>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              color: isDbOnline ? '#10b981' : '#ef4444' 
            }}>
              {isDbOnline ? 'En línea' : 'Desconectado'}
            </span>
          </div>
        </div>

      </div>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#374151' }}>Lista de Registros</h3>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '1.2rem' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box', borderRadius: '50px' }}
          />
        </div>
      </div>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Alumno</th>
            <th>Fecha Nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                {busqueda ? 'No se encontraron alumnos con esa búsqueda.' : 'No hay alumnos registrados aún o error de conexión.'}
              </td>
            </tr>
          ) : (
            alumnosFiltrados.map((alumno) => (
              <tr key={alumno.id}>
                <td>
                  <div className="avatar-container">
                    <div className="avatar">
                      {obtenerIniciales(alumno.nombre, alumno.apellido)}
                    </div>
                    <div className="alumno-nombre-completo">
                      <strong>{alumno.nombre} {alumno.apellido}</strong>
                      <span className="alumno-email-small">{alumno.email}</span>
                    </div>
                  </div>
                </td>
                <td>{alumno.fechaNacimiento}</td>
                <td style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => onEditar(alumno)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', transition: 'transform 0.2s' }} title="Editar">
                    ✏️
                  </button>
                  <button onClick={() => eliminarAlumno(alumno.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', transition: 'transform 0.2s' }} title="Eliminar">
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}