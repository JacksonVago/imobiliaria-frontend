import { lancamentoTipo } from "@/enums/locacao/enums-locacao";
import { PessoaStatus } from "@/enums/pessoal/status-pesoa";
import { LancamentoLocacao } from "./lancamentos";
import { Empresa } from "./empresa";
import { LancamentoCondominio } from "./lancamentocondominio";

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
    lancamentosLocacoes: LancamentoLocacao[];
    lancamentosCondominio: LancamentoCondominio[];
    empresa: Empresa;
    empresaId: number;
}
