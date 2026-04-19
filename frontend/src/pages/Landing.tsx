export default function Landing() {
  return (
    <div className="min-h-screen w-full overflow-hidden flex flex-col items-center justify-center ">
      <h1 className="text-6xl font-bold mb-4">Presto Slides</h1>

      <p className="text-gray-300 mb-8">
        Create, present, and share slides instantly.
      </p>

      <div className="flex gap-4">
        <button className="px-6 py-3">
          Login
        </button>
        <button className="px-6 py-3">
          Register
        </button>
      </div>
    </div>
  )
}