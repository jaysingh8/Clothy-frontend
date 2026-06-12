import { createSlice } from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: true,  // true on first load so App.jsx waits for getMe
        error: null
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        logout: (state) => {
            state.user = null
            state.error = null
            state.loading = false
        }
    }
})

export const { setError, setLoading, setUser, logout } = authSlice.actions
export default authSlice.reducer