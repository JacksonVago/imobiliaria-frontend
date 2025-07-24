import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { generatePaginationLinks } from '@/components/ui/generate-pages'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ImovelTipo } from '@/enums/imovel/enums-imovel'
import { ROUTE } from '@/enums/routes.enum'
import { useGlobalParams } from '@/globals/GlobalParams'
import { getEnderecoFormatado } from '@/helpers/get-endereco-formatado'
import { Imovel } from '@/interfaces/imovel'
import { cn } from '@/lib/utils'
import api from '@/services/axios/api'
import { Value } from '@radix-ui/react-select'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { MapPin, Plus, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useNavigate, useSearchParams } from 'react-router-dom'

// Types
interface GetImoveisParams {
  search?: string
  type?: string
  rooms?: number
  price?: string
  page?: number
  limit?: number
  tipo?: string | undefined
  exclude?: string
}

export interface BasePaginationData<T> {
  data: T[]
  page: number
  pageSize: number
  totalPages: number
  currentPosition: number
}

// API & Query Logic
export const getImoveis = async ({ page, limit, search, type, rooms, price, tipo, exclude }: GetImoveisParams) => {
  return await api.get<BasePaginationData<Imovel>>('imoveis', {
    params: {
      page,
      limit,
      search,
      type,
      rooms,
      price,
      tipo,
      exclude
    }
  })
}

export const useGetImoveisQueryOptions = ({
  search,
  type,
  rooms,
  price,
  page,
  limit,
  tipo,
  exclude,
  ...queryKeys
}: {
  search?: string
  type?: string
  rooms?: number
  price?: string
  page?: number
  limit?: number
  tipo?: string | undefined
  exclude?: string
} = {}) => {
  return queryOptions({
    queryKey: ['imoveis', { search, type, rooms, price, page, limit, tipo, exclude }, queryKeys],
    queryFn: () => getImoveis({ search, type, rooms, price, page, limit, tipo, exclude })
  })
}

const mockedImages = [
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FzYSUyMDIlMjBhbmFkcmVzfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FzYSUyMDIlMjBhbmFkcmVzfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FzYSUyMDIlMjBhbmFkcmVzfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FzYSUyMDIlMjBhbmFkcmVzfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FzYSUyMDIlMjBhbmFkcmVzfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FzYSUyMDIlMjBhbmFkcmVzfGVufDB8fDB8fHww'
]

