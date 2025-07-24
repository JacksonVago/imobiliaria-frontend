import { Pagamento } from "./pagamento";

export interface Anexo {
    id:number;
    url:string;
    tipo:string;
    createdAt:string;
    updatedAt:string;
    Pagamentos?:Pagamento;
  }
  