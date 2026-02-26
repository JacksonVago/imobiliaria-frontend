import { PessoaStatus } from "@/enums/pessoal/status-pesoa";
import { Imovel } from "./imovel";
import { Empresa } from "./empresa";

export interface TipoImovel {
    id: number;
    name: string;
    status: PessoaStatus
    createdAt: string;
    updatedAt?: string;
    imoveis: Imovel[];
    empresa: Empresa;
    empresaId: number;

}