// Component
export default function ListarImoveis({
  limitView,
  exclude,
  onSelectImovel
}: {
  limitView: number
  exclude: string
  onSelectImovel: (imovel: Imovel | undefined) => void
}) {
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isPortrait = useMediaQuery({ query: '(min-width: 1224px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 746px)' })
  const isMobile = useMediaQuery({ query: '(min-width: 400px)' })

  const navigate = useNavigate()
  //Globals
  const glb_params = useGlobalParams();

  const [searchParams, setSearchTerm] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1
  const limit = ((isPortrait || isTablet || isBigScreen) && limitView > 1 ? 3 : (isMobile && limitView > 2) ? 1 : limitView > 0 ? limitView : limitView || Number(searchParams.get('limit')) || 3);
  const search = searchParams.get('search') || ''
  const tipo = searchParams.get('tipo') || undefined

  const { data, isLoading } = useQuery(
    useGetImoveisQueryOptions({
      page,
      limit,
      search,
      tipo,
      exclude,
    })
  )

  const imoveis = data?.data?.data || []
  const totalPages = data?.data?.totalPages

  const hasTotalPages = !!totalPages
  const canGoToNextPage = hasTotalPages && page < totalPages
  const canGoToPreviousPage = hasTotalPages && page > totalPages


  //Leitura das imagens
  const LoadImage = async (id: number, url: string) => {

    const response = await fetch(
      'https://jrseqfittadsxfbmlwvz.supabase.co/storage/v1/object/public/' + url
    )
    if (!response.ok) {
      throw new Error(`Erro ao buscar imagem: ${url}, Status: ${response.status}`)
    }
    const blob = await response.blob()
    const file = new File([blob], url, { type: blob.type })
    return {
      file,
      preview: URL.createObjectURL(file),
      id: id
    }
  }

  //always that we go to out of the total pages, we will go to the first page
  useEffect(() => {
    glb_params.updTitle_form('Imóveis');

    if (totalPages && page > totalPages) {
      navigate({
        search: `?page=1&limit=${limit}&search=${search}&tipo=${(tipo !== null ? tipo : '')}`
      })
    }
  }, [totalPages, page, limit, search, tipo])

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
      search: `?page=${newpage}&limit=${limit}&search=${search}&tipo=${(tipo !== null && tipo !== undefined ? tipo : '')}`
    })
  }

  console.log(limit);
  const handlerChangeTipo = (tipo: string) => {
    let tipo_aux: ImovelTipo | null;

    switch (tipo.toUpperCase()) {
      case "CASA":
        tipo_aux = ImovelTipo.CASA;
        break;
      case "APARTAMENTO":
        tipo_aux = ImovelTipo.APARTAMENTO;
        break;
      case "TERRENO":
        tipo_aux = ImovelTipo.TERRENO;
        break;
      default:
        tipo_aux = null;
    }
    navigate({
      search: `?page=1&limit=${limit}&search=${search}&tipo=${(tipo_aux !== null ? tipo_aux : '')}`
    })
  }

  const handleClickCreateImovel = () => {
    navigate(ROUTE.IMOVEIS_CRIAR)
  }
  // UI Logic
  const hasSearchResults = Boolean(!isLoading && search && imoveis?.length === 0)

  const handleClickVerDetalhes = (id: string) => {
    navigate(`${ROUTE.IMOVEIS}/${id}`)
  }

  return (
    <div className="container mx-auto space-y-6 p-4 font-[Poppins-regular]">
      {/* Search & Filters */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Imoveis</h1>
        <Button onClick={handleClickCreateImovel}>
          <Plus className="mr-2 h-4 w-4" /> Criar imovel
        </Button>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            onChange={handleSearchChange}
            value={search}
            placeholder="Buscar imóveis"
            className="pl-8"
          />
        </div>
        {/* Filter Selects */}
        <div className="flex gap-2">
          <Select onValueChange={(value) => { handlerChangeTipo(value) }}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casa">Casa</SelectItem>
              <SelectItem value="apartamento">Apartamento</SelectItem>
              <SelectItem value="terreno">Terreno</SelectItem>
            </SelectContent>
          </Select>
          {/* ... other filters ... */}
        </div>
      </div>

      {/* Imoveis Grid */}
      <div className= {(isBigScreen ? "grid gap-6 grid-cols-3" : isPortrait ? "grid gap-6 grid-cols-3" : isTablet ? "grid gap-6 grid-cols-2" : isMobile ? "grid gap-6 grid-cols-1" : "grid gap-6 grid-cols-1")}>
        {/* Search Results & No Results Message */}
        {hasSearchResults && (
          <p className="text-center text-muted-foreground">Nenhum imóvel</p>
        )}

        {/* Imoveis Cards */}
        {imoveis?.map((imovel, index) => (
          <Card key={imovel.id} className="">
            {(imovel?.imovelPhotos?.length ? imovel?.imovelPhotos?.length : 0) > 0 ? (
              <Carousel  autoplay={true}>
                <CarouselContent>
                  {imovel?.imovelPhotos && (
                    imovel?.imovelPhotos.map((image, index: number) => (
                      <CarouselItem key={index} className="">
                        <div className="p-1">
                          <Card>
                            <CardContent className="relative flex aspect-square items-center justify-center p-2">
                              <img
                                src={'https://jrseqfittadsxfbmlwvz.supabase.co/storage/v1/object/public/' + image.url}
                                alt={`Property image ${index + 1}`}
                                className="h-full w-full rounded-md object-cover"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))
                  )}
                </CarouselContent>
                <CarouselPrevious type="button" className={((imovel.imovelPhotos ? imovel.imovelPhotos?.length : 0) > (isBigScreen ? 7 : isPortrait ? 4 : isTablet ? 4 : 2) ? "flex" : "hidden")} />
                <CarouselNext type="button" className={((imovel.imovelPhotos ? imovel.imovelPhotos?.length : 0) > (isBigScreen ? 7 : isPortrait ? 4 : isTablet ? 4 : 2) ? "flex" : "hidden")} />
              </Carousel>
            ) : (
              <div className="rounded-md bg-muted py-8 text-center">
                <p className="text-muted-foreground">Nenhuma imagem adicionada</p>
              </div>
            )}

            <CardHeader className="flex flex-row justify-between">
              <CardTitle className="line-clamp-1" style={{fontSize:'1rem'}}>{imovel?.description}</CardTitle>
              <Badge
                variant="secondary"
                className={cn('mt-2', {
                  'bg-blue-50 text-blue-800': imovel?.tipo === ImovelTipo.APARTAMENTO,
                  'bg-yellow-50 text-yellow-800': imovel?.tipo === ImovelTipo.TERRENO,
                  'bg-green-50 text-green-800': imovel?.tipo === ImovelTipo.CASA
                })}
              >
                {imovel?.tipo}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2 flex gap-1 text-sm text-muted-foreground">
                <MapPin className="inline-block h-4 w-4" />
                {getEnderecoFormatado(imovel?.endereco)}
              </p>
              <span className="text-lg font-bold">
                Aluguel R$ {imovel?.valor_aluguel?.toLocaleString('pt-BR')}
              </span>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className='grid grid-cols-2 gap-4'>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleClickVerDetalhes(imovel?.id.toString())}
                >
                  Ver detalhes
                </Button>
                {onSelectImovel && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onSelectImovel(imovel);
                    }}
                    style={{
                      fontSize: (isBigScreen ? '1.2rem' : isPortrait ? '1rem' : isTablet ? '0.8rem' : isMobile ? '0.8rem' : '0.3rem'),
                      textWrap: 'inherit'
                    }}

                  >
                    Selecionar Imóvel
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
          {generatePaginationLinks(page, !totalPages ? 1 : totalPages, (limit === 1 ? limit : isBigScreen ? 10 : isPortrait ? 10 : isTablet ? 5 : 1), handlePageChange)}
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
