export interface User {
  id: string
  login: string
  name: string
  email: string
  password:string
  role: UserRole
  permissions: Permission[]
  createdAt: string
  updatedAt?: string
}

export type Permission =
  | 'ALL'
  | 'VIEW_EMPRESAS'
  | 'UPDATE_EMPRESA'
  | 'CREATE_IMOVEL'
  | 'UPDATE_IMOVEL'
  | 'DELETE_IMOVEL'
  | 'VIEW_IMOVELS'
  | 'CREATE_LOCATARIO'
  | 'UPDATE_LOCATARIO'
  | 'DELETE_LOCATARIO'
  | 'VIEW_LOCATARIOS'
  | 'CREATE_PROPRIETARIO'
  | 'UPDATE_PROPRIETARIO'
  | 'DELETE_PROPRIETARIO'
  | 'VIEW_PROPRIETARIOS'
  | 'CREATE_LOCACAO'
  | 'UPDATE_LOCACAO'
  | 'DELETE_LOCACAO'
  | 'VIEW_LOCACOES'
  | 'CREATE_CLIENTE'
  | 'UPDATE_CLIENTE'
  | 'DELETE_CLIENTE'
  | 'VIEW_CLIENTES'
  | 'CREATE_LANCAMENTO'
  | 'UPDATE_LANCAMENTO'
  | 'DELETE_LANCAMENTO'
  | 'VIEW_LANCAMENTOS'
  | 'CREATE_TIPO'
  | 'UPDATE_TIPO'
  | 'DELETE_TIPO'
  | 'VIEW_TIPOS'
  | 'CREATE_PESSOA'
  | 'UPDATE_PESSOA'
  | 'DELETE_PESSOA'
  | 'VIEW_PESSOAS'
  | 'CREATE_TIPOLANCAMENTO'
  | 'UPDATE_TIPOLANCAMENTO'
  | 'DELETE_TIPOLANCAMENTO'
  | 'VIEW_TIPOLANCAMENTOS'
  | 'CREATE_PAGAMENTO'
  | 'UPDATE_PAGAMENTO'
  | 'DELETE_PAGAMENTO'
  | 'VIEW_PAGAMENTOS'

export const userPermissions: {
  [key in Permission]: string
} = {
  ALL: 'Todas as permissões',
  UPDATE_EMPRESA: 'Atualizar Empresa',
  VIEW_EMPRESAS: 'Visualizar Empresas',
  CREATE_IMOVEL: 'Criar imóveis',
  UPDATE_IMOVEL: 'Atualizar imóveis',
  DELETE_IMOVEL: 'Deletar imóveis',
  VIEW_IMOVELS: 'Visualizar imóveis',
  CREATE_LOCATARIO: 'Criar locatários',
  UPDATE_LOCATARIO: 'Atualizar locatários',
  DELETE_LOCATARIO: 'Deletar locatários',
  VIEW_LOCATARIOS: 'Visualizar locatários',
  CREATE_PROPRIETARIO: 'Criar proprietários',
  UPDATE_PROPRIETARIO: 'Atualizar proprietários',
  DELETE_PROPRIETARIO: 'Deletar proprietários',
  VIEW_PROPRIETARIOS: 'Visualizar proprietários',
  CREATE_LOCACAO: 'Criar locações',
  UPDATE_LOCACAO: 'Atualizar locações',
  DELETE_LOCACAO: 'Deletar locações',
  VIEW_LOCACOES: 'Visualizar locações',
  CREATE_CLIENTE: 'Criar clientes',
  UPDATE_CLIENTE: 'Atualizar clientes',
  DELETE_CLIENTE: 'Deletar clientes',
  VIEW_CLIENTES: 'Visualizar clientes',
  CREATE_LANCAMENTO: 'Criar lançamento',
  UPDATE_LANCAMENTO: 'Atualizar lançamento',
  DELETE_LANCAMENTO: 'Deletar lançamento',
  VIEW_LANCAMENTOS: 'Visualizar lançamentos',
  CREATE_TIPO: 'Criar tipos de imóvel',
  UPDATE_TIPO: 'Atualizar tipos de imóvel',
  DELETE_TIPO: 'Deletar tipos de imóvel',
  VIEW_TIPOS: 'Visualizar tipos de imóvel',
  CREATE_PESSOA: 'Criar Pessoa',
  UPDATE_PESSOA: 'Atualizar Pessoa',
  DELETE_PESSOA: 'Deletar Pessoa',
  VIEW_PESSOAS: 'Visualizar Pessoas',
  CREATE_TIPOLANCAMENTO: 'Criar tipos de lançamento',
  UPDATE_TIPOLANCAMENTO: 'Atualizar tipos de lançamento',
  DELETE_TIPOLANCAMENTO: 'Deletar tipos de lançamento',
  VIEW_TIPOLANCAMENTOS: 'Visualizar tipos de lançamentos',
  CREATE_PAGAMENTO: 'Criar pagamento',
  UPDATE_PAGAMENTO: 'Atualizar pagamento',
  DELETE_PAGAMENTO: 'Deletar pagamento',
  VIEW_PAGAMENTOS: 'Visualizar pagamentos',

}

export enum UserRole {
  ADMIN = 'ADMIN',
  COLLABORATOR = 'COLLABORATOR'
}
