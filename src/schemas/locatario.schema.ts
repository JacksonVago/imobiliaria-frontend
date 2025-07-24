import { EstadoCivil } from '@/enums/estado-civil'
import { MAX_DOCUMENT_FILE_SIZE } from '@/pages/main/imoveis/constants/max_document_file_size'
import { ACCEPTED_DOCUMENT_TYPES } from '@/pages/main/proprietarios/constants/accepted-document-types'
import { z } from 'zod'
import { LocacaoSchema, locacaoSchema } from './locacao.schema'

export const locatarioSchema = z.object({
  nome: z.string().min(1, 'Nome do locatário é obrigatório'),
  documento: z.string().min(1, 'Documento é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  telefone: z.string().optional(),
  profissao: z.string().optional(),
  estadoCivil: z.enum(Object.values(EstadoCivil) as [string, ...string[]]).optional(),
  logradouro: z.string(),
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
  //TODO: change that in future
  documentos: z
    .array(
      z.object({
        file: z.instanceof(File),
        size: z
          .number()
          .max(
            MAX_DOCUMENT_FILE_SIZE,
            `O tamanho do documento não pode ser maior que ${MAX_DOCUMENT_FILE_SIZE / 1024 / 1024}MB.`
          )
          .optional(),
        type: z
          .string()
          .refine(
            (type) => ACCEPTED_DOCUMENT_TYPES.includes(type),
            'Tipo de arquivo não suportado. Por favor, envie um formato válido.'
          )
          .optional(),
        id: z.number().optional()
      })
    )
    .optional(),
  documentosToDeleteIds: z.array(z.number()).optional()
  // dataInicio: z
  //   .string()
  //   .refine((dateStr) => !isNaN(new Date(dateStr).getTime()), {
  //     message: 'Data de início inválida'
  //   })
  //   .transform((dateStr) => new Date(dateStr)),

  // observacoes: z.string().optional(),
  // documentos: z.array(
  //   z.object({
  //     file: z.instanceof(File),
  //     size: z
  //       .number()
  //       .max(
  //         MAX_DOCUMENT_FILE_SIZE,
  //         `O tamanho do documento não pode ser maior que ${MAX_DOCUMENT_FILE_SIZE / 1024 / 1024}MB.`
  //       ),
  //     type: z
  //       .string()
  //       .refine(
  //         (type) => ACCEPTED_DOCUMENT_TYPES.includes(type),
  //         'Tipo de arquivo não suportado. Por favor, envie um formato válido.'
  //       )
  //   })
  // ),
  //locacao data
  // valor_aluguel: z.number().or(z.string().transform(Number)),
  //FIXME: handle this, because some months have 31 days, 30 days, 28 days
  // diaVencimentoPagamento: z.coerce
  //   .number()
  //   .min(1, 'Dia de vencimento é obrigatório')
  //   .max(28, 'Dia de vencimento inválido'),

  //garantia de locacao
  // garantiaLocacaoTipo: z.enum()
})

export type GarantiaLocacaoTypes =
  | 'seguro-fianca'
  | 'titulo-capitalizacao'
  | 'deposito-calcao'
  | 'fiador'

export type LocatarioSchema = z.infer<typeof locatarioSchema>

export const locImoveSchema = z.object({
  pessoaId: z
    .union([
      z.number().min(1, 'Proprietário é obrigatório'),
      z
        .string()
        .min(1, 'Proprietário é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Proprietário é obrigatório')
})

export type LocImovelSchema = z.infer<typeof locImoveSchema>
