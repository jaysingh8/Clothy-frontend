import './App.css'
import { RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { routes } from './app.routes.jsx'
import { useSelector } from 'react-redux'
import { useAuth } from '../features/auth/hook/useAuth.js'
import { useEffect } from 'react'

function App() {
    const { handleGetMe } = useAuth()
    const { loading } = useSelector(state => state.auth)

    useEffect(() => {
        // When Google OAuth redirects back, it adds ?token= to the URL
        // Save it to localStorage so all future requests include it
        const params = new URLSearchParams(window.location.search)
        const googleToken = params.get("token")
        if (googleToken) {
            localStorage.setItem("token", googleToken)
            // Clean the token out of the URL
            window.history.replaceState({}, "", "/")
        }

        handleGetMe()
    }, [])

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <>
            <RouterProvider router={routes} />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}

export default App