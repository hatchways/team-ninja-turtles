import { theme } from "./themes/theme"

const hostname = "http://localhost:5000"

const makeRequest = async (subdom, callMethod, header, data, onSucess, onError, ) => {
    fetch(hostname+subdom, {
        method: callMethod,
        headers: header,
        body: data
    }).
    then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw response
        }
    })
    .then(data => onSucess) 
    .catch(response => onError(response))
}

export const login = async (username, password, onSuccess, onError) => {
    const data = {
        'username' : username,
        'password' : password
    }
    makeRequest("/api/login", {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body:JSON.stringify(data)
    }, onSuccess, onError)
}

export const register = async (username, password, email, onSuccess, onError) => {
    const data = {
        'username' : username,
        'email' : email, 
        'password' : password
    }
    
    makeRequest("/api/register", {
        method: "POST", 
        headers: {"Content-Type": "application/json"}, 
        body:JSON.stringify(data)
    }, onSuccess, onError)
}
