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
import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const router = useRouter()

  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push('/')
    },
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign in failed!</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

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

          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full rounded-full"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-up">Create new account</Link>
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
