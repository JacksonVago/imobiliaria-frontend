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
import { Separator } from '@/components/ui/separator'
import { ROUTE } from '@/enums/routes.enum'
import { Pessoa } from '@/interfaces/pessoa'
import api from '@/services/axios/api'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { Home, Plus, Search } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BasePaginationData } from '../imoveis/listarImoveis'
import {
  ProprietarioCardPreviewFooter,
  ProprietarioCardPreviewHeader,
  ProprietarioCardPreviewInfoContent,
  ProprietarioCardPreviewRoot
} from './components/proprietario-card-preview'
import { Proprietario } from '@/interfaces/proprietario'

// Types
interface GetProprietariosParams {
  search?: string
  page?: number
  limit?: number
}

// API & Query Logic
export const getProprietarios = async ({ page, limit, search }: GetProprietariosParams) => {
  return await api.get<BasePaginationData<Proprietario>>('proprietarios', {
    params: {
      page,
      limit,
      search
    }
  })
}

export const useGetProprietariosQueryOptions = ({
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
    queryKey: ['proprietarios', { search, page, limit }, queryKeys],
    queryFn: () => getProprietarios({ search, page, limit })
  })
}

// Component
export default function ListarProprietarios({
  onSelectImovel
}: {
  onSelectImovel?: (id: number) => void
}) {
  const navigate = useNavigate()

  const [searchParams, setSearchTerm] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 3
  const search = searchParams.get('search') || ''

  const { data, isLoading } = useQuery(
    useGetProprietariosQueryOptions({
      page,
      limit,
      search
    })
  )

  const proprietarios = data?.data?.data || []
  const totalPages = data?.data?.totalPages

  console.log(proprietarios);
  
  const hasTotalPages = !!totalPages
  const canGoToNextPage = hasTotalPages && page < totalPages
  const canGoToPreviousPage = hasTotalPages && page > totalPages
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

  const handlePageChange = (newpage: number) => {
    // Check if the new page is within the total pages
    // const canGoNext = !!totalPages && newpage <= totalPages ||

    const canChangePage = !!totalPages && newpage > 0 && newpage <= totalPages

    if (!canChangePage) return
    navigate({
      search: `?page=${newpage}&limit=${limit}&search=${search}`
    })
  }
  const handleClickCreateProprietario = () => {
    navigate(ROUTE.PROPRIETARIOS_CRIAR)
  }

  const handleClickVerDetalhes = (id: number) => () => {
    navigate(`${ROUTE.PROPRIETARIOS}/${id}`)
  }
  // UI Logic
  const hasSearchResults = Boolean(!isLoading && search && proprietarios?.length === 0)

  return (
    <div className="container mx-auto space-y-6 p-4">
      {/* Search & Filters */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Proprietários</h1>
        <Button onClick={handleClickCreateProprietario}>
          <Plus className="mr-2 h-4 w-4" /> Criar Proprietário
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            onChange={handleSearchChange}
            value={search}
            placeholder="Buscar proprietários"
            className="pl-8"
          />
        </div>
      </div>
      {/* Proprietarios Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Search Results & No Results Message */}
        {hasSearchResults && (
          <p className="text-center text-muted-foreground">
            Nenhum proprietário encontrado para a busca atual.
          </p>
        )}

        {/* Proprietarios Cards */}
        {proprietarios.map((proprietario) => (
          <ProprietarioCardPreviewRoot>
            <ProprietarioCardPreviewHeader proprietario={proprietario} />
            <ProprietarioCardPreviewInfoContent proprietario={proprietario} />
            {/* <Separator className="my-4" /> */}

            {/* <ProprietarioCardImoveisContent proprietario={proprietario} /> */}
            <ProprietarioCardPreviewFooter
              proprietario={proprietario}
              handleClickVerDetalhes={handleClickVerDetalhes}
              onSelectImovel={onSelectImovel}
            />
          </ProprietarioCardPreviewRoot>
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

export const ProprietarioPreviewCard = ({
  proprietario,
  handleClickVerDetalhes
}: {
  proprietario: Proprietario
  handleClickVerDetalhes: (id: number) => () => void
}) => {
  return (
    <Card key={proprietario.id} className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{proprietario?.pessoa?.nome}</span>
          <Badge variant="secondary">{proprietario?.imovelId} imóveis</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <dl className="grid grid-cols-2 gap-1 text-sm">
          <dt className="font-semibold">CPF/CNPJ:</dt>
          <dd className="truncate">{proprietario.pessoa?.documento}</dd>
          <dt className="font-semibold">Profissão:</dt>
          <dd className="truncate">{proprietario.pessoa?.profissao || 'N/A'}</dd>
          <dt className="font-semibold">Estado Civil:</dt>
          <dd>{proprietario.pessoa?.estadoCivil || 'N/A'}</dd>
          <dt className="font-semibold">Email:</dt>
          <dd className="truncate">{proprietario.pessoa?.email || 'N/A'}</dd>
          <dt className="font-semibold">Telefone:</dt>
          <dd>{proprietario.pessoa?.telefone || 'N/A'}</dd>
        </dl>
        <Separator className="my-4" />
        {/* <div>
          <h4 className="mb-2 font-semibold">Imóveis:</h4>
          <ul className="space-y-2">
            {proprietario?.imoveis?.slice(0, 3).map((imovel) => (
              <li key={imovel.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center">
                  <Home className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{imovel?.title}</span>
                </span>
                <span className="whitespace-nowrap font-semibold">
                  R$ {imovel?.valor_aluguel?.toLocaleString('pt-BR')}
                </span>
              </li>
            ))}

            {!!proprietario?.imoveis?.length && proprietario?.imoveis?.length > 3 && (
              <li className="text-sm text-muted-foreground">
                + {proprietario?.imoveis?.length - 3} imóveis
              </li>
            )}
          </ul>
        </div> */}
      </CardContent>
      <CardFooter>
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={handleClickVerDetalhes(proprietario.id)}
        >
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  )
}
