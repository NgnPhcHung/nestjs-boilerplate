"use client";

import { useSuspenseQuery } from "@apollo/client";
import { Button, Flex, Typography } from "antd";
import gql from "graphql-tag";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Flex>
      <Typography>Welcome to summoner's rift</Typography>
      <Button onClick={() => router.push("selection")}>Go to selection</Button>
    </Flex>
  );
}
