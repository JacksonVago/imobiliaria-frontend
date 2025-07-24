import { GarantiaLocacao } from '@/enums/locacao/enums-locacao'
import { Fiador } from './fiador'
import { GenericAnexo } from './generic-anexo'
import { Imovel } from './imovel'
import { Locatario } from './locatario'

export enum BackendGarantiaLocacaoTypes {
  SEGURO_FIANCA = 'SEGURO_FIANCA',
  TITULO_CAPITALIZACAO = 'TITULO_CAPITALIZACAO',
  DEPOSITO_CALCAO = 'DEPOSITO_CALCAO',
  FIADOR = 'FIADOR'
}

export enum LocacaoStatus {
  ATIVA = 'ATIVA',
  ENCERRADA = 'ENCERRADA',
  AGUARDANDO_DOCUMENTOS = 'AGUARDANDO_DOCUMENTOS'
}
export interface Locacao {
  id: number
  dataInicio: string
  dataFim?: string
  valor_aluguel: number
  dia_vencimento:number
  status: LocacaoStatus
  imovel?: Imovel
  imovelId: number

  documentos?:GenericAnexo[]
  
  //garantiaLocacaoFields
  garantiaLocacaoTipo: GarantiaLocacao

  garantiaSeguroFianca?: SeguroFianca
  garantiaSeguroFiancaId?: number

  garantiaTituloCapitalizacao?: TituloCapitalizacao
  garantiaTituloCapitalizacaoId?: number

  garantiaDepositoCalcao?: DepositoCalcao
  garantiaDepositoCalcaoId?: number

  fiadores?: Fiador[]

  createdAt: string
  updatedAt: string

  locatarios?:Locatario[]
}

export interface SeguroFianca {
  id: string
  numeroSeguro: string
  documentos?: GenericAnexo[]
  locacaoId: number
  locacao?: Locacao
}

export interface TituloCapitalizacao {
  id: string
  numeroTitulo: string
  locacaoId: number
  locacao?: Locacao
  documentos?: GenericAnexo[]
}

export interface DepositoCalcao {
  id: string
  valorDeposito: number
  quantidadeMeses: number
  locacao?: Locacao
  documentos?: GenericAnexo[]
  locacaoId: number
}

