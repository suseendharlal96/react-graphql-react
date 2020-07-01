import React, { useState, useContext } from "react";

import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/FormHooks";

const Register = (props) => {
  const context = useContext(AuthContext);

  const { formValue, onChangeInput, onSubmit } = useForm(triggerRegister, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(proxy, result) {
      console.log(result.data.signup);
      context.login(result.data.signup);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: formValue,
  });

  function triggerRegister() {
    registerUser();
  }

  return (
    <div style={{ width: "30%", margin: "auto" }}>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          value={formValue.username}
          onChange={onChangeInput}
          error={errors.username}
        />
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          value={formValue.email}
          onChange={onChangeInput}
          error={errors.email}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          value={formValue.password}
          onChange={onChangeInput}
          error={errors.password}
          type="password"
        />
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          value={formValue.confirmPassword}
          onChange={onChangeInput}
          error={errors.confirmPassword}
          type="password"
        />
        <Button type="submit" primary>
          Register
        </Button>
      </Form>
      {/* {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

const REGISTER_USER = gql`
  mutation signup(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    signup(
      signupInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
