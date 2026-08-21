import { AnimatePresence, motion } from 'framer-motion'

const toastStyles = {
  success: 'toast-success',
  error: 'toast-error',
  info: 'toast-info',
}

export default function Toast({ toasts, onClose }) {
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className={`toast-item ${toastStyles[toast.type] || 'toast-info'}`}
            initial={{ opacity: 0, x: 30, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 30, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="toast-content">
              <strong>{toast.title}</strong>
              <span>{toast.message}</span>
            </div>
            <button type="button" className="icon-button simple" onClick={() => onClose(toast.id)} aria-label="Dismiss notification">
              ×
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
