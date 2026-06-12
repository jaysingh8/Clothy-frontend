import { setError, setLoading, setUser } from "../state/auth.slice"
import { getMe, login, register } from "../service/auth.api"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"

export const useAuth = () => {
    const dispatch = useDispatch()

    async function handleRegister({ email, password, contact, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await register({ email, password, contact, fullname, isSeller })

            // Save token to localStorage so it's sent on every future request
            localStorage.setItem("token", data.token)

            dispatch(setUser(data.user))
            toast.success("Account created successfully!")
            return data.user
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Registration failed"
            dispatch(setError(message))
            toast.error(message)
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await login({ email, password })

            // Save token to localStorage so it's sent on every future request
            localStorage.setItem("token", data.token)

            dispatch(setUser(data.user))
            toast.success("Logged in successfully!")
            return data.user
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Login failed"
            dispatch(setError(message))
            toast.error(message)
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        // If no token in localStorage, user is not logged in — skip the API call entirely
        const token = localStorage.getItem("token")
        if (!token) {
            dispatch(setUser(null))
            dispatch(setLoading(false))
            return
        }

        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            // Token is invalid or expired — clean up
            const message = error.response?.data?.message || error.message
            console.log("getMe failed:", message)
            localStorage.removeItem("token")
            dispatch(setUser(null))
        } finally {
            dispatch(setLoading(false))
        }
    }

    function handleLogout() {
        localStorage.removeItem("token")
        dispatch(setUser(null))
        dispatch(setError(null))
        toast.success("Logged out successfully!")
    }

    return { handleRegister, handleLogin, handleGetMe, handleLogout }
}