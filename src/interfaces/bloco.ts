import { Condominio } from "./condominio";
import { GenericAnexo } from "./generic-anexo";
import { Imovel } from "./imovel";
import { LancamentoCondominio } from "./lancamentocondominio";

export interface Bloco {
  id: number;
  name: string;
  complemento: string;
  qtdUnidades: number;
  totalAndares: number;
  possuiElevador: string;
  anoConstrucao: number;

  condominio: Condominio
  condominioId: number;

  createdAt: Date;
  updatedAt?: Date;
  imovels?: Imovel[]
  documentos?: GenericAnexo[]
  lancamentosCondominios?: LancamentoCondominio[]
}