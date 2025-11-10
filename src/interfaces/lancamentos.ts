import { LancamentoStatus } from "@/enums/locacao/enums-locacao"
import { Locacao } from "./locacao"
import { TipoLancamento } from "./lancamentotipo"

export interface Lancamento {
  id: number
  lancamentotipo: TipoLancamento
  tipoId:number
  valorLancamento: number
  dataLancamento: string
  vencimentoLancamento: string
  observacao?: string
  status:LancamentoStatus
  locacao?: Locacao
  locacaoId: number
}