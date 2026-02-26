import api from '@/services/axios/api'
import { Condominio } from '@/interfaces/condominio'

export const getCondominio = async (id: number): Promise<Condominio> => {
  const response = await api.get<Condominio>(`condominios/findbyid/${id}`)
  return response.data
}

//Altera condominio
const updateCondominio = async (id: number, data: FormData): Promise<Condominio> => {
  const response = await api.put<Condominio>(`condominios/${id}`, data)
  return response.data
}

// Types
interface GetCondominiosParams {
  search?: string
  page?: number
  limit?: number
  exclude?: string
}

export interface BasePaginationData<T> {
  data: T[]
  page: number
  pageSize: number
  totalPages: number
  currentPosition: number
}

/*export const getTipos = async () => {
  return await api.get<TipoImovel[]>('tipoimovel')
}*/


// API & Query Logic
export const getCondominios = async (empresaId:number, { page, limit, search, exclude }: GetCondominiosParams) => {
  return await api.get<BasePaginationData<Condominio>>('condominios/' + empresaId.toString(), {
    params: {
      page,
      limit,
      search,
      exclude
    }
  })
}


export const getCondominiosEmp = async (empresaId:number) => {
  const result = await api.get<Condominio[]>('condominios/findbyempresa/' + empresaId.toString())
  return result.data
}
