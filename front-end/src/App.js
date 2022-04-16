import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from './components/common/PrivateRoute';

import { auth } from "./firebase/firebaseConfig";
import requestsUsers from "./API/requestsUsers";
import { onAuthStateChanged } from "firebase/auth"; 

import Register from './components/log/Register';
import Login from './components/log/Login';
import Dashboard from './components/Dashboard';

function App() {
  onAuthStateChanged(auth, function (user) { 
    if(!user){
      requestsUsers.onAuthOut();
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />

        <Route path="/*"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
