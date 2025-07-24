import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { LocacaoSchema } from '@/schemas/locacao.schema'
import { GarantiaLocacaoTypes } from '@/schemas/locatario.schema'
import api from '@/services/axios/api'
import { cleanDocument } from '@/utils/clean-number'
import { cleanPhoneNumber } from '@/utils/clean-phone'
import { FileUp } from 'lucide-react'
import { Controller, FieldErrors, FormProvider, UseFormReturn } from 'react-hook-form'
import { DocumentUpload } from '../../imoveis/criarImovel/components/document-upload'

export const LocacaoFormRoot = ({
  locacaoMethods,
  children,
  onSubmitLocacaoData
}: {
  locacaoMethods: UseFormReturn<LocacaoSchema>
  children: React.ReactNode
  onSubmitLocacaoData: (data: LocacaoSchema) => void
}) => {
  return <form onSubmit={locacaoMethods.handleSubmit(onSubmitLocacaoData)}>{children}</form>
}

export const LocacaoFormContent = ({
  titleDocuments,
  locacaoMethods,
  disabled
}: {
  titleDocuments?: string
  locacaoMethods: UseFormReturn<LocacaoSchema>
  disabled?: boolean
}) => {
  const errors = locacaoMethods?.formState?.errors
  if (Object.keys(errors).length > 0) {
    console.error('formState errors:')
    console.error(errors)
  }
  console.log('locacaoMethods', locacaoMethods.getValues('garantiaLocacaoTipo'))
  const optionsRadio: GarantiaLocacaoTypes[] = [
    'fiador',
    'titulo-capitalizacao',
    'seguro-fianca',
    'deposito-calcao'
  ]

  console.log(locacaoMethods.getValues())
  return (
    <Form {...locacaoMethods}>
      <RadioGroup
        defaultValue={optionsRadio[0]}
        className="grid grid-cols-2 gap-4"
        onValueChange={(value: GarantiaLocacaoTypes) => {
          locacaoMethods.setValue('garantiaLocacaoTipo', value)
        }}
      >
        {optionsRadio.map((option: GarantiaLocacaoTypes) => (
          <Label key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} className="h-4 w-4" />
            <label
              htmlFor={option}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option}
            </label>
          </Label>
        ))}
      </RadioGroup>
      <FormProvider {...locacaoMethods}>
        <DocumentUpload documentField="documentos" title={titleDocuments} disabled={disabled} />
      </FormProvider>
      <div className="gap-4">
        <div className="flex w-full justify-between gap-4">
          <Label htmlFor="dataInicio" className="w-full">
            Data de Início
            <Input
              className="w-full"
              id="dataInicio"
              type="date"
              {...locacaoMethods.register('dataInicio')}
            />
            {locacaoMethods.formState.errors.dataInicio && (
              <p className="text-sm text-red-500">
                {locacaoMethods.formState.errors.dataInicio.message}
              </p>
            )}
          </Label>
          <Label htmlFor="dataFim" className="w-full">
            Data de Fim
            <Input id="dataFim" type="date" {...locacaoMethods.register('dataFim')} />
          </Label>
        </div>
        <Label htmlFor="valor_aluguel">
          Valor do Aluguel
          <Input
            id="valor_aluguel"
            type="number"
            {...locacaoMethods.register('valor_aluguel', {
              valueAsNumber: true
            })}
          />
          {locacaoMethods.formState.errors.valor_aluguel && (
            <p className="text-sm text-red-500">
              {locacaoMethods.formState.errors.valor_aluguel.message}
            </p>
          )}
        </Label>
      </div>
      <div className="grid gap-4">
        <div className="flex flex-row gap-8"></div>
        <>
          <Accordion type="single" collapsible className="w-full">
            {/* Fiador */}
            <AccordionItem value="item-3">
              <AccordionTrigger type="button">
                {locacaoMethods.getValues('garantiaLocacaoTipo') === 'fiador' && 'Fiador'}

                {locacaoMethods.getValues('garantiaLocacaoTipo') === 'seguro-fianca' &&
                  'Seguro Fiança'}

                {locacaoMethods.getValues('garantiaLocacaoTipo') === 'deposito-calcao' &&
                  'Depósito Calção'}

                {locacaoMethods.getValues('garantiaLocacaoTipo') === 'titulo-capitalizacao' &&
                  'Título de Capitalização'}
              </AccordionTrigger>
              <AccordionContent className="px-2 py-4">
                {/* //escolher o tipo de garantia de locacao */}
                {locacaoMethods.watch('garantiaLocacaoTipo') === 'fiador' && (
                  <>
                    <FormProvider {...locacaoMethods}>
                      <DocumentUpload
                        title="Documentos do Fiador"
                        documentField="fiador.documentos"
                        disabled={disabled}
                      />
                    </FormProvider>
                    <div className="space-y-4">
                      <Label>
                        Nome
                        <Input
                          type="text"
                          disabled={disabled}
                          placeholder="Nome completo"
                          {...locacaoMethods.register('fiador.nome')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.nome?.message
                          }
                        />
                      </Label>
                      <Label>
                        CPF ou CNPJ
                        <Input
                          type="text"
                          disabled={disabled}
                          placeholder="CPF ou CNPJ"
                          {...locacaoMethods.register('fiador.documento', {
                            onChange: (e) => {
                              e.target.value = cleanDocument(e.target.value)
                            }
                          })}
                          // onBlur={() => searchForProprietarioByDocument(proprietarioFormDocument)}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.documento?.message
                          }
                        />
                      </Label>
                      <Label>
                        Email
                        <Input
                          type="email"
                          disabled={disabled}
                          placeholder="Email"
                          {...locacaoMethods.register('fiador.email')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.email?.message
                          }
                        />
                      </Label>
                      <Label>
                        Telefone
                        <Input
                          type="tel"
                          disabled={disabled}
                          placeholder="Telefone"
                          {...locacaoMethods.register('fiador.telefone', {
                            onChange: (e) => {
                              e.target.value = cleanPhoneNumber(e.target.value)
                            }
                          })}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.telefone?.message
                          }
                        />
                      </Label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Label>
                        Estado
                        <Controller
                          name="fiador.estadoCivil"
                          control={locacaoMethods.control}
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
                        {!!(
                          locacaoMethods.formState.errors as FieldErrors<
                            LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                          >
                        )?.fiador?.estado?.message && (
                          <span>
                            {
                              (
                                locacaoMethods.formState.errors as FieldErrors<
                                  LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                                >
                              )?.fiador?.estado?.message
                            }
                          </span>
                        )}
                      </Label>
                      <Label>
                        Profissão
                        <Input
                          type="string"
                          disabled={disabled}
                          placeholder="Profissão"
                          {...locacaoMethods.register('fiador.profissao')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.profissao?.message
                          }
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
                          {...locacaoMethods.register('fiador.logradouro')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.logradouro?.message
                          }
                        />
                      </Label>
                      <Label>
                        Número
                        <Input
                          type="text"
                          placeholder="Número"
                          disabled={disabled}
                          {...locacaoMethods.register('fiador.numero')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.numero?.message
                          }
                        />
                      </Label>
                      <Label>
                        Complemento
                        <Input
                          type="text"
                          disabled={disabled}
                          placeholder="Complemento"
                          {...locacaoMethods.register('fiador.complemento')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.complemento?.message
                          }
                        />
                      </Label>
                      <Label>
                        Bairro
                        <Input
                          type="text"
                          disabled={disabled}
                          placeholder="Bairro"
                          {...locacaoMethods.register('fiador.bairro')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.bairro?.message
                          }
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
                          {...locacaoMethods.register('fiador.cidade')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.cidade?.message
                          }
                        />
                      </Label>
                      <Label>
                        CEP
                        <Input
                          type="text"
                          disabled={disabled}
                          placeholder="CEP"
                          {...locacaoMethods.register('fiador.cep', {
                            onChange: async (e) => {
                              let cep = e.target.value?.replace(/\D/g, '') // Remove caracteres não numéricos
                              const cleanedCep = cep
                              // Formata o CEP para o formato '#####-###'
                              console.log('first cep', cep)
                              if (cep.length > 5) {
                                cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
                                locacaoMethods.setValue('fiador.cep', cep)
                              }
                              if (cep?.replace(/\D/g, '')?.length === 8) {
                                try {
                                  console.log(cep)
                                  const response = await api.get<ApiCep>(`cep/${cleanedCep}`)
                                  const data = response.data

                                  if (data) {
                                    // Preenche os campos com os dados retornados
                                    locacaoMethods.setValue(
                                      'fiador.logradouro',
                                      data.logradouro || ''
                                    )
                                    locacaoMethods.setValue('fiador.bairro', data.bairro || '')
                                    locacaoMethods.setValue('fiador.cidade', data.localidade || '')
                                    locacaoMethods.setValue('fiador.estado', data.estado || '')
                                  } else {
                                    // Caso o CEP seja inválido
                                    locacaoMethods.setError('fiador.cep', {
                                      type: 'manual',
                                      message: 'CEP inválido'
                                    })
                                  }
                                } catch (error) {
                                  locacaoMethods.setError('fiador.cep', {
                                    type: 'manual',
                                    message: 'Erro ao buscar o CEP'
                                  })
                                }
                              }
                            }
                          })}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.cep?.message
                          }
                        />
                      </Label>
                    </div>
                    <Label>
                      Estado
                      <Controller
                        name="fiador.estado"
                        control={locacaoMethods.control}
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
                      {!!(
                        locacaoMethods.formState.errors as FieldErrors<
                          LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                        >
                      )?.fiador?.estado?.message && (
                        <span>
                          {
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'fiador' }
                              >
                            )?.fiador?.estado?.message
                          }
                        </span>
                      )}
                    </Label>
                  </>
                )}
                {locacaoMethods.watch('garantiaLocacaoTipo') === 'seguro-fianca' && (
                  <>
                    <FormProvider {...locacaoMethods}>
                      {/* numero do titulo  */}
                      <Label>
                        Número do contrato da seguradora
                        <Input
                          type="text"
                          disabled={disabled}
                          placeholder="Número do contrato da seguradora"
                          {...locacaoMethods.register('seguroFianca.numeroSeguro')}
                          helperText={
                            (
                              locacaoMethods.formState.errors as FieldErrors<
                                LocacaoSchema & { garantiaLocacaoTipo: 'seguro-fianca' }
                              >
                            )?.seguroFianca?.numeroSeguro?.message
                          }
                        />
                      </Label>
                      <DocumentUpload
                        title="Documentos do Seguro Fiança"
                        documentField="seguroFianca.documentos"
                        disabled={disabled}
                      />
                    </FormProvider>
                  </>
                )}
                {locacaoMethods.watch('garantiaLocacaoTipo') === 'deposito-calcao' && (
                  <>Deposito calcao</>
                )}
                {locacaoMethods.watch('garantiaLocacaoTipo') === 'titulo-capitalizacao' && (
                  <FormProvider {...locacaoMethods}>
                    {/* numero do titulo  */}
                    <Label>
                      Número do contrato da seguradora
                      <Input
                        type="text"
                        disabled={disabled}
                        placeholder="Número do contrato da seguradora"
                        {...locacaoMethods.register('tituloCapitalizacao.numeroTitulo')}
                        helperText={
                          (
                            locacaoMethods.formState.errors as FieldErrors<
                              LocacaoSchema & { garantiaLocacaoTipo: 'titulo-capitalizacao' }
                            >
                          )?.tituloCapitalizacao?.numeroTitulo?.message
                        }
                      />
                    </Label>
                    <DocumentUpload
                      title="Documentos do Seguro Fiança"
                      documentField="tituloCapitalizacao.documentos"
                      disabled={disabled}
                    />
                  </FormProvider>
                )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-1">
              <AccordionTrigger type="button">Aluguel</AccordionTrigger>
              <AccordionContent>
                <table className="min-w-full border-collapse border border-gray-300 text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                        Valor aluguel
                      </th>
                      <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                        Data
                      </th>
                      <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                        Comprovante
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { valor: 'R$ 1500,00', data: 'Janeiro 2024', status: 'Pendente' },
                      { valor: 'R$ 1550,00', data: 'Fevereiro 2024', status: 'Pendente' },
                      { valor: 'R$ 1600,00', data: 'Março 2024', status: 'Pendente' },
                      { valor: 'R$ 1650,00', data: 'Abril 2024', status: 'Pendente' },
                      { valor: 'R$ 1700,00', data: 'Maio 2024', status: 'Pendente' },
                      { valor: 'R$ 1750,00', data: 'Junho 2024', status: 'Pendente' },
                      { valor: 'R$ 1800,00', data: 'Julho 2024', status: 'Pendente' },
                      { valor: 'R$ 1850,00', data: 'Agosto 2024', status: 'Pendente' },
                      { valor: 'R$ 1900,00', data: 'Setembro 2024', status: 'Pendente' },
                      { valor: 'R$ 1950,00', data: 'Outubro 2024', status: 'Pendente' },
                      { valor: 'R$ 2000,00', data: 'Novembro 2024', status: 'Pendente' },
                      { valor: 'R$ 2050,00', data: 'Dezembro 2024', status: 'Pendente' }
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                        }
                      >
                        <td className="border border-gray-300 px-4 py-2">{item.valor}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.data}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.status}</td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <FileUp className="mr-2 h-4 w-4" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AccordionContent>
            </AccordionItem>
            {/* agua */}
            <AccordionItem value="item-2">
              <AccordionTrigger type="button">Água</AccordionTrigger>
              <AccordionContent>
                <table className="min-w-full border-collapse border border-gray-300 text-left text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                        Valor água
                      </th>
                      <th className="border border-gray-300 px-4 py-2 font-medium text-gray-700">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { valor: 'R$ 50,00', data: 'Janeiro 2024' },
                      { valor: 'R$ 50,00', data: 'Fevereiro 2024' },
                      { valor: 'R$ 50,00', data: 'Março 2024' }
                    ].map((item, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
                        }
                      >
                        <td className="border border-gray-300 px-4 py-2">{item.valor}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <form className="mt-4 flex flex-row items-center gap-8">
                  <Label htmlFor="valorAgua">
                    Valor
                    <Input id="valorAgua" type="number" placeholder="R$ 0,00" />
                  </Label>
                  <Label htmlFor="dataAgua">
                    Data
                    <Input id="dataAgua" type="date" />
                  </Label>
                  <Button type="submit" className="self-end">
                    Adicionar
                  </Button>
                </form>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
        {/* )} */}
      </div>
    </Form>
  )
}

export const LocacaoFormSubmit = ({
  disabled,
  locacaoMethods
}: {
  locacaoMethods: UseFormReturn<LocacaoSchema>
  disabled?: boolean
}) => {
  return (
    <div className="mt-4 flex justify-end">
      <Button
        type="submit"
        disabled={
          disabled || !locacaoMethods.formState.isDirty || !locacaoMethods.formState.isValid
        }
      >
        Finalizar Cadastro
      </Button>
    </div>
  )
}

export const LocacaoForm = {
  Root: LocacaoFormRoot,
  Content: LocacaoFormContent,
  SubmitButton: LocacaoFormSubmit
}
