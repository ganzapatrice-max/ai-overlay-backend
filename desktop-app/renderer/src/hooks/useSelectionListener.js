import { useEffect } from "react";

export default function useSelectionListener(onSelect) {
  useEffect(() => {
    const handler = () => {
      const text = window.getSelection().toString();
      if (text.trim().length > 0) onSelect(text);
    };

    document.addEventListener("mouseup", handler);
    return () => document.removeEventListener("mouseup", handler);
  }, [onSelect]);
}
