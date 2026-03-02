import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

//Bem vindo
export const Adesao = () => {
    const dataParams = useParams<{ email: string }>()
    const email = dataParams.email ? dataParams.email : '';

    const navigate = useNavigate()


    useEffect(() => {
    }, [])

    // Event Handlers
    const handlerContinue = () => {
        navigate(`/planos/${email}`);
    }

    return (
        <div className="container mx-auto space-y-6 p-4 font-[Poppins-regular]">
            {/* Search & Filters */}
            {/* <div className="grid grid-cols-2 flex flex-col justify-end items-start gap-4 sm:flex-row sm:items-center"> */}
            <div className='grid grid-cols-2'>
                <h1 className='flex justify-start font-bold m-3 text-center'></h1>
                <h1 className='flex justify-end m-3 text-center'>Etapa 1 de 4</h1>
            </div>

            <div className="flex font-bold justify-center m-3 text-center">
                <h1 className=''>Bem Vindo(a) à nossa plataforma de gestão imobiliária!</h1>

            </div>
            <div className='m-3 text-gray-500 text-center' style={{ "fontSize": '0.9rem' }}>
                <div className="flex justify-center ">
                    <Check className="inline mr-2 text-green-500" /> Gestão completa de imóveis, locações e clientes.
                </div>
                <div className="flex justify-center ">
                    <Check className="inline mr-2 text-green-500" /> Acesso a relatórios detalhados e análises financeiras.
                </div>
                <div className="flex justify-center ">
                    <Check className="inline mr-2 text-green-500" /> Suporte dedicado para ajudar você a aproveitar ao máximo nossa plataforma.
                </div>
            </div>
            <div className="flex justify-center m-3 text-center ">
                <p>Selecione seu plano de pagamento mensal/anual/semestral</p>
            </div>

            <div className="flex justify-center m-3 text-center" style={{ "fontSize": '0.7rem' }}>
                <p className='border-b pb-5'>Economize a partir de 25% com o plano anual (comparado a 12 meses em um plano mensal).</p>
            </div>
            <div className="flex justify-center m-3 text-center" style={{ "fontSize": '0.7rem' }}>
                <p className='border-b pb-5'>Para novos assinantes, seus primeiros 7 dias são gratuitos, a menos que você tenha uma oferta alternativa. Renovação automática, exceto se cancelada.</p>
            </div>
            <div className="flex justify-center m-3 text-center" style={{ "fontSize": '0.7rem' }}>
                <p className='border-b pb-5'>Você pode cancelar seu plano a qualquer momento. Termos se aplicam.</p>
            </div>
            <div className="flex justify-center m-3" >
                <Button size="lg" onClick={handlerContinue}>Continuar</Button>
            </div>
        </div>
    )
}

