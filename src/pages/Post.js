import React, { useContext, useEffect, useState, useRef } from "react";

import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  Grid,
  Card,
  Icon,
  Label,
  Button,
  Image,
  Form,
  Popup,
  Transition,
} from "semantic-ui-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Profile from "../images/talk.png";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { AuthContext } from "../context/auth";

const Post = (props) => {
  dayjs.extend(relativeTime);

  const [comment, setComment] = useState("");

  useEffect(() => {
    console.log(data);
  }, []);

  const commentRef = useRef(null);

  const context = useContext(AuthContext);

  const postId = props.match.params.postId;

  const { data } = useQuery(FETCH_SINGLE_POST, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(POST_COMMENT, {
    update() {
      setComment("");
      commentRef.current.blur();
    },
    variables: {
      postId: postId,
      body: comment,
    },
  });

  const redirectToHome = () => {
    props.history.push("/");
  };

  const postContent =
    data && data.getPost ? (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image floated="right" size="small" src={Profile} />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{data.getPost.username}</Card.Header>
                <Card.Meta>{dayjs(data.getPost.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{data.getPost.body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton
                  postId={data.getPost.id}
                  username={context.user ? context.user.username : null}
                  likes={data.getPost.likes}
                />
                <Popup
                  inverted
                  content="Post a comment"
                  trigger={
                    <Button as="div" labelPosition="right">
                      <Button color="teal" basic>
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="teal" pointing="left">
                        {data.getPost.comments.length}
                      </Label>
                    </Button>
                  }
                />
                {context.user &&
                  context.user.username === data.getPost.username && (
                    <DeleteButton
                      postId={data.getPost.id}
                      redirect={redirectToHome}
                    />
                  )}
              </Card.Content>
            </Card>
            {context.user && (
              <Card fluid>
                <Card.Content>
                  <Form>
                    <div className="ui action input field">
                      <input
                        type="text"
                        placeholder="Post a comment..."
                        value={comment}
                        name="comment"
                        ref={commentRef}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="ui button teal"
                        disabled={comment.trim() === "" ? true : false}
                        onClick={submitComment}
                      >
                        Post Comment
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            <Transition.Group animation="vertical flip" duration="700">
              {data.getPost.comments &&
                data.getPost.comments.map((comment) => (
                  <Card fluid key={comment.id}>
                    <Card.Content>
                      {context.user &&
                        context.user.username === comment.username && (
                          <DeleteButton
                            postId={data.getPost.id}
                            commentId={comment.id}
                          />
                        )}
                      <Card.Header>{comment.username}</Card.Header>
                      <Card.Meta>
                        {dayjs(comment.createdAt).fromNow()}
                      </Card.Meta>
                      <Card.Description>{comment.body}</Card.Description>
                    </Card.Content>
                  </Card>
                ))}
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    ) : (
      <p>Loading...</p>
    );

  return postContent;
};
const FETCH_SINGLE_POST = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
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

const POST_COMMENT = gql`
  mutation postComment($postId: ID!, $body: String!) {
    postComment(postId: $postId, body: $body) {
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

export default Post;
