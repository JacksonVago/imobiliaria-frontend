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
import { cn } from '@/lib/utils'
import { ProprietarioSchema } from '@/schemas/proprietario.schema'
import api from '@/services/axios/api'
import { cleanDocument } from '@/utils/clean-number'
import { cleanPhoneNumber } from '@/utils/clean-phone'
import { Controller, FormProvider, UseFormReturn } from 'react-hook-form'
import { DocumentUpload } from '../../imoveis/criarImovel/components/document-upload'

export const ProprietarioFormRoot = ({
  children,
  className,
  onSubmitProprietarioData,
  proprietarioMethods
}: {
  children: React.ReactNode
  className?: string
  proprietarioMethods: UseFormReturn<ProprietarioSchema>
  onSubmitProprietarioData: (data: ProprietarioSchema) => void
}) => {
  return (
    <form
      className={cn(className)}
      onSubmit={proprietarioMethods.handleSubmit(onSubmitProprietarioData)}
    >
      {children}
    </form>
  )
}

export const ProprietarioFormContent = ({
  proprietarioMethods,
  disabled
}: {
  proprietarioMethods: UseFormReturn<ProprietarioSchema>
  disabled?: boolean
}) => {
  return (
    <>
      <FormProvider {...proprietarioMethods}>
        <DocumentUpload disabled={disabled} />
      </FormProvider>
      <div className="space-y-4">
        <Label>
          Nome
          <Input
            type="text"
            disabled={disabled}
            placeholder="Nome completo"
            {...proprietarioMethods.register('nome')}
            helperText={proprietarioMethods.formState?.errors?.nome?.message}
          />
        </Label>
        <Label>
          CPF ou CNPJ
          <Input
            type="text"
            disabled={disabled}
            placeholder="CPF ou CNPJ"
            {...proprietarioMethods.register('documento', {
              onChange: (e) => {
                e.target.value = cleanDocument(e.target.value)
              }
            })}
            // onBlur={() => searchForProprietarioByDocument(proprietarioFormDocument)}
            helperText={proprietarioMethods.formState?.errors?.documento?.message}
          />
        </Label>
        <Label>
          Email
          <Input
            type="email"
            disabled={disabled}
            placeholder="Email"
            {...proprietarioMethods.register('email')}
            helperText={proprietarioMethods.formState?.errors?.email?.message}
          />
        </Label>
        <Label>
          Telefone
          <Input
            type="tel"
            disabled={disabled}
            placeholder="Telefone"
            {...proprietarioMethods.register('telefone', {
              onChange: (e) => {
                e.target.value = cleanPhoneNumber(e.target.value)
              }
            })}
            helperText={proprietarioMethods.formState?.errors?.telefone?.message}
          />
        </Label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Label>
          Estado
          <Controller
            name="estadoCivil"
            control={proprietarioMethods.control}
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
          {!!proprietarioMethods?.formState?.errors?.estado?.message && (
            <span>{proprietarioMethods?.formState?.errors?.estado?.message}</span>
          )}
        </Label>
        <Label>
          Profissão
          <Input
            type="string"
            disabled={disabled}
            placeholder="Profissão"
            {...proprietarioMethods.register('profissao')}
            helperText={proprietarioMethods.formState?.errors?.profissao?.message}
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
            {...proprietarioMethods.register('logradouro')}
            helperText={proprietarioMethods.formState?.errors?.logradouro?.message}
          />
        </Label>
        <Label>
          Número
          <Input
            type="text"
            placeholder="Número"
            disabled={disabled}
            {...proprietarioMethods.register('numero')}
            helperText={proprietarioMethods.formState?.errors?.numero?.message}
          />
        </Label>
        <Label>
          Complemento
          <Input
            type="text"
            disabled={disabled}
            placeholder="Complemento"
            {...proprietarioMethods.register('complemento')}
            helperText={proprietarioMethods.formState?.errors?.complemento?.message}
          />
        </Label>
        <Label>
          Bairro
          <Input
            type="text"
            disabled={disabled}
            placeholder="Bairro"
            {...proprietarioMethods.register('bairro')}
            helperText={proprietarioMethods.formState?.errors?.bairro?.message}
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
            {...proprietarioMethods.register('cidade')}
            helperText={proprietarioMethods.formState?.errors?.cidade?.message}
          />
        </Label>
        <Label>
          CEP
          <Input
            type="text"
            disabled={disabled}
            placeholder="CEP"
            {...proprietarioMethods.register('cep', {
              onChange: async (e) => {
                let cep = e.target.value?.replace(/\D/g, '') // Remove caracteres não numéricos
                const cleanedCep = cep
                // Formata o CEP para o formato '#####-###'
                console.log('first cep', cep)
                if (cep.length > 5) {
                  cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
                  proprietarioMethods.setValue('cep', cep)
                }
                if (cep?.replace(/\D/g, '')?.length === 8) {
                  try {
                    console.log(cep)
                    const response = await api.get<ApiCep>(`cep/${cleanedCep}`)
                    const data = response.data

                    if (data) {
                      // Preenche os campos com os dados retornados
                      proprietarioMethods.setValue('logradouro', data.logradouro || '')
                      proprietarioMethods.setValue('bairro', data.bairro || '')
                      proprietarioMethods.setValue('cidade', data.localidade || '')
                      proprietarioMethods.setValue('estado', data.estado || '')
                    } else {
                      // Caso o CEP seja inválido
                      proprietarioMethods.setError('cep', {
                        type: 'manual',
                        message: 'CEP inválido'
                      })
                    }
                  } catch (error) {
                    proprietarioMethods.setError('cep', {
                      type: 'manual',
                      message: 'Erro ao buscar o CEP'
                    })
                  }
                }
              }
            })}
            helperText={proprietarioMethods.formState?.errors?.cep?.message}
          />
        </Label>
      </div>
      <Label>
        Estado
        <Controller
          name="estado"
          control={proprietarioMethods.control}
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
        {!!proprietarioMethods?.formState?.errors?.estado?.message && (
          <span>{proprietarioMethods?.formState?.errors?.estado?.message}</span>
        )}
      </Label>

      {/* <AlertDialog
        open={showLinkExistingProprietarioDialogOpen}
        onOpenChange={setShowLinkExistingProprietarioDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proprietário Encontrado</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <div>
                  Deseja vincular este proprietário ao imóvel? Sinta-se a vontade para verificar os
                  dados, você também pode cadastrar um novo proprietário.
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
      </AlertDialog> */}
    </>
  )
}

