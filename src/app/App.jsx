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
        handleGetMe()
    }, [])

    // Wait for getMe to finish before rendering routes
    // Prevents protected routes from redirecting before auth state is known
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