const hostname = "http://localhost:5000"

class RequestError extends Error {
    constructor(status, body) {
        super()
        this.status = status
        this.body = body
    }
}

const makeRequest = async (subdom, callMethod, header, data, onSucess, onError) => {
    fetch(hostname+subdom, {
        method: callMethod,
        headers: header,
        body: data,
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response
        } else {
            return response.json().then(err => Promise.reject(new RequestError(response.status, err)))
        }
    })
    .then(response => response.json())
    .then(data => onSucess(data)) 
    .catch(error => onError(error))
}

const get = async (subdom, header, onSucess, onError) => {
    fetch(hostname+subdom, {
        headers: header,
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            return response
        } else {
            return response.json().then(err => Promise.reject(new RequestError(response.status, err)))
        }
    })
    .then(response => response.json())
    .then(data => onSucess(data))
    .catch(error => onError(error))
}

export const login = async (username, password, onSuccess, onError) => {
    const data = {
        'username' : username,
        'password' : password
    }
    makeRequest("/api/login", "POST", {"Content-Type": "application/json"}, JSON.stringify(data), onSuccess, onError)
}

export const register = async (username, password, email, onSuccess, onError) => {
    const data = {
        'username' : username,
        'email' : email, 
        'password' : password
    }
    
    makeRequest("/api/register", "POST", {"Content-Type": "application/json"}, JSON.stringify(data), onSuccess, onError)
}

export const createContest = async (title, description, prize_contest, deadline_date, contest_creator, onSuccess, onError) => {
    const data = {
        'title': title,
        'description': description,
        'prize_contest': prize_contest,
        'deadline_date': deadline_date,
        'contest_creator': contest_creator
    }

    makeRequest("/contest", "POST", {"Content-Type": "application/json"}, JSON.stringify(data), onSuccess, onError)
}

export const getStripeID = async (onSuccess, onError) => {
    get("/api/get_stripe_intent", {}, onSuccess, onError)
    return true
}

export const getOwnedContests = async (userId, onSuccess, onError) => {
    get(`/contests/owned/${userId}`, {"Content-Type": "application/json"}, onSuccess, onError)
}

export const getAllContest = async (onSuccess, onError) => {
    get("/contests", {}, onSuccess, onError)
}

export const getContestDetails = async(contestId, onSuccess, onError) => {
    get(`/contest/${contestId}`, {}, onSuccess, onError)
}

export default RequestError;
