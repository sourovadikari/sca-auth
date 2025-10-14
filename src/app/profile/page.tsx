'use client'

import { useSession, signOut } from "next-auth/react"

export default function ProfilePage() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p className="p-6 text-center">Loading...</p>
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="p-6 text-center">
        <p>You are not logged in.</p>
        <a href="/login" className="text-blue-600 underline">
          Go to Login
        </a>
      </div>
    )
  }

  const { user } = session
  // Custom properties (role, emailVerified) are on user if you added them to your session callback.

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="space-y-4 bg-white dark:bg-gray-900 p-6 rounded shadow-md">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Name</h2>
          <p className="text-lg">{user.name ?? "N/A"}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email</h2>
          <p className="text-lg">{user.email ?? "N/A"}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Role</h2>
          <p className="text-lg">{user.role ?? "N/A"}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Email Verified</h2>
          <p className="text-lg">{user.emailVerified ? "Yes" : "No"}</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Sign Out
        </button>
      </div>
    </main>
  )
}
