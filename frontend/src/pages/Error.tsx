import { useEffect } from "react"

type ErrorPopupProps = {
  message: string
  onClose: () => void
}

export default function ErrorPopup({ message, onClose }: ErrorPopupProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div className="relative bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg min-w-[280px] animate-fade-in">
        <p className="text-center font-medium">{message}</p>

        <button
          onClick={onClose}
          className="mt-3 w-full bg-white text-red-500 py-1 rounded hover:bg-gray-100 transition"
        >
          Close
        </button>
      </div>
    </div>
  )
}