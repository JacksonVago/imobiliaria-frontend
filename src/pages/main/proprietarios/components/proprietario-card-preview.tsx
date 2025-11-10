import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Proprietario } from '@/interfaces/proprietario'
import { cn } from '@/lib/utils'

export const ProprietarioCardPreviewRoot = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <Card className={cn('flex flex-col', className)}>{children}</Card>
}

export const ProprietarioCardPreviewHeader = ({
  proprietario,
  classname
}: {
  classname?: string
  proprietario: Proprietario
}) => {
  return (
    <CardHeader className={cn(classname)}>
      <CardTitle className="flex items-center justify-between">
        <span className="truncate">{proprietario?.pessoa?.nome}</span>
        {/*proprietario?.imoveis?.length && (
          <Badge variant="secondary">{proprietario?.imoveis?.length} imóveis</Badge>
        )*/}
      </CardTitle>
    </CardHeader>
  )
}

export const ProprietarioCardPreviewInfoContent = ({
  classname,
  proprietario
}: {
  proprietario: Proprietario
  classname?: string
}) => {
  return (
    <CardContent className={cn('flex-grow', classname)}>
      <dl className="grid grid-cols-2 gap-1 text-sm">
        <dt className="font-semibold">CPF/CNPJ:</dt>
        <dd className="truncate">{proprietario.pessoa?.documento}</dd>
        <dt className="font-semibold">Profissão:</dt>
        <dd className="truncate">{proprietario.pessoa?.profissao || 'N/A'}</dd>
        <dt className="font-semibold">Estado Civil:</dt>
        <dd>{proprietario.pessoa?.estadoCivil || 'N/A'}</dd>
        <dt className="font-semibold">Email:</dt>
        <dd className="truncate">{proprietario.pessoa?.email || 'N/A'}</dd>
        <dt className="font-semibold">Telefone:</dt>
        <dd>{proprietario.pessoa?.telefone || 'N/A'}</dd>
      </dl>
    </CardContent>
  )
}

export const ProprietarioCardImoveisContent = ({
  classname,
  proprietario
}: {
  proprietario: Proprietario
  classname?: string
}) => {
  return (
    <CardContent className={cn('flex-grow', classname)}>
      <div>
        <h4 className="mb-2 font-semibold">Imóveis:</h4>
        <ul className="space-y-2">
          {!!proprietario?.imovel && (
            <li className="text-sm text-muted-foreground">
              + 1 imóveis
            </li>
          )}
        </ul>
      </div>
    </CardContent>
  )
}

export const ProprietarioCardPreviewFooter = ({
  proprietario,
  classname,
  onSelectImovel,
  handleClickVerDetalhes
}: {
  classname?: string
  proprietario: Proprietario
  handleClickVerDetalhes: (id: number) => () => void
  onSelectImovel?: (imovelId: number) => void
}) => {
  return (
    <CardFooter className={cn(classname)}>
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={handleClickVerDetalhes(proprietario.id)}
      >
        Ver detalhes
      </Button>
      {onSelectImovel && (
        <Button
          variant="default"
          size="sm"
          className="w-full"
          onClick={() => onSelectImovel(proprietario.id)}
        >
          Vincular proprietário
        </Button>
      )}
    </CardFooter>
  )
}

export const ProprietarioPreviewCard = {
  Root: ProprietarioCardPreviewRoot,
  Header: ProprietarioCardPreviewHeader,
  InfoContent: ProprietarioCardPreviewInfoContent,
  imoveisContent: ProprietarioCardImoveisContent,
  Footer: ProprietarioCardPreviewFooter
}
