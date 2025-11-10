import { GarantiaLocacao } from '@/enums/locacao/enums-locacao'
import { Fiador } from './fiador'
import { GenericAnexo } from './generic-anexo'
import { Imovel } from './imovel'
import { Locatario } from './locatario'
import { Lancamento } from './lancamentos'

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

export enum LocalDeposito {
  IMOBILIARIA = 'IMOBILIARIA',
  PROPRIETARIO = 'PROPRIETARIO',
}

export interface Locacao {
  id: number
  dataInicio: string
  dataFim?: string
  valorAluguel: number
  diaVencimento:number
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

  seguroIncendio: SeguroIncendio
  fiadores?: Fiador[]

  createdAt: string
  updatedAt: string

  locatarios?:Locatario[]
  lancamentos?: Lancamento[]
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
  localDeposito: LocalDeposito
  locacao?: Locacao
  documentos?: GenericAnexo[]
  locacaoId: number
}

export interface SeguroIncendio {
  id:number
  numeroApolice: string
  locacao?: Locacao
  locacaoId: number
  vigenciaInicio: string
  vigenciaFim: string

}