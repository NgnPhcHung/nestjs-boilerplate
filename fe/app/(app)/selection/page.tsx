"use client";

import { Selection } from "@/app/(components)/Selection";
import { UserStorage } from "@/types/userStorage";
import { gql, useQuery } from "@apollo/client";
import { Spin } from "antd";
import { useEffect } from "react";

const userQuery = gql`
  query getMe {
    getMe {
      id
      email
      name
      role
    }
  }
`;

export default function SelectionPage() {
  const { data, loading } = useQuery<{ getMe: UserStorage }>(userQuery);

  useEffect(() => {
    if (data?.getMe) localStorage.setItem("user", JSON.stringify(data.getMe));
  }, [data]);

  if (loading) {
    return <Spin />;
  }
  return <Selection />;
}
