"use client";

import { Selection } from "@/app/(components)/Selection";
import { useSuspenseQuery } from "@apollo/client";

import gql from "graphql-tag";
const PING = gql`
  query Ping {
    ping
  }
`;

export default function SelectionPage() {
  const { data, error } = useSuspenseQuery(PING);
  console.log({ data, error });

  return <Selection />;
}
