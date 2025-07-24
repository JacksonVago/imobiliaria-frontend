import { AppSidebar } from '@/components/app-sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ROUTE } from '@/enums/routes.enum'
import { useAuth } from '@/hooks/auth/use-auth'
import { Permission } from '@/interfaces/user'
import { Login } from '@/pages/auth/login'
import { ListarColaboradores } from '@/pages/main/colaboradores'
import { CriarImovel } from '@/pages/main/imoveis/criarImovel'
import { DetalhesImovel } from '@/pages/main/imoveis/detalhes'
import ListarImoveis from '@/pages/main/imoveis/listarImoveis'
import ListarLocatarios from '@/pages/main/locatarios'
import { CriarLocatario } from '@/pages/main/locatarios/criar'
import DetalhesLocatario from '@/pages/main/locatarios/detalhes'
import ListarProprietarios from '@/pages/main/proprietarios'
import { CriarProprietario } from '@/pages/main/proprietarios/criar'
import DetalhesProprietario from '@/pages/main/proprietarios/detalhes'
import { Outlet, Route, Routes } from 'react-router-dom'
import { AuthenticatedRoutesGuard } from './guards/authenticated-routes-guard'
import { UnauthenticatedRoutesGuard } from './guards/unauthenticated-routes-guard'
import DetalhesCliente from '@/pages/main/clientes/detalhes'
import { CriarCliente } from '@/pages/main/clientes/criar'
import ListarClientes from '@/pages/main/clientes'
import { Label } from '@radix-ui/react-label'
import { useEffect, useState } from 'react'
import { useGlobalParams } from '@/globals/GlobalParams'
import ListarLocacoes from '@/pages/main/locacoes'
import DetalhesLocacao from '@/pages/main/locacoes/detalhes'
import  CriarLocacao  from '@/pages/main/locacoes/criar'

export interface ProtectedRouteProps {
  permission: Permission
  children: React.ReactNode
}

export const MainLayout = () => {
  const glb_params = useGlobalParams();
  const [nameUser, setNameUser] = useState(false);

  const { firstName } = useAuth()

  useEffect(()=>{},[glb_params]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-gray-100">
          <div className="flex w-full items-center justify-between gap-2 px-8">
            <SidebarTrigger className="-ml-1" />
            <Label>{glb_params.title_form}</Label>
            <Avatar className={nameUser ? 'w-1/3' : 'w-10'}>
              <AvatarImage src="http://localhost:3000/assets/images/avatar.jpg" />
              <AvatarFallback className="bg-gray-200" onClick={() => {setNameUser(!nameUser)}}>
                {nameUser ? firstName : firstName?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className="flex flex-1 flex-col pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3"></div>
          <div className="min-h-[100vh] flex-1 bg-muted md:min-h-min">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
export const ProtectedRoute = ({ children, permission }: ProtectedRouteProps) => {
  const { user } = useAuth()
  const userPermissions = user?.permissions || []

  // Check if user has permission to access
  const canAccess =
    permission && (userPermissions.includes('ALL') || userPermissions.includes(permission))

  if (canAccess) {
    return <>{children}</>
  }

  return <div>Unauthorized</div>
}

export const RoutesComponent = () => {
  const { user } = useAuth()
  return (
    <Routes>
      <Route element={<UnauthenticatedRoutesGuard />}>
        <Route path={ROUTE.LOGIN} element={<Login />} />
      </Route>
      <Route element={<AuthenticatedRoutesGuard />}>
        <Route element={<MainLayout />}>
          <Route
            path={ROUTE.COLABORADORES}
            element={user?.role === 'ADMIN' ? <ListarColaboradores /> : <UnauthorizedPage />}
          />

          <Route path={ROUTE.HOME} element={<div>Home</div>} />

          {/* Imóveis */}
          <Route
            path={ROUTE.IMOVEIS}
            element={
              <ProtectedRoute permission="VIEW_IMOVELS">
                <ListarImoveis limitView={3} exclude='' />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.IMOVEIS_CRIAR}
            element={
              <ProtectedRoute permission="CREATE_IMOVEL">
                <CriarImovel />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.IMOVEIS_DETALHES}
            element={
              <ProtectedRoute permission="VIEW_IMOVELS">
                <DetalhesImovel />
              </ProtectedRoute>
            }
          />

          {/* Locações */}
          <Route
            path={ROUTE.LOCACOES}
            element={
              <ProtectedRoute permission="VIEW_LOCACOES">
                <ListarLocacoes exclude='' limitView={3} txtVinc='' />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.LOCACOES_CRIAR}
            element={
              <ProtectedRoute permission="CREATE_LOCACAO">
                <CriarLocacao />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.LOCACOES_DETALHES}
            element={
              <ProtectedRoute permission="VIEW_LOCACOES">
                <DetalhesLocacao />
              </ProtectedRoute>
            }
          />

          {/* propriterios */}
          <Route
            path={ROUTE.PROPRIETARIOS}
            element={
              <ProtectedRoute permission="VIEW_PROPRIETARIOS">
                <ListarProprietarios />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTE.PROPRIETARIOS_CRIAR}
            element={
              <ProtectedRoute permission="CREATE_PROPRIETARIO">
                <CriarProprietario />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTE.PROPRIETARIOS_DETALHES}
            element={
              <ProtectedRoute permission="VIEW_PROPRIETARIOS">
                <DetalhesProprietario />
              </ProtectedRoute>
            }
          />

          {/* locatarios */}
          <Route
            path={ROUTE.LOCATARIOS}
            element={
              <ProtectedRoute permission="VIEW_LOCATARIOS">
                <ListarLocatarios />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTE.LOCATARIOS_DETALHES}
            element={
              <ProtectedRoute permission="VIEW_LOCATARIOS">
                <DetalhesLocatario />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.LOCATARIOS_CRIAR}
            element={
              <ProtectedRoute permission="CREATE_LOCATARIO">
                <CriarLocatario />
              </ProtectedRoute>
            }
          />

          {/* clientes */}
          <Route
            path={ROUTE.CLIENTES}
            element={
              <ProtectedRoute permission="VIEW_CLIENTES">
                <ListarClientes exclude='' limitView={3} txtVinc='' />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTE.CLIENTES_DETALHES}
            element={
              <ProtectedRoute permission="VIEW_CLIENTES">
                <DetalhesCliente/>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTE.CLIENTES_CRIAR}
            element={
              <ProtectedRoute permission="CREATE_CLIENTE">
                <CriarCliente />
              </ProtectedRoute>
            }
          />

          {/* <Route path={ROUTE.IMOVEIS_DETALHES} element={<DetalhesImovel />} />
          <Route path={ROUTE.IMOVEIS_CRIAR} element={<CriarImovel />} />
          <Route path={ROUTE.PROPRIETARIOS} element={<ListarProprietarios />} />
          <Route path={ROUTE.PROPRIETARIOS_CRIAR} element={<CriarProprietario />} />
          <Route path={ROUTE.PROPRIETARIOS_DETALHES} element={<DetalhesProprietario />} />
          <Route path={ROUTE.LOCATARIOS} element={<ListarLocatarios />} />
          <Route path={ROUTE.LOCATARIOS_DETALHES} element={<DetalhesLocatario />} /> */}
        </Route>
      </Route>
      <Route path={ROUTE.UNAUTHORIZED} element={<UnauthorizedPage />} />
      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}
export const UnauthorizedPage = () => {
  return (
    <div>
      <h1>Unauthorized</h1>
    </div>
  )
}
export const GerenciarColaboradores = () => {
  return (
    <div>
      <h1>Gerenciar Colaboradores</h1>
    </div>
  )
}
