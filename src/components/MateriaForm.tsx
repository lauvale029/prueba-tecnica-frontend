import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import type { Materia } from '../types';

interface MateriaFormProps {
  onGuardadoExitoso: () => void;
  materiaAEditar: Materia | null;
  onCancelar: () => void;
}

export default function MateriaForm({ onGuardadoExitoso, materiaAEditar, onCancelar }: MateriaFormProps) {
  const [formData, setFormData] = useState<Materia>({
    nombre: '', codigo: '', creditos: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (materiaAEditar) {
      setFormData(materiaAEditar);
    } else {
      setFormData({ nombre: '', codigo: '', creditos: 1 });
    }
  }, [materiaAEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (formData.id) {
        await api.put(`/materias/${formData.id}`, formData);
        toast.success('¡Materia actualizada correctamente! ✨');
      } else {
        await api.post('/materias', formData);
        toast.success('¡Materia registrada exitosamente! 🎉');
        
        
        setFormData({ nombre: '', codigo: '', creditos: 1 });
      }
      onGuardadoExitoso();
    } catch (err) {
      console.error(err);
      toast.error('Hubo un error al guardar la materia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '20px', borderTop: '5px solid #8b5cf6' }}>
      <h2 style={{ marginTop: 0, color: '#111827' }}>
        {materiaAEditar ? '✏️ Editar Materia' : '➕ Registrar Nueva Materia'}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
          <label htmlFor="nombre" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Nombre de la Materia:</label>
          <input id="nombre" type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="form-input" placeholder="Ej. Matemáticas Avanzadas" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="codigo" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Código:</label>
          <input id="codigo" type="text" name="codigo" value={formData.codigo} onChange={handleChange} required className="form-input" placeholder="Ej. MAT-101" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label htmlFor="creditos" style={{ fontWeight: '600', fontSize: '0.9rem', color: '#374151' }}>Créditos:</label>
          <input id="creditos" type="number" name="creditos" value={formData.creditos} onChange={handleChange} required min="1" max="10" className="form-input" />
        </div>
        
        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" disabled={loading} style={{ flex: 1, padding: '12px', backgroundColor: '#8b5cf6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
            {loading ? 'Guardando...' : (materiaAEditar ? 'Actualizar Materia' : 'Guardar Materia')}
          </button>
          
          {materiaAEditar && (
            <button type="button" onClick={onCancelar} style={{ flex: 1, padding: '12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.2s' }}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}