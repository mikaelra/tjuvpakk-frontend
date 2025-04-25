import { useEffect, useState } from "react";

export default function FloatingMessage({
  message,
  onDone,
}: {
  message: string;
  onDone: () => void;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 800);
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed z-50 pointer-events-none left-1/2 top-1/3 -translate-x-1/2 px-8 py-4 text-xl sm:text-2xl max-w-[80vw] text-center whitespace-pre-line rounded-xl font-bold bg-black/90 text-white shadow-xl transition-all duration-700 ${
        visible ? "opacity-100 scale-100" : "opacity-0 translate-y-20 scale-90"
      }`}
    >
      {message}
    </div>
  );
}