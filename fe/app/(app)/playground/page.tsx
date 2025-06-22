import dynamic from "next/dynamic";

const SocketGame = dynamic(() => import("@/app/(components)/Game"), {
  ssr: false,
});

export default function PlaygroundPage() {
  return <SocketGame />;
}
