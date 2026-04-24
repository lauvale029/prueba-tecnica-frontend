export interface Alumno {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaNacimiento: string;
}

export interface Materia {
  id?: number;
  nombre: string;
  codigo: string;
  creditos: number;
}

export interface Nota {
  id?: number;
  valor: number;
  fechaRegistro?: string;
  alumno: Alumno;
  materia: Materia;
}

export interface Materia {
  id?: number;
  nombre: string;
  codigo: string;
  creditos: number;
}

export interface Nota {
  id?: number;
  alumnoId: number | string;
  materiaId: number | string;
  calificacion: number | string;
}