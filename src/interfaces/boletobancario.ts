import { Boleto } from "./boleto";

export interface BoletoBancario {
  id:number;
  boleto:Boleto;
  boletoId:number;
  valor:number; //Valor do boleto
  valorPago:number; //Valor pago no boleto
  dataBoleto:string; //Emissao do boleto
  dataVencimento:string; //Vencimento do boleto
  dataPagamento?:string; //Data de pagamento do boleto
  formaPix:string; //Forma de pagamento PIX para recebimento
  codigoBarras:string;
  linhaDigitavel:string;
  nossoNumero:string;
  urlBoleto:string; //URL para visualização do boleto
  registrado:string; //S/N Informa se ocorreu o registro do boleto
  emvPIX:string; //Código EMV para pagamento via PIX
  metodoPagamento:string; //Método de pagamento utilizado
  status:string; //Status do boleto
  observacao:string;
  createdAt:string;
  updatedAt:string;
}
