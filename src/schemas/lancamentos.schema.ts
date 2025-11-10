import { LancamentoStatus } from "@/enums/locacao/enums-locacao";
import { MAX_DOCUMENT_FILE_SIZE } from "@/pages/main/imoveis/constants/max_document_file_size";
import { ACCEPTED_DOCUMENT_TYPES } from "@/pages/main/proprietarios/constants/accepted-document-types";
import moment from "moment";
import { z } from "zod";

export const lancamentoSchema = z.object({
  id: z.coerce.number(),
  dataLancamento: z.string().transform((val) => {
    const data: string = val;
    return moment(data.substring(0, 10)).format("YYYY-MM-DD");
  }),
  vencimentoLancamento: z.string().transform((val) => {
    const data: string = val;
    return moment(data.substring(0, 10)).format("YYYY-MM-DD");
  }),
  valorLancamento: z.coerce.number().min(1, 'Valor do lançamento é obrigatório'),
  parcela: z.coerce.number().optional(),
  observacao: z.string().optional(),
  status: z.enum(Object.values(LancamentoStatus) as [string, ...string[]]),
  tipoId: z.coerce.number().optional(),
  locacaoId: z.coerce.number().min(1, 'Locação é obrigatório'),
});

export type LancamentoSchema = z.infer<typeof lancamentoSchema>