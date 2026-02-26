import { FrequenciaAssinatura } from "@/enums/assinatura/FrequenciaAssinatura";
import { MetodoPagamento } from "@/enums/metodopag.enum";
import moment from "moment";
import { z } from "zod";

export const pagamentoSchema = z.object({
    nome: z.string().min(1, 'Nome do titular é obrigatório'),
    cpf: z.string().min(11, 'CPF é obrigatório'),
    numeroCartao: z.string().min(16, 'Número do cartão é obrigatório'),
    expMes: z.coerce.number().min(1, 'Mês de expiração inválido').max(12, 'Mês de expiração inválido'),
    expAno: z.coerce.number().min(moment().year(), 'Ano de expiração inválido'),
    codigoSeguranca: z.string().min(1, 'CVV do cartão é obrigatório'),
    valorPagamento: z.coerce.number().min(1, 'Valor do lançamento é obrigatório'),
    parcela: z.coerce.number().optional(),
    observacao: z.string().optional(),
    encryptedCard: z.string().min(1, 'Cartão criptografado é obrigatório'),
    plano: z.string().min(1, 'Plano é obrigatório'),
    frequencia: z.enum(Object.values(FrequenciaAssinatura) as [string, ...string[]]).default(FrequenciaAssinatura.MENSAL),
    assinaturaId: z.coerce.number().min(1, 'ID da assinatura é obrigatório'),
    metodoPagamento: z.enum(Object.values(MetodoPagamento) as [string, ...string[]]).default(MetodoPagamento.CREDIT_CARD),
    empresa_pagamento: z.string().default('pagseguro'),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    empresaId: z.coerce.number().optional(),
});

export type PagamentoSchema = z.infer<typeof pagamentoSchema>