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
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const imovelSchema = z.object({
  nome: z.string().min(1, 'Nome do imóvel é obrigatório'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().min(1, 'Número é obrigatório'),
  bairro: z.string().min(1, 'Bairro é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  cep: z.string().min(1, 'CEP é obrigatório'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  valor_aluguel: z
    .number()
    .min(0, 'Valor do aluguel deve ser um número positivo')
    .or(z.string().min(1, 'Valor do aluguel é obrigatório').transform(Number)),
  valorAgua: z.number().min(0).optional(),
  valorCondominio: z.number().min(0).optional(),
  valorIptu: z.number().min(0).optional(),
  valorTaxaLixo: z.number().min(0).optional()
})

type ImovelFormValues = z.infer<typeof imovelSchema>

const ESTADOS = [
  { nome: 'Acre', sigla: 'AC' },
  { nome: 'Alagoas', sigla: 'AL' }
  // ... add other states
]

export default function CriarImovel() {
  const form = useForm<ImovelFormValues>({
    resolver: zodResolver(imovelSchema),
    defaultValues: {
      nome: '',
      logradouro: '',
      numero: '',
      bairro: '',
      cidade: '',
      cep: '',
      estado: '',
      valor_aluguel: 0,
      valorAgua: 0,
      valorCondominio: 0,
      valorIptu: 0,
      valorTaxaLixo: 0
    }
  })

  async function onSubmit(data: ImovelFormValues) {
    try {
      // Here you would typically send the data to your API
      console.log(data)
      //   toast({
      //     title: "Imóvel cadastrado com sucesso!",
      //     description: "Os dados do imóvel foram salvos.",
      //   })
      form.reset()
    } catch (error) {
      //   toast({
      //     title: "Erro ao cadastrar imóvel",
      //     description: "Ocorreu um erro ao salvar os dados. Tente novamente.",
      //     variant: "destructive",
      //   })
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Cadastrar Imóvel</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome do Imóvel</Label>
          <Input id="nome" {...form.register('nome')} />
          {form.formState.errors.nome && (
            <p className="text-sm text-red-500">{form.formState.errors.nome.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="logradouro">Logradouro</Label>
          <Input id="logradouro" {...form.register('logradouro')} />
          {form.formState.errors.logradouro && (
            <p className="text-sm text-red-500">{form.formState.errors.logradouro.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numero">Número</Label>
            <Input id="numero" {...form.register('numero')} />
            {form.formState.errors.numero && (
              <p className="text-sm text-red-500">{form.formState.errors.numero.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input id="bairro" {...form.register('bairro')} />
            {form.formState.errors.bairro && (
              <p className="text-sm text-red-500">{form.formState.errors.bairro.message}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input id="cidade" {...form.register('cidade')} />
            {form.formState.errors.cidade && (
              <p className="text-sm text-red-500">{form.formState.errors.cidade.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input id="cep" {...form.register('cep')} />
            {form.formState.errors.cep && (
              <p className="text-sm text-red-500">{form.formState.errors.cep.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="estado">Estado</Label>
          <Select onValueChange={(value) => form.setValue('estado', value)}>
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
          {form.formState.errors.estado && (
            <p className="text-sm text-red-500">{form.formState.errors.estado.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valor_aluguel">Valor do Aluguel</Label>
            <Input
              id="valor_aluguel"
              type="number"
              {...form.register('valor_aluguel', { valueAsNumber: true })}
            />
            {form.formState.errors.valor_aluguel && (
              <p className="text-sm text-red-500">{form.formState.errors.valor_aluguel.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="valorAgua">Valor da Água</Label>
            <Input
              id="valorAgua"
              type="number"
              {...form.register('valorAgua', { valueAsNumber: true })}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="valorCondominio">Valor do Condomínio</Label>
            <Input
              id="valorCondominio"
              type="number"
              {...form.register('valorCondominio', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valorIptu">Valor do IPTU</Label>
            <Input
              id="valorIptu"
              type="number"
              {...form.register('valorIptu', { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="valorTaxaLixo">Valor da Taxa de Lixo</Label>
            <Input
              id="valorTaxaLixo"
              type="number"
              {...form.register('valorTaxaLixo', { valueAsNumber: true })}
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Cadastrar Imóvel
        </Button>
      </form>
    </div>
  )
}
