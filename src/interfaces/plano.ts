import { FrequenciaAssinatura } from "@/enums/assinatura/FrequenciaAssinatura";
import { TipoAssinatura } from "@/enums/assinatura/TipoAssinatura";

export interface Plano {
  id:number;
  name:string;
  descricao:string;
  tipo:TipoAssinatura;
  frequencia:FrequenciaAssinatura;
  valor:Number;
  check:boolean
}
