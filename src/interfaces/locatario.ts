import { Locacao } from './locacao'
import { Boleto } from './boleto';
import { Pessoa } from './pessoa'

export interface Locatario {
  id:number;
  pessoa?: Pessoa;
  pessoaId: number;

  locacoes?: Locacao[]
  boletos?: Boleto[]
}
