import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { Menu } from "semantic-ui-react";

import { AuthContext } from "../context/auth";

const MenuBar = () => {
  const context = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const menuContent = context.user ? (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item name={context.user.username} active as={Link} to="/" />
      <Menu.Menu position="right">
        <Menu.Item
          name="Logout"
          active={activeItem === "Logout"}
          onClick={context.logout}
        />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuContent;
};

export default MenuBar;
