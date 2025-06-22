"use client";

import { Button, Flex } from "antd";
import { useRouter } from "next/navigation";

export const Selection = () => {
  const router = useRouter();

  return (
    <Flex>
      <Button onClick={() => router.push("playground")}>
        Go to playground
      </Button>
    </Flex>
  );
};
