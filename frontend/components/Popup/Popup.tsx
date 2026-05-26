import { type ReactNode } from "react";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Popup = ({ open, onClose, children }: PopupProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-150">{children}</div>
    </div>
  );
};
