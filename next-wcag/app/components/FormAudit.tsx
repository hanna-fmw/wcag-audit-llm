import { MessageCircle, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"

interface FormProps {
  onSubmit: (url: string) => void
  isLoading: boolean
}

export const FormAudit = ({ onSubmit, isLoading }: FormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const url = formData.get('url') as string
    onSubmit(url)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 flex-1 p-4 justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-zinc-500" />
          <span className="text-sm text-zinc-500">Website URL</span>
        </div>
        <Input
          name="url"
          type="url"
          size={16}
          placeholder="Enter URL to audit..."
          className="w-full bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 rounded-xl focus:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 focus-visible:border-zinc-900 dark:focus-visible:border-zinc-100"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-9 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-sm font-medium rounded-xl transition-colors self-end"
      >
        <Sparkles className="w-4 h-4" />
        {isLoading ? 'Auditing...' : 'Run Audit'}
      </button>
    </form>
  )
}
