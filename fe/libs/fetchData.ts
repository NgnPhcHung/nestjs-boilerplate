import { gql } from "@apollo/client";
import { getClient } from "./apolloClient";

export async function queryRSC() {
  const { data } = await getClient().query({
    query: gql`
      query {
        characters(page: 1, filter: { name: "rick" }) {
          results {
            id
            name
            image
          }
        }
      }
    `,
  });

  return data.characters.results;
}
