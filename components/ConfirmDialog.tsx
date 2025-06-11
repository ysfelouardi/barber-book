interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4">
            {isDangerous ? (
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-200 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium shadow-lg ${
                isDangerous
                  ? 'bg-red-600 hover:bg-red-700 text-white border-2 border-red-600 hover:border-red-700 hover:shadow-red-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-600 hover:border-blue-700 hover:shadow-blue-200'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
