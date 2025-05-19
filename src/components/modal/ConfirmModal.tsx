import React from "react"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 animate-fade-in">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}

        <div className="mt-4">{children}</div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm?.()
              onClose()
            }}
            className="px-4 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomModal
