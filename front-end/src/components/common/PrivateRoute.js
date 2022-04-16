import requestsUsers from "../../API/requestsUsers";
import { Navigate, useLocation  } from "react-router-dom";
//import {auth} from '../../firebase/firebaseConfig';

export default function PrivateRoute({ children, redirectTo }) {
    const userIsRegistered = requestsUsers.isRegistered();
    //const location = useLocation();
    
    if(!userIsRegistered){ 
        return <Navigate to={redirectTo || "./login"} replace />
    }

    return children;
}
