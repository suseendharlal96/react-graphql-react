import React, { useContext } from "react";

import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import PostCard from "../components/PostCard";
import { AuthContext } from "../context/auth";
import PostForm from "../components/PostForm";
import { FETCH_POSTS } from "../util/FetchPosts";

const Home = () => {
  const context = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS);

  return (
    <Grid columns={3} divided>
      <Grid.Row>
        <h2>Recent Posts</h2>
      </Grid.Row>
      <Grid.Row>
        {context.user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h2>Loading posts...</h2>
        ) : (
          <Transition.Group animation="zoom" duration="600">
            {data.getPosts &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: "15px" }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
