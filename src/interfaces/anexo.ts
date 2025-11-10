import { Boleto } from "./boleto";

export interface Anexo {
    id:number;
    url:string;
    tipo:string;
    createdAt:string;
    updatedAt:string;
    Boletos?:Boleto;
  }
  