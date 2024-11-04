import { auth } from '@/auth/auth'

const { user } = await auth()

export default function Home() {
  return (
    <div>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
