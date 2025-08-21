import { User, UserRole } from '@/interfaces/user'

// Mocked user data
export const mockedUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password:'1234',
    role: UserRole.COLLABORATOR,
    createdAt: '2021-09-01T12:00:00Z',
    permissions: ['CREATE_IMOVEL', 'VIEW_IMOVELS']
  },
  {
    id: '2',
    name: 'Jane Doe',
    email: 'jane@test.com',
    password:'1234',
    role: UserRole.COLLABORATOR,
    createdAt: '2021-09-01T12:00:00Z',
    permissions: ['VIEW_IMOVELS', 'VIEW_LOCATARIOS', 'VIEW_PROPRIETARIOS']
  },
  {
    id: '3',
    name: 'jhongali',
    email: 'Jonhgali@test.com',
    password:'1234',
    role: UserRole.COLLABORATOR,
    createdAt: '2021-09-01T12:00:00Z',
    permissions: ['ALL']
  }
]
