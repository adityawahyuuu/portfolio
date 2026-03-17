export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
      <p className="text-gray-400 text-sm tracking-widest uppercase animate-pulse">Loading...</p>
    </div>
  )
}

