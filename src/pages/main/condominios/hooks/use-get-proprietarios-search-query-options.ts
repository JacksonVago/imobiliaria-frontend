import { queryOptions } from '@tanstack/react-query'
import { searchProprietarios } from '../detalhes'

export const useGetProprietariosSearchQueryOptions = (
    proprietariosSearchQuery: string
    
) => {
  return queryOptions({
    queryKey: ['proprietarios', proprietariosSearchQuery],
    queryFn: () => searchProprietarios(proprietariosSearchQuery),
    enabled: !!proprietariosSearchQuery
  })
}
