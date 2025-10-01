
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
import api from '@/services/axios/api'
import { Controller, UseFormReturn } from 'react-hook-form'
import { EmpresaSchema } from '@/schemas/empresa.schema'
import { formatCpfCnpj } from '@/utils/format-cpfcnpj'
import { Switch, Thumb } from "@radix-ui/react-switch"

export const EmpresaFormRoot = ({
  children,
  createEmpresaMethods,
  onSubmitEmpresaData
}: {
  createEmpresaMethods: UseFormReturn<EmpresaSchema>
  children: React.ReactNode
  onSubmitEmpresaData: (data: EmpresaSchema) => void
}) => {
  return (
    <form onSubmit={createEmpresaMethods.handleSubmit(onSubmitEmpresaData)}>{children}</form>
  )
}

export const EmpresaFormContent = ({
  createEmpresaMethods,
  disabled
}: {
  createEmpresaMethods: UseFormReturn<EmpresaSchema>
  disabled?: boolean
}) => {
  return (
    <>
      <div className="space-y-4 font-[Poppins-Regular]">
        <div className="grid grid-cols-2 gap-4">
          <Label className="text-base">
            Nome
            <Input
              className="mt-1"
              type="text"
              disabled={disabled}
              placeholder="Nome completo"
              {...createEmpresaMethods.register('nome')}
              helperText={createEmpresaMethods.formState?.errors?.nome?.message}
            />
          </Label>
          <Label className="text-base">
            CPF/CNPJ
            <Input
              className="mt-1"
              type="text"
              disabled={disabled}
              placeholder="Cpf/Cnpj"
              {...createEmpresaMethods.register('nome', {
                onChange: async (e) => {
                  const { value } = e.target;
                  e.target.value = formatCpfCnpj(value);
                }
              })}
              helperText={createEmpresaMethods.formState?.errors?.nome?.message}
            />
          </Label>
          <Label className="text-base">
            Email
            <Input
              className="mt-1"
              type="email"
              disabled={disabled}
              placeholder="Email"
              {...createEmpresaMethods.register('email')}
              helperText={createEmpresaMethods.formState?.errors?.email?.message}
            />
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label className="text-base">
            Telefone
            <Input
              className="mt-2"
              type="tel"
              disabled={disabled}
              placeholder="Telefone"
              {...createEmpresaMethods.register('telefone')}
              helperText={createEmpresaMethods.formState?.errors?.telefone?.message}
            />
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label className="text-base">
            CEP
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="CEP"
              {...createEmpresaMethods.register('cep', {
                onChange: async (e) => {
                  let cep = e.target.value?.replace(/\D/g, '') // Remove caracteres não numéricos
                  const cleanedCep = cep
                  // Formata o CEP para o formato '#####-###'
                  if (cep.length > 5) {
                    cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
                    createEmpresaMethods.setValue('cep', cep)
                  }
                  if (cep?.replace(/\D/g, '')?.length === 8) {
                    try {
                      const response = await api.get<ApiCep>(`cep/${cleanedCep}`)
                      const data = response.data

                      if (data) {
                        // Preenche os campos com os dados retornados
                        createEmpresaMethods.setValue('logradouro', data.logradouro || '')
                        createEmpresaMethods.setValue('bairro', data.bairro || '')
                        createEmpresaMethods.setValue('cidade', data.localidade || '')
                        createEmpresaMethods.setValue('estado', data.estado || '')
                      } else {
                        // Caso o CEP seja inválido
                        createEmpresaMethods.setError('cep', {
                          type: 'manual',
                          message: 'CEP inválido'
                        })
                      }
                    } catch (error) {
                      createEmpresaMethods.setError('cep', {
                        type: 'manual',
                        message: 'Erro ao buscar o CEP'
                      })
                    }
                  }
                }
              })}
              helperText={createEmpresaMethods.formState?.errors?.cep?.message}
            />
          </Label>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Label className="text-base">
            Logradouro
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Logradouro"
              {...createEmpresaMethods.register('logradouro')}
              helperText={createEmpresaMethods.formState?.errors?.logradouro?.message}
            />
          </Label>

        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label className="text-base">
            Número
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Número"
              {...createEmpresaMethods.register('numero')}
              helperText={createEmpresaMethods.formState?.errors?.numero?.message}
            />
          </Label>
          <Label className="text-base">
            Complemento
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Complemento"
              {...createEmpresaMethods.register('complemento')}
              helperText={createEmpresaMethods.formState?.errors?.complemento?.message}
            />
          </Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Label className="text-base">
            Bairro
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Bairro"
              {...createEmpresaMethods.register('bairro')}
              helperText={createEmpresaMethods.formState?.errors?.bairro?.message}
            />
          </Label>
          <Label className="text-base">
            Cidade
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Cidade"
              {...createEmpresaMethods.register('cidade')}
              helperText={createEmpresaMethods.formState?.errors?.cidade?.message}
            />
          </Label>
        </div>

        <div className='mt-2'>
          <Label className="text-base">
            Estado
            <div className='mt-2'>
              <Controller
                name="estado"
                control={createEmpresaMethods.control}
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
              {createEmpresaMethods.formState?.errors?.estado?.message && (
                <span>{createEmpresaMethods.formState?.errors?.estado?.message}</span>
              )}
            </div>
          </Label>
        </div>

        <div className="flex justify-center font-[Poppins-ExtraLight]">
          <Label className='font-bold text-lg'>ALERTAS</Label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Label className="text-base">
            Reajuste de Locação
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Dias"
              {...createEmpresaMethods.register('avisosReajusteLocacao')}
              helperText={createEmpresaMethods.formState?.errors?.avisosReajusteLocacao?.message}
            />
          </Label>
          <Label className="text-base">
            Renovação de Contrato
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Dias"
              {...createEmpresaMethods.register('avisosRenovacaoContrato')}
              helperText={createEmpresaMethods.formState?.errors?.avisosRenovacaoContrato?.message}
            />
          </Label>
          <Label className="text-base">
            Seguro Fiança
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Dias"
              {...createEmpresaMethods.register('avisosSeguroFianca')}
              helperText={createEmpresaMethods.formState?.errors?.avisosSeguroFianca?.message}
            />
          </Label>
          <Label className="text-base">
            Seguro Incêndio
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Dias"
              {...createEmpresaMethods.register('avisosSeguroIncendio')}
              helperText={createEmpresaMethods.formState?.errors?.avisosSeguroIncendio?.message}
            />
          </Label>
          <Label className="text-base">
            Titulo de Capitalização
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Dias"
              {...createEmpresaMethods.register('avisosTituloCapitalizacao')}
              helperText={createEmpresaMethods.formState?.errors?.avisosTituloCapitalizacao?.message}
            />
          </Label>
          <Label className="text-base">
            Depósito Calcão
            <Input
              className="mt-2"
              type="text"
              disabled={disabled}
              placeholder="Dias"
              {...createEmpresaMethods.register('avisosDepositoCalcao')}
              helperText={createEmpresaMethods.formState?.errors?.avisosDepositoCalcao?.message}
            />
          </Label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Label className='col-span-2'>
            Porcentagem Comissão
            <Input
              className="mt-2"
              type="number"
              disabled={disabled}
              placeholder="Porcentagem comissão"
              {...createEmpresaMethods.register('porcentagemComissao')}
            />
            {createEmpresaMethods.formState.errors.porcentagemComissao?.message &&
              (<p className='mt-2' style={{ color: '#ed535d', fontSize: '0.8rem' }}>*
                {createEmpresaMethods.formState.errors.porcentagemComissao.message}
              </p>)}
          </Label>

        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <label
            className="Label"
            htmlFor="airplane-mode"
            style={{ paddingRight: 15 }}
          >
            Boletos
          </label>
          <Switch className="SwitchRoot focus:outline-none" id="airplane-mode"
            onCheckedChange={(checked) => { createEmpresaMethods.setValue("emiteBoleto", (checked ? "S" : "N")) }}>
            <Thumb className="SwitchThumb" />
          </Switch>
        </div>

        <div className="mt-2">
          <div style={{ 'display': createEmpresaMethods.getValues("emiteBoleto") === "S" ? "block" : "none" }}>
            <div className="grid grid-cols-2 gap-4">
              <Label className="text-base">
                Número
                <Input
                  className="mt-2"
                  type="text"
                  disabled={disabled}
                  placeholder="Número"
                  {...createEmpresaMethods.register('numero')}
                  helperText={createEmpresaMethods.formState?.errors?.numero?.message}
                />
              </Label>
              <Label className="text-base">
                Complemento
                <Input
                  className="mt-2"
                  type="text"
                  disabled={disabled}
                  placeholder="Complemento"
                  {...createEmpresaMethods.register('complemento')}
                  helperText={createEmpresaMethods.formState?.errors?.complemento?.message}
                />
              </Label>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export const EmpresaFormSubmitButton = ({
  createEmpresaMethods,
  disabled
}: {
  createEmpresaMethods: UseFormReturn<EmpresaSchema>
  disabled?: boolean
}) => {
  return (
    <div className='flex justify-end mt-4'>
      <Button
        type="submit"
        disabled={
          disabled ||
          !createEmpresaMethods.formState.isDirty ||
          !createEmpresaMethods.formState.isValid
        }
      >
        Finalizar Cadastro
      </Button>
    </div>
  )
}

export const EmpresaForm = {
  Root: EmpresaFormRoot,
  Content: EmpresaFormContent,
  SubmitButton: EmpresaFormSubmitButton
}

// ;<h2 className="mb-4 text-2xl font-bold">Locatário</h2>
