import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '@/components/ui/loader'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@radix-ui/react-label'
import { useMediaQuery } from 'react-responsive'
import { Input } from '@/components/ui/input'
import { ROUTE } from '@/enums/routes.enum'
import api from '@/services/axios/api'
import { Plano } from '@/interfaces/plano'
import { useQuery } from '@tanstack/react-query'
import { TipoAssinatura } from '@/enums/assinatura/TipoAssinatura'
import { FrequenciaAssinatura } from '@/enums/assinatura/FrequenciaAssinatura'
import { usdFormatter } from '@/utils/format-money'

export const getPlanos = async () => {
    return await api.get<Plano[]>('assinatura')
}

interface IPlanosLista extends Plano {
    checked: boolean;
}

//Bem vindo
export const Planos = () => {
    const dataParams = useParams<{ email: string }>()
    const email = dataParams.email ? dataParams.email : '';

    const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
    const isPortrait = useMediaQuery({ query: '(min-width: 1224px)' })
    const isTablet = useMediaQuery({ query: '(min-width: 746px)' })
    const isMobile = useMediaQuery({ query: '(min-width: 200px)' })

    const [rows, setRows] = useState<IPlanosLista[]>([]);
    const [rowsFilter, setRowsFilter] = useState<IPlanosLista[]>([]);

    const cardStyle = {
        padding: '20px',
        borderRadius: '8px',
        transition: 'border-color 0.3s ease',
        cursor: 'pointer'
    };
    const navigate = useNavigate()


    //Consulta PLANOS
    const {
        data: planos
    } = useQuery({
        queryKey: ['planos'],
        queryFn: () => getPlanos()
    });

    useEffect(() => {
        setRows(planos?.data.map((plano) => ({
            ...plano,
            checked: false
        })) || []);

        setRowsFilter(planos?.data.filter(x => x.frequencia === FrequenciaAssinatura.MENSAL).map((plano) => ({
            ...plano,
            checked: false
        })) || []);
    }, [planos])


    // Event Handlers
    const handlerContinue = (idPlano: number) => {
        navigate(`/planos/tipo/${email}/${idPlano}`);
    }

    const handlerSelPlano = (id: number) => {

        //setExpanded(!expanded);
        const checkeds = rowsFilter.map((c, i) => {
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
                <h1 className='flex justify-start font-bold m-3 text-center'>Selecione seu plano</h1>
                <h1 className='flex justify-end m-3 text-center'>Etapa 2 de 4</h1>
            </div>
            <div className={(isBigScreen ? "grid gap-4 grid-cols-3" : isPortrait ? "grid gap-4 grid-cols-3" : isTablet ? "grid gap-4 grid-cols-2" : isMobile ? "grid gap-4 grid-cols-1" : "grid gap-4 grid-cols-1")}>
                {rowsFilter.map((plano) => (
                    <Card className='font-[Poppins-regular]' style={cardStyle}
                        onClick={() => {
                            handlerSelPlano(plano.id);
                        }}>
                        <CardHeader>
                            <CardTitle className="">
                                <div className='grid grid-cols-4'>
                                    <div className='mt-2 mb-2 flex justify-between items-center col-span-3'>
                                        <Label className="font-bold">{plano.tipo}
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
                            {plano.descricao.split(' - ').map((desc, index) => (
                                <div key={index} className="flex justify-left mb-2">
                                    <Check className="inline mr-2 text-green-500" />{desc}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            <Button size="lg" onClick={() => { handlerContinue(plano.id) }} className="w-full" disabled={!plano.checked}>Selecionar Plano</Button>
                        </CardFooter>
                    </Card>
                ))}

            </div>
        </div>
    )
}

