import { ImovelStatus } from '@/enums/imovel/enums-imovel'
import { Endereco } from './endereco'
import { Locacao } from './locacao'
//import { Locatario } from './locatario'
import { Proprietario } from './proprietario'
import { TipoImovel } from './tipoimovel'

export interface Imovel {
  id: number
  title: string
  status: ImovelStatus
  description?: string
  tipo: TipoImovel
  tipoId: number

  porcentagemLucroImobiliaria: number
  valorAluguel?: number

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
