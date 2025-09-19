import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  isDeleteModal?: boolean;
  showActionButton?: boolean;
  titleStyle?: string;
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
  isDeleteModal = true,
  showActionButton = true,
  titleStyle = "",
}) => {
  if (!isOpen) return null;
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  return (
    <div className="fixed inset-0 z-[1111] flex items-center justify-center bg-black/50">
      <div className={cn("relative bg-white rounded-xl shadow-lg  animate-fade-in dark:bg-slate-800 dark:text-slate-50",isDesktopDevice ? "w-auto p-6" : "w-[20rem] p-6")}>
        <button
          onClick={onClose}
          className="absolute -top-0 -right-0 flex h-7 w-7 items-center justify-center  dark:text-white text-black "
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className={`text-sm text-gray-500 mt-1 ${titleStyle}`}>
            {description}
          </p>
        )}

        <div className="mt-4">{children}</div>

        {showActionButton && (
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:text-black"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm && onConfirm();
                onClose();
              }}
              className={cn(
                "px-4 py-2 rounded-md text-sm text-white",
                isDeleteModal
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-royalBlue hover:bg-blue-700"
              )}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomModal;
