import RequestError, {makeRequest} from "./apiCalls"

const hostname = "https://api.stripe.com/v1"

export const createCustomer = async (username, email, onSuccess, onError) => {
    const formData = new FormData()
    formData.append('')

    const data = {
        'username' : username,
        'email' : email
    }
    makeRequest("/api/login", "POST", {"Content-Type": "application/json"}, JSON.stringify(data), onSuccess, onError)
}

export default RequestError;