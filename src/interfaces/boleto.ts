import { GenericAnexo } from "./generic-anexo";
import { Lancamento } from "./lancamentos";
import { Locacao } from "./locacao";
import { Locatario } from "./locatario";

export interface Boleto {
    id:number;
    createdAt:string;
    updatedAt:string;
  
    locacao?:Locacao;
    locacaoId:number;
  
    status:string;
    dataEmissao:string;
    dataVencimento:string;
    dataPagamento:string;
  
    valorOriginal:number;
    valorPago:number;
    documentos?:GenericAnexo[]
    lancamentos?:Lancamento[];
    locatario?:Locatario
  }
  