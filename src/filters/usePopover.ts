import { useEffect } from "react";

type Props = {
  popoverRef: React.RefObject<HTMLDivElement>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  setIsOpen: (open: boolean) => void;
};

export function usePopover({ popoverRef, buttonRef, setIsOpen }: Props) {
  useEffect(() => {
    window.addEventListener("click", e => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    });
    window.addEventListener("keyup", e => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    });
    return () => {
      window.removeEventListener("click", () => {});
      window.removeEventListener("keyup", () => {});
    };
  });

  return {
    setIsOpen,
  };
}
