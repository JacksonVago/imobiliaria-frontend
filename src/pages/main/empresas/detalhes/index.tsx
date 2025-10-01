//import { createClient } from '@supabase/supabase-js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import moment from "moment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ROUTE } from '@/enums/routes.enum'
import { toast } from '@/hooks/use-toast'
import api from '@/services/axios/api'
import { queryClient } from '@/services/react-query/query-client'
import { transformNullToUndefined } from '@/utils/transform-null-to-undefined'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {  Edit, Link2Off, Plus, Search, Trash2, X } from 'lucide-react'
import * as React from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { PessoaStatus } from '@/enums/pessoal/status-pesoa'
import { Imovel } from '@/interfaces/imovel'
import { DialogClose } from '@radix-ui/react-dialog'
import { useGlobalParams } from '@/globals/GlobalParams';
import { useMediaQuery } from 'react-responsive';
import { Empresa } from '@/interfaces/empresa'
import { empresaSchema, EmpresaSchema } from '@/schemas/empresa.schema'
import { EmpresaFormContent, EmpresaFormRoot } from '../components/empresa-form'

export const DetalhesEmpresaForm = () => {


  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = React.useState(false)
  const disabled = isEditingPersonalInfo

  //const navigate = useNavigate();
  const dataParams = useParams<{ id: string }>();
  const id = dataParams.id ? parseInt(dataParams.id) : undefined;
  //const params = useParams();
  
  //Globals
  const glb_params = useGlobalParams();

  console.log(id);
  const { data: empresa } = useQuery({
    queryKey: ['empresa', id],
    queryFn: async () => {
      const { data } = await api.get<Empresa>(`/empresas/${id}`)
      return data
    },
    enabled: !!id
  })

  const updateEmpresa = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.put<Empresa>(`/empresas/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      ;['cliente', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    }
  })

  const onSubmitEmpresaData = async (data: EmpresaSchema) => {
    try {
      const form = new FormData()

      if (data?.nome) {
        form.append('nome', data.nome)
      }

      if (data?.cnpj) {
        form.append('cnpj', data.cnpj)
      }

      if (data?.email) {
        form.append('email', data.email)
      }

      if (data?.telefone) {
        form.append('telefone', data.telefone)
      }

      if (data?.logradouro) {
        form.append('logradouro', data.logradouro)
      }

      if (data?.numero) {
        form.append('numero', data.numero.toString())
      }

      if (data?.complemento) {
        form.append('complemento', data.complemento)
      }

      if (data?.bairro) {
        form.append('bairro', data.bairro)
      }

      if (data?.cidade) {
        form.append('cidade', data.cidade)
      }

      if (data?.cep) {
        form.append('cep', data.cep)
      }

      if (data?.estado) {
        form.append('estado', data.estado)
      }

      if (data?.status) {
        form.append('status', data.status)
      }
      else {
        form.append('status', PessoaStatus.ATIVA)
      }


      await updateEmpresa.mutateAsync(form)

      toast({
        title: 'Empresa atualizado com sucesso',
        description: `Empresa atualizado com sucesso`

      })
    } catch (error) {
      toast({
        title: 'Erro ao atualizar empresa',
        description: 'Ocorreu um erro ao tentar atualizar a empresa. Tente novamente.'
      })
    }
  }

  //default values
  const enderecoData = transformNullToUndefined(empresa?.endereco || {})
  const defaultValues = React.useMemo(
    () => ({
      ...transformNullToUndefined(empresa || {}),
      logradouro: enderecoData?.logradouro,
      numero: enderecoData?.numero ? parseInt(enderecoData.numero) : undefined,
      complemento: enderecoData?.complemento,
      bairro: enderecoData?.bairro,
      cidade: enderecoData?.cidade,
      cep: enderecoData?.cep,
      estado: enderecoData?.estado,
    }),
    [empresa]
  )

  React.useEffect(() => {
    glb_params.updTitle_form('Clientes');
    if (empresa) empresaMethods.reset(defaultValues)
  }, [defaultValues])

  //react hook form

  const empresaMethods = useForm<EmpresaSchema>({
    resolver: zodResolver(empresaSchema),
    defaultValues,
    mode: 'onBlur'
  })

  React.useEffect(() => {
    if (empresa) {
      empresaMethods.reset(defaultValues) // seta os valores do formulário com os dados do proprietário
    }
  }, [id, empresa])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2 className="mb-4 mt-8 text-xl font-bold">Configurações</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditingPersonalInfo ? 'Cancelar' : 'Editar'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EmpresaFormRoot
          createEmpresaMethods={empresaMethods}
          onSubmitEmpresaData={onSubmitEmpresaData}
        >
          <EmpresaFormContent createEmpresaMethods={empresaMethods} disabled={!disabled} />
          <div className="mt-4">
            {disabled && (
              <Button
                className="w-full"
                disabled={
                  !empresaMethods.formState.isDirty || !empresaMethods.formState.isValid
                }
              >
                Salvar Alterações
              </Button>
            )}
          </div>
        </EmpresaFormRoot>
      </CardContent>
    </Card>
  )
}

export default function DetalhesEmpresa() {
  //const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isPortrait = useMediaQuery({ query: '(min-width: 1224px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 746px)' })
  //const isMobile = useMediaQuery({ query: '(min-width: 400px)' })

  const navigate = useNavigate()
  const dataParams = useParams<{ id: string }>();
  const id = dataParams.id ? parseInt(dataParams.id) : undefined;

  //Globals
  const glb_params = useGlobalParams();
  //const { pessoa, addPessoa, removePessoa, updatePessoa, resetStatePessoa } = usePessoa();

  const { data: empresa } = useQuery({
    queryKey: ['cliente', id],
    queryFn: async () => {
      const { data } = await api.get<Empresa>(`/empresas/${id}`)
      return data
    },
    enabled: !!id
  })

  //default values
  const enderecoData = transformNullToUndefined(empresa?.endereco || {})
  const defaultValues = React.useMemo(
    () => ({
      ...transformNullToUndefined(empresa || {}),
      logradouro: enderecoData?.logradouro,
      numero: enderecoData?.numero ? parseInt(enderecoData.numero) : undefined,
      complemento: enderecoData?.complemento,
      bairro: enderecoData?.bairro,
      cidade: enderecoData?.cidade,
      cep: enderecoData?.cep,
      estado: enderecoData?.estado,
    }),
    [empresa]
  )

  //react hook form
  const empresaMethods = useForm<EmpresaSchema>({
    resolver: zodResolver(empresaSchema),
    defaultValues,
    mode: 'onBlur'
  })

  React.useEffect(() => {
    if (empresa) {
      empresaMethods.reset(defaultValues) // seta os valores do formulário com os dados do proprietário
    }
  }, [id, empresa])


  return (
    <div className="container mx-auto space-y-6 p-4 font-[Poppins-regular]">
      <DetalhesEmpresaForm/>
    </div>
  )
}
