import { PessoaStatus } from "@/enums/pessoal/status-pesoa";
import { Imovel } from "./imovel";

export interface TipoImovel {
    id: number;
    name: string;
    status: PessoaStatus
    createdAt: string;
    updatedAt?: string;
    imoveis: Imovel[];
}
