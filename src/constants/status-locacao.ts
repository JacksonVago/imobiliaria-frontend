import { LocacaoStatus } from "@/enums/locacao/enums-locacao";

export const STATUS_LOCACAO_OPTIONS = [
  { value: LocacaoStatus.AGUARDANDO_DOCUMENTOS, label: 'Aguardando documentos' },
  { value: LocacaoStatus.ATIVA, label: 'Ativa' },
  { value: LocacaoStatus.ENCERRADA, label: 'Encerrada' },
  
]
