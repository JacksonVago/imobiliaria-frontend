import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { useMediaQuery } from 'react-responsive'
import { Input } from '@/components/ui/input'
import { ROUTE } from '@/enums/routes.enum'
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import api from '@/services/axios/api'
import { Plano } from '@/interfaces/plano'
import { useQuery } from '@tanstack/react-query'
import { TipoAssinatura } from '@/enums/assinatura/TipoAssinatura'
import { usdFormatter } from '@/utils/format-money'
import { Info } from 'lucide-react'

export const getPlanos = async () => {
    return await api.get<Plano[]>('assinatura')
}

export const getPlano = async (id: string) => {
    return await api.get<Plano>('assinatura/' + id)
}

interface IPlanosLista extends Plano {
    checked: boolean;
}

//Bem vindo
export const PlanoTipo = () => {

    const dataParams = useParams<{ email: string, plano: string }>()
    const planoId = dataParams.plano ? dataParams.plano : '0';
    const email = dataParams.email ? dataParams.email : 'email@email.com';

    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isPortrait = useMediaQuery({ query: '(min-width: 1224px)' })
    const isTablet = useMediaQuery({ query: '(min-width: 746px)' })
    const isMobile = useMediaQuery({ query: '(min-width: 200px)' })

    //const [rows, setRows] = useState<IPlanosLista[]>([]);
    const [rowsFilter, setRowsFilter] = useState<IPlanosLista[]>([]);

    //const [selMensal, setSelMensal] = useState(false);
    //const [selSemestral, setSelSemestral] = useState(false);
    //const [selAnual, setSelAnual] = useState(false);
    const [openAss, setOpenAss] = useState(false);

    const cardStyle = {
        padding: '20px',
        borderRadius: '8px',
        transition: 'border-color 0.3s ease',
        cursor: 'pointer'
    };
    const navigate = useNavigate()


    //Consulta PLANOS
    const {
        data: plano
    } = useQuery({
        queryKey: ['plano', planoId],
        queryFn: () => getPlano(planoId)
    });

    const {
        data: planos
    } = useQuery({
        queryKey: ['planos'],
        queryFn: () => getPlanos()
    });
    useEffect(() => {
        /*setRows(planos?.data.map((plano) => ({
            ...plano,
            checked: false
        })) || []);*/

        setRowsFilter(planos?.data.filter(x => x.tipo === plano?.data?.tipo).map((plano) => ({
            ...plano,
            checked: false
        })) || []);
    }, [planos])


    // Event Handlers
    const handlerContinue = (id: number) => {
        console.log('Tipo plano selecionado:', `${ROUTE.PLANOS}/pagamento/${id}`);
        navigate(`/planos/pagamento/${email}/${id}`);
    }

    const handlerSelPlanoTipo = (id: number) => {

        //setExpanded(!expanded);
        const checkeds = rowsFilter.map((c) => {
            if (id === c.id) {

                c.checked = !c.checked;
                return c;
            } else {
                c.checked = false;
                return c;
            }            
        });

        console.log(checkeds);
        setRowsFilter(checkeds);

    };

    return (
        <div className="container mx-auto space-y-6 p-4 font-[Poppins-regular]">
            <div className='grid grid-cols-2'>
                <h1 className='flex justify-start font-bold m-3 text-center'>{`Plano Selecionado ${plano?.data?.tipo}`}</h1>
                <h1 className='flex justify-end m-3 text-center'>Etapa 3 de 4</h1>
            </div>
            <div className={(isBigScreen ? "grid gap-4 grid-cols-3" : isPortrait ? "grid gap-4 grid-cols-3" : isTablet ? "grid gap-4 grid-cols-2" : isMobile ? "grid gap-4 grid-cols-1" : "grid gap-4 grid-cols-1")}>
                {rowsFilter.map((plano) => (
                    <div>
                        <Card className='font-[Poppins-regular]' style={cardStyle}
                            onClick={() => {
                                handlerSelPlanoTipo(plano.id);
                            }}>
                            <CardHeader>
                                <CardTitle className="">
                                    <div className='grid grid-cols-4'>
                                        <div className='mt-2 mb-2 flex justify-between items-center col-span-3'>
                                            <Label className="font-bold">{plano.frequencia}
                                            </Label>
                                        </div>
                                        <div className='flex justify-end items-center'>
                                            <Input type='radio' checked={plano.checked}></Input>
                                        </div>
                                    </div>
                                    {plano.tipo === TipoAssinatura.BASICO && <p className="ml-1 mb-4 text-gray-500" style={{ "fontSize": '0.9rem' }}>Apenas celular</p>}
                                    <div className='mt-12'>
                                        <Label className="ml-1 font-bold" style={{ "fontSize": '2rem' }}>{usdFormatter.format(Number(plano.valor))}</Label>
                                        <Label className="ml-1 font-bold" style={{ "fontSize": '0.9rem' }}>/ mês</Label>
                                    </div>
                                    <p className="ml-1 mt-2 font-bold" style={{ "fontSize": '0.9rem' }}>7 dias grátis</p>
                                    <p className="ml-1 mt-1 mb-5 border-b pb-8 text-gray-500 font-[Poppins-Light]" style={{ "fontSize": '0.9rem' }}>Renovação automática, exceto se cancelada</p>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                            </CardContent>
                            <CardFooter>
                                <Button size="lg" onClick={() => { handlerContinue(plano.id) }} className="w-full" disabled={!plano.checked}>Continuar</Button>
                            </CardFooter>
                        </Card>
                        <div className='mt-2 flex justify-center'>
                            <Button size="sm" className="rounded-full bg-gray-400 hover:bg-blue-500 hover:cursor-pointer"
                                onClick={() => {
                                    setOpenAss(true);
                                }}>
                                <Info className="inline mr-2" />
                                SABER MAIS
                            </Button>
                        </div>
                    </div>
                ))}
                <div className='mt-2 flex justify-center'>
                    <AlertDialog open={openAss} onOpenChange={setOpenAss}>
                        <AlertDialogTrigger>
                            <Button size="sm" className="rounded-full bg-gray-400 hover:bg-blue-500 hover:cursor-pointer">
                                <Info className="inline mr-2" />
                                SABER MAIS
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <div className='flex justify-end'>
                                    <Button size="icon" variant="ghost" className="close-button hover:cursor-pointer" aria-label="Close dialog"
                                        onClick={() => {
                                            setOpenAss(false);
                                        }}>
                                        &times; {/* This is the HTML entity for an "X" icon */}
                                    </Button>
                                </div>

                                <AlertDialogTitle>Informações de Assinatura</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <p>
                                        Seu plano será renovado automaticamente a cada ano, inclusive após qualquer período de avaliação gratuita ou promocional aplicável, a menos que o cancelamento seja feito antes da renovação. O cancelamento entrará em vigor após o período de cobrança atual.
                                    </p>
                                    <p>Disponibilidade sujeita ao seu serviço de internet e aos recursos do dispositivo. </p>
                                    <p>Saiba mais aqui: <a href="www.admimoveis.com.br/premium">www.admimoveis.com.br/premium</a>.</p>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </div >
    )
}

