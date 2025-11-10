import { lancamentoTipo } from "@/enums/locacao/enums-locacao";
import { PessoaStatus } from "@/enums/pessoal/status-pesoa";
import { Lancamento } from "./lancamentos";

export interface TipoLancamento {
    id: number;
    name: string;
    tipo: lancamentoTipo;
    automatico: string;
    parcelas: number;
    geraObservacao: string;
    valorFixo: number;
    status: PessoaStatus
    createdAt: string;
    updatedAt?: string;
    lancamentos: Lancamento[];
}
