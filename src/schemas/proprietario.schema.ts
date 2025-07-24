import { EstadoCivil } from '@/enums/estado-civil'
import { MAX_DOCUMENT_FILE_SIZE } from '@/pages/main/imoveis/constants/max_document_file_size'
import { ACCEPTED_DOCUMENT_TYPES } from '@/pages/main/proprietarios/constants/accepted-document-types'

import { z } from 'zod'

export const proprietarioSchema = z.object({
  nome: z.string().min(1, 'Nome do proprietário é obrigatório'),
  documento: z.string().min(1, 'Documento é obrigatório'),
  profissao: z.string().optional(),
  estadoCivil: z.enum(Object.values(EstadoCivil) as [string, ...string[]]).optional(),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  telefone: z.string().optional(),
  vincularImoveisIds: z.array(z.string()).optional(),
  desvincularImoveisIds: z.array(z.string()).optional(),

  //Endereco
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
})

export type ProprietarioSchema = z.infer<typeof proprietarioSchema>

export const propImoveSchema = z.object({
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
    .refine((val) => val !== undefined, 'Proprietário é obrigatório'),
  imovelId: z
    .union([
      z.number().min(1, 'Imóvel é obrigatório'),
      z
        .string()
        .min(1, 'Imóvel é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Imóvel é obrigatório'),
  cota_imovel: z
    .union([
      z.number().min(1, 'Cota é obrigatório'),
      z
        .string()
        .min(1, 'Cota é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Cota é obrigatório'),
  proprietarios: z.array(
    z.object(
      {
        nome: z.string(),
        id: z.number()
      }
    )
  ).optional(),

})

export type PropImovelSchema = z.infer<typeof propImoveSchema>
