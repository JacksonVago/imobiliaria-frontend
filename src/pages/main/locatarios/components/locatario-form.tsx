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
import { ESTADO_CIVIL_OPTIONS } from '@/constants/estado-civil'
import { ESTADOS } from '@/constants/estados'
import { ApiCep } from '@/interfaces/cep'
import { LocatarioSchema } from '@/schemas/locatario.schema'
import api from '@/services/axios/api'
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form'
import { DocumentUpload } from '../../imoveis/criarImovel/components/document-upload'

export const LocatarioFormRoot = ({
  children,
  createLocatarioMethods,
  onSubmitLocatarioData
}: {
  createLocatarioMethods: UseFormReturn<LocatarioSchema>
  children: React.ReactNode
  onSubmitLocatarioData: (data: LocatarioSchema) => void
}) => {
  return (
    <form onSubmit={createLocatarioMethods.handleSubmit(onSubmitLocatarioData)}>{children}</form>
  )
}

export const LocatarioFormContent = ({
  createLocatarioMethods,
  disabled
}: {
  createLocatarioMethods: UseFormReturn<LocatarioSchema>
  disabled?: boolean
}) => {
  return (
    <>
      <FormProvider {...createLocatarioMethods}>
        <DocumentUpload disabled={disabled} />
      </FormProvider>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Label>
            Nome
            <Input
              type="text"
              disabled={disabled}
              placeholder="Nome completo"
              {...createLocatarioMethods.register('nome')}
              helperText={createLocatarioMethods.formState?.errors?.nome?.message}
            />
          </Label>
          <Label>
            Email
            <Input
              type="email"
              disabled={disabled}
              placeholder="Email"
              {...createLocatarioMethods.register('email')}
              helperText={createLocatarioMethods.formState?.errors?.email?.message}
            />
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label>
            Documento
            <Input
              type="text"
              disabled={disabled}
              placeholder="CPF ou CNPJ"
              {...createLocatarioMethods.register('documento')}
              helperText={createLocatarioMethods.formState?.errors?.documento?.message}
            />
          </Label>

          <Label>
            Telefone
            <Input
              type="tel"
              disabled={disabled}
              placeholder="Telefone"
              {...createLocatarioMethods.register('telefone')}
              helperText={createLocatarioMethods.formState?.errors?.telefone?.message}
            />
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label>
            Estado
            <Controller
              name="estadoCivil"
              control={createLocatarioMethods.control}
              render={({ field }) => (
                <Select
                  disabled={disabled}
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
            {!!createLocatarioMethods?.formState?.errors?.estado?.message && (
              <span>{createLocatarioMethods?.formState?.errors?.estado?.message}</span>
            )}
          </Label>
          <Label>
            Profissão
            <Input
              type="string"
              disabled={disabled}
              placeholder="Profissão"
              {...createLocatarioMethods.register('profissao')}
              helperText={createLocatarioMethods.formState?.errors?.profissao?.message}
            />
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label>
            Logradouro
            <Input
              type="text"
              disabled={disabled}
              placeholder="Logradouro"
              {...createLocatarioMethods.register('logradouro')}
              helperText={createLocatarioMethods.formState?.errors?.logradouro?.message}
            />
          </Label>
          <Label>
            Número
            <Input
              type="text"
              disabled={disabled}
              placeholder="Número"
              {...createLocatarioMethods.register('numero')}
              helperText={createLocatarioMethods.formState?.errors?.numero?.message}
            />
          </Label>
          <Label>
            Complemento
            <Input
              type="text"
              disabled={disabled}
              placeholder="Complemento"
              {...createLocatarioMethods.register('complemento')}
              helperText={createLocatarioMethods.formState?.errors?.complemento?.message}
            />
          </Label>
          <Label>
            Bairro
            <Input
              type="text"
              disabled={disabled}
              placeholder="Bairro"
              {...createLocatarioMethods.register('bairro')}
              helperText={createLocatarioMethods.formState?.errors?.bairro?.message}
            />
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label>
            Cidade
            <Input
              type="text"
              disabled={disabled}
              placeholder="Cidade"
              {...createLocatarioMethods.register('cidade')}
              helperText={createLocatarioMethods.formState?.errors?.cidade?.message}
            />
          </Label>
          <Label>
            CEP
            <Input
              type="text"
              disabled={disabled}
              placeholder="CEP"
              {...createLocatarioMethods.register('cep', {
                onChange: async (e) => {
                  let cep = e.target.value?.replace(/\D/g, '') // Remove caracteres não numéricos
                  const cleanedCep = cep
                  // Formata o CEP para o formato '#####-###'
                  console.log('first cep', cep)
                  if (cep.length > 5) {
                    cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
                    createLocatarioMethods.setValue('cep', cep)
                  }
                  if (cep?.replace(/\D/g, '')?.length === 8) {
                    try {
                      console.log(cep)
                      const response = await api.get<ApiCep>(`cep/${cleanedCep}`)
                      const data = response.data

                      if (data) {
                        // Preenche os campos com os dados retornados
                        createLocatarioMethods.setValue('logradouro', data.logradouro || '')
                        createLocatarioMethods.setValue('bairro', data.bairro || '')
                        createLocatarioMethods.setValue('cidade', data.localidade || '')
                        createLocatarioMethods.setValue('estado', data.estado || '')
                      } else {
                        // Caso o CEP seja inválido
                        createLocatarioMethods.setError('cep', {
                          type: 'manual',
                          message: 'CEP inválido'
                        })
                      }
                    } catch (error) {
                      createLocatarioMethods.setError('cep', {
                        type: 'manual',
                        message: 'Erro ao buscar o CEP'
                      })
                    }
                  }
                }
              })}
              helperText={createLocatarioMethods.formState?.errors?.cep?.message}
            />
          </Label>
        </div>
        <Label>
          Estado
          <Controller
            name="estado"
            control={createLocatarioMethods.control}
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
          {createLocatarioMethods.formState?.errors?.estado?.message && (
            <span>{createLocatarioMethods.formState?.errors?.estado?.message}</span>
          )}
        </Label>
      </div>
      {/* <h2 className="mb-4 text-xl font-semibold">informações de locação</h2> */}

      {/* data inicio and valor aluguel */}
      {/* <div className="grid grid-cols-2 gap-4">
        <Label>
          Data de início da locação
          <Input
            type="date"
            placeholder="Data de início"
            {...createLocatarioMethods.register('dataInicio')}
            helperText={createLocatarioMethods.formState?.errors?.dataInicio?.message}
          />
        </Label>

        <Label>
          Data de término da locação
          <Input
            type="date"
            placeholder="Data de término"
            {...createLocatarioMethods.register('dataFim')}
            helperText={createLocatarioMethods.formState?.errors?.dataFim?.message}
          />
        </Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Label>
          Dia de vencimento do pagamento
          <Input
            type="number"
            placeholder="Dia de vencimento"
            min={1}
            max={28}
            {...createLocatarioMethods.register('diaVencimentoPagamento')}
            helperText={createLocatarioMethods.formState?.errors?.diaVencimentoPagamento?.message}
          />
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Label>
          Escolha o tipo de garantia de locação
          <Controller
            name="garantiaLocacaoTipo"
            control={createLocatarioMethods.control}
            render={({ field }) => (
              <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de garantia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fiador">Fiador</SelectItem>
                  <SelectItem value="titulo-capitalizacao">Título de Capitalização</SelectItem>
                  <SelectItem value="seguro-fianca">Seguro Fiança</SelectItem>
                  <SelectItem value="deposito-calcao">Depósito Caução</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {createLocatarioMethods.formState?.errors?.garantiaLocacaoTipo?.message && (
            <span>{createLocatarioMethods.formState?.errors?.garantiaLocacaoTipo?.message}</span>
          )}
        </Label>

        {createLocatarioMethods.watch('garantiaLocacaoTipo') === 'fiador' && (
          <div className="grid grid-cols-2 gap-4">
            <Label>
              Nome do fiador
              <Input
                type="text"
                placeholder="Nome do fiador"
                {...createLocatarioMethods.register('fiadorNome')}
                helperText={createLocatarioMethods.formState?.errors?.fiadorNome?.message}
              />
            </Label>
            <Label>
              CPF do fiador
              <Input
                type="text"
                placeholder="CPF do fiador"
                {...createLocatarioMethods.register('fiadorDocumento')}
                helperText={createLocatarioMethods.formState?.errors?.fiadorDocumento?.message}
              />
            </Label>
          </div>
        )}

        {createLocatarioMethods.watch('garantiaLocacaoTipo') === 'titulo-capitalizacao' && (
          <div className="grid grid-cols-1 gap-4">
            <Label>
              Número do Título de Capitalização
              <Input
                type="text"
                placeholder="Número do Título"
                {...createLocatarioMethods.register('tituloCaptalizacaoNumero')}
                helperText={
                  createLocatarioMethods.formState?.errors?.tituloCaptalizacaoNumero?.message
                }
              />
            </Label>
          </div>
        )}

        {createLocatarioMethods.watch('garantiaLocacaoTipo') === 'seguro-fianca' && (
          <div className="grid grid-cols-1 gap-4">
            <Label>
              Número do Seguro Fiança
              <Input
                type="text"
                placeholder="Número do Seguro"
                {...createLocatarioMethods.register('seguroFiancaNumero')}
                helperText={createLocatarioMethods.formState?.errors?.seguroFiancaNumero?.message}
              />
            </Label>
          </div>
        )}

        {createLocatarioMethods.watch('garantiaLocacaoTipo') === 'deposito-calcao' && (
          <div className="grid grid-cols-2 gap-4">
            <Label>
              Valor do Depósito Caução
              <Input
                type="number"
                placeholder="Valor do Depósito"
                {...createLocatarioMethods.register('depositoCalcaoValor', {
                  valueAsNumber: true
                })}
                helperText={createLocatarioMethods.formState?.errors?.depositoCalcaoValor?.message}
              />
            </Label>
            <Label>
              Tipo de Depósito
              <Controller
                name="depositoCalcaoTipo"
                control={createLocatarioMethods.control}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de depósito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                      <SelectItem value="proprietario">Proprietário</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {createLocatarioMethods.formState?.errors?.depositoCalcaoTipo?.message && (
                <span>{createLocatarioMethods.formState?.errors?.depositoCalcaoTipo?.message}</span>
              )}
            </Label>
          </div>
        )}
      </div> */}
    </>
  )
}

export const LocatarioFormSubmitButton = ({
  createLocatarioMethods,
  disabled
}: {
  createLocatarioMethods: UseFormReturn<LocatarioSchema>
  disabled?: boolean
}) => {
  return (
    <div className='flex justify-end mt-4'>
      <Button
        type="submit"
        disabled={
          disabled ||
          !createLocatarioMethods.formState.isDirty ||
          !createLocatarioMethods.formState.isValid
        }
      >
        Finalizar Cadastro
      </Button>
    </div>
  )
}

export const LocatarioForm = {
  Root: LocatarioFormRoot,
  Content: LocatarioFormContent,
  SubmitButton: LocatarioFormSubmitButton
}

// ;<h2 className="mb-4 text-2xl font-bold">Locatário</h2>
