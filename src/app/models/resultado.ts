export type EstadoResultado = 'REGISTRADO' | 'VALIDADO' | 'RECHAZADO';

export interface Resultado {
  id?: number;              
  laboratorioId: number;    
  analistaId: number;       
  fechaMuestra?: string;  
  fechaResultado?: string;  
  observacion?: string;     
  estado: EstadoResultado;  
}
