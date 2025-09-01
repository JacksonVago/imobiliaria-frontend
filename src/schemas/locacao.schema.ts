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
  //dataInicio: z.coerce.date({ message: 'Data inválida' }),  
  dataInicio: z.string().transform((val)=>{
    const data:string = val;
    return moment(data.substring(0,10)).format("YYYY-MM-DD");
  }),
  //dataFim: z.coerce.date({ message: 'Data inválida' }),
   dataFim: z.string().transform((val)=>{
     const data:string = val;
     return moment(data.substring(0,10)).format("YYYY-MM-DD");
   }),
  valor_aluguel: z.string().or(z.number()),
    // .union(
    //   [
    //     //z.number().min(1, 'Valor do aluguel é obrigatório'),
    //     z.string().min(1, 'Valor do aluguel é obrigatório')
    //       .transform((val) => {
    //         try{
    //         console.log(val);
    //         const num = Number(val)
    //         console.log(val);
    //         return isNaN(num) ? 0 : num
    //         }
    //         catch (error){
    //           console.log(error);
    //           return error;
    //         }
    //       })
    //   ]
    // ).refine((val) => val !== undefined, 'Valor do aluguel é obrigatório'),
  dia_vencimento: z.string().or(z.number()),
    // .union([
    //   z.number().min(1, 'Dia de vencimento é obrigatório'),
    //   z
    //     .string()
    //     .min(1, 'Dia de vencimento é obrigatório')
    //     .transform((val) => {
    //       console.log(val);
    //       const num = Number(val)
    //       return isNaN(num) ? undefined : num
    //     })
    // ])
    // .refine((val) => val !== undefined, 'Dia de vencimento é obrigatório'),
  status: z.enum(Object.values(LocacaoStatus) as [string, ...string[]]),
  garantiaLocacaoTipo: z.enum(Object.values(GarantiaLocacao) as [string, ...string[]]),
  imovelId: z.string().or(z.number()),
    // .union([
    //   z.number().min(1, 'Imóvel é obrigatório'),
    //   z
    //     .string()
    //     .min(1, 'Imóvel é obrigatório')
    //     .transform((val) => {
    //       const num = Number(val)
    //       return isNaN(num) ? 0 : num === undefined ? 0 : num
    //     })
    // ])
    // .refine((val) => val !== undefined, 'Imóvel é obrigatório'),
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
})

// export const locacaoSchema = z.object({
//   documentos: z.array(
//     z.object({
//       file: z.instanceof(File),
//       size: z
//         .number()
//         .max(MAX_DOCUMENT_FILE_SIZE, `Documento não pode ter mais que ${MAX_DOCUMENT_FILE_SIZE / 1024 / 1024}MB`)
//         .optional(),
//       type: z
//         .string()
//         .refine((val) => ACCEPTED_DOCUMENT_TYPES.includes(val), {
//           message: 'Tipo de arquivo não suportado. Envie um formato válido.'
//         })
//         .optional(),
//       id: z.number().optional(),
//     })
//   ).optional(),

//   documentosToDeleteIds: z.array(z.number()).optional(),

//   dataInicio: z.coerce.date('Data de início inválida'),

//   dataFim: z.coerce.date('Data de término inválida'),

//   valor_aluguel: z.coerce.number()
//     .refine((val) => val > 0, { message: 'Valor do aluguel obrigatório e maior que zero.' }),

//   dia_vencimento: z.coerce.number()
//     .int({ message: 'Dia de vencimento deve ser inteiro.' })
//     .min(1, { message: 'Dia de vencimento obrigatório' }),

//   status: z.enum(Object.values(LocacaoStatus) as [string, ...string[]]),

//   garantiaLocacaoTipo: z.enum(Object.values(GarantiaLocacao) as [string, ...string[]]),

//   imovelId: z.coerce.number()
//     .int({ message: 'Imóvel obrigatório e inteiro.' })
//     .min(1, { message: 'Imóvel obrigatório' }),

//   locatarios: z.array(
//     z.object({
//       nome: z.string(),
//       id: z.number(),
//     })
//   ).min(1, 'Locatário é obrigatório'),

//   fiadores: z.array(
//     z.object({
//       nome: z.string(),
//       id: z.number(),
//     })
//   ).optional(),

//   imoveis: z.array(
//     z.object({
//       nome: z.string(),
//       id: z.number(),
//     })
//   ).optional(),

//   tituloCap: z.object({
//     numeroTitulo: z.string(),
//   }).optional(),

//   seguroFianca: z.object({
//     numeroSeguro: z.string(),
//   }).optional(),

//   depCalcao: z.object({
//     valorDeposito: z.coerce.number()
//       .refine((val) => val > 0, { message: 'Valor do depósito obrigatório e maior que zero.' }),
//     quantidadeMeses: z.coerce.number()
//       .refine((val) => val > 0, { message: 'Valor do depósito obrigatório e maior que zero.' }),
//   }).optional(),
// });

export type LocacaoSchema = z.infer<typeof locacaoSchema>