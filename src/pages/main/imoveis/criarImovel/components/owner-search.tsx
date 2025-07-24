import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Proprietario } from '@/interfaces/proprietario'
import {
  ProprietarioCardPreviewHeader,
  ProprietarioCardPreviewInfoContent,
  ProprietarioCardPreviewRoot
} from '@/pages/main/proprietarios/components/proprietario-card-preview'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useGetProprietariosSearchQueryOptions } from '../../hooks/use-get-proprietarios-search-query-options'

interface ProprietarioSearchProps {
  onSelect: (proprietario: Proprietario) => void
  onCreateNew: () => void
}

export function ProprietarioSearch({ onSelect, onCreateNew }: ProprietarioSearchProps) {
  const [proprietariosSearchQuery, setProprietariosSearchQuery] = useState<string>('')

  const { data: proprietariosSearchResultsData } = useQuery(
    useGetProprietariosSearchQueryOptions(proprietariosSearchQuery)
  )

  const searchResults = proprietariosSearchResultsData?.data

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          onChange={(e) => setProprietariosSearchQuery(e.target.value)}
          value={proprietariosSearchQuery}
          placeholder="Buscar proprietário por nome ou documento"
        />

        <Button type="submit">Buscar</Button>
      </div>
      {!!proprietariosSearchQuery && (
        <>
          {!!searchResults?.length ? (
            <div className="space-y-4">
              {searchResults?.map((proprietario) => (
                <ProprietarioCardPreviewRoot className="max-w-md">
                  <ProprietarioCardPreviewHeader proprietario={proprietario} />
                  <ProprietarioCardPreviewInfoContent proprietario={proprietario} />
                  <Button className="w-full" onClick={() => onSelect(proprietario)}>
                    Vincular ao imóvel
                  </Button>
                </ProprietarioCardPreviewRoot>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Nenhum proprietário encontrado para a busca atual.
            </p>
          )}
        </>
      )}
    </div>
  )
}
