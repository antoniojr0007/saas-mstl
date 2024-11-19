'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import FacebookIcon from '@/assets/facebook-icon.svg'
import GithubIcon from '@/assets/github-icon.svg'
import GoogleIcon from '@/assets/google-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import {
  signInWithFacebook,
  signInWithGithub,
  signInWithGoogle,
} from '../actions'
import { signUpAction } from './actions'

export function SignUpForm() {
  const router = useRouter()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push('/auth/sign-in')
    },
  )

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign up failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            name="name"
            id="name"
            placeholder="Antonio junior"
            className="my-4 rounded-full"
          />
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="example@example.com"
            className="my-4 rounded-full"
          />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type="password"
            id="password"
            placeholder="123456"
            className="my-4 rounded-full"
          />
          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your Password</Label>
          <Input
            name="password_confirmation"
            type="password"
            id="password_confirmation"
            placeholder="123456"
            className="my-4 rounded-full"
          />
          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>
        <Button type="submit" className="w-full rounded-full">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <Button className="w-full" size="sm" asChild variant="link">
          <Link href="/auth/sign-in">Already registered? Sign in</Link>
        </Button>

        <Separator />
      </form>
      <div className="flex w-full flex-row justify-around">
        <form action={signInWithGithub}>
          <Button type="submit" variant="ghost">
            <Image
              src={GithubIcon}
              alt="Logo Github"
              className="mr-2 size-6 dark:invert"
            />
          </Button>
        </form>
        <form action={signInWithGoogle}>
          <Button type="submit" variant="ghost">
            <Image src={GoogleIcon} alt="Logo Google" className="mr-2 size-6" />
          </Button>
        </form>

        <form action={signInWithFacebook}>
          <Button type="submit" variant="ghost">
            <Image
              src={FacebookIcon}
              alt="Logo Facebook"
              className="mr-2 size-8"
            />
          </Button>
        </form>
      </div>
    </div>
  )
}
