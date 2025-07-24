import { Imovel } from '@/interfaces/imovel'
import { Proprietario } from '@/interfaces/proprietario'
import api from '@/services/axios/api'
import { CreateLocacaoData } from '../detalhes'

export const linkProprietario = async (imovelId: number, proprietarioId: number): Promise<void> => {
  await api.put<Proprietario>(`proprietarios/${proprietarioId}/vincular-imovel/${imovelId}`)
}

export const unlinkProprietario = async (
  imovelId: number,
  proprietarioId: number
): Promise<void> => {
  await api.delete(`proprietarios/${proprietarioId}/desvincular-imovel/${imovelId}`)
}

export const findProprietarioByDocument = async (document: string) => {
  return await api.get<Proprietario>(`/proprietarios/find-by-document/${document}`)
}

export const createLocacao = async (data: CreateLocacaoData): Promise<void> => {
  await api.post(`locatarios/locacao`, data)
}

export const getImovel = async (id: number): Promise<Imovel> => {
  const response = await api.get<Imovel>(`imoveis/${id}`)
  return response.data
}
