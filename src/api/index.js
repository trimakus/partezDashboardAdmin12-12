import axios from 'axios';

export default
   axios.create({
     //baseURL: 'http://127.0.0.1:8000/api/',
       baseURL: 'http://partez-bes.trimakus.com/api/',

       //baseURL: 'http://13.58.101.221:8001/api/',

      timeout: 60000
   });
