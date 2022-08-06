import { createContext, useCallback, useEffect, useState } from 'react';

let logoutTimer;

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');

  const storedExpirationTime = localStorage.getItem('expirationTime');
  const remainingTime = calcRemainingTime(storedExpirationTime);
  if (remainingTime <= 60000) {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime');
    return null;
  }
  return {
    token: storedToken,
    duration: remainingTime
  }

}
const AuthContext = createContext({

  token: '',
  isLoggedIn: false,
  login: (token) => { },
  logout: () => { },
});
const calcRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingTime = adjExpirationTime - currentTime;
  return remainingTime;
}
export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }

  const [token, setToken] = useState(initialToken);
  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('expirationTime');
    localStorage.removeItem('token');
    if (logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }, []);

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration)
    }
  }, [tokenData, logoutHandler]);
  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    const remainingTime = calcRemainingTime(expirationTime);
    logoutTimer = setTimeout(logoutHandler, remainingTime)

  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  }
  return <AuthContext.Provider value={contextValue} >
    {props.children}
  </AuthContext.Provider >
}
export default AuthContext;
