import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import type { Nota, Alumno, Materia } from '../types';

interface NotaFormProps {
  onGuardadoExitoso: () => void;
}

export default function NotaForm({ onGuardadoExitoso }: NotaFormProps) {
  const [formData, setFormData] = useState({ alumnoId: '', materiaId: '', calificacion: '' });
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [resAlumnos, resMaterias] = await Promise.all([
          api.get('/alumnos'), api.get('/materias')
        ]);
        setAlumnos(resAlumnos.data);
        setMaterias(resMaterias.data);
      } catch (error) {
        toast.error('Error al cargar alumnos o materias');
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        alumno: { id: Number(formData.alumnoId) },
        materia: { id: Number(formData.materiaId) },
        calificacion: Number(formData.calificacion)
      };

      // Única acción permitida: Crear
      await api.post('/notas', payload);
      toast.success('¡Nota registrada correctamente! 🎉');
      
      onGuardadoExitoso();
      setFormData({ alumnoId: '', materiaId: '', calificacion: '' }); 
    } catch (err) {
      toast.error('Hubo un error al guardar la nota.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '20px', borderTop: '5px solid #f59e0b' }}>
      <h2 style={{ marginTop: 0, color: '#111827' }}>➕ Registrar Calificación</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Alumno:</label>
          <select name="alumnoId" value={formData.alumnoId} onChange={handleChange} required className="form-input">
            <option value="">Seleccione un alumno...</option>
            {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre} {a.apellido}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Materia:</label>
          <select name="materiaId" value={formData.materiaId} onChange={handleChange} required className="form-input">
            <option value="">Seleccione una materia...</option>
            {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Calificación (0.0 - 5.0):</label>
          <input type="number" name="calificacion" value={formData.calificacion} onChange={handleChange} required min="0" max="5" step="0.1" className="form-input" />
        </div>
        
        <div style={{ gridColumn: 'span 3' }}>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Guardando...' : 'Guardar Nota (Definitiva)'}
          </button>
        </div>
      </form>
    </div>
  );
}