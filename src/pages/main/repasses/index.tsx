import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { ROUTE } from '@/enums/routes.enum'
import api from '@/services/axios/api'
import { queryOptions, useQuery } from '@tanstack/react-query'
import { MapPin, Receipt, Search, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BasePaginationData } from '../imoveis/listarImoveis'
import { useMediaQuery } from 'react-responsive'
import { useGlobalParams } from '@/globals/GlobalParams'
import { generatePaginationLinks } from '@/components/ui/generate-pages'
import { getEnderecoFormatado, getEnderecoFormatMaps } from '@/helpers/get-endereco-formatado'
import { Endereco } from '@/interfaces/endereco'
import { Label } from '@/components/ui/label'
import moment from 'moment'
import { toast } from '@/hooks/use-toast'
import { Boleto } from '@/interfaces/boleto'
import { cn } from '@/lib/utils'
import { BoletoStatus } from '@/enums/locacao/enums-locacao'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STATUS_BOLETO_OPTIONS } from '@/constants/status-boletos'

// Types
interface GetRepassesParams {
  search?: string
  page?: number
  limit?: number
  status?: string,
  exclude?: string
  dataInicial?: string
  dataFinal?: string
}

// API & Query Logic
export const getRepasses = async ({ page, limit, search, status, exclude, dataInicial, dataFinal }: GetRepassesParams) => {
  return await api.get<BasePaginationData<Boleto>>('pagamentos', {
    params: {
      page,
      limit,
      status,
      search,
      exclude,
      dataInicial,
      dataFinal
    }
  })
}

