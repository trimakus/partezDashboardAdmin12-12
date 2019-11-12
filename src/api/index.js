import axios from 'axios';

export default
   axios.create({
       //backend URL
     baseURL: 'http://127.0.0.1:8000/api/',
      timeout: 60000
   });
