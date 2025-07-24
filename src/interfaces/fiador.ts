import { Locacao } from "./locacao";
import { Pessoa } from "./pessoa";

export interface Fiador {
    id:number;
    pessoa?:Pessoa;
    pessoaId:number;  
    locacoes?:Locacao[]
  }
  