import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex justify-center items-center overflow-hidden">
      {children}
    </div>
  );
}
