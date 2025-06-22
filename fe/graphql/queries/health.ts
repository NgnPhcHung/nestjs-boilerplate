"use client";

import { getClient } from "@/libs/apolloClient";
import { gql } from "@apollo/client";

export const PING = gql`
  query Ping {
    ping
  }
`;

export async function Ping() {
  await getClient().query({ query: PING });
}
