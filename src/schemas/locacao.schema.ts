import { GarantiaLocacao } from '@/enums/locacao/enums-locacao'
import { LocacaoStatus, LocalDeposito } from '@/interfaces/locacao'
import { MAX_DOCUMENT_FILE_SIZE } from '@/pages/main/imoveis/constants/max_document_file_size'
import { ACCEPTED_DOCUMENT_TYPES } from '@/pages/main/proprietarios/constants/accepted-document-types'
import { z } from 'zod'
import moment from 'moment';

export const fiadorSchema = z.object({
  pessoalId: z.number().min(1, 'Id do imóvel e obrigatório'),
})

export const seguroFiancaSchema = z.object({
  numeroSeguro: z.string().min(1, 'Número do seguro é obrigatório'),
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

export const tituloCapitalizacaoSchema = z.object({
  numeroTitulo: z.string().min(1, 'Número do título é obrigatório'),
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

export const depositoCalcaoSchema = z.object({
  valorDeposito: z.number().min(0, 'Valor do depósito deve ser positivo'),
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
  //FIXME: it will be months
})

// Schema base para todos os casos de locação
const baseLocacaoSchema = z.object({
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

  documentosToDeleteIds: z.array(z.number()).optional(),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória'),
  valorAluguel: z.number().min(0, 'Valor do aluguel deve ser positivo'),
  diaVencimento: z
    .union([
      z.number().min(1, 'Dia de vencimento é obrigatório'),
      z
        .string()
        .min(1, 'Dia de vencimento é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Dia de vencimento é obrigatório'),
  status: z.enum(Object.values(LocacaoStatus) as [string, ...string[]]),
  garantiaLocacaoTipo: z.enum(Object.values(GarantiaLocacao) as [string, ...string[]]),
  imovelId: z.number().min(1, 'Id do imóvel e obrigatório')
  /*.transform((val) => {
    const num = Number(val)
    return isNaN(num) ? undefined : num
  })*/
  ,
})

export const locacaoSchemaOld = z.discriminatedUnion('garantiaLocacaoTipo', [
  baseLocacaoSchema.extend({
    garantiaLocacaoTipo: z.literal(GarantiaLocacao.FIADOR),
    fiador: fiadorSchema
  }),
  baseLocacaoSchema.extend({
    garantiaLocacaoTipo: z.literal(GarantiaLocacao.TITULO_CAPITALIZACAO),
    tituloCapitalizacao: tituloCapitalizacaoSchema
  }),
  baseLocacaoSchema.extend({
    garantiaLocacaoTipo: z.literal(GarantiaLocacao.SEGURO_FIANCA),
    seguroFianca: seguroFiancaSchema
  }),
  baseLocacaoSchema.extend({
    garantiaLocacaoTipo: z.literal(GarantiaLocacao.DEPOSITO_CALCAO),
    depositoCalcao: depositoCalcaoSchema
  })
])

export type LocacaoSchemaOld = z.infer<typeof locacaoSchemaOld>

export const locacaoSchema = z.object({
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

  documentosToDeleteIds: z.array(z.number()).optional(),
  dataInicio: z.string().transform((val) => {
    const data: string = val;
    return moment(data.substring(0, 10)).format("YYYY-MM-DD");
  }),
  dataFim: z.string().transform((val) => {
    const data: string = val;
    return moment(data.substring(0, 10)).format("YYYY-MM-DD");
  }),
  valorAluguel: z.coerce.number().min(1, 'Valor do aluguel é obrigatório'),
  diaVencimento: z
    .union([
      z.number().min(1, 'Dia de vencimento é obrigatório'),
      z
        .string()
        .min(1, 'Dia de vencimento é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Dia de vencimento é obrigatório'),
  status: z.enum(Object.values(LocacaoStatus) as [string, ...string[]]),
  garantiaLocacaoTipo: z.enum(Object.values(GarantiaLocacao) as [string, ...string[]]),
  imovelId: z.coerce.number().min(1, 'Id do imóvel e obrigatório'),
  locatarios: z.array(z.object(
    {
      nome: z.string(),
      id: z.number()
    }
  )

  ).min(1, { message: 'Locatário é obrigatório' }),
  fiadores: z.array(
    z.object(
      {
        nome: z.string(),
        id: z.number()
      }
    )
  ).optional(),
  imoveis: z.array(
    z.object(
      {
        nome: z.string(),
        id: z.number()
      }
    )
  ).optional(),
  tituloCap: z.object(
    {
      numeroTitulo: z.string().min(1, 'Número do seguro é obrigatório').optional(),
    }
  ).optional(),
  seguroFianca: z.object(
    {
      numeroSeguro: z.string().min(1, 'Número do seguro é obrigatório').optional(),
    }
  ).optional(),
  depCalcao: z.object(
    {
      valorDeposito: z.coerce.number().min(1, 'Valor do depósito é obrigatório').optional(),
      quantidadeMeses: z.coerce.number().min(1, 'Quantidade de meses é obrigatório').optional(),
      localDeposito: z.enum(Object.values(LocalDeposito) as [string, ...string[]]).optional(),
    }
  ).optional(),
  seguroIncendio: z.object(
    {
      numeroApolice: z.string().min(1, 'Número da apólice do seguro de incêndio é obrigatório'),
      vigenciaInicio: z.string().transform((val) => {
        const data: string = val;
        return moment(data.substring(0, 10)).format("YYYY-MM-DD");
      }),
      vigenciaFim: z.string().transform((val) => {
        const data: string = val;
        return moment(data.substring(0, 10)).format("YYYY-MM-DD");
      }),
    }
  ),
});

export type LocacaoSchema = z.infer<typeof locacaoSchema>