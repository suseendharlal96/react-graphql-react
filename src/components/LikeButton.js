import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Button, Icon, Label, Popup } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const LikeButton = (props) => {
  const [liked, setliked] = useState(false);

  useEffect(() => {
    if (
      props.username &&
      props.likes.find((like) => like.username === props.username)
    ) {
      setliked(true);
    } else {
      setliked(false);
    }
  }, [props.username, props.likes]);

  const [likeunlikePost] = useMutation(LIKE_POST, {
    variables: { postId: props.postId },
  });

  const likeButton = props.username ? (
    liked ? (
      <Button color="red">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="red" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button as={Link} to="/login" color="red" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <Popup
      inverted
      content={liked ? "Unlike" : "Like"}
      trigger={
        <Button as="div" labelPosition="right" onClick={likeunlikePost}>
          {likeButton}
          <Label basic color="red" pointing="left">
            {liked
              ? `Liked by you and ${props.likes.length - 1} ${
                  props.likes.length - 1 > 1 ? "others" : "other"
                }`
              : `${props.likes.length} ${
                  props.likes.length > 1 ? "likes" : "like"
                }`}
          </Label>
        </Button>
      }
    />
  );
};

const LIKE_POST = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
        createdAt
      }
    }
  }
`;

export default LikeButton;
