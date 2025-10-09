import { ImovelStatus } from '@/enums/imovel/enums-imovel'
import { Endereco } from './endereco'
import { Locacao } from './locacao'
//import { Locatario } from './locatario'
import { Proprietario } from './proprietario'

export interface Imovel {
  id: number
  title: string
  status: ImovelStatus
  description?: string
  tipo: {id:number, name: string}
  tipoId: number

  porcentagem_lucro_imobiliaria: number
  valor_iptu?: number
  valor_condominio?: number
  valor_aluguel?: number
  valor_venda?: number
  valor_agua?: number
  valor_taxa_lixo?: number

  enderecoId: number
  endereco: Endereco
  createdAt: Date
  updatedAt?: Date
  locacoes?: Locacao[]
  proprietarios?: Proprietario[]
  imovelPhotos?: ImovelPhotos[]
}

export interface ImovelPhotos {
  id: number
  url: string
  imovelid: number
  createdAt?: string
  updatedAt?: string
}
