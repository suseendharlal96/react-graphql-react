import gql from "graphql-tag";

export const FETCH_POSTS = gql`
  {
    getPosts {
      id
      body
      username
      createdAt
      likes {
        id
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
