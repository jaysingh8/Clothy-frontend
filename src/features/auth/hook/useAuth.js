import { setError, setLoading, setUser } from "../state/auth.slice";
import { getMe, login, register } from "../service/auth.api";
import { useDispatch } from "react-redux"


export const useAuth = () => {

    const dispatch = useDispatch()

    async function handleRegister({ email, password, contact, fullname, isSeller = false }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))

            const data = await register({ email, password, contact, fullname, isSeller })

            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message || "Registration failed"))
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
            dispatch(setUser(data.user))
            return data.user
        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message || "Login failed"))
            throw error
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function handleGetMe() {
        try {

            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
                console.log(error);
                
        }

        finally {

            dispatch(setLoading(false))
        }
    }


    return { handleRegister, handleLogin, handleGetMe }
}