import axios from 'axios'

const authApiInstance = axios.create({
    baseURL: `https://clothy-backend-djl7.onrender.com/api/auth`,
    withCredentials: true
})

// Attach token from localStorage to every request automatically
authApiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export async function register({ email, password, contact, fullname, isSeller }) {
    const response = await authApiInstance.post("/register", {
        email,
        contact,
        password,
        fullname,
        isSeller
    })
    return response.data
}

export async function login({ email, password }) {
    const response = await authApiInstance.post("/login", {
        email,
        password
    })
    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/me")
    return response.data
}