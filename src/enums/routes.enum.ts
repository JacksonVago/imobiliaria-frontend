export enum ROUTE {
  // Auth routes
  LOGIN = '/login',
  REGISTER = '/register',

  // Main routes
  HOME = '/',
  SOBRE = '/sobre',

  // Configurações
  EMPRESA = '/empresas',

  // Imoveis routes
  IMOVEIS = '/imoveis',
  IMOVEIS_CRIAR = '/imoveis/criar',
  IMOVEIS_DETALHES = '/imoveis/:id',

  // Locações routes
  LOCACOES = '/locacoes',
  LOCACOES_CRIAR = '/locacoes/criar',
  LOCACOES_DETALHES = '/locacoes/:id',

  // Clientes routes
  CLIENTES = '/pessoas',
  CLIENTES_CRIAR = '/pessoas/criar',
  CLIENTES_DETALHES = '/pessoas/:id',

  // Proprietarios routes
  PROPRIETARIOS = '/proprietarios',
  PROPRIETARIOS_CRIAR = '/proprietarios/criar',
  PROPRIETARIOS_DETALHES = '/proprietarios/:id',

  //Locatarios routes
  LOCATARIOS = '/locatarios',
  LOCATARIOS_CRIAR = '/locatarios/criar',
  LOCATARIOS_DETALHES = '/locatarios/:id',

  //Colaboradores routes
  COLABORADORES = '/colaboradores',
  COLABORADORES_CRIAR = '/colaboradores/criar',
  COLABORADORES_DETALHES = '/colaboradores/:id',

  //TipoImovel routes
  TIPOIMOVEL = '/tipoimovel',
  TIPOIMOVEL_CRIAR = '/tipoimovel/criar',
  TIPOIMOVEL_DETALHES = '/tipoimovel/:id',

  // Error routes
  NOT_FOUND = '*',
  UNAUTHORIZED = '/unauthorized'
}
