import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { Card, Icon, Label, Image, Button, Popup } from "semantic-ui-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Profile from "../images/talk.png";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

const PostCard = (props) => {
  dayjs.extend(relativeTime);

  const context = useContext(AuthContext);

  const commentPost = () => {};

  return (
    <Card fluid>
      <Card.Content>
        <Image floated="right" size="mini" src={Profile} />
        <Card.Header as={Link} to={`/posts/${props.post.id}`}>
          {props.post.username}
        </Card.Header>
        <Card.Meta>{dayjs(props.post.createdAt).fromNow()}</Card.Meta>
        <Card.Description>{props.post.body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton
          postId={props.post.id}
          username={context.user ? context.user.username : null}
          likes={props.post.likes}
        />
        <Popup
          inverted
          content="Post a comment"
          trigger={
            <Button
              as="div"
              labelPosition="right"
              as={Link}
              to={`/posts/${props.post.id}`}
            >
              <Button color="teal" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="teal" pointing="left">
                {props.post.comments.length}
              </Label>
            </Button>
          }
        />
        {context.user && context.user.username === props.post.username && (
          <DeleteButton postId={props.post.id} />
        )}
      </Card.Content>
    </Card>
  );
};
export default PostCard;
