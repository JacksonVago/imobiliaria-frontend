import { BoletoStatus } from "@/enums/locacao/enums-locacao";
import { MAX_DOCUMENT_FILE_SIZE } from "@/pages/main/imoveis/constants/max_document_file_size";
import { ACCEPTED_DOCUMENT_TYPES } from "@/pages/main/proprietarios/constants/accepted-document-types";
import moment from "moment";
import { z } from "zod";

export const boletoSchema = z.object({
  id: z.coerce.number(),
  dataEmissao: z.string().transform((val) => {
    const data: string = val;
    return moment(data.substring(0, 10)).format("YYYY-MM-DD");
  }),
  dataPagamento: z.string().transform((val) => {
    const data: string = val;
    return moment(data.substring(0, 10)).format("YYYY-MM-DD");
  }),
  dataVencimento: z.string().transform((val) => {
    const data: string = val;
    return moment(data.substring(0, 10)).format("YYYY-MM-DD");
  }),
  valorOriginal: z.coerce.number().min(1, 'Valor do boleto é obrigatório'),
  valorPago: z.coerce.number().optional(),
  status: z.enum(Object.values(BoletoStatus) as [string, ...string[]]),
  locatarioId: z.coerce.number().optional(),
  locacaoId: z.coerce.number().min(1, 'Locação é obrigatório'),
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
  //documentosToDeleteIds: z.array(z.object({id:z.number(), file:z.string()})).optional(),

});

export type BoletoSchema = z.infer<typeof boletoSchema>