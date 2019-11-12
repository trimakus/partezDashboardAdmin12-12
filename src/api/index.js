import axios from 'axios';

export default
   axios.create({
       //backend URL
     //baseURL: 'http://127.0.0.1:8000/api/',
    baseURL: 'http://partez-bes.trimakus.com/api/',
      timeout: 60000
   });
