import { Imovel } from "./imovel";
import { Pessoa } from "./pessoa";

export interface Proprietario {
  id: number;
  pessoa?: Pessoa;
  pessoaId: number;
  cota_imovel:number;
  imovel?: Imovel;
  imovelId:number;
  
}
