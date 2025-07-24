import { z } from "zod";

export const enderecoSchema = z.object({
    logradouro: z.string().min(1, 'Logradouro é obrigatório'),
    numero: z.string().min(1, 'Número é obrigatório'),
    bairro: z.string().min(1, 'Bairro é obrigatório'),
    complemento: z.string().optional(),
    cidade: z.string().min(1, 'Cidade é obrigatória'),
    cep: z.string().min(1, 'CEP é obrigatório'),
    estado: z.string().min(1, 'Estado é obrigatório')
  })
  