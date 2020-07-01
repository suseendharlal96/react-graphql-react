import React, { useState, useEffect } from "react";

import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Form, Button } from "semantic-ui-react";

import { useForm } from "../util/FormHooks";
import { FETCH_POSTS } from "../util/FetchPosts";

const PostForm = () => {
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, []);

  const { formValue, onChangeInput, onSubmit } = useForm(triggerCreatePost, {
    body: "",
  });

  const [createPost] = useMutation(CREATE_POST, {
    update(proxy, result) {
      const postsData = proxy.readQuery({
        query: FETCH_POSTS,
      });
      proxy.writeQuery({
        query: FETCH_POSTS,
        data: {
          getPosts: [result.data.createPost, ...postsData.getPosts],
        },
      });
      console.log(result);
      formValue.body = "";
    },
    variables: formValue,
    onError(err) {
      setError(err.graphQLErrors[0].message);
      console.log(err.graphQLErrors[0].message);
    },
  });

  function triggerCreatePost() {
    createPost();
  }

  return (
    <Form onSubmit={onSubmit}>
      <h2>Create Post</h2>
      <Form.Field>
        <Form.Input
          name="body"
          placeholder="Write a post.."
          value={formValue.body}
          onChange={onChangeInput}
          error={error.length > 0 ? error : null}
        />
        <Button style={{ marginBottom: "15px" }} type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
};

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      username
      body
      createdAt
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        username
        createdAt
      }
    }
  }
`;

export default PostForm;
