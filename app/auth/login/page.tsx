import { LoginForm } from "@/components/login-form"
import { CmciLogo } from "@/components/cmci-logo"


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md px-4 py-8">
        <div className="flex justify-center mb-8">
          <CmciLogo className="h-24 w-auto" />
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
