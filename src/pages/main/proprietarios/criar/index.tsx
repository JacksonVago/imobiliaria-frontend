import { Endereco } from '@/interfaces/endereco'
import { Imovel } from '@/interfaces/imovel'
import api from '@/services/axios/api'
import { useForm, UseFormReturn } from 'react-hook-form'

import { Card, CardContent } from '@/components/ui/card'
import { ROUTE } from '@/enums/routes.enum'
import { toast } from '@/hooks/use-toast'
import { Proprietario } from '@/interfaces/proprietario'
import { proprietarioSchema, ProprietarioSchema } from '@/schemas/proprietario.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ProprietarioForm } from '../components/proprietario-form'

export interface DefaultCadastroImovelFormProps {
  methods: UseFormReturn<any>
  onSubmit: (data: any) => void
}

interface CriarImovelData {
  nome: string
  endereco: Endereco
  valorAluguel: number
  valorAgua?: number
  valorCondominio?: number
  valorIptu?: number
  valorTaxaLixo?: number
}

export const postCriarImovel = async (data: CriarImovelData) => {
  return await api.post<Imovel>('/imoveis', data)
}

export interface CriarProprietarioData {
  nome: string
  documento: string
  email: string
  telefone: string
  imovelId?: string
  endereco: Endereco
  desvincularImoveisIds?: string[]
  vincularImoveisIds?: string[]
}

export const postCriarProprietario = async (formData: FormData) => {
  return await api.post<Proprietario>('/proprietarios', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

//IMPROVE: move to constants file
const PROPRIETARIO_KNOWN_ERRORS = ['Documento já cadastrado']

//TODO: create a interface for created imovel

export const CriarProprietario = () => {
  const navigate = useNavigate()

  const proprietarioMethods = useForm<ProprietarioSchema>({
    resolver: zodResolver(proprietarioSchema),
    defaultValues: {},
    mode: 'all'
  })

  const createProprietarioMutation = useMutation({
    mutationFn: (data: FormData) => postCriarProprietario(data),
    onError: (error) => {
      if (PROPRIETARIO_KNOWN_ERRORS.includes(error?.message)) {
        toast({
          title: 'Erro ao criar proprietário',
          description: 'Já existe um proprietário com este documento!'
        })
      }

      //TODO: we can search for the already existing proprietario. and show a dialog to link it
    }
  })

  console.log('proprietario errors', proprietarioMethods.formState.errors)
  console.log('proprietario dirty', proprietarioMethods.formState.isDirty)

  const onSubmitProprietarioData = async (data: ProprietarioSchema) => {
    try {
      console.log(data)
      const form = new FormData()
      if (data.nome) {
        form.append('nome', data.nome)
      }
      if (data.documento) {
        form.append('documento', data.documento)
      }
      if (data.email) {
        form.append('email', data.email)
      }
      if (data.telefone) {
        form.append('telefone', data.telefone)
      }
      if (data.profissao) {
        form.append('profissao', data.profissao)
      }
      if (data.estadoCivil) {
        form.append('estadoCivil', data.estadoCivil)
      }
      if (data.logradouro) {
        form.append('logradouro', data.logradouro)
      }
      if (data.numero) {
        form.append('numero', data.numero.toString())
      }
      if (data.complemento) {
        form.append('complemento', data.complemento)
      }
      if (data.bairro) {
        form.append('bairro', data.bairro)
      }
      if (data.cidade) {
        form.append('cidade', data.cidade)
      }
      if (data.cep) {
        form.append('cep', data.cep)
      }
      if (data.estado) {
        form.append('estado', data.estado)
      }
      if (data.documentos) {
        data.documentos.forEach((doc) => {
          form.append('documentos', doc.file)
        })
      }

      // const array = [imovelId ? imovelId : '']

      // array?.forEach((id) => {
      //   form.append('vincularImoveisIds[]', id.toString()) // Crucial!
      // })

      const { data: proprietarioData } = await createProprietarioMutation.mutateAsync(form)

      //After create and link the proprietario to imovel, we should clear the form and reset its state
      toast({ title: 'Proprietário criado com sucesso' })
      //  navigate('/main/proprietarios')
      navigate(ROUTE.PROPRIETARIOS + '/' + proprietarioData?.id)
    } catch (error) {
      //TODO: verify type of error
      toast({
        title: 'Erro ao criar proprietário',
        description: 'Não foi possível criar o proprietário, tente novamente'
      })
    }
  }

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4">
      <Card>
        <CardContent>
          <ProprietarioForm.Root
            proprietarioMethods={proprietarioMethods}
            onSubmitProprietarioData={onSubmitProprietarioData}
          >
            <h2 className="mb-4 mt-8 text-xl font-bold">Criar um novo proprietário</h2>
            <ProprietarioForm.FormContent proprietarioMethods={proprietarioMethods} />
            <ProprietarioForm.SubmitButton proprietarioMethods={proprietarioMethods} />
          </ProprietarioForm.Root>
        </CardContent>
      </Card>
    </div>
  )
}
