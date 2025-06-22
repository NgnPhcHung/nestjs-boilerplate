"use client";

import { Button, Flex } from "antd";
import { useRouter } from "next/navigation";

export default function SelectionPage() {
  const router = useRouter();

  return (
    <Flex>
      <Button onClick={() => router.push("playground")}>
        Go to playground
      </Button>
    </Flex>
  );
}
