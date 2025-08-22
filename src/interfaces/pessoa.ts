import { PessoaStatus } from '@/enums/pessoal/status-pesoa'
import { Endereco } from './endereco'
import { Fiador } from './fiador'
import { GenericAnexo } from './generic-anexo'
import { Proprietario } from './proprietario'
import { Locatario } from './locatario'

export interface Pessoa {
  id: number
  documento: string
  nome: string
  profissao?: string
  estadoCivil?: string
  endereco?: Endereco
  enderecoId: number
  email?: string
  telefone?: string
  status:PessoaStatus

  documentos?:GenericAnexo[]
  fiador?: Fiador
  proprietarios?: Proprietario[]
  locatarios?: Locatario[];
}