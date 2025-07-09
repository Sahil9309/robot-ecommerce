import { useState } from "react";
import PropTypes from "prop-types";
import { UserContext } from "./UserContext.js";

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready] = useState(true);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
