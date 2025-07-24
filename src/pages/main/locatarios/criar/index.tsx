import { Card, CardContent } from '@/components/ui/card'
import { ROUTE } from '@/enums/routes.enum'
import { toast } from '@/hooks/use-toast'
import { Locatario } from '@/interfaces/locatario'
import { locatarioSchema, LocatarioSchema } from '@/schemas/locatario.schema'
import api from '@/services/axios/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { LocatarioForm } from '../components/locatario-form'

export const CriarLocatario = () => {
  const navigate = useNavigate()

  const locatarioMethods = useForm<LocatarioSchema>({
    resolver: zodResolver(locatarioSchema),
    defaultValues: {},
    mode: 'all'
  })

  const createLocatarioMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.post<Locatario>('/locatarios', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    }
  })

  console.log('locatarioMethods errors', locatarioMethods.formState.errors)
  console.log('locatarioMethods dirtyFields', locatarioMethods.formState.isDirty)
  console.log('isvalid', locatarioMethods.formState.isValid)
  const onSubmitLocatarioData = async (data: LocatarioSchema) => {
    try {
      const form = new FormData()

      if (data?.nome) {
        form.append('nome', data.nome)
      }

      if (data?.documento) {
        form.append('documento', data.documento)
      }

      if (data?.email) {
        form.append('email', data.email)
      }

      if (data?.telefone) {
        form.append('telefone', data.telefone)
      }

      if (data?.profissao) {
        form.append('profissao', data.profissao)
      }

      if (data?.estadoCivil) {
        form.append('estadoCivil', data.estadoCivil)
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

      const newDocuments = data?.documentos?.filter((doc) => !doc.id)
      newDocuments?.forEach((doc) => {
        form.append('documentos', doc.file)
      })

      if (data?.documentosToDeleteIds?.length) {
        data.documentosToDeleteIds.forEach((docId) => {
          form.append('documentosToDeleteIds[]', docId.toString())
        })
      }

      const { data: locatarioData } = await createLocatarioMutation.mutateAsync(form)

      toast({
        title: 'Locatário criado com sucesso',
        description: `Locatário criado com sucesso`
      })

      navigate(ROUTE.LOCATARIOS + '/' + locatarioData?.id)
    } catch (error) {
      toast({
        title: 'Erro ao criar locatário',
        description: 'Não foi possível criar o locatário, tente novamente'
      })
    }
  }
  return (
    <div className="mx-auto max-w-screen-xl">
        <Card className='py-10'>
        <CardContent>
          <LocatarioForm.Root
            createLocatarioMethods={locatarioMethods}
            onSubmitLocatarioData={onSubmitLocatarioData}
          >
            <LocatarioForm.Content createLocatarioMethods={locatarioMethods} />
            <LocatarioForm.SubmitButton createLocatarioMethods={locatarioMethods} />
          </LocatarioForm.Root>
        </CardContent>
      </Card>
    </div>
  )
}
