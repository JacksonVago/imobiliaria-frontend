import { FrequenciaAssinatura } from "@/enums/assinatura/FrequenciaAssinatura";
import { TipoAssinatura } from "@/enums/assinatura/TipoAssinatura";

export interface Assinatura {
  id: number
  name:string
  descricao:string 
  tipo:TipoAssinatura
  frequencia:FrequenciaAssinatura
  valor:number
  createdAt:Date
  updatedAt:Date
}
