import Header from './apps/Header'
import Main from './apps/main/Main'

import './App.css'
import { createContext, useState } from 'react';
import Login from './apps/Login';
import { Container } from 'react-bootstrap';


const UserContext = createContext<UserContextI>({ username: null, token: null });

function App() {

  const [userDeets, setUserDeets] = useState<UserContextI>({ username: null, token: null });

  const onSuccessLogin = (json: UserContextI) => {
    setUserDeets(json);
  }
  const loginElem = <Login onSuccess={onSuccessLogin} />;

  return (
    <>
      <UserContext.Provider value={userDeets}>
        <Container fluid={true}>
          <Header loginElem={loginElem} />
          <Main />
        </Container>
      </UserContext.Provider>
    </>
  )
}

export { UserContext };
export default App;