export const useGetRepassesQueryOptions = ({
  search,
  page,
  limit,
  status,
  exclude,
  dataInicial,
  dataFinal,
  ...queryKeys
}: {
  search?: string
  page?: number
  limit?: number
  status?: string,
  exclude?: string
  dataInicial?: string
  dataFinal?: string
} = {}) => {
  return queryOptions({
    queryKey: ['boletos', { search, page, limit, status, exclude, dataInicial, dataFinal }, queryKeys],
    queryFn: () => getRepasses({ search, page, limit, status, exclude, dataInicial, dataFinal })
  })
}
//lancamentos
export default function ListarBoletos({
  limitView,
  exclude,
}: {
  limitView: number
  exclude: string
}) {
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isPortrait = useMediaQuery({ query: '(min-width: 1224px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 746px)' })
  const isMobile = useMediaQuery({ query: '(max-width: 420px)' })
  //const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  const navigate = useNavigate()

  //Globals
  const glb_params = useGlobalParams();

  const [searchParams, setSearchTerm] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  //const limit = ((isPortrait || isTablet || isBigScreen) && limitView > 1 ? 3 : isMobile ? 1 : limitView > 0 ? limitView : limitView || Number(searchParams.get('limit')) || 3);
  const limit = ((isPortrait || isTablet || isBigScreen) && limitView > 1 ? 3 : isMobile ? 1 : limitView > 0 ? limitView : limitView || Number(searchParams.get('limit')) || 3);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const [dataInicial, setdataInicial] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [dataFinal, setdataFinal] = useState(moment(new Date()).format("bole-DD"));

  const { data, isLoading } = useQuery(
    useGetRepassesQueryOptions({
      page,
      limit,
      search,
      status,
      exclude,
      dataInicial,
      dataFinal
    })
  )

  const boletos = data?.data?.data || []
  const totalPages = data?.data?.totalPages

  console.log(boletos);

  useEffect(() => {
    glb_params.updTitle_form('Boletos');
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

  const handleClickVerDetalhes = (id: number) => {
    navigate(`${ROUTE.PAGAMENTOS}/${id}`)
  }
  // UI Logic
  const hasSearchResults = Boolean(!isLoading && search && boletos?.length === 0)

  const googleMaps = "https://www.google.com/maps/place/";
  const handlerClickMaps = (endereco: Endereco | undefined) => {
    if (endereco) {
      const urlGoogleMaps = googleMaps + getEnderecoFormatMaps(endereco);
      window.open(urlGoogleMaps);
    }
  }

  const usdFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  const handleConfirmarBoleto = async (boleto: Boleto) => {
    try {
      boleto.status = BoletoStatus.CONFIRMADO;
    } catch (error) {
      toast({ title: 'Erro ao gerar boletos.', variant: 'destructive' });
    }
  }

  const handleExcluirBoleto = async (boletoId: number) => {
    try {
      return await api.delete(`pagamentos/${boletoId}`);
    } catch (error) {
      toast({ title: 'Erro ao excluir boleto.', variant: 'destructive' });
    }
  }
  const handlerChangeTipo = (tipo: string) => {
    navigate({
      search: `?page=1&limit=${limit}&search=${search}&status=${tipo}`
    })
  }


  return (
    <div className="container mx-auto space-y-6 p-4 font-[Poppins-regular]">
      {/* Search & Filters */}
      {/* <div className="grid grid-cols-2 flex flex-col justify-end items-start gap-4 sm:flex-row sm:items-center"> */}
      <div className="flex flex-row items-start justify-end gap-2 sm:flex-row sm:items-center">
        {glb_params.origin_url.indexOf('lista') > -1 && (
          <h1 className="text-2xl font-bold">Pagamentos</h1>
        )}
      </div>

      <div className=
        {(isPortrait || isTablet || isBigScreen)
          ? "grid grid-cols-2 gap-4 sm:flex-row sm:items-center sm:justify-between border-b"
          : "grid grid-cols-1 gap-4 sm:flex-row sm:items-center sm:justify-between border-b"}
      >
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            onChange={handleSearchChange}
            value={search}
            placeholder="Buscar pagamentos"
            className="pl-8"
          />
        </div>
        <div className=
          {(isPortrait || isTablet || isBigScreen)
            ? "grid grid-cols-3 gap-4 mb-2"
            : "grid grid-cols-1 gap-4 mb-2"}>
          <h1 className='flex items-center'>Período</h1>
          <div className="flex justify-between gap-2">
            <Label className="text-base flex items-center">
              De</Label>
            <Input
              type='date'
              className="mt-2"
              placeholder="Data de vencimento"
              value={dataInicial}
              onChange={(e) => setdataInicial(e.target.value)}
            />
          </div>
          <div className="flex justify-between gap-2">
            <Label className="text-base flex items-center">
              Até
            </Label>
            <Input
              type='date'
              className="mt-2"
              placeholder="Data de vencimento"
              value={dataFinal}
              onChange={(e) => setdataFinal(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select onValueChange={(value) => { handlerChangeTipo(value) }}>
            <SelectTrigger className="h-4 w-[160px]">
              <SelectValue placeholder="Situação" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_BOLETO_OPTIONS.map((value) => (
                <SelectItem key={value.label} value={value.value}>
                  {value.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* pagamentos Grid */}
      <div className={limit === 1 ? "grid gap-6 grid-cols-1" : "grid gap-6 sm:grid-cols-1 lg:grid-cols-3"}>
        {/* Search Results & No Results Message */}
        {hasSearchResults && (
          <p className="text-center text-muted-foreground">
            Nenhum pagamento encontrado para a busca atual.
          </p>
        )}

        {/*Card das locações/pagamentos */}
        {(boletos.length === 0 && !hasSearchResults) && (
          <div className="col-span-3 flex flex-col items-center justify-center w-full">
            <p className="text-center text-muted-foreground">
              Nenhum boleto disponível para este período.
            </p>
          </div>
        )}
        {boletos.map((boleto) => (
          <Card key={boleto.id} className="">
            <CardHeader className="flex flex-row justify-between">

              <CardTitle className="line-clamp-1" style={{ fontSize: '1rem' }}>
                <p className="line-clamp-2 flex gap-1 text-sm text-muted-foreground">
                  <MapPin className="inline-block h-4 w-4 cursor-pointer"
                    onClick={() => { handlerClickMaps(boleto.locacao?.imovel?.endereco) }}
                    color='green'
                  />
                  {getEnderecoFormatado(boleto.locacao?.imovel?.endereco)}
                </p>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="font-bold flex justify-end">
                Aluguel R$ {boleto.locacao?.valorAluguel?.toLocaleString('pt-BR')}
              </Label>
              {(boleto.lancamentos && boleto.lancamentos?.length > 0) ? (
                <>
                  <Label style={{ 'fontSize': '0.7rem' }}> Lançamentos </Label>
                  <div className='rounded-md border'>
                    <div className='grid grid-cols-5 m-2 font-[Poppins-bold]' >
                      <Label className='col-span-2' style={{ 'fontSize': '0.7rem' }}>Descrição</Label>
                      {!isMobile ? (
                        <Label style={{ 'fontSize': '0.7rem' }}>Emissão</Label>)
                        : (<></>)
                      }
                      <Label style={{ 'fontSize': '0.7rem' }}>Vencimento</Label>
                      <Label className={!isMobile ? 'flex justify-end' : 'flex justify-end col-span-2'} style={{ 'fontSize': '0.7rem' }}>Valor</Label>
                    </div>

                    <div className='grid grid-cols-5 m-2 gap-1' >
                      {boleto.lancamentos?.map((lancamento) => (
                        <>
                          <Label className={boleto.status === BoletoStatus.PENDENTE ? 'col-span-2 text-green-600' : 'col-span-2'} style={{ 'fontSize': '0.7rem' }}>{lancamento.lancamentotipo.name}</Label>
                          {!isMobile ? (<Label className={boleto.status === BoletoStatus.PENDENTE ? 'text-green-600' : ''} style={{ 'fontSize': '0.7rem' }}>{moment.utc(lancamento.dataLancamento).format("DD/MM/YYYY")}</Label>)
                            : (<></>)
                          }
                          <Label className={boleto.status === BoletoStatus.PENDENTE ? (!isMobile ? 'text-green-600' : 'text-green-600 col-span-2') : (!isMobile ? '' : 'col-span-2')} style={{ 'fontSize': '0.7rem' }}>{moment.utc(lancamento.vencimentoLancamento).format("DD/MM/YYYY")}</Label>
                          <Label className={boleto.status === BoletoStatus.PENDENTE ? 'flex justify-end text-green-600' : 'flex justify-end'} style={{ 'fontSize': '0.7rem' }}>{usdFormatter.format(lancamento.valorLancamento)}</Label>
                        </>
                      ))}
                    </div>
                  </div>
                  <div className='grid grid-cols-2 font-[Poppins-bold] mt-5 '>
                    <Label className={boleto.status === BoletoStatus.PENDENTE ? 'flex justify-start text-green-600' : 'flex justify-start'} style={{ 'fontSize': '0.7rem' }}>Total </Label>
                    <Label className={boleto.status === BoletoStatus.PENDENTE ? 'flex justify-end text-green-600' : 'flex justify-end'} style={{ 'fontSize': '0.7rem' }}>
                      {usdFormatter.format((boleto.locacao ? boleto.locacao.valorAluguel : 0) +
                        boleto.lancamentos.reduce((total, lancamento) => {
                          return total + lancamento.valorLancamento;
                        }, 0))}
                    </Label>
                  </div>
                  <div className='flex justify-end'>
                    <Badge
                      variant="secondary"
                      className={cn('mt-2 text-xs', {
                        'bg-green-50 text-green-800': boleto.status === BoletoStatus.PENDENTE,
                        'bg-red-50 text-red-800': boleto.status === BoletoStatus.ATRASADO,
                        'bg-blue-50 text-blue-800': boleto.status === BoletoStatus.PAGO
                      })}
                    >
                      {boleto.status}
                    </Badge>
                  </div>

                </>
              )
                : (<p className="text-center text-muted-foreground mt-5">
                  Não há lançamentos para esse boleto
                </p>
                )
              }
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className=
              {cn('grid gap-10', {
                                    'grid-cols-3': boleto.status === BoletoStatus.PENDENTE,
                                    'grid-cols-2': boleto.status === BoletoStatus.ATRASADO || boleto.status === BoletoStatus.PAGO,
                                  })}
              >
                <Button variant="secondary"
                  onClick={() => handleClickVerDetalhes(boleto.id ? boleto.id : 0)}
                  size={"sm"}>
                  Detalhes
                </Button>
                {(boleto.status === BoletoStatus.PENDENTE) && (
                  <>
                    <Button variant="destructive"
                      onClick={() => handleExcluirBoleto(boleto.id)}
                      size={"sm"}>
                      <Trash className="h-4 w-4" />Excluir
                    </Button>
                    <Button variant="secondary"
                      onClick={() => handleConfirmarBoleto(boleto)}
                      size={"sm"}>
                      <Receipt className="h-4 w-4" />Emitir Boleto
                    </Button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent className={boletos.length > 0 ? "" : "hidden"}>
          {/* Previous & Next Buttons */}
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
          </PaginationItem>
          {generatePaginationLinks(page, !totalPages ? 1 : totalPages, (limit === 1 ? 1 : isBigScreen ? 10 : isPortrait ? 10 : isTablet ? 5 : 2), handlePageChange)}
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

