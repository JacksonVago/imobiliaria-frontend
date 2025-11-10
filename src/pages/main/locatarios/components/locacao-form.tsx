/*import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'*/
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
/*import { Input } from '@/components/ui/input'
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
import { ApiCep } from '@/interfaces/cep'*/
import { LocacaoSchema } from '@/schemas/locacao.schema'
//import { GarantiaLocacaoTypes } from '@/schemas/locatario.schema'
/*import api from '@/services/axios/api'
import { cleanDocument } from '@/utils/clean-number'
import { cleanPhoneNumber } from '@/utils/clean-phone'
import { FileUp } from 'lucide-react'
import { Controller, FieldErrors, FormProvider, UseFormReturn } from 'react-hook-form'
import { DocumentUpload } from '../../imoveis/criarImovel/components/document-upload'*/
import { UseFormReturn } from 'react-hook-form'
import { Card } from '@/components/ui/card'

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
  //titleDocuments,
  locacaoMethods,
  //disabled
}: {
  //titleDocuments?: string
  locacaoMethods: UseFormReturn<LocacaoSchema>
  //disabled?: boolean
}) => {
  const errors = locacaoMethods?.formState?.errors
  if (Object.keys(errors).length > 0) {
    console.error('formState errors:')
    console.error(errors)
  }
  console.log('locacaoMethods', locacaoMethods.getValues('garantiaLocacaoTipo'))
  /*const optionsRadio: GarantiaLocacaoTypes[] = [
    'fiador',
    'titulo-capitalizacao',
    'seguro-fianca',
    'deposito-calcao'
  ]*/

  console.log(locacaoMethods.getValues())
  return (
    <Form {...locacaoMethods}>
      <Card></Card>
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
