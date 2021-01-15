const hostname = "http://localhost:5000"

export const login = async (username, password, onSuccess, onError) => {
    const data = {
        'username' : username,
        'password' : password
    }
    
    fetch(hostname+'/api/login', {
        method: "POST", 
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            return response.data
        } else {
            throw response
        }
    })
    .then(data => onSuccess(data))
    .catch(response => onError(response))
}