import ProtectedRoute from "../../components/ProtectedRoute"
import { useSession } from "next-auth/react"

export default function ProfilePage() {
  const { data: session } = useSession()

  return (
    <ProtectedRoute>
      <h1>Profile Page</h1>
      <p>Welcome, {session?.user?.name}!</p>
      {/* Add more profile information here */}
    </ProtectedRoute>
  )
}
