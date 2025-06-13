import {useEffect, useState} from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { UserContext } from "./UserContext.js";


export function UserContextProvider({children}) {
  const [user,setUser] = useState(null);
  const [ready,setReady] = useState(false);
  useEffect(() => {
  if (!user) {
    axios.get('/api/profile').then(({data}) => {
      setUser(data);
      setReady(true);
    });
  }
}, [user]);
  return (
    <UserContext.Provider value={{user,setUser,ready}}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};