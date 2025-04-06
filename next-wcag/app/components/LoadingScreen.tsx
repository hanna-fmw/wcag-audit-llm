import { Loader2 } from "lucide-react"

export const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      <p className="text-zinc-500">Running accessibility audit...</p>
    </div>
  )
}
