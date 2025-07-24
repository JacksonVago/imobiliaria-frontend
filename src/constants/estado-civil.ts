import { EstadoCivil } from '@/enums/estado-civil'

export const ESTADO_CIVIL_OPTIONS = [
  { value: EstadoCivil.CASADO, label: 'Casado' },
  { value: EstadoCivil.DIVORCIADO, label: 'Divorciado' },
  { value: EstadoCivil.SOLTEIRO, label: 'Solteiro' },
  { value: EstadoCivil.VIUVO, label: 'Viúvo' },
  { value: EstadoCivil.UNIAO_ESTAVEL, label: 'União Estável' }
]
