import axios from 'axios'

const cartAPIInstance = axios.create({
    baseURL:`${import.meta.env.VITE_API_URL || ""}/api/cart`,
    withCredentials:true
})


cartAPIInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


export const addItem = async ({productId,variantId}) => {
    const response = await cartAPIInstance.post(`/add/${productId}/${variantId}`,{
        quantity:1
    }
    )

    return response.data
}

export const getCart = async () => {
    const response = await cartAPIInstance.get("/")
    return response.data
}


export const increamentCartItemApi = async ({productId,variantId}) => {
    const response = await cartAPIInstance.patch(`/quantity/increament/${productId}/${variantId}`)
    return response.data
}

export const decreamentCartItemApi = async ({productId,variantId}) => {
    const response = await cartAPIInstance.patch(`/quantity/decreament/${productId}/${variantId}`)
    return response.data
}
export const removeCartItemApi = async ({productId,variantId}) => {
    const response = await cartAPIInstance.delete(`/remove/${productId}/${variantId}`)
    return response.data
}

export const createOrderApi = async () => {
    const response = await cartAPIInstance.post("/payment/create/order")
    return response.data
}

export const verifyOrderApi = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartAPIInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })
    return response.data
}