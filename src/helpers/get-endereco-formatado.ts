import { Endereco } from '@/interfaces/endereco'

// Helper functions
export const getEnderecoFormatado = (endereco?: Endereco) => {
  if (!endereco) return ''
  return `${endereco?.logradouro}, ${endereco?.numero}, ${endereco?.bairro}, ${endereco?.cidade} - ${endereco?.estado}`
}
