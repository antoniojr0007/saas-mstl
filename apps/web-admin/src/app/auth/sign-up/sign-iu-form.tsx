import Image from 'next/image'
import Link from 'next/link'

import FacebookIcon from '@/assets/facebook-icon.svg'
import GithubIcon from '@/assets/github-icon.svg'
import GoogleIcon from '@/assets/google-icon.svg'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export default function SignUpForm() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input
          name="name"
          id="name"
          placeholder="Antonio junior"
          className="my-4 rounded-full"
        />
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
      </div>
      <Button type="submit" className="w-full rounded-full">
        Create account
      </Button>

      <Button className="w-full" size="sm" asChild variant="link">
        <Link href="/auth/sign-in">Already registered? Sign in</Link>
      </Button>

      <Separator />

      <div className="flex w-full flex-row justify-around">
        <Button type="submit" variant="ghost">
          <Image
            src={GithubIcon}
            alt="Logo Github"
            className="mr-2 size-6 dark:invert"
          />
        </Button>

        <Button type="submit" variant="ghost">
          <Image src={GoogleIcon} alt="Logo Google" className="mr-2 size-6" />
        </Button>

        <Button type="submit" variant="ghost">
          <Image
            src={FacebookIcon}
            alt="Logo Facebook"
            className="mr-2 size-8"
          />
        </Button>
      </div>
    </form>
  )
}
