import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { ROUTE } from '@/enums/routes.enum'
import api from '@/services/axios/api'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BasePaginationData } from '../imoveis/listarImoveis'
import { Pessoa } from '@/interfaces/pessoa'
import { useMediaQuery } from 'react-responsive'
import { useGlobalParams, usePessoa } from '@/globals/GlobalParams'
import { generatePaginationLinks } from '@/components/ui/generate-pages'

// Types
interface GetClientesParams {
  search?: string
  page?: number
  limit?: number,
  exclude?: string,
}

// API & Query Logic
export const getClientes = async ({ page, limit, search, exclude }: GetClientesParams) => {
  return await api.get<BasePaginationData<Pessoa>>('pessoas', {
    params: {
      page,
      limit,
      search,
      exclude
    }
  })
}

export const useGetClientesQueryOptions = ({
  search,
  page,
  limit,
  exclude,
  ...queryKeys
}: {
  search?: string
  type?: string
  rooms?: number
  price?: string
  page?: number
  limit?: number
  exclude?: string
} = {}) => {
  return queryOptions({
    queryKey: ['clientes', { search, page, limit, exclude }, queryKeys],
    queryFn: () => getClientes({ search, page, limit, exclude })
  })
}

// Component
export default function ListarClientes({
  txtVinc,
  limitView,
  exclude,
  onSelectCliente
}: {
  txtVinc: string
  limitView: number
  exclude: string
  onSelectCliente: (cliente: Pessoa | undefined) => void
}) {
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isPortrait = useMediaQuery({ query: '(min-width: 1224px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 746px)' })
  const isMobile = useMediaQuery({ query: '(min-width: 400px)' })
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  const navigate = useNavigate()

  //Globals
  const glb_params = useGlobalParams();

  const [searchParams, setSearchTerm] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = ((isPortrait || isTablet || isBigScreen) && limitView > 1 ? 3 : (isMobile && limitView > 2) ? 2 : limitView > 0 ? limitView : limitView || Number(searchParams.get('limit')) || 3);
  const search = searchParams.get('search') || '';

  const { data, isLoading } = useQuery(
    useGetClientesQueryOptions({
      page,
      limit,
      search,
      exclude,
    })
  )

  const clientes = data?.data?.data || []
  const totalPages = data?.data?.totalPages

  // const hasTotalPages = !!totalPages
  // const canGoToNextPage = hasTotalPages && page < totalPages
  // const canGoToPreviousPage = hasTotalPages && page > totalPages
  //always that we go to out of the total pages, we will go to the first page
  useEffect(() => {
    glb_params.updTitle_form('Clientes');
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
  const handleClickCreateCliente = () => {
    navigate(ROUTE.CLIENTES_CRIAR)
  }

  const handleClickVerDetalhes = (id: number) => () => {
    console.log(id);
    console.log(`${ROUTE.CLIENTES}/${id}`);
    navigate(`${ROUTE.CLIENTES}/${id}`)
  }
  // UI Logic
  const hasSearchResults = Boolean(!isLoading && search && clientes?.length === 0)

  return (
    <div className="container mx-auto space-y-6 p-4 font-[Poppins-regular]">
      {/* Search & Filters */}
      <div className="grid grid-cols-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {glb_params.origin_url.indexOf('lista') > -1 && (
          <h1 className="text-2xl font-bold">Clientes</h1>
        )}
        <Button onClick={handleClickCreateCliente}>
          <Plus className="h-4 w-4" />Criar Cliente
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            onChange={handleSearchChange}
            value={search}
            placeholder="Buscar clientes"
            className="pl-8"
          />
        </div>
      </div>

      {/* Clientes Grid */}
      <div className={limit === 1 ? "grid gap-6 grid-cols-1" : "grid gap-6 sm:grid-cols-1 lg:grid-cols-3"}>
        {/* Search Results & No Results Message */}
        {hasSearchResults && (
          <p className="text-center text-muted-foreground">
            Nenhum cliente encontrado para a busca atual.
          </p>
        )}

        {/* Clientes Cards */}
        {clientes?.map((cliente) => (
          <Card key={cliente.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate"
                  style={
                    {
                      fontSize: (isBigScreen ? '1.2rem' : isPortrait ? '1rem' : isTablet ? '0.8rem' : isMobile ? '1rem' : '1rem'),
                    }}

                >{cliente?.nome}</span>
                <Badge variant="secondary">
                  {cliente?.locatarios?.length}
                  {cliente?.locatarios?.length && cliente?.locatarios?.length > 1
                    ? ' clientes'
                    : ' cliente'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="font-semibold">CPF/CNPJ:</dt>
                <dd className="truncate">{cliente?.documento}</dd>
                <dt className="font-semibold">Profissão:</dt>
                <dd className="truncate">{cliente?.profissao || 'N/A'}</dd>
                <dt className="font-semibold">Estado Civil:</dt>
                <dd>{cliente?.estadoCivil || 'N/A'}</dd>
                <dt className="font-semibold">Email:</dt>
                <dd className="truncate">{cliente?.email || 'N/A'}</dd>
                <dt className="font-semibold">Telefone:</dt>
                <dd>{cliente?.telefone || 'N/A'}</dd>
              </dl>
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={handleClickVerDetalhes(cliente.id)}
                  style={
                    {
                      fontSize: (isBigScreen ? '1.2rem' : isPortrait ? '1rem' : isTablet ? '0.8rem' : isMobile ? '0.8rem' : '0.3rem'),
                    }}
                >
                  Ver detalhes
                </Button>
                {onSelectCliente && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onSelectCliente(cliente);
                    }}
                    style={{
                      fontSize: (isBigScreen ? '1.2rem' : isPortrait ? '1rem' : isTablet ? '0.8rem' : isMobile ? '0.8rem' : '0.3rem'),
                      textWrap: 'inherit'
                    }}

                  >
                    {txtVinc !== '' ? txtVinc : 'Vincular Imóvel'}
                  </Button>
                )}
              </div>
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
          {generatePaginationLinks(page, !totalPages ? 1 : totalPages, (limit === 1 ? 2 : isBigScreen ? 10 : isPortrait ? 10 : isTablet ? 5 : 2), handlePageChange)}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(page + 1)}
              aria-disabled={(page > (!totalPages ? 1 : totalPages - 1) ? "true" : "false")}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
