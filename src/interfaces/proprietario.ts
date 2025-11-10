import { Imovel } from "./imovel";
import { Pessoa } from "./pessoa";

export interface Proprietario {
  id: number;
  pessoa?: Pessoa;
  pessoaId: number;
  cotaImovel:number;
  imovel?: Imovel;
  imovelId:number;
  
}
