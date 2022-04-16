import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import requestsUsers from '../../API/requestsUsers';

import MainNavbar from './MainNavbar';
import Home from './pages/Home';

export default function Index() {
  const [user, setUser] = useState({})

  useEffect(() => {
    const infoUser = requestsUsers.getInfoCurrentUser();
    setUser(infoUser);
  }, []);

  const onLogout = () => {
    requestsUsers.logout();
  };

  return (
    <>
      <MainNavbar nickname={user?.fullname} logout={onLogout} />

      <div className="container" style={
        {
          marginTop: '100px',
        }
      }>
        <div className="row">
          <div className="col">
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </div>
      </div>
    </>
  )
}
