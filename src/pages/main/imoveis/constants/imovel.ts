import { ImovelTipo, ImovelStatus, ImovelFinalidade } from "@/enums/imovel/enums-imovel";

export const IMOVEL_STATUS = Object.values(ImovelStatus) as [string, ...string[]]
export const IMOVEL_TIPO = Object.values(ImovelTipo) as [string, ...string[]]
export const IMOVEL_FINALIDADE = Object.values(ImovelFinalidade) as [string, ...string[]]