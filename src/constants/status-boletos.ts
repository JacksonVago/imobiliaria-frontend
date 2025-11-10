import { BoletoStatus } from "@/enums/locacao/enums-locacao";

export const STATUS_BOLETO_OPTIONS = [
  { value: BoletoStatus.ATRASADO, label: 'Atrasado' },  
  { value: BoletoStatus.PAGO, label: 'Pago' },  
  { value: BoletoStatus.PENDENTE, label: 'Pendente' },  
  { value: BoletoStatus.CONFIRMADO, label: 'Confirmado' },  
  { value: BoletoStatus.CANCELADO, label: 'Cancelado' },  
]