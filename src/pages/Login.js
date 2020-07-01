import React, { useState, useContext } from "react";

import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";
import { useForm } from "../util/FormHooks";

const Login = (props) => {
  const context = useContext(AuthContext);

  const { formValue, onChangeInput, onSubmit } = useForm(triggerLogin, {
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      console.log(result);
      context.login(result.data.signin);
      props.history.push("/");
    },
    onError(err) {
      console.log(err.graphQLErrors);
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: formValue,
  });

  function triggerLogin() {
    loginUser();
  }

  return (
    <div style={{ width: "30%", margin: "auto" }}>
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
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
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {errors.general && errors.general.length > 1 && (
        <div className="ui error message">{errors.general}</div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
