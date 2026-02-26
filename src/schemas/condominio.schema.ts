import { FormaRateio } from '@/enums/condominio/FormaRateio'
import { ImovelTipo, ImovelFinalidade, ImovelStatus } from '@/enums/imovel/enums-imovel'
import { MAX_DOCUMENT_FILE_SIZE } from '@/pages/main/imoveis/constants/max_document_file_size'
import { ACCEPTED_DOCUMENT_TYPES } from '@/pages/main/proprietarios/constants/accepted-document-types'
import { z } from 'zod'

export const condominioSchema = z.object({
    name: z.string(),
    observacao: z.string().optional(),
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

    formaRateio: z.enum(Object.values(FormaRateio) as [string, ...string[]]),
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
    empresaId: z.number(),
})

export type CondominioSchema = z.infer<typeof condominioSchema>
