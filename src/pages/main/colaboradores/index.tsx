'use client'

import { Check, Pencil, Plus, Trash2 } from 'lucide-react'
import * as React from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/hooks/use-toast'
import { Permission, User } from '@/interfaces/user'
import { cn } from '@/lib/utils'
import api from '@/services/axios/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const permissions: { value: Permission; label: string }[] = [
  { value: 'ALL', label: 'Todas as permissões' },
  { value: 'CREATE_IMOVEL', label: 'Criar Imóvel' },
  { value: 'UPDATE_IMOVEL', label: 'Atualizar Imóvel' },
  { value: 'DELETE_IMOVEL', label: 'Deletar Imóvel' },
  { value: 'VIEW_IMOVELS', label: 'Visualizar Imóveis' },
  { value: 'CREATE_LOCATARIO', label: 'Criar Locatário' },
  { value: 'UPDATE_LOCATARIO', label: 'Atualizar locatário' },
  { value: 'DELETE_LOCATARIO', label: 'Excluir Locatário' },
  { value: 'VIEW_LOCATARIOS', label: 'Ver Locatários' },
  { value: 'CREATE_PROPRIETARIO', label: 'Criar Proprietário' },
  { value: 'UPDATE_PROPRIETARIO', label: 'Atualizar Proprietário' },
  { value: 'DELETE_PROPRIETARIO', label: 'Excluir Proprietário' },
  { value: 'VIEW_PROPRIETARIOS', label: 'Ver Proprietários' },
  { value: 'CREATE_LOCACAO', label: 'Criar Locação' },
  { value: 'UPDATE_LOCACAO', label: 'Atualizar Locação' },
  { value: 'DELETE_LOCACAO', label: 'Excluir Locação' },
  { value: 'VIEW_LOCACOES', label: 'Ver Locações' }
]

const imoveisPermissions: { value: Permission; label: string }[] = [
  { value: 'CREATE_IMOVEL', label: 'Criar Imóvel' },
  { value: 'UPDATE_IMOVEL', label: 'Atualizar Imóvel' },
  { value: 'DELETE_IMOVEL', label: 'Deletar Imóvel' },
  { value: 'VIEW_IMOVELS', label: 'Visualizar Imóveis' }
]

const proprietariosPermissions: { value: Permission; label: string }[] = [
  { value: 'CREATE_PROPRIETARIO', label: 'Criar Proprietário' },
  { value: 'UPDATE_PROPRIETARIO', label: 'Atualizar Proprietário' },
  { value: 'DELETE_PROPRIETARIO', label: 'Excluir Proprietário' },
  { value: 'VIEW_PROPRIETARIOS', label: 'Ver Proprietários' }
]

const locatariosPermissions: { value: Permission; label: string }[] = [
  { value: 'CREATE_LOCATARIO', label: 'Criar Locatário' },
  { value: 'UPDATE_LOCATARIO', label: 'Atualizar locatário' },
  { value: 'DELETE_LOCATARIO', label: 'Excluir Locatário' },
  { value: 'VIEW_LOCATARIOS', label: 'Ver Locatários' }
]

export const getUsers = () => {
  return api.get<User[]>('/users/collaborators')
}

export const createUser = ({
  email,
  name,
  password,
  permissions = []
}: {
  name: string
  email: string
  password: string
  permissions: Permission[]
}) => {
  return api.post('/users', {
    name: name,
    email: email,
    password: password,
    permissions: permissions
  })
}

export const putUpdateUser = (userData: {
  id: string
  name: string
  email: string
  permissions: Permission[]
}) => {
  return api.put(`/users/${userData.id}`, userData)
}

enum QueryKeys {
  USERS_LIST
}

import { PageLoader } from '@/pages/assistant/page-loader'
import { z } from 'zod'
import axios from 'axios'

const createUserSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().email('Insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.')
})

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().email('Insira um e-mail válido.'),
  permissions: z.array(
    z.enum([
      'ALL',
      'CREATE_IMOVEL',
      'UPDATE_IMOVEL',
      'DELETE_IMOVEL',
      'VIEW_IMOVELS',
      'CREATE_LOCATARIO',
      'UPDATE_LOCATARIO',
      'DELETE_LOCATARIO',
      'VIEW_LOCATARIOS',
      'CREATE_PROPRIETARIO',
      'UPDATE_PROPRIETARIO',
      'DELETE_PROPRIETARIO',
      'VIEW_PROPRIETARIOS',
      'CREATE_LOCACAO',
      'UPDATE_LOCACAO',
      'DELETE_LOCACAO',
      'VIEW_LOCACOES'
    ])
  )
})

export const ListarColaboradores = () => {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [userPermissions, setUserPermissions] = React.useState<Permission[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [newUser, setNewUser] = React.useState({ name: '', email: '', password: '' })
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: usersData, isLoading } = useQuery({
    queryKey: [QueryKeys.USERS_LIST],
    queryFn: getUsers
  })

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS_LIST]
      })
      toast({
        title: 'Usuário criado',
        description: 'O novo usuário foi criado com sucesso.'
      })
      setIsCreateDialogOpen(false)
      setNewUser({ name: '', email: '', password: '' })
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        // Check if there's a response and data within the error
        if (error.response && error.response.data) {
          console.error('Error message from server:', error.response.data);
          toast({
            title: 'Erro ao criar colaborador',
            description: error.response.data.message,
          })

          // You can also set this error message to a state to display it in your UI
        } else {
          console.error('Axios error without response data:', error.message);
        }
      } else {
        console.error('Non-Axios error:', error);
        toast({
          title: 'Erro',
          description: error instanceof Error ? error.message : 'Ocorreu um erro ao criar o usuário. Tente novamente.',
          variant: 'destructive'
        })
      }

    }
  })

  const updateUserMutation = useMutation({
    mutationFn: putUpdateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS_LIST]
      })
      toast({
        title: 'Usuário atualizado',
        description: 'As informações do usuário foram atualizadas com sucesso.'
      })
      setIsEditDialogOpen(false)
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o usuário. Tente novamente.',
        variant: 'destructive'
      })
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => api.delete(`/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.USERS_LIST]
      })
      toast({
        title: 'Usuário excluído',
        description: 'O usuário foi excluído com sucesso.'
      })
      setSelectedUser(null)
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o usuário. Tente novamente.',
        variant: 'destructive'
      })
    }
  })

  const users = usersData?.data

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    setUserPermissions(user.permissions)
  }

  const handlePermissionChange = (checked: boolean, permission: Permission) => {
    // setUserPermissions((prevPermissions) => {
    //   if (permission === 'ALL') {
    //     return checked ? ['ALL'] : []
    //   } else {
    //     if (checked) {
    //       return [...(prevPermissions || []), permission]
    //     } else {
    //       return prevPermissions.filter((p) => p !== permission)
    //     }
    //   }
    // })
    //
    if (permission?.includes('IMOVEL')) {
      if (permission !== 'VIEW_IMOVELS') {
        setUserPermissions((prevPermissions) => {
          if (checked) {
            return [...(prevPermissions || []), permission, 'VIEW_IMOVELS']
          } else {
            return prevPermissions.filter((p) => p !== permission)
          }
        })
      } else {
        setUserPermissions((prevPermissions) => {
          if (checked) {
            return [...(prevPermissions || []), permission]
          } else {
            return prevPermissions.filter((p) => !p.includes('IMOVEL'))
          }
        })
      }
    }

    if (permission?.includes('LOCATARIO')) {
      if (permission !== 'VIEW_LOCATARIOS') {
        setUserPermissions((prevPermissions) => {
          if (checked) {
            return [...(prevPermissions || []), permission, 'VIEW_LOCATARIOS']
          } else {
            return prevPermissions.filter((p) => p !== permission)
          }
        })
      } else {
        setUserPermissions((prevPermissions) => {
          if (checked) {
            return [...(prevPermissions || []), permission]
          } else {
            return prevPermissions.filter((p) => !p.includes('LOCATARIO'))
          }
        })
      }
    }

    if (permission?.includes('PROPRIETARIO')) {
      if (permission !== 'VIEW_PROPRIETARIOS') {
        setUserPermissions((prevPermissions) => {
          if (checked) {
            return [...(prevPermissions || []), permission, 'VIEW_PROPRIETARIOS']
          } else {
            return prevPermissions.filter((p) => p !== permission)
          }
        })
      } else {
        setUserPermissions((prevPermissions) => {
          if (checked) {
            return [...(prevPermissions || []), permission]
          } else {
            return prevPermissions.filter((p) => !p.includes('PROPRIETARIO'))
          }
        })
      }
    }
  }

  const handleSavePermissions = () => {
    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        permissions: userPermissions
      })
    }
  }

  const handleCreateUser = () => {
    createUserMutation.mutate({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      permissions: []
    })
  }

  const handleUpdateUser = () => {
    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        permissions: userPermissions
      })
    }
  }

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id)
    }
  }

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Gerenciar usuários e permissões</h1>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={(value) => {
            setIsCreateDialogOpen(value)
            setNewUser({ name: '', email: '', password: '' })
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Criar colaborador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar novo colaborador</DialogTitle>
              <DialogDescription>Preencha os dados do novo colaborador abaixo.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateUser}>Criar colaborador</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex space-x-8">
        <div className="w-1/3">
          <h2 className="mb-4 text-lg font-semibold">Colaboradores</h2>
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {users?.map((user) => (
              <div
                key={user.id}
                className={cn(
                  'flex cursor-pointer flex-wrap items-center justify-between space-x-2 rounded p-2 hover:bg-gray-100',
                  selectedUser?.id === user.id && 'bg-gray-100'
                )}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center space-x-2">
                  <Check
                    className={cn(
                      'h-4 w-4',
                      selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedUser(user)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. Isso excluirá permanentemente o usuário e
                          todos os dados associados a ele.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>
                          Sim, excluir usuário
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>

        <div className="w-2/3 space-y-4">
          {selectedUser && (
            <>
              <h2 className="text-lg font-semibold">Permissões de {selectedUser.name}</h2>
              <ScrollArea className="h-full max-h-[500px] rounded-md border p-4">
                <div className="space-y-2">
                  <>
                    <h3 className="text-lg font-semibold">Imoveis</h3>
                    {imoveisPermissions.map((permission) => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.value}
                          checked={userPermissions.includes(permission.value)}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(checked as boolean, permission.value)
                          }
                        />
                        <label
                          htmlFor={permission.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </>
                  <>
                    <h3 className="text-lg font-semibold">Proprietários</h3>
                    {proprietariosPermissions.map((permission) => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.value}
                          checked={userPermissions.includes(permission.value)}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(checked as boolean, permission.value)
                          }
                        />
                        <label
                          htmlFor={permission.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </>
                  <>
                    <h3 className="text-lg font-semibold">Locatários</h3>
                    {locatariosPermissions.map((permission) => (
                      <div key={permission.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.value}
                          checked={userPermissions.includes(permission.value)}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(checked as boolean, permission.value)
                          }
                        />
                        <label
                          htmlFor={permission.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {permission.label}
                        </label>
                      </div>
                    ))}
                  </>
                </div>
              </ScrollArea>
              <Button onClick={handleSavePermissions}>Salvar permissões</Button>
            </>
          )}

          {!selectedUser && (
            <div className="flex h-[40%] items-center justify-center">
              <p className="text-muted-foreground">
                Selecione um colaborador para ver suas permissões.
              </p>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(value) => {
          setIsEditDialogOpen(value)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar colaborador</DialogTitle>
            <DialogDescription>Edite os dados do colaborador abaixo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nome
              </Label>
              <Input
                id="edit-name"
                value={selectedUser?.name || ''}
                onChange={(e) => setSelectedUser((prev) => ({ ...prev!, name: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser((prev) => ({ ...prev!, email: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Senha
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={selectedUser?.password || ''}
                placeholder="Deixe em branco para manter a senha atual"
                onChange={(e) =>
                  setSelectedUser((prev) => ({ ...prev!, password: e.target.value }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateUser}>Salvar alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
