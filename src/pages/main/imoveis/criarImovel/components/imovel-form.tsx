import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ESTADOS } from '@/constants/estados'
import { ApiCep } from '@/interfaces/cep'
import { ImovelSchema } from '@/schemas/imovel.schema'
import api from '@/services/axios/api'
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form'
import { IMOVEL_FINALIDADE, IMOVEL_STATUS, IMOVEL_TIPO } from '../../constants/imovel'
import { PropertyImageUpload } from './multi-images-upload'
import { DocumentUpload } from './document-upload'
import { Textarea } from '@/components/ui/textarea'

export const ImovelFormRoot = ({
  children,
  createImovelMethods,
  onSubmitImovelData
}: {
  createImovelMethods: UseFormReturn<ImovelSchema>
  children: React.ReactNode
  onSubmitImovelData: (data: ImovelSchema) => void
}) => {
  return <form onSubmit={createImovelMethods.handleSubmit(onSubmitImovelData)}>{children}</form>
}

export const ImovelFormContent = ({
  createImovelMethods,
  disabled
}: {
  createImovelMethods: UseFormReturn<ImovelSchema>
  disabled?: boolean
}) => {
  console.log(createImovelMethods.formState.errors);
  console.log(createImovelMethods.formState.isDirty);
  console.log(createImovelMethods.formState.isValid);
  console.log(createImovelMethods.formState.dirtyFields);

  return (
    <>
      <FormProvider {...createImovelMethods}>
        <DocumentUpload disabled={disabled} downloadDocuments={true} />
        <PropertyImageUpload disabled={disabled} />
      </FormProvider>
      <div className="space-y-4 font-[Poppins-Regular]">
        <div className='mt-2'>
          <Label htmlFor="description">Descrição</Label>
          <Textarea placeholder="Descrição principal do imóvel " 
          {...createImovelMethods.register('description')}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label className='text-base font-[Poppins-Regular]'>
            CEP
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="CEP"
              {...createImovelMethods.register('cep', {
                onChange: async (e) => {
                  let cep = e.target.value?.replace(/\D/g, '') // Remove caracteres não numéricos
                  const cleanedCep = cep
                  // Formata o CEP para o formato '#####-###'
                  console.log('first cep', cep)
                  if (cep.length > 5) {
                    cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
                    createImovelMethods.setValue('cep', cep)
                  }
                  if (cep?.replace(/\D/g, '')?.length === 8) {
                    try {
                      console.log(cep)
                      const response = await api.get<ApiCep>(`cep/${cleanedCep}`)
                      const data = response.data

                      if (data) {
                        // Preenche os campos com os dados retornados
                        createImovelMethods.setValue('logradouro', data.logradouro || '')
                        createImovelMethods.setValue('bairro', data.bairro || '')
                        createImovelMethods.setValue('cidade', data.localidade || '')
                        createImovelMethods.setValue('estado', data.estado || '')
                      } else {
                        // Caso o CEP seja inválido
                        createImovelMethods.setError('cep', {
                          type: 'manual',
                          message: 'CEP inválido'
                        })
                      }
                    } catch (error) {
                      createImovelMethods.setError('cep', {
                        type: 'manual',
                        message: 'Erro ao buscar o CEP'
                      })
                    }
                  }
                }
              })}
              helperText={createImovelMethods.formState?.errors?.cep?.message}
            />
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label className='text-base font-[Poppins-Regular]'>
            Logradouro
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Logradouro"
              {...createImovelMethods.register('logradouro')}
              helperText={createImovelMethods.formState?.errors?.logradouro?.message}
            />
          </Label>

          <Label className='text-base font-[Poppins-Regular]'>
            Número
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Número"
              {...createImovelMethods.register('numero')}
              helperText={createImovelMethods.formState?.errors?.numero?.message}
            />
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label className='text-base font-[Poppins-Regular]'>
            Bairro
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Bairro"
              {...createImovelMethods.register('bairro')}
              helperText={createImovelMethods.formState?.errors?.bairro?.message}
            />
          </Label>
          <Label className='text-base font-[Poppins-Regular]'>
            Cidade
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Cidade"
              {...createImovelMethods.register('cidade')}
              helperText={createImovelMethods.formState?.errors?.cidade?.message}
            />
          </Label>

          <Label className='text-base font-[Poppins-Regular]'>
            Complemento
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Complemento"
              {...createImovelMethods.register('complemento')}
              helperText={createImovelMethods.formState?.errors?.complemento?.message}
            />
          </Label>
        </div>


        <div className='mt-2'>
          <Label className='text-base font-[Poppins-Regular]'>
            Estado
            <div className='mt-2'>
              <Controller
                name="estado"
                control={createImovelMethods.control}

                render={({ field }) => (
                  <Select
                    disabled={disabled}
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
              <span>{createImovelMethods?.formState?.errors?.estado?.message}</span>
            </div>
          </Label>
        </div>

        <div className='mt-2'>
          <Label className='text-base font-[Poppins-Regular]'>
            Status do imóvel
            <div className='mt-2'>
              <Controller
                name="status"
                control={createImovelMethods.control}
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    aria-label={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger value={field.value}>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMOVEL_STATUS.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {createImovelMethods?.formState?.errors?.status?.message}
              <span>{createImovelMethods?.formState?.errors?.status?.message}</span>
            </div>
          </Label>
        </div>

        <div className='mt-2'>
          <Label className='text-base font-[Poppins-Regular]'>
            Tipo do imóvel
            <div className='mt-2'>
              <Controller
                name="tipo"
                control={createImovelMethods.control}
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    aria-label={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger value={field.value}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMOVEL_TIPO.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {createImovelMethods?.formState?.errors?.tipo?.message}
              <span>{createImovelMethods?.formState?.errors?.tipo?.message}</span>
            </div>
          </Label>
        </div>

        <div className='mt-2'>
          <Label className='text-base font-[Poppins-Regular]'>
            Finalidade
            <div className='mt-2'>
              <Controller
                name="finalidade"
                control={createImovelMethods.control}
                render={({ field }) => (
                  <Select
                    disabled={disabled}
                    aria-label={field.value}
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger value={field.value}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMOVEL_FINALIDADE.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {createImovelMethods?.formState?.errors?.finalidade?.message}
              <span>{createImovelMethods?.formState?.errors?.finalidade?.message}</span>
            </div>
          </Label>
        </div>

        {/* VALORES */}
        <div className="flex justify-center font-[Poppins-ExtraLight]">
          <Label className='font-bold text-lg'>VALORES DO IMÓVEL</Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label className='text-base font-[Poppins-Regular]'>
            Taxa Administrativa
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Taxa Administrativa"
              {...createImovelMethods.register('porcentagem_lucro_imobiliaria')}
              helperText={
                createImovelMethods.formState?.errors?.porcentagem_lucro_imobiliaria?.message
              }
            />
          </Label>

        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* TODO: fix float values */}
          <Label className='text-base font-[Poppins-Regular]'>
            Aluguel
            <Label className='text-[0.7rem]'> (opcional)</Label>
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Valor do aluguel"
              {...createImovelMethods.register('valor_aluguel')}
              helperText={createImovelMethods.formState?.errors?.valor_aluguel?.message}
            />
          </Label>
          <Label className='text-base font-[Poppins-Regular]'>
            Venda
            <Label className='text-[0.7rem]'> (opcional)</Label>
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Valor de venda"
              {...createImovelMethods.register('valor_venda')}
              helperText={createImovelMethods.formState?.errors?.valor_venda?.message}
            />
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label className='text-base font-[Poppins-Regular]'>
            Água
            <Label className='text-[0.7rem]'> (opcional)</Label>
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Valor da água"
              {...createImovelMethods.register('valor_agua')}
              helperText={createImovelMethods.formState?.errors?.valor_agua?.message}
            />
          </Label>
          <Label className='text-base font-[Poppins-Regular]'>
            Taxa de lixo
            <Label className='text-[0.7rem]'> (opcional)</Label>
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Valor da taxa de lixo"
              {...createImovelMethods.register('valor_taxa_lixo')}
              helperText={createImovelMethods.formState?.errors?.valor_taxa_lixo?.message}
            />
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label className='text-base font-[Poppins-Regular]'>
            Condomínio
            <Label className='text-[0.7rem]'> (opcional)</Label>
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Valor do condomínio"
              {...createImovelMethods.register('valor_condominio')}
              helperText={createImovelMethods.formState?.errors?.valor_condominio?.message}
            />
          </Label>
          <Label className='text-base font-[Poppins-Regular]'>
            IPTU
            <Label className='text-[0.7rem]'> (opcional)</Label>
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Valor do IPTU"
              {...createImovelMethods.register('valor_iptu')}
              helperText={createImovelMethods.formState?.errors?.valor_iptu?.message}
            />
          </Label>
        </div>
      </div>
    </>
  )
}

export const ImovelFormSubmitButton = ({
  createImovelMethods,
  disabled
}: {
  createImovelMethods: UseFormReturn<ImovelSchema>
  disabled?: boolean
}) => {
  return (
    <div className="">
      <Button
        type="submit"
        className="mt-4"
        disabled={
          disabled ||
          !createImovelMethods.formState.isDirty ||
          !createImovelMethods.formState.isValid
        }
      >
        Salvar e Continuar
      </Button>
    </div>
  )
}

export const ImovelForm = {
  Root: ImovelFormRoot,
  FormContent: ImovelFormContent,
  SubmitButton: ImovelFormSubmitButton
}
