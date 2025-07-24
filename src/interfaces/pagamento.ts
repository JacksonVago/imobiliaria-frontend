import { Anexo } from "./anexo";
import { Locacao } from "./locacao";
import { Pessoa } from "./pessoa";

export interface Pagamento {
    id:number;
    createdAt:string;
    updatedAt:string;
  
    locacao?:Locacao;
    locacaoId:number;
  
    statusPagamento:string;
    dataPagamento:string;
    diaVencimentoPagamento:string;
  
    valor:number;
    comprovantePagamento?:Anexo;    
    pessoa?:Pessoa;
    pessoaId:number;
    anexoId:number;
  }
  