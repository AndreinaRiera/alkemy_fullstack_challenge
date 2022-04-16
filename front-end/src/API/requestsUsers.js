import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "@firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import API, { getHeadersRequestAPI } from "./connect";

class RequestsUsers {
  constructor() {
    this.auth = auth;
  }

  signIn(dataUser) {
    return new Promise(async (resolve, reject) => {
      const { email, password } = dataUser;

      const response = {
        error: false
      };

      try {
        let user = await signInWithEmailAndPassword(auth, email, password);
        await this.saveInfoUser(user);

        resolve(response);

      } catch (error) {
        response.error = error.code;
        resolve(response);
      };

    });
  }


  create(dataUser) {
    return new Promise(async (resolve, reject) => {
      const { email, password, name, lastname } = dataUser;

      const response = {
        error: false
      };

      try {
        let user = await createUserWithEmailAndPassword(this.auth, email, password);
        const token = await user.user.getIdToken();

        
        let created = await API.post(`users/create`, { name, lastname }, getHeadersRequestAPI(token));

        await this.saveInfoUser(user);

        response.data = created;

        resolve(response);

      } catch (error) {
        response.error = error.code;
        resolve(response);
      };
    });
  }


  resetPassword(email) {
    return new Promise(async (resolve, reject) => {
      const response = {
        error: false
      };

      try {
        await sendPasswordResetEmail(auth, email);
        resolve(response);

      } catch (error) {
        response.error = error.code;
        resolve(response);
      };
    });
  }




  logout() {
    signOut(auth);
  }



  getInfoCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }



  isRegistered() {
    return (this.getInfoCurrentUser() ? true : false);
  }


  onAuthOut() {
    if (this.isRegistered()) {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      window.location.reload();
    }
  }


  async saveInfoUser({ user }) {
    return new Promise(async (resolve, reject) => {
      const uid = user.uid;

      await this.onAuthIn(user);
      
      API.get(
        `users/get/${uid}`,
        getHeadersRequestAPI()
      ).then(({ data }) => {
        if (data && data.data && !data.error) {

          localStorage.setItem('user', JSON.stringify({
            ...data.data,
            fullname: `${(data.data.name + ' ' + data.data.lastname).ToCapitalize('all')}`,
          }));

          resolve(true);

        } else {
          reject(true);
        }

      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }


  onAuthIn(user) {
    return new Promise(async (resolve, reject) => {
      user.getIdToken().then(token => {
        
        localStorage.setItem('userToken', token);
        resolve(true);
        
      });
    });
  }
}


export default new RequestsUsers();

