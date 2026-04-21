import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col items-center justify-center ">
      <h1 className="text-6xl font-bold mb-4">Presto Slides</h1>

      <p className="text-gray-300 mb-8">
        Create, present, and share slides instantly.
      </p>

      <div className="flex gap-4">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/login")}
        >
        Login
        </button>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/register")}
        >
        Register
        </button>
      </div>
    </div>
  )
}