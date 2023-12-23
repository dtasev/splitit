import Header from './apps/Header'
import Main from './apps/main/Main'

import './App.css'
import { createContext, useState } from 'react';
import Login from './apps/Login';
import { Container } from 'react-bootstrap';

const UserContext = createContext<string>("");

interface LoginResponse {
  token: string,
}

function App() {

  const [token, setToken] = useState<string>("");

  const onSuccessLogin = (json: LoginResponse) => {
    setToken(json.token);
  }
  const loginElem = <Login onSuccess={onSuccessLogin} />;

  return (
    <>
      <UserContext.Provider value={token}>
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