import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, EyeOffIcon, Icon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

export const description =
  "A login form with email and password. There's an option to login with Google and a link to sign up if you don't have an account."

const loginSchema_old = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

const loginSchema = z.object({
  login: z
    .string()
    .min(1, { message: 'Login is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
})

type LoginSchema = z.infer<typeof loginSchema>

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = (data: LoginSchema) => {
    login(data)
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Acesso</CardTitle>
        <CardDescription>Digite seu e-mail abaixo para acessar sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="login">Usuário</Label>
            <Input
              id="login"
              type="text"
              placeholder="Usuario"
              {...register('login')}
              required
              helperText={errors.login?.message}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Senha</Label>
              <Link to="#" className="ml-auto inline-block text-sm underline">
                Esqueceu sua senha ?
              </Link>
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              {...register('password')}
              helperText={errors.password?.message}
            />
            <Button className='bg-white' onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <Eye color='black'></Eye> : <EyeOffIcon color='black'></EyeOffIcon>}
            </Button>
          </div>
          <Button type="submit" className="w-full">
            Acessar
          </Button>
          {/* TODO: */}
          {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
        </form>
        <div className="mt-4 text-center text-sm">
          Não tem uma conta ?{' '}
          <Link to="#" className="underline">
            Criar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
