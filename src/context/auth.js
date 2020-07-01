import React, { createContext, useReducer } from "react";

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

const AuthReducer = (initState, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("jwtToken", action.userData.token);
      return {
        ...initState,
        user: action.userData,
      };

    case "LOGOUT":
      localStorage.clear();
      return {
        ...initState,
        user: null,
      };

    default:
      return initState;
  }
};

const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(AuthReducer, { user: null });

  const login = (userData) => {
    dispatch({
      type: "LOGIN",
      userData: userData,
    });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
