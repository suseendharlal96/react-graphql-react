import React, { useState } from "react";

import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Icon, Confirm, Popup } from "semantic-ui-react";

import { FETCH_POSTS } from "../util/FetchPosts";

const DeleteButton = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const mutationType = props.commentId ? DELETE_COMMENT : DELETE_POST;

  const [deletePostOrComment] = useMutation(mutationType, {
    update(proxy) {
      if (!props.commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS,
        });
        // data.getPosts = data.getPosts.filter((p) => p.id !== props.postId);
        proxy.writeQuery({
          query: FETCH_POSTS,
          data: {
            getPosts: data.getPosts.filter((p) => p.id !== props.postId),
          },
        });
      }
      setIsOpen(false);
      if (props.redirect) {
        props.redirect();
      }
    },
    variables: { postId: props.postId, commentId: props.commentId },
  });

  return (
    <React.Fragment>
      <Popup
        content={props.commentId ? "Delete comment" : "Delete Post"}
        inverted
        trigger={
          <Icon
            style={{ float: "right", cursor: "pointer", marginTop: "10px" }}
            onClick={() => setIsOpen(true)}
            color="red"
            name="trash alternate"
          />
        }
      />
      <Confirm
        open={isOpen}
        onCancel={() => setIsOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </React.Fragment>
  );
};

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
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

export default DeleteButton;
