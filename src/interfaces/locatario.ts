import { Endereco } from './endereco'
import { GenericAnexo } from './generic-anexo'
import { Locacao } from './locacao'
import { Pagamento } from './pagamento';
import { Pessoa } from './pessoa'

export interface Locatario {
  id:number;
  pessoa?: Pessoa;
  pessoaId: number;

  locacoes?: Locacao[]
  pagamentos?: Pagamento[]
}
