import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ESTADO_CIVIL_OPTIONS } from '@/constants/estado-civil'
import { ESTADOS } from '@/constants/estados'
import { ImovelStatus } from '@/enums/imovel/enums-imovel'
import { ROUTE } from '@/enums/routes.enum'
import { useToast } from '@/hooks/use-toast'
import { ApiCep } from '@/interfaces/cep'
import { Endereco } from '@/interfaces/endereco'
import { Imovel } from '@/interfaces/imovel'
import { Proprietario } from '@/interfaces/proprietario'
import { imovelSchema, ImovelSchema } from '@/schemas/imovel.schema'
import { LocatarioSchema } from '@/schemas/locatario.schema'
import { ProprietarioSchema, proprietarioSchema } from '@/schemas/proprietario.schema'
import api from '@/services/axios/api'
import { queryClient } from '@/services/react-query/query-client'
import { cleanDocument } from '@/utils/clean-number'
import { cleanPhoneNumber } from '@/utils/clean-phone'
import { hasValues } from '@/utils/has-valuest'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { useMutation, useQuery } from '@tanstack/react-query'
import { UserMinus } from 'lucide-react'
import * as React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import {
  ProprietarioCardPreviewHeader,
  ProprietarioCardPreviewInfoContent,
  ProprietarioCardPreviewRoot
} from '../../proprietarios/components/proprietario-card-preview'
import {
  findProprietarioByDocument,
  getImovel,
  linkProprietario,
  unlinkProprietario
} from '../requests'
import { DocumentUpload } from './components/document-upload'
import { ImovelForm } from './components/imovel-form'
import { ProprietarioSearch } from './components/owner-search'

export interface CriarLocatarioData extends LocatarioSchema {
  imovelId?: string
  valor_aluguel?: number
}

export const postCriarLocatario = async (data: CriarLocatarioData) => {
  return await api.post('/locatarios', data)
}

export interface CriarProprietarioData {
  nome: string
  documento: string
  email: string
  telefone: string
  vincularImoveisIds?: string[]
  desvincularImoveisIds?: string[]
  endereco: Endereco
}

