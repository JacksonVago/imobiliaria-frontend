import { MAX_DOCUMENT_FILE_SIZE } from '@/pages/main/imoveis/constants/max_document_file_size'
import { ACCEPTED_DOCUMENT_TYPES } from '@/pages/main/proprietarios/constants/accepted-document-types'
import { z } from 'zod'

export const blocoSchema = z.object({
    name: z.string(),
    observacao: z.string().optional(),
    qtdUnidades: z
    .union([
      z.number().min(1, 'Quantidade de andares deve ser pelo menos 1'),
      z
        .string()
        .min(1, 'Quantidade de unidades é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Quantidade de unidades é obrigatório'),
    totalAndares: z
    .union([
      z.number().min(1, 'Quantidade de andares deve ser pelo menos 1'),
      z
        .string()
        .min(1, 'Quantidade de andares é obrigatório')
        .transform((val) => {
          const num = Number(val)
          return isNaN(num) ? undefined : num
        })
    ])
    .refine((val) => val !== undefined, 'Quantidade de andares é obrigatório'),
    possuiElevador: z.enum(['Sim', 'Não']),
    anoConstrucao: z.number().min(1800, 'Ano de construção inválido').max(new Date().getFullYear(), 'Ano de construção inválido'),

    //images: z.any().optional(),

    //imagesToDeleteIds: z.array(z.number()).optional(),
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
    documentosToDeleteIds: z.array(z.number()).optional(),
    condominioId: z.string().min(1, 'Condomínio é obrigatório'),
    empresaId: z.number(),    

    // condominios: z.array(
    //     z.object(
    //         {
    //             nome: z.string(),
    //             id: z.string()
    //         }
    //     )
    // ).optional(),

})

export type BlocoSchema = z.infer<typeof blocoSchema>