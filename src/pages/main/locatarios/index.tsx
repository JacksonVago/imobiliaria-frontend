import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { ROUTE } from '@/enums/routes.enum'
import { Locatario } from '@/interfaces/locatario'
import api from '@/services/axios/api'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BasePaginationData } from '../imoveis/listarImoveis'

// Types
interface GetLocatariosParams {
  search?: string
  page?: number
  limit?: number
}

// API & Query Logic
export const getLocatarios = async ({ page, limit, search }: GetLocatariosParams) => {
  return await api.get<BasePaginationData<Locatario>>('locatarios', {
    params: {
      page,
      limit,
      search
    }
  })
}

export const useGetLocatariosQueryOptions = ({
  search,
  page,
  limit,
  ...queryKeys
}: {
  search?: string
  type?: string
  rooms?: number
  price?: string
  page?: number
  limit?: number
} = {}) => {
  return queryOptions({
    queryKey: ['locatarios', { search, page, limit }, queryKeys],
    queryFn: () => getLocatarios({ search, page, limit })
  })
}

// Component
export default function ListarLocatarios({
  onSelectLocatario
}: {
  onSelectLocatario: (locatarioId: number) => void
}) {
  const navigate = useNavigate()

  const [searchParams, setSearchTerm] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 3
  const search = searchParams.get('search') || ''

  const { data, isLoading } = useQuery(
    useGetLocatariosQueryOptions({
      page,
      limit,
      search
    })
  )

  const locatarios = data?.data?.data || []
  const totalPages = data?.data?.totalPages

  // const hasTotalPages = !!totalPages
  // const canGoToNextPage = hasTotalPages && page < totalPages
  // const canGoToPreviousPage = hasTotalPages && page > totalPages
  //always that we go to out of the total pages, we will go to the first page
  useEffect(() => {
    if (totalPages && page > totalPages) {
      navigate({
        search: `?page=1&limit=${limit}&search=${search}`
      })
    }
  }, [totalPages, page, navigate, limit, search])

  // Event Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.target.value
    setSearchTerm({ search })
  }

  // const methods = useForm({})

  const handlePageChange = (newpage: number) => {
    // Check if the new page is within the total pages
    // const canGoNext = !!totalPages && newpage <= totalPages ||

    const canChangePage = !!totalPages && newpage > 0 && newpage <= totalPages

    if (!canChangePage) return
    navigate({
      search: `?page=${newpage}&limit=${limit}&search=${search}`
    })
  }
  const handleClickCreateLocatario = () => {
    navigate(ROUTE.LOCATARIOS_CRIAR)
  }

  const handleClickVerDetalhes = (id: number) => () => {
    navigate(`${ROUTE.LOCATARIOS}/${id}`)
  }
  // UI Logic
  const hasSearchResults = Boolean(!isLoading && search && locatarios?.length === 0)

  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Search & Filters */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Locatários</h1>
        <Button onClick={handleClickCreateLocatario}>
          <Plus className="mr-2 h-4 w-4" /> Criar locatário
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            onChange={handleSearchChange}
            value={search}
            placeholder="Buscar locatários"
            className="pl-8"
          />
        </div>
      </div>
      {/* Locatarios Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Search Results & No Results Message */}
        {hasSearchResults && (
          <p className="text-center text-muted-foreground">
            Nenhum locatário encontrado para a busca atual.
          </p>
        )}

        {/* Locatarios Cards */}
        {locatarios?.map((locatario) => (
          <Card key={locatario.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{locatario?.nome}</span>
                <Badge variant="secondary">
                  {locatario?.locacoes?.length}
                  {locatario?.locacoes?.length && locatario?.locacoes?.length > 1
                    ? ' locações'
                    : ' locação'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="font-semibold">CPF/CNPJ:</dt>
                <dd className="truncate">{locatario?.documento}</dd>
                <dt className="font-semibold">Profissão:</dt>
                <dd className="truncate">{locatario?.profissao || 'N/A'}</dd>
                <dt className="font-semibold">Estado Civil:</dt>
                <dd>{locatario?.estadoCivil || 'N/A'}</dd>
                <dt className="font-semibold">Email:</dt>
                <dd className="truncate">{locatario?.email || 'N/A'}</dd>
                <dt className="font-semibold">Telefone:</dt>
                <dd>{locatario?.telefone || 'N/A'}</dd>
              </dl>
            </CardContent>
            <CardFooter>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleClickVerDetalhes(locatario.id)}
              >
                Ver detalhes
              </Button>
              {onSelectLocatario && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => onSelectLocatario(locatario.id)}
                >
                  Vincular locatário
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          {/* Previous & Next Buttons */}
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
          </PaginationItem>
          {/* Page Links */}
          {[...Array(totalPages).keys()].map((index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