export const PropretarioFormSubmitButton = ({
  proprietarioMethods,
  disabled
}: {
  proprietarioMethods: UseFormReturn<ProprietarioSchema>
  disabled?: boolean
}) => {
  return (
    <div className="mt-4 flex justify-end">
      <Button
        disabled={
          disabled ||
          !proprietarioMethods.formState.isValid ||
          !proprietarioMethods.formState.isDirty
        }
        type="submit"
        className=""
      >
        Criar proprietário
      </Button>
    </div>
  )
}

export const ProprietarioForm = {
  Root: ProprietarioFormRoot,
  FormContent: ProprietarioFormContent,
  SubmitButton: PropretarioFormSubmitButton
}
// ;<div className="space-y-8">
//   <h2 className="mb-4 text-xl font-bold">Vincular proprietários ao imovel</h2>

//   <ProprietarioSearch
//     onSelect={handleSelectProprietario}
//     onCreateNew={() => {
//       // Reset the form to create a new owner
//       proprietarioMethods.reset()
//     }}
//   />

//   <Button
//     onClick={() => {
//       if (isCreateProprietarioOpen) {
//         setIsCreateProprietarioOpen(false)
//         proprietarioMethods.reset()
//       } else {
//         setIsCreateProprietarioOpen(true)
//       }
//     }}
//   >
//     {isCreateProprietarioOpen ? 'Cancelar' : 'Criar novo proprietário e vincular ao imóvel'}
//   </Button>

