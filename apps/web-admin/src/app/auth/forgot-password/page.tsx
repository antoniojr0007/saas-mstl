import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  return (
    <form action="" className="space-y-4">
      <div className="space-y-1">
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
      </div>

      <Button type="submit" className="w-full rounded-full">
        Recover password
      </Button>
      <Button className="w-full" size="sm" asChild variant="link">
        <Link href="/auth/sign-in">Sign in instead</Link>
      </Button>
    </form>
  )
}
