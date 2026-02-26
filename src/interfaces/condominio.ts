import { FormaRateio } from "@/enums/condominio/FormaRateio";
import { Bloco } from "./bloco";
import { Empresa } from "./empresa";
import { Endereco } from "./endereco";
import { GenericAnexo } from "./generic-anexo";
import { Imovel } from "./imovel";

export interface Condominio {
  id:number;
  name:string;
  complemento?:string;
  qtdUnidades:number;
  enderecoId:number;
  endereco:Endereco;
  formaRateio:FormaRateio;
  createdAt:Date;
  updatedAt?:Date;

  blocos?:Bloco[]
  imovels?: Imovel[]
  documentos?: GenericAnexo[]

  empresa: Empresa;
  empresaId:number;
}
