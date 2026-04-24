import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../services/api';
import type { Materia } from '../types';
import Swal from 'sweetalert2';

interface MateriasListProps {
  onEditar: (materia: Materia) => void;
}

export default function MateriasList({ onEditar }: MateriasListProps) {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState('');

  const cargarMaterias = async () => {
    try {
      const response = await api.get('/materias');
      setMaterias(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Error al conectar con la base de datos de materias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      await cargarMaterias();
    };
    inicializar();
  }, []);

  const eliminarMateria = async (id?: number) => {
    if (!id) return;

    // Ventana emergente bonita para Materias
    const result = await Swal.fire({
      title: '¿Eliminar materia?',
      text: "Todos los registros asociados podrían verse afectados.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#9ca3af',
      confirmButtonText: 'Sí, eliminar materia',
      cancelButtonText: 'Cancelar',
      borderRadius: '12px'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/materias/${id}`);
        toast.success('Materia eliminada correctamente');
        cargarMaterias();
      } catch (err) {
        console.error(err);
        toast.error('Error al intentar eliminar la materia.');
      }
    }
  };

  const materiasFiltradas = materias.filter((materia) => {
    return materia.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
           materia.codigo.toLowerCase().includes(busqueda.toLowerCase());
  });

  if (loading) return <div className="loading-text">Cargando materias...</div>;

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#374151' }}>Catálogo de Materias ({materias.length})</h3>
        
        <div style={{ position: 'relative', width: '300px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '10px', fontSize: '1.2rem' }}>🔍</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre o código..." 
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
            <th>Código</th>
            <th>Nombre de la Materia</th>
            <th>Créditos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materiasFiltradas.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                {busqueda ? 'No se encontraron materias.' : 'No hay materias registradas aún.'}
              </td>
            </tr>
          ) : (
            materiasFiltradas.map((materia) => (
              <tr key={materia.id}>
                <td><strong style={{ color: '#8b5cf6', background: '#ede9fe', padding: '4px 8px', borderRadius: '4px' }}>{materia.codigo}</strong></td>
                <td>{materia.nombre}</td>
                <td>{materia.creditos}</td>
                <td style={{ display: 'flex', gap: '15px' }}>
                  <button onClick={() => onEditar(materia)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Editar">✏️</button>
                  <button onClick={() => eliminarMateria(materia.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="Eliminar">🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}