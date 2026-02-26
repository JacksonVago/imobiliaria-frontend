import { BoletoStatus } from "@/enums/locacao/enums-locacao"
import { Empresa } from "./empresa"
import { Assinatura } from "./assinatura"
import { PagamentoAssinatura } from "./pagamentosassinaturas"

export interface EmpresaAssinatura {
  id:number;
  empresa:Empresa;
  empresaId:number;
  assinatura:Assinatura;
  assinaturaId:number;
  dataInicio:Date;
  dataFim:Date;
  status:BoletoStatus;
  pagamentoAssinaturas:PagamentoAssinatura[];
}
