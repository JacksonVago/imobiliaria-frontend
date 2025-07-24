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
import { IMOVEL_STATUS } from '../../constants/imovel'
import { PropertyImageUpload } from './multi-images-upload'

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
  return (
    <div className="space-y-4">
      <div>
        <FormProvider {...createImovelMethods}>
          <PropertyImageUpload disabled={disabled} />
        </FormProvider>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Label>
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

        <Label>
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
        <Label>
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
        <Label>
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

        <Label>
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
        <Label>
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

      <Label>
        Estado
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
      </Label>

      {/* VALORES */}
      <div className="flex justify-center">
        <Label className='font-bold'>VALORES DO IMÓVEL</Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Label>
          Valor da porcentagem da imobiliária
          <Input
          className="mt-2"
            type="number"
            disabled={disabled}
            placeholder="Valor do aluguel"
            {...createImovelMethods.register('porcentagem_lucro_imobiliaria')}
            helperText={
              createImovelMethods.formState?.errors?.porcentagem_lucro_imobiliaria?.message
            }
          />
        </Label>

        <Label>
          Status do imóvel
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
          {createImovelMethods?.formState?.errors?.estado?.message}
          <span>{createImovelMethods?.formState?.errors?.estado?.message}</span>
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* TODO: fix float values */}
        <Label>
          Valor do aluguel (opcional)
          <Input        
            className="mt-2"
            type="number"
            disabled={disabled}
            placeholder="Valor do aluguel"
            {...createImovelMethods.register('valor_aluguel')}
            helperText={createImovelMethods.formState?.errors?.valor_aluguel?.message}            
          />
        </Label>
        <Label>
          Valor de Venda (opcional)
          <Input
          className="mt-2"
            type="number"
            disabled={disabled}
            placeholder="Valor de venda"
            {...createImovelMethods.register('valorVenda')}
            helperText={createImovelMethods.formState?.errors?.valor_aluguel?.message}
          />
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Label>
          Valor da água (opcional)
          <Input
          className="mt-2"
            type="number"
            disabled={disabled}
            placeholder="Valor da água"
            {...createImovelMethods.register('valorAgua')}
            helperText={createImovelMethods.formState?.errors?.valorAgua?.message}
          />
        </Label>
        <Label>
          Valor da taxa de lixo (opcional)
          <Input
          className="mt-2"
            type="number"
            disabled={disabled}
            placeholder="Valor da taxa de lixo"
            {...createImovelMethods.register('valorTaxaLixo')}
            helperText={createImovelMethods.formState?.errors?.valorTaxaLixo?.message}
          />
        </Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Label>
          Valor do condomínio (opcional)
          <Input
          className="mt-2"
            type="number"
            disabled={disabled}
            placeholder="Valor do condomínio"
            {...createImovelMethods.register('valorCondominio')}
            helperText={createImovelMethods.formState?.errors?.valorCondominio?.message}
          />
        </Label>
        <Label>
          Valor do IPTU (opcional)
          <Input
          className="mt-2"
            type="number"
            disabled={disabled}
            placeholder="Valor do IPTU"
            {...createImovelMethods.register('valorIptu')}
            helperText={createImovelMethods.formState?.errors?.valorIptu?.message}
          />
        </Label>
      </div>
    </div>
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
