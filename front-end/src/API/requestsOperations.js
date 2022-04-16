import { auth } from "../firebase/firebaseConfig";
import API, { getHeadersRequestAPI } from "./connect";

class RequestsOperations {
  constructor() {
    this.auth = auth;
  }

  create(dataOperation) {
    return new Promise(async (resolve, reject) => {
      const { type, description, amount, date } = dataOperation;

      const response = {
        error: false
      };

      try {
        let created = await API.post(`operations/create`, { type, description, amount, date }, getHeadersRequestAPI());
        response.data = created;

        resolve(response);

      } catch (error) {
        response.error = error.code;
        resolve(response);
      };
    });
  }

  update(id, dataOperation) {
    return new Promise(async (resolve, reject) => {

      const { type, description, amount, date } = dataOperation;

      const response = {
        error: false
      };

      try {
        let updated = await API.put(`operations/update/${id}`, { type, description, amount, date }, getHeadersRequestAPI());
        response.data = updated;

        resolve(response);

      } catch (error) {
        response.error = error.code;
        resolve(response);
      };
    });
  }

  delete(id) {
    return new Promise(async (resolve, reject) => {
      const response = {
        error: false
      };

      try {
        let deleted = await API.delete(`operations/delete/${id}`, getHeadersRequestAPI());
        response.data = deleted;

        resolve(response);

      } catch (error) {
        response.error = error.code;
        resolve(response);
      };
    });
  }

  list() {
    return new Promise(async (resolve, reject) => {
      const response = {
        error: false
      };

      try {
        let operations = await API.get(`operations/list`, getHeadersRequestAPI());
        resolve(operations);

      } catch (error) {
        response.error = error.code;
        resolve(response);
      };
    });
  }
}


export default new RequestsOperations();

