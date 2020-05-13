import axios from 'axios';
const API_URL = 'http://95.217.20.238:3000';
export class APIService{

    constructor(){

    }

    getUser(token) {
        const url = `${API_URL}/api/user`;

        return axios.get(url, {
            headers: {
                Authorization: token,
                'Access-Control-Max-Age': 999999,
            }
        }).then(response => response.data);
    }
}