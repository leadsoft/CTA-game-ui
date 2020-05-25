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

    gameTables(token) {
        const url = `${API_URL}/api/get-game-tables`;

        return axios.get(url, {
            headers: {
                Authorization: token
            }
        }).then(response => response);
    }

    gameDetails(token, gameId) {
        const url = `${API_URL}/api/get-game-details/` + gameId;

        return axios.get(url, {
            headers: {
                Authorization: token
            }
        }).then(response => response);
    }

    placeBet(token, data) {
        const url = `${API_URL}/api/place-bet`;

        const options = {
            headers: {
                Authorization: token,
                'Access-Control-Max-Age': 999999,
            },
            /*timeout: 5000*/
        };

        return axios.post(url, data, options).then(response => response.data);
    }
}