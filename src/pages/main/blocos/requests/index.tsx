import { Bloco } from '@/interfaces/bloco'
import api from '@/services/axios/api'

export const getBloco = async (id: number): Promise<Bloco> => {
  const response = await api.get<Bloco>(`blocos/${id}`)
  return response.data
}
