import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  message?: ReactNode;
  width?: string;
  height?: string;
};

export const Spinner = ({
  message = "Loading...",
  width = "w-full",
  height = "h-svh",
}: Props) => {
  return (
    <div
      className={`flex ${height} ${width} flex-col items-center justify-center gap-2 text-sm`}
    >
      <Loader2 className="animate-spin" /> {message}
    </div>
  );
};