//   {isCreateProprietarioOpen && (
//     <form onSubmit={proprietarioMethods.handleSubmit(onSubmitProprietarioData)}>
//       <h2 className="mb-4 text-xl font-bold">Criar um novo proprietário e vincula-lo ao imovel</h2>
//       <FormProvider {...proprietarioMethods}>
//         <DocumentUpload />
//       </FormProvider>
//       <div className="space-y-4">
//         <Label>
//           Nome
//           <Input
//             type="text"
//             placeholder="Nome completo"
//             {...proprietarioMethods.register('nome')}
//             helperText={proprietarioMethods.formState?.errors?.nome?.message}
//           />
//         </Label>
//         <Label>
//           CPF ou CNPJ
//           <Input
//             type="text"
//             placeholder="CPF ou CNPJ"
//             {...proprietarioMethods.register('documento', {
//               onChange: (e) => {
//                 e.target.value = cleanDocument(e.target.value)
//               }
//             })}
//             onBlur={() => searchForProprietarioByDocument(proprietarioFormDocument)}
//             helperText={proprietarioMethods.formState?.errors?.documento?.message}
//           />
//         </Label>
//         <Label>
//           Email
//           <Input
//             type="email"
//             placeholder="Email"
//             {...proprietarioMethods.register('email')}
//             helperText={proprietarioMethods.formState?.errors?.email?.message}
//           />
//         </Label>
//         <Label>
//           Telefone
//           <Input
//             type="tel"
//             placeholder="Telefone"
//             {...proprietarioMethods.register('telefone', {
//               onChange: (e) => {
//                 e.target.value = cleanPhoneNumber(e.target.value)
//               }
//             })}
//             helperText={proprietarioMethods.formState?.errors?.telefone?.message}
//           />
//         </Label>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <Label>
//           Estado
//           <Controller
//             name="estadoCivil"
//             control={proprietarioMethods.control}
//             render={({ field }) => (
//               <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Estado civil" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {ESTADO_CIVIL_OPTIONS.map((estadoCivil) => (
//                     <SelectItem key={estadoCivil.label} value={estadoCivil.value}>
//                       {estadoCivil.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             )}
//           />
//           {!!proprietarioMethods?.formState?.errors?.estado?.message && (
//             <span>{proprietarioMethods?.formState?.errors?.estado?.message}</span>
//           )}
//         </Label>
//         <Label>
//           Profissão
//           <Input
//             type="string"
//             placeholder="Profissão"
//             {...proprietarioMethods.register('profissao')}
//             helperText={proprietarioMethods.formState?.errors?.profissao?.message}
//           />
//         </Label>
//       </div>
//       <div className="grid grid-cols-2 gap-4">
//         <Label>
//           Logradouro
//           <Input
//             type="text"
//             placeholder="Logradouro"
//             {...proprietarioMethods.register('logradouro')}
//             helperText={proprietarioMethods.formState?.errors?.logradouro?.message}
//           />
//         </Label>
//         <Label>
//           Número
//           <Input
//             type="text"
//             placeholder="Número"
//             {...proprietarioMethods.register('numero')}
//             helperText={proprietarioMethods.formState?.errors?.numero?.message}
//           />
//         </Label>
//         <Label>
//           Complemento
//           <Input
//             type="text"
//             placeholder="Complemento"
//             {...createProprietarioMethods.register('complemento')}
//             helperText={createProprietarioMethods.formState?.errors?.complemento?.message}
//           />
//         </Label>
//         <Label>
//           Bairro
//           <Input
//             type="text"
//             placeholder="Bairro"
//             {...createProprietarioMethods.register('bairro')}
//             helperText={createProprietarioMethods.formState?.errors?.bairro?.message}
//           />
//         </Label>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <Label>
//           Cidade
//           <Input
//             type="text"
//             placeholder="Cidade"
//             {...createProprietarioMethods.register('cidade')}
//             helperText={createProprietarioMethods.formState?.errors?.cidade?.message}
//           />
//         </Label>
//         <Label>
//           CEP
//           <Input
//             type="text"
//             placeholder="CEP"
//             {...createProprietarioMethods.register('cep', {
//               onChange: async (e) => {
//                 let cep = e.target.value?.replace(/\D/g, '') // Remove caracteres não numéricos
//                 const cleanedCep = cep
//                 // Formata o CEP para o formato '#####-###'
//                 console.log('first cep', cep)
//                 if (cep.length > 5) {
//                   cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`
//                   createProprietarioMethods.setValue('cep', cep)
//                 }
//                 if (cep?.replace(/\D/g, '')?.length === 8) {
//                   try {
//                     console.log(cep)
//                     const response = await api.get<ApiCep>(`cep/${cleanedCep}`)
//                     const data = response.data

//                     if (!data.erro) {
//                       // Preenche os campos com os dados retornados
//                       createProprietarioMethods.setValue('logradouro', data.logradouro || '')
//                       createProprietarioMethods.setValue('bairro', data.bairro || '')
//                       createProprietarioMethods.setValue('cidade', data.localidade || '')
//                       createProprietarioMethods.setValue('estado', data.estado || '')
//                     } else {
//                       // Caso o CEP seja inválido
//                       createProprietarioMethods.setError('cep', {
//                         type: 'manual',
//                         message: 'CEP inválido'
//                       })
//                     }
//                   } catch (error) {
//                     createProprietarioMethods.setError('cep', {
//                       type: 'manual',
//                       message: 'Erro ao buscar o CEP'
//                     })
//                   }
//                 }
//               }
//             })}
//             helperText={createProprietarioMethods.formState?.errors?.cep?.message}
//           />
//         </Label>
//       </div>
//       <Label>
//         Estado
//         <Controller
//           name="estado"
//           control={createProprietarioMethods.control}
//           render={({ field }) => (
//             <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Selecione o estado" />
//               </SelectTrigger>
//               <SelectContent>
//                 {ESTADOS.map((estado) => (
//                   <SelectItem key={estado.sigla} value={estado.sigla}>
//                     {estado.nome}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//         />
//         {!!createProprietarioMethods?.formState?.errors?.estado?.message && (
//           <span>{createProprietarioMethods?.formState?.errors?.estado?.message}</span>
//         )}
//       </Label>
//       <div className="mt-4 flex flex-row justify-between">
//         <Button
//           disabled={
//             !createProprietarioMethods.formState.isValid ||
//             !createProprietarioMethods.formState.isDirty
//           }
//           type="submit"
//           className=""
//         >
//           Criar e vincular proprietário
//         </Button>
//       </div>
//       <AlertDialog
//         open={showLinkExistingProprietarioDialogOpen}
//         onOpenChange={setShowLinkExistingProprietarioDialogOpen}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Proprietário Encontrado</AlertDialogTitle>
//             <AlertDialogDescription>
//               <div className="space-y-3">
//                 <div>
//                   Deseja vincular este proprietário ao imóvel? Sinta-se a vontade para verificar os
//                   dados, você também pode cadastrar um novo proprietário.
//                   <ProprietarioCardPreviewRoot>
//                     <ProprietarioCardPreviewHeader
//                       classname="px-0"
//                       proprietario={existingProprietarioByDocument!}
//                     />
//                     <ProprietarioCardPreviewInfoContent
//                       classname="px-0"
//                       proprietario={existingProprietarioByDocument!}
//                     />
//                   </ProprietarioCardPreviewRoot>
//                 </div>

//                 <div>
//                   <Link
//                     to={`/proprietarios/${existingProprietarioByDocument?.id}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <Button variant="outline" type="button">
//                       Ver Detalhes
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancelar</AlertDialogCancel>
//             <AlertDialogAction onClick={linkExistingProprietario}>
//               Vincular Proprietário
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </form>
//   )}
//   {/* Proprietarios vinculados */}
//   <div>
//     <h4 className="mb-2 font-semibold">Proprietários Vinculados</h4>
//     <ScrollArea className="h-[200px]">
//       {imovelData?.proprietarios?.map((proprietario) => (
//         <div key={proprietario.id} className="flex items-center justify-between p-2">
//           <span>{proprietario.nome}</span>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => unlinkProprietarioMutation.mutate(proprietario.id)}
//           >
//             <UserMinus className="mr-2 h-4 w-4" />
//             Desvincular
//           </Button>
//         </div>
//       ))}

//       {!imovelData?.proprietarios?.length && (
//         <div className="flex h-full items-center justify-center">
//           <span>Nenhum proprietário vinculado</span>
//         </div>
//       )}
//     </ScrollArea>
//   </div>

//   <Button
//     type="button"
//     className=""
//     onClick={() => {
//       setCompletedSteps(new Set([currentStep]))
//       setCurrentStep('locatario')
//     }}
//   >
//     Próxima etapa
//   </Button>
// </div>
