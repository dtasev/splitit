import Header from './apps/Header'
import { createContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import './App.css'

const UserContext = createContext<UserContextI>({ id: null, username: null, token: null });

function App() {

  const [userDeets, setUserDeets] = useState<UserContextI>({ id: null, username: null, token: null });

  const onSuccessLogin = (json: UserContextI) => {
    setUserDeets(json);
  }

  return (
    <UserContext.Provider value={userDeets}>
      <Container fluid={true}>
        <Header onSuccessLogin={onSuccessLogin} />
        <Outlet />
      </Container>
    </UserContext.Provider>
  )
}

export { UserContext };
export default App;