'use client'

import { Cog, House,  HousePlus, Lock, LogOut, Shapes, Users } from 'lucide-react'
import * as React from 'react'
import logo  from '../assets/logo-molina.png';

import { NavMain } from '@/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { ROUTE } from '@/enums/routes.enum'
import { useAuth } from '@/hooks/auth/use-auth'
import { Link } from 'react-router-dom'

const data = {
  navMain: [
    {
      title: 'Configurações',
      url: ROUTE.EMPRESA + "/1",
      icon: Cog
    },
    {
      title: 'Tipo de Imóvel',
      url: ROUTE.TIPOIMOVEL,
      icon: Shapes
    },
    {
      title: 'Imoveis',
      url: ROUTE.IMOVEIS,
      icon: House
    },
    {
      title: 'Locações',
      url: ROUTE.LOCACOES,
      icon: HousePlus
    },
    /*{
      title: 'Proprietários',
      url: ROUTE.PROPRIETARIOS,
      icon: User
    },
    {
      title: 'Locatários',
      url: ROUTE.LOCATARIOS,
      icon: Users
    },*/
    {
      title: 'Clientes',
      url: ROUTE.CLIENTES,
      icon: Users
    },
    {
      title: 'Permissões/Colaboradores',
      url: ROUTE.COLABORADORES,
      icon: Lock
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  //const { user, logout, isAdmin } = useAuth()
  const { user, logout } = useAuth()

  const navMainData = React.useMemo(() => {
    return data.navMain.filter((item) => {
      const isAdmin = user?.role === 'ADMIN';
      if ((item.url === ROUTE.COLABORADORES || item.url === ROUTE.EMPRESA) && isAdmin) {
        return true
      }
      if (user?.permissions.includes('ALL')) {
        return true
      }
      if (item.url === ROUTE.IMOVEIS && user?.permissions.includes('VIEW_IMOVELS')) {
        return true
      }
      if (item.url === ROUTE.LOCACOES && user?.permissions.includes('VIEW_LOCACOES')) {
        return true
      }
      if (item.url === ROUTE.PROPRIETARIOS && user?.permissions.includes('VIEW_PROPRIETARIOS')) {
        return true
      }
      if (item.url === ROUTE.LOCATARIOS && user?.permissions.includes('VIEW_LOCATARIOS')) {
        return true
      }
      if (item.url === ROUTE.CLIENTES && user?.permissions.includes('VIEW_CLIENTES')) {
        return true
      }
      if (item.url === ROUTE.TIPOIMOVEL && user?.permissions.includes('VIEW_TIPOS')) {
        return true
      }
      return false
    })
  }, [user])

  return (
    <Sidebar className="border-r bg-white font-[Poppins-Regular]" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className='my-5 flex justify-center'>
              <Link to={ROUTE.HOME} className='h-auto'>
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"> */}
                <div className="flex justify-center rounded-lg">
                  <img
                    src={logo}
                    alt={`Property image`}
                    className="rounded-md object-contain h-26"
                  />
                </div>
                {/* <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Imobiliaria</span>
                  <span className="truncate text-xs">Sistema</span>
                </div> */}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainData} />
      </SidebarContent>
      <SidebarFooter>
        <div
          className="flex h-7 min-w-0 -translate-x-px items-center gap-4 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground font-[Poppins-Regular]"
          onClick={logout}
        >
          <LogOut />
          Log out
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
