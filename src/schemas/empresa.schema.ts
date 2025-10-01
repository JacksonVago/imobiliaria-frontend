import { EstadoCivil } from '@/enums/estado-civil'
import { PessoaStatus } from '@/enums/pessoal/status-pesoa'
import { MAX_DOCUMENT_FILE_SIZE } from '@/pages/main/imoveis/constants/max_document_file_size'
import { ACCEPTED_DOCUMENT_TYPES } from '@/pages/main/proprietarios/constants/accepted-document-types'
import { z } from 'zod'

export const empresaSchema = z.object({
  nome: z.string().min(1, 'Nome do cliente é obrigatório'),
  cnpj: z
    .string({
      required_error: 'CPF/CNPJ é obrigatório.',
    })
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '');
      return replacedDoc.length >= 11;
    }, 'CPF/CNPJ deve conter no mínimo 11 caracteres.')
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '');
      return replacedDoc.length <= 14;
    }, 'CPF/CNPJ deve conter no máximo 14 caracteres.')
    .refine((doc) => {
      const replacedDoc = doc.replace(/\D/g, '');
      return !!Number(replacedDoc);
    }, 'CPF/CNPJ deve conter apenas números.'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  telefone: z.string().optional(),
  logradouro: z.string(),
  status: z.enum(Object.values(PessoaStatus) as [string, ...string[]]).optional(),
  numero: z
    .union([
      z.number().min(1, 'Número é obrigatório'),
      z
        .string()
        .min(1, 'Número é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  avisosReajusteLocacao: z.number().optional(),
  avisosRenovacaoContrato: z.number().optional(),
  avisosSeguroFianca: z.number().optional(),
  avisosSeguroIncendio: z.number().optional(),
  avisosTituloCapitalizacao: z.number().optional(),
  avisosDepositoCalcao: z.number().optional(),
  porcentagemComissao: z.number().optional(),
  emiteBoleto: z.string().optional(),
  valorTaxaBoleto: z.number().optional(),
  emissaoBoletoAntecedencia: z.number().optional(),
  porcentagemMultaAtraso: z.number().optional(),
  porcentagemJurosAtraso: z.number().optional(),

})

export type EmpresaSchema = z.infer<typeof empresaSchema>
