import { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; 
import api from '../services/api';
import type { Alumno } from '../types';

interface AlumnoFormProps {
  onGuardadoExitoso: () => void;
  alumnoAEditar: Alumno | null;
  onCancelar: () => void;
}

export default function AlumnoForm({ onGuardadoExitoso, alumnoAEditar, onCancelar }: AlumnoFormProps) {
  const [formData, setFormData] = useState<Alumno>({
    nombre: '', apellido: '', email: '', fechaNacimiento: '',
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (alumnoAEditar) {
      setFormData(alumnoAEditar);
    } else {
      setFormData({ nombre: '', apellido: '', email: '', fechaNacimiento: '' });
    }
  }, [alumnoAEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.id) {
        
        await api.put(`/alumnos/${formData.id}`, formData);
        toast.success('¡Alumno actualizado correctamente! ✨');
      } else {
        
        await api.post('/alumnos', formData);
        toast.success('¡Alumno registrado exitosamente! 🎉');
        
        
        setFormData({ nombre: '', apellido: '', email: '', fechaNacimiento: '' });
      }
      onGuardadoExitoso();
    } catch (err) {
      console.error(err);
      toast.error('Hubo un error al guardar. Verifica los datos.');
    } finally {
      setLoading(false);
    }
  };

  const fechaMaxima = new Date().toISOString().split('T')[0];

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
      <h2 style={{ marginTop: 0, color: '#111827' }}>
        {alumnoAEditar ? '✏️ Editar Alumno' : '➕ Registrar Nuevo Alumno'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="nombre" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Nombre(s):</label>
          <input id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-input" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="apellido" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Apellidos:</label>
          <input id="apellido" type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="form-input" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="email" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Correo Electrónico:</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="fechaNacimiento" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Fecha de Nacimiento:</label>
          {}
          <input id="fechaNacimiento" type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} max={fechaMaxima} required className="form-input" />
        </div>
        
        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
            {loading ? 'Guardando...' : (alumnoAEditar ? 'Actualizar Alumno' : 'Guardar Alumno')}
          </button>
          
          {alumnoAEditar && (
            <button type="button" onClick={onCancelar} style={{ flex: 1, padding: '12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}