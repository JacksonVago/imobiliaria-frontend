import { GarantiaLocacao } from "@/enums/locacao/enums-locacao";

export const GARANTIA_LOCACAO_OPTIONS = [
  { value: GarantiaLocacao.DEPOSITO_CALCAO, label: 'Depósito calção' },
  { value: GarantiaLocacao.FIADOR, label: 'Fiador' },
  { value: GarantiaLocacao.SEGURO_FIANCA, label: 'Segurpo fiança' },
  { value: GarantiaLocacao.TITULO_CAPITALIZACAO, label: 'Título de captalização' },  
]
