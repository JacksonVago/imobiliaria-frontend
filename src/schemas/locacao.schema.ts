import { GarantiaLocacao } from '@/enums/locacao/enums-locacao'
import { LocacaoStatus } from '@/interfaces/locacao'
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
  valor_aluguel: z.number().min(0, 'Valor do aluguel deve ser positivo'),
  dia_vencimento: z
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
    .transform((val) => {
      const num = Number(val)
      return isNaN(num) ? undefined : num
    })
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
  dataInicio: z.string().transform((val)=>{
    const data:string = val;
    console.log(moment(data).format("YYYY-MM-DD"));
    return moment(data).format("DD/MM/YYYY");
  }),
  dataFim: z.coerce.date({ message: 'Data inválida' }),
  valor_aluguel: z
    .union(
      [
        z.number().min(1, 'Valor do aluguel é obrigatório'),
        z
          .string()
          .min(1, 'Valor do aluguel é obrigatório')
          .transform((val) => {
            const num = Number(val)
            return isNaN(num) ? undefined : num
          })
      ]
    ).refine((val) => val !== undefined, 'Valor do aluguel é obrigatório'),
  dia_vencimento: z
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
  imovelId: z
    .union([
      z.number().min(1, 'Imóvel é obrigatório'),
      z
        .string()
        .min(1, 'Imóvel é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? 0 : num === undefined ? 0 : num
        })
    ])
    .refine((val) => val !== undefined, 'Imóvel é obrigatório'),
  /*pessoaId: z.number().min(1, 'Id da Pessoa (locatário) e obrigatório')
    .transform((val) => {
      const num = Number(val)
      return isNaN(num) ? undefined : num
    }),*/
  locatarios: z.array(    z.object(
      {
        nome: z.string(),
        id: z.number()
      }
    )

  ).min(1, 'Locatário é obrigatório'),
  fiadores: z.array(
    z.object(
      {
        nome: z.string(),
        id: z.number()
      }
    )
  ),
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
      numeroTitulo: z.string(),
    }
  ).optional(),
  seguroFianca: z.object(
    {
      numeroSeguro: z.string(),
    }
  ).optional(),
  depCalcao: z.object(
    {
      valorDeposito: z.number(),
      /*z.union(
          [
            z.number().min(1, 'Valor do depósito é obrigatório'),
            z
              .string()
              .min(1, 'Valor do depósito é obrigatório')
              .transform((val) => {
                const num = Number(val)
                return isNaN(num) ? undefined : num
              })
          ]
        ).refine((val) => val !== undefined, 'Valor do depósito é obrigatório'),*/

      quantidadeMeses: z.number(),
      /*z.union(
          [
            z.number().min(1, 'Quantidade de meses é obrigatório'),
            z
              .string()
              .min(1, 'Quantidade de meses é obrigatório')
              .transform((val) => {
                const num = Number(val)
                return isNaN(num) ? undefined : num
              })
          ]
        ).refine((val) => val !== undefined, 'Quantidade de meses é obrigatório'),*/
    }
  ).optional(),
})/*.refine((schema) => {

  if (schema.garantiaLocacaoTipo === undefined || schema.garantiaLocacaoTipo === null || schema.garantiaLocacaoTipo.length === 0) {
    return {
      message: "Tipo de garantia é obrigatório",
      path: ['garantiaLocacaoTipo']
    }

  }

  switch (schema.garantiaLocacaoTipo) {
    case GarantiaLocacao.DEPOSITO_CALCAO:
      if (schema.depCalcao === undefined) {
        return {
          message: "Depósito calção obrigatório",
          path: ['valorDeposito', 'quantidadeMeses']
        }
      }
      else {
        if (schema.depCalcao.quantidadeMeses === undefined || schema.depCalcao.quantidadeMeses === 0) {
          return {
            message: "Quantidade de meses obrigatório",
            path: ['quantidadeMeses']
          }
        }
        if (schema.depCalcao.valorDeposito === undefined || schema.depCalcao.valorDeposito === 0) {
          return {
            message: "Valor do Depósito é obrigatório",
            path: ['valorDeposito']
          }
        }
      }
      break;

    case GarantiaLocacao.FIADOR:
      if (schema.fiadores?.length === 0) {
        return {
          message: "Fiador é obrigatório",
          path: ['fiadores']
        }
      }
      break;

    case GarantiaLocacao.SEGURO_FIANCA:
      break;

    case GarantiaLocacao.TITULO_CAPITALIZACAO:
      break;
  }

})*/

export type LocacaoSchema = z.infer<typeof locacaoSchema>