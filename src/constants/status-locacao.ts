import { LocacaoStatus } from "@/enums/locacao/enums-locacao";
import { LocalDeposito } from "@/interfaces/locacao";

export const STATUS_LOCACAO_OPTIONS = [
  { value: LocacaoStatus.AGUARDANDO_DOCUMENTOS, label: 'Aguardando documentos' },
  { value: LocacaoStatus.ATIVA, label: 'Ativa' },
  { value: LocacaoStatus.ENCERRADA, label: 'Encerrada' },
  
]

export const LOCAL_DEPOSITO_OPTIONS = [
  { value: LocalDeposito.IMOBILIARIA, label: 'Imobiliária' },  
  { value: LocalDeposito.PROPRIETARIO, label: 'Proprietário' },  
]