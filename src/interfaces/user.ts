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
  | 'VIEW_EMPRESA'
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
  | 'CREATE_TIPOIMOVEL'
  | 'UPDATE_TIPOIMOVEL'
  | 'DELETE_TIPOIMOVEL'
  | 'VIEW_TIPOIMOVEL'

export const userPermissions: {
  [key in Permission]: string
} = {
  ALL: 'Todas as permissões',
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
  CREATE_TIPOIMOVEL: 'Criar tipos de imóvel',
  UPDATE_TIPOIMOVEL: 'Atualizar tipos de imóvel',
  DELETE_TIPOIMOVEL: 'Deletar tipos de imóvel',
  VIEW_TIPOIMOVEL: 'Visualizar tipos de imóvel'

}

export enum UserRole {
  ADMIN = 'ADMIN',
  COLLABORATOR = 'COLLABORATOR'
}