export const postCriarProprietario = async (formData: FormData) => {
  return await api.post<Proprietario>('/proprietarios', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

type Step = {
  id: 'imovel' | 'proprietario' | 'locatario'
  title: string
  description: string
  icon: React.ElementType
}

// const steps: Step[] = [
//   {
//     id: 'imovel',
//     title: 'Imóvel',
//     description: 'Cadastre as informações do imóvel',
//     icon: Home
//   },
//   {
//     id: 'proprietario',
//     title: 'Proprietário',
//     description: 'Vincule o proprietário ao imóvel',
//     icon: User
//   },
//   {
//     id: 'locatario',
//     title: 'Locatário',
//     description: 'Vincule o locatário ao imóvel',
//     icon: Users
//   }
// ]

const IMOVEL_KNOWN_ERRORS = ['Imóvel já cadastrado']
//TODO: create a interface for created imovel

export const CriarImovel = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = React.useState<Step['id']>('imovel')
  //const [completedSteps, setCompletedSteps] = React.useState<Set<Step['id']>>(new Set())

  //TODO: create the created imovel state
  //======CREATE IMOVEL METHODS======
  const [createdImovel, setCreatedImovel] = React.useState<Imovel | undefined>()
  const imovelId = createdImovel?.id

  const { data: imovel } = useQuery({
    enabled: !!imovelId,
    queryKey: ['imovel', imovelId],
    queryFn: () => getImovel(imovelId!)
  })

  //by priority, react query imovel is the updated imovel data
  const imovelData = imovel || createdImovel

  const createImovelMethods = useForm<ImovelSchema>({
    resolver: zodResolver(imovelSchema),
    defaultValues: {
      status: ImovelStatus.DISPONIVEL,
      images: (imovelData?.imovelPhotos ? imovelData?.imovelPhotos : [])
    },
    mode: 'all'
  })

  const onSubmitImovelData = async (data: ImovelSchema) => {
    try {
      console.log(data);
      const form = new FormData()

      /*if (data.description) {
        form.append('description', data.description)
      }*/

      if (data.tipo) {
        form.append('tipo', data.tipo)
      }
      if (data.status) {
        form.append('status', data.status)
      }
      /*if (data.finalidade) {
        form.append('finalidade', data.finalidade)
      }*/
      if (hasValues(data.porcentagem_lucro_imobiliaria ? data.porcentagem_lucro_imobiliaria : "")) {
        form.append('porcentagem_lucro_imobiliaria', data.porcentagem_lucro_imobiliaria ? data.porcentagem_lucro_imobiliaria.toString() : "")
      }
      if (data.valor_aluguel) {
        form.append('valor_aluguel', data.valor_aluguel.toString())
      }
      if (data.valor_venda) {
        form.append('valor_venda', data.valor_venda.toString())
      }

      if (data.valor_agua) {
        form.append('valor_agua', data.valor_agua.toString())
      }

      if (data.valor_condominio) {
        form.append('valor_condominio', data.valor_condominio.toString())
      }

      if (data.valor_iptu) {
        form.append('valor_iptu', data.valor_iptu.toString())
      }

      if (data.valor_taxa_lixo) {
        form.append('valor_taxa_lixo', data.valor_taxa_lixo.toString())
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

      data?.images?.forEach((image: any) => {
        form.append('images', image.file)
      })

      //Jackson estava gravando duas vezes
      /*await api.post('imoveis', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })*/

      const response = await api.post('imoveis', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setCreatedImovel(response.data)
      //setCompletedSteps(new Set([currentStep]))
      setCurrentStep('proprietario')

      //

      toast({ title: 'Imóvel criado com sucesso' })
      navigate(`${ROUTE.IMOVEIS}/${response.data.id}`)

    } catch (error) {
      console.log(error);
      toast({
        title: 'Erro ao criar imóvel',
        description: 'Não foi possível criar o imóvel, tente novamente'
      })
    }
  }

  //======CREATE PROPRIETARIO METHODS======

  const createProprietarioMethods = useForm<ProprietarioSchema>({
    resolver: zodResolver(proprietarioSchema),
    defaultValues: {
      vincularImoveisIds: imovelId ? [imovelId.toString()] : undefined
    },
    mode: 'all'
  })

  const proprietarioFormDocument = createProprietarioMethods?.watch('documento')

  const [isCreateProprietarioOpen, setIsCreateProprietarioOpen] = React.useState(false)

  const [showLinkExistingProprietarioDialogOpen, setShowLinkExistingProprietarioDialogOpen] =
    React.useState(false)
  const [existingProprietarioByDocument, setExistingProprietarioByDocument] =
    React.useState<Proprietario>()

  const searchForProprietarioByDocument = async (document: string) => {
    try {
      const { data } = await findProprietarioByDocument(document)
      if (data) {
        setExistingProprietarioByDocument(data)
        setShowLinkExistingProprietarioDialogOpen(true)
      }
    } catch (error: any) {
      //if is 404, don't have a proprietario with this document
      if (error?.response?.status === 404) {
        return
      }
    }
  }

  const linkExistingProprietario = async () => {
    try {
      await linkProprietarioMutation.mutateAsync(existingProprietarioByDocument!.id)
    } catch (error) {
      toast({
        title: 'Erro ao vincular proprietário',
        description: 'Não foi possível vincular o proprietário, tente novamente'
      })
    } finally {
      setIsCreateProprietarioOpen(false)
      setExistingProprietarioByDocument(undefined)
    }
  }

  const createProprietarioMutation = useMutation({
    mutationFn: (data: FormData) => postCriarProprietario(data),
    onSuccess: async () => {
      //invalidate the imovel query to get the updated imovel data
      ;['imovel', imovelId].forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key]
        })
      })
    },
    onError: (error) => {
      //if (IMOVEL_KNOWN_ERRORS.includes(error?.response?.data?.message)) {
      if (IMOVEL_KNOWN_ERRORS.includes(error.message)) {
        toast({
          title: 'Erro ao criar proprietário',
          description: 'Já existe um proprietário com este documento!'
        })
      }

      //TODO: we can search for the already existing proprietario. and show a dialog to link it
    }
  })

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

      const array = [imovelId ? imovelId : '']

      array?.forEach((id) => {
        form.append('vincularImoveisIds[]', id.toString()) // Crucial!
      })

      await createProprietarioMutation.mutateAsync(form)

      //After create and link the proprietario to imovel, we should clear the form and reset its state
      toast({ title: 'Proprietário criado com sucesso' })
      createProprietarioMethods.reset()
      setIsCreateProprietarioOpen(false)
    } catch (error) {
      toast({
        title: 'Erro ao criar proprietário',
        description: 'Não foi possível criar o proprietário, tente novamente'
      })
    }
  }

  const handleSelectProprietario = async (proprietario: Proprietario) => {
    try {
      await linkProprietarioMutation.mutateAsync(proprietario.id)
      console.log('selecionou propritetario', proprietario)
    } catch (error) {
      toast({ title: 'Erro ao vincular proprietário', variant: 'destructive' })
    }
  }

  const linkProprietarioMutation = useMutation({
    mutationFn: (proprietarioId: number) => linkProprietario(imovelId!, proprietarioId),
    onSuccess: async () => {
      ;['imovel', imovelId].forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key]
        })
      })
      toast({ title: 'Proprietário vinculado com sucesso' })
    },
    onError: () => {
      toast({ title: 'Erro ao vincular proprietário', variant: 'destructive' })
    }
  })

  const unlinkProprietarioMutation = useMutation({
    mutationFn: (proprietarioId: number) => unlinkProprietario(imovelId!, proprietarioId),
    onSuccess: async () => {
      ;['imovel', imovelId].forEach((key) => {
        queryClient.invalidateQueries({
          queryKey: [key]
        })
      })
      toast({ title: 'Proprietário desvinculado com sucesso' })
    },
    onError: () => {
      toast({ title: 'Erro ao desvincular proprietário', variant: 'destructive' })
    }
  })

  // // ======CREATE LOCATARIO METHODS======

  // const createLocatarioMethods = useForm<LocatarioSchema>({
  //   resolver: zodResolver(locatarioSchema),
  //   defaultValues: {},
  //   mode: 'all'
  // })

  // const [garantiaLocacaoTipo, setGarantiaLocacaoTipo] = React.useState<
  //   'fiador' | 'titulo-capitalizacao' | 'seguro-fianca' | 'deposito-calcao'
  // >('fiador')

  // const onSubmitLocatarioData = async (data: LocatarioSchema) => {
  //   try {
  //     alert('submit')
  //   } catch (error) {
  //     toast({
  //       title: 'Erro ao criar locatário',
  //       description: 'Não foi possível criar o locatário, tente novamente'
  //     })
  //   }
  // }

  // const methods = useForm<
  //   // Dynamically determine the type based on currentStep
  //   typeof currentStep extends 'imovel'
  //     ? ImovelSchema
  //     : typeof currentStep extends 'proprietario'
  //       ? ProprietarioSchema
  //       : LocatarioSchema
  // >({
  //   resolver: zodResolver(
  //     currentStep === 'imovel'
  //       ? imovelSchema
  //       : currentStep === 'proprietario'
  //         ? proprietarioSchema
  //         : locatarioSchema
  //   ),
  //   defaultValues: {},
  //   mode: 'onBlur'
  // })

  // const documentProprietario =
  //   currentStep == 'proprietario' ? methods.watch('documento') : undefined
  // //when the document is changed we should check if the document already exists

  // const handleSubmit = async (data: any) => {
  //   if (currentStep === 'locatario') {
  //     try {
  //       await postCriarLocatario({
  //         documento: data.documento,
  //         email: data.email,
  //         nome: data.nome,
  //         telefone: data.telefone,
  //         dataInicio: data.dataInicio,
  //         valor_aluguel: imovelData?.valor_aluguel,
  //         imovelId: imovelData?.id,
  //         endereco: {
  //           bairro: data.endereco.bairro,
  //           cep: data.endereco.cep,
  //           cidade: data.endereco.cidade,
  //           estado: data.endereco.estado,
  //           logradouro: data.endereco.logradouro,
  //           numero: data.endereco.numero
  //         }
  //       })
  //       setCompletedSteps(new Set([currentStep]))
  //       //When register we should redirect to the created imovel page
  //       navigate(ROUTE.IMOVEIS)
  //     } catch (error) {
  //       toast({
  //         title: 'Erro ao criar locatário',
  //         description: 'Não foi possível criar o locatário, tente novamente'
  //       })
  //     }
  //   }
  // }

  return (
    <div className="scale mx-auto flex max-w-screen-xl transform flex-col items-center px-4 transition-transform">
      <div className="mb-8 flex w-full items-center justify-between">
        {/* {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2',
                  currentStep === step.id && 'border-primary bg-primary text-primary-foreground',
                  completedSteps.has(step.id) &&
                    'border-primary bg-primary text-primary-foreground',
                  !completedSteps.has(step.id) && currentStep !== step.id && 'border-muted'
                )}
              >
                {completedSteps.has(step.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className="text-sm font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && <ArrowRight className="h-5 w-5 text-muted-foreground" />}
          </React.Fragment>
        ))} */}
      </div>
      <div className="mx-auto w-full rounded-md">
        <Card>
          {/* <div className="flex  justify-end">
          <Button className='w-8 h-8 rounded-full bg-transparent text-black bg-zinc-200 hover:bg-zinc-400'>X</Button>
          </div>
          <div className="flex  justify-end">
            <Button className="btn btn-change rounded-full bg-transparent">
              <div className="flex  justify-center">
                <span className="w-5 h-5 bg-red-500 rounded-full">X</span>
              </div>
            </Button>
          </div> */}
          <CardContent>
            <h2 className="mb-4 mt-8 text-xl font-bold">Criar um novo imovel</h2>

            {/* ======imovel====== */}
            {currentStep === 'imovel' && (
              <ImovelForm.Root
                createImovelMethods={createImovelMethods}
                onSubmitImovelData={onSubmitImovelData}
              >
                <ImovelForm.FormContent
                  createImovelMethods={createImovelMethods}
                ></ImovelForm.FormContent>
                <ImovelForm.SubmitButton
                  createImovelMethods={createImovelMethods}
                ></ImovelForm.SubmitButton>
              </ImovelForm.Root>
            )}
            {/* ======proprietario====== */}
            {currentStep === 'proprietario' && (
              <div className="space-y-8">
                <h2 className="mb-4 text-xl font-bold">Vincular proprietários ao imovel</h2>

                <ProprietarioSearch
                  onSelect={handleSelectProprietario}
                  onCreateNew={() => {
                    // Reset the form to create a new owner
                    createProprietarioMethods.reset()
                  }}
                />

                <Button
                  onClick={() => {
                    if (isCreateProprietarioOpen) {
                      setIsCreateProprietarioOpen(false)
                      createProprietarioMethods.reset()
                    } else {
                      setIsCreateProprietarioOpen(true)
                    }
                  }}
                >
                  {isCreateProprietarioOpen
                    ? 'Cancelar'
                    : 'Criar novo proprietário e vincular ao imóvel'}
                </Button>

                {isCreateProprietarioOpen && (
                  <form onSubmit={createProprietarioMethods.handleSubmit(onSubmitProprietarioData)}>
                    <h2 className="mb-4 text-xl font-bold">
                      Criar um novo proprietário e vincula-lo ao imovel
                    </h2>
                    <FormProvider {...createProprietarioMethods}>
                      <DocumentUpload />
                    </FormProvider>
                    <div className="space-y-4">
                      <Label>
                        Nome
                        <Input
                          type="text"
                          placeholder="Nome completo"
                          {...createProprietarioMethods.register('nome')}
                          helperText={createProprietarioMethods.formState?.errors?.nome?.message}
                        />
                      </Label>
                      <Label>
                        CPF ou CNPJ
                        <Input
                          type="text"
                          placeholder="CPF ou CNPJ"
                          {...createProprietarioMethods.register('documento', {
                            onChange: (e) => {
                              e.target.value = cleanDocument(e.target.value)
                            }
                          })}
                          onBlur={() => searchForProprietarioByDocument(proprietarioFormDocument)}
                          helperText={
                            createProprietarioMethods.formState?.errors?.documento?.message
                          }
                        />
                      </Label>
                      <Label>
                        Email
                        <Input
                          type="email"
                          placeholder="Email"
                          {...createProprietarioMethods.register('email')}
                          helperText={createProprietarioMethods.formState?.errors?.email?.message}
                        />
                      </Label>
                      <Label>
                        Telefone
                        <Input
                          type="tel"
                          placeholder="Telefone"
                          {...createProprietarioMethods.register('telefone', {
                            onChange: (e) => {
                              e.target.value = cleanPhoneNumber(e.target.value)
                            }
                          })}
                          helperText={
                            createProprietarioMethods.formState?.errors?.telefone?.message
                          }
                        />
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Label>
                        Estado
                        <Controller
                          name="estadoCivil"
                          control={createProprietarioMethods.control}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => field.onChange(value)}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Estado civil" />
                              </SelectTrigger>
                              <SelectContent>
                                {ESTADO_CIVIL_OPTIONS.map((estadoCivil) => (
                                  <SelectItem key={estadoCivil.label} value={estadoCivil.value}>
                                    {estadoCivil.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {!!createProprietarioMethods?.formState?.errors?.estado?.message && (
                          <span>
                            {createProprietarioMethods?.formState?.errors?.estado?.message}
                          </span>
                        )}
                      </Label>
                      <Label>
                        Profissão
                        <Input
                          type="string"
                          placeholder="Profissão"
                          {...createProprietarioMethods.register('profissao')}
                          helperText={
                            createProprietarioMethods.formState?.errors?.profissao?.message
                          }
                        />
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Label>
                        Logradouro
                        <Input
                          type="text"
                          placeholder="Logradouro"
                          {...createProprietarioMethods.register('logradouro')}
                          helperText={
                            createProprietarioMethods.formState?.errors?.logradouro?.message
                          }
                        />
                      </Label>
                      <Label>
                        Número
                        <Input
                          type="text"
                          placeholder="Número"
                          {...createProprietarioMethods.register('numero')}
                          helperText={createProprietarioMethods.formState?.errors?.numero?.message}
                        />
                      </Label>
                      <Label>
                        Complemento
                        <Input
                          type="text"
                          placeholder="Complemento"
                          {...createProprietarioMethods.register('complemento')}
                          helperText={
                            createProprietarioMethods.formState?.errors?.complemento?.message
                          }
                        />
                      </Label>
                      <Label>
                        Bairro
                        <Input
                          type="text"
                          placeholder="Bairro"
                          {...createProprietarioMethods.register('bairro')}
                          helperText={createProprietarioMethods.formState?.errors?.bairro?.message}
                        />
                      </Label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Label>
                        Cidade
                        <Input
                          type="text"
                          placeholder="Cidade"
                          {...createProprietarioMethods.register('cidade')}
                          helperText={createProprietarioMethods.formState?.errors?.cidade?.message}
                        />
                      </Label>
                      <Label>
                        CEP
                        <Input
                          type="text"
                          placeholder="CEP"
                          {...createProprietarioMethods.register('cep', {
                            onChange: async (e) => {
                              let cep = e.target.value?.replace(/\D/g, '') // Remove caracteres não numéricos
                              const cleanedCep = cep
                              // Formata o CEP para o formato '#####-###'
                              console.log('first cep', cep)
                              if (cep.length > 5) {
                                cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
                                createProprietarioMethods.setValue('cep', cep)
                              }
                              if (cep?.replace(/\D/g, '')?.length === 8) {
                                try {
                                  console.log(cep)
                                  const response = await api.get<ApiCep>(`cep/${cleanedCep}`)
                                  const data = response.data

                                  //if (!data.erro) {
                                  if (data) {
                                    // Preenche os campos com os dados retornados
                                    createProprietarioMethods.setValue(
                                      'logradouro',
                                      data.logradouro || ''
                                    )
                                    createProprietarioMethods.setValue('bairro', data.bairro || '')
                                    createProprietarioMethods.setValue(
                                      'cidade',
                                      data.localidade || ''
                                    )
                                    createProprietarioMethods.setValue('estado', data.estado || '')
                                  } else {
                                    // Caso o CEP seja inválido
                                    createProprietarioMethods.setError('cep', {
                                      type: 'manual',
                                      message: 'CEP inválido'
                                    })
                                  }
                                } catch (error) {
                                  createProprietarioMethods.setError('cep', {
                                    type: 'manual',
                                    message: 'Erro ao buscar o CEP'
                                  })
                                }
                              }
                            }
                          })}
                          helperText={createProprietarioMethods.formState?.errors?.cep?.message}
                        />
                      </Label>
                    </div>
                    <Label>
                      Estado
                      <Controller
                        name="estado"
                        control={createProprietarioMethods.control}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o estado" />
                            </SelectTrigger>
                            <SelectContent>
                              {ESTADOS.map((estado) => (
                                <SelectItem key={estado.sigla} value={estado.sigla}>
                                  {estado.nome}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {!!createProprietarioMethods?.formState?.errors?.estado?.message && (
                        <span>{createProprietarioMethods?.formState?.errors?.estado?.message}</span>
                      )}
                    </Label>
                    <div className="mt-4 flex flex-row justify-between">
                      <Button
                        disabled={
                          !createProprietarioMethods.formState.isValid ||
                          !createProprietarioMethods.formState.isDirty
                        }
                        type="submit"
                        className=""
                      >
                        Criar e vincular proprietário
                      </Button>
                    </div>
                    <AlertDialog
                      open={showLinkExistingProprietarioDialogOpen}
                      onOpenChange={setShowLinkExistingProprietarioDialogOpen}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Proprietário Encontrado</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="space-y-3">
                              <div>
                                Deseja vincular este proprietário ao imóvel? Sinta-se a vontade para
                                verificar os dados, você também pode cadastrar um novo proprietário.
                                <ProprietarioCardPreviewRoot>
                                  <ProprietarioCardPreviewHeader
                                    classname="px-0"
                                    proprietario={existingProprietarioByDocument!}
                                  />
                                  <ProprietarioCardPreviewInfoContent
                                    classname="px-0"
                                    proprietario={existingProprietarioByDocument!}
                                  />
                                </ProprietarioCardPreviewRoot>
                              </div>

                              <div>
                                <Link
                                  to={`/proprietarios/${existingProprietarioByDocument?.id}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Button variant="outline" type="button">
                                    Ver Detalhes
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={linkExistingProprietario}>
                            Vincular Proprietário
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </form>
                )}
                {/* Proprietarios vinculados */}
                <div>
                  <h4 className="mb-2 font-semibold">Proprietários Vinculados</h4>
                  <ScrollArea className="h-[200px]">
                    {imovelData?.proprietarios?.map((proprietario) => (
                      <div key={proprietario.id} className="flex items-center justify-between p-2">
                        <span>{proprietario.pessoa?.nome}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => unlinkProprietarioMutation.mutate(proprietario.id)}
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Desvincular
                        </Button>
                      </div>
                    ))}

                    {!imovelData?.proprietarios?.length && (
                      <div className="flex h-full items-center justify-center">
                        <span>Nenhum proprietário vinculado</span>
                      </div>
                    )}
                  </ScrollArea>
                </div>

                <Button
                  type="button"
                  className=""
                  onClick={() => {
                    //setCompletedSteps(new Set([currentStep]))
                    setCurrentStep('locatario')
                  }}
                >
                  Próxima etapa
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// const IconButton = () => {
//   return (
//     <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-black drop-shadow-sm transition-colors duration-150 hover:bg-gray-200">
//       <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
//         <path
//           d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
//           clip-rule="evenodd"
//           fill-rule="evenodd"
//         ></path>
//       </svg>
//     </button>
//   );
// };