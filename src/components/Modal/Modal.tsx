import type { FC, ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import css from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && onClose();

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return createPortal(
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;