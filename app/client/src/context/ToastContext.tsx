import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

let nextId = 0

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-green-500 bg-green-50 dark:bg-green-950/20',
  error: 'border-red-500 bg-red-50 dark:bg-red-950/20',
  info: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) {
  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border-l-4 px-4 py-3 shadow-lg text-sm animate-in slide-in-from-right',
        styles[toast.type]
      )}
    >
      <Icon className={cn(
        'h-4 w-4 shrink-0',
        toast.type === 'success' && 'text-green-600 dark:text-green-400',
        toast.type === 'error' && 'text-red-600 dark:text-red-400',
        toast.type === 'info' && 'text-blue-600 dark:text-blue-400',
      )} />
      <span className="flex-1 text-foreground">{toast.message}</span>
      <button onClick={() => onRemove(toast.id)} className="shrink-0 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
