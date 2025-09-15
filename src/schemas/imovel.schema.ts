import { ImovelTipo, ImovelFinalidade, ImovelStatus } from '@/enums/imovel/enums-imovel'
import { MAX_DOCUMENT_FILE_SIZE } from '@/pages/main/imoveis/constants/max_document_file_size'
import { ACCEPTED_DOCUMENT_TYPES } from '@/pages/main/proprietarios/constants/accepted-document-types'
import { z } from 'zod'

export const imovelSchema1 = z.object({
  description: z.string().min(1, 'Descrição do imóvel é obrigatório'),
  tipo: z.enum(Object.values(ImovelTipo) as [string, ...string[]]),
  status: z.enum(Object.values(ImovelStatus) as [string, ...string[]]),
  finalidade: z.enum(Object.values(ImovelFinalidade) as [string, ...string[]]),
  porcentagem_lucro_imobiliaria : z
        .string()
        .min(2, 'Porcentagem de lucro é obrigatório'),
// ...existing code...
/*porcentagem_lucro_imobiliaria: z.preprocess(
  (val) => {
    if (typeof val === 'string') {
      if (val.trim() === '') return undefined
      const num = Number(val)
      return isNaN(num) ? undefined : num
    }
    return val
  },
  z
    .number({ message: 'Porcentagem de lucro é obrigatório' })
    .min(1, 'Porcentagem de lucro é obrigatório')
),*/
// ...existing code...
  /*porcentagem_lucro_imobiliaria: z
    .union([
      z.number().min(1, 'Porcentagem de lucro é obrigatório'),
      z
        .string()
        .min(1, 'Porcentagem de lucro é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Número é obrigatório'),*/
// ...existing code...
  valor_aluguel: z
    .union([
      z.number(),
      z.string().transform((val) => (val === '' ? undefined : Number(val))),
      z.literal('')
    ])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  valor_venda: z
    .union([
      z.number(),
      z.string().transform((val) => (val === '' ? undefined : Number(val))),
      z.literal('')
    ])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  valor_agua: z
    .union([
      z.number(),
      z.string().transform((val) => (val === '' ? undefined : Number(val))),
      z.literal('')
    ])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  valor_condominio: z
    .union([
      z.number(),
      z.string().transform((val) => (val === '' ? undefined : Number(val))),
      z.literal('')
    ])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  valor_iptu: z
    .union([
      z.number(),
      z.string().transform((val) => (val === '' ? undefined : Number(val))),
      z.literal('')
    ])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  valor_taxa_lixo: z
    .union([
      z.number(),
      z.string().transform((val) => (val === '' ? undefined : Number(val))),
      z.literal('')
    ])
    .optional()
    .transform((val) => (val === '' ? undefined : val)),    
  /*
  valor_aluguel: z.number().or(z.string().transform(Number)).optional(),
  valor_venda: z.number().optional().or(z.string().transform(Number)).optional(),
  valor_agua: z.number().optional().or(z.string().transform(Number)).optional(),
  valor_condominio: z.number().optional().or(z.string().transform(Number)).optional(),
  valor_iptu: z.number().optional().or(z.string().transform(Number)).optional(),
  valor_taxa_lixo: z.number().optional().or(z.string().transform(Number)).optional(),
  */

  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  /*numero: z
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
    .refine((val) => val !== undefined, 'Número é obrigatório'),*/
  numero: z.string().optional(),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  images: z.any().optional(),
  // .refine(
  //   (file) => {
  //     //importante: converter para MB
  //     const fileSizeMB = file?.size / (1024 * 1024)
  //     return fileSizeMB <= MAX_DOCUMENT_FILE_SIZE
  //   },
  //   { message: `Tamanho máximo de imagem é ${MAX_DOCUMENT_FILE_SIZE} MB` }
  // ) // message customizada

  imagesToDeleteIds: z.array(z.number()).optional(),
  documentos: z
    .array(
      z.object({
        file: z.instanceof(File).optional(),
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
// .any()
// .optional()
// .refine((files) => !files || files?.length === 0, 'Document is required.')
// .refine(
//   (files) => {
//     return files?.[0]?.size <= MAX_DOCUMENT_FILE_SIZE
//   },
//   `O tamanho da imagem não pode ser maior que ${MAX_DOCUMENT_FILE_SIZE / 1024 / 1024}MB`
// )
// .refine(
//   (files) => ACCEPTED_IMAGES_MIME_TYPES.includes(files?.[0]?.type),
//   'Tipo de arquivo não suportado. Por favor, envie uma imagem.'
// )

//TODO: campos relacionados a ocorrencias

export const imovelSchema = z.object({
  description: z.string().optional(),
  tipo: z.enum(Object.values(ImovelTipo) as [string, ...string[]],{required_error:'Tipo é obrigatório'}),
  status: z.enum(Object.values(ImovelStatus) as [string, ...string[]],{required_error:'Situação é obrigatório'}),
  finalidade: z.enum(Object.values(ImovelFinalidade) as [string, ...string[]],{required_error:'Finalidade é obrigatório'}),
  porcentagem_lucro_imobiliaria: z
    .union([
      z.number({invalid_type_error:'Taxa administrativa é obrigatório'}).min(1, {message: 'Taxa administrativa é obrigatório'}),
      z
        .string()
        .min(1, {message: 'Taxa administrativa é obrigatório'})
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Número é obrigatório'),
  valor_aluguel: z.coerce.number().or(z.string().transform(Number)),
  valor_venda: z.number().optional().or(z.string().transform(Number)).optional(),
  valor_agua: z.number().optional().or(z.string().transform(Number)).optional(),
  valor_condominio: z.number().optional().or(z.string().transform(Number)).optional(),
  valor_iptu: z.number().optional().or(z.string().transform(Number)).optional(),
  valor_taxa_lixo: z.number().optional().or(z.string().transform(Number)).optional(),

  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string()
        .min(1, 'Número é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    .refine((val) => val !== undefined, 'Número é obrigatório'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  images: z.any().optional(),
  // .refine(
  //   (file) => {
  //     //importante: converter para MB
  //     const fileSizeMB = file?.size / (1024 * 1024)
  //     return fileSizeMB <= MAX_DOCUMENT_FILE_SIZE
  //   },
  //   { message: `Tamanho máximo de imagem é ${MAX_DOCUMENT_FILE_SIZE} MB` }
  // ) // message customizada

  imagesToDeleteIds: z.array(z.number()).optional(),
  documentos: z
    .array(
      z.object({
        file: z.instanceof(File).optional(),
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

export type ImovelSchema = z.infer<typeof imovelSchema>
