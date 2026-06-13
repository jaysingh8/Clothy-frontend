import { addItem, getCart, increamentCartItemApi, decreamentCartItemApi, removeCartItemApi, createOrderApi, verifyOrderApi } from "../service/cart.api"
import { useDispatch } from "react-redux"
import { addItem as addItemToCart, setItems, increamentCartItem, decreamentCartItem, removeCartItem } from "../state/cart.slice"
import { toast } from "react-toastify"

export const useCart = () => {
    const dispatch = useDispatch()

    async function handleAddItem({ productId, variantId }) {
        try {
            const data = await addItem({ productId, variantId })
            toast.success("Item added to cart!")
            return data
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add item to cart")
            throw error
        }
    }

    async function handleGetCart() {
        try {
            const data = await getCart()
            dispatch(setItems(data.cart))
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load cart")
        }
    }

    async function handleIncreamentCartItem({ productId, variantId }) {
        try {
            const data = await increamentCartItemApi({ productId, variantId })
            dispatch(increamentCartItem({ productId, variantId }))
            toast.success("Quantity increased")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity")
        }
    }

    async function handleDecreamentCartItem({ productId, variantId }) {
        try {
            const data = await decreamentCartItemApi({ productId, variantId })
            dispatch(decreamentCartItem({ productId, variantId }))
            toast.success("Quantity decreased")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity")
        }
    }

    async function handleRemoveCartItem({ productId, variantId }) {
        try {
            const data = await removeCartItemApi({ productId, variantId })
            dispatch(removeCartItem({ productId, variantId }))
            toast.success("Item removed from cart")
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item")
        }
    }

    async function handleCheckout() {
        try {
            // 1. Create Razorpay order on backend
            const { order } = await createOrderApi()

            // 2. Configure Razorpay checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Clothy",
                description: "Premium Fashion",
                order_id: order.id,
                handler: async function (response) {
                    // 3. Verify payment on backend
                    const result = await verifyOrderApi({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    })

                    if (result.success) {
                        toast.success("Payment successful! 🎉")
                        // Refresh cart after successful payment
                        dispatch(setItems({ items: [], totalPrice: 0, currency: "INR" }))
                    }
                },
                prefill: {
                    contact: '',
                    email: ''
                },
                theme: {
                    color: "#b8973a"
                }
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to initiate payment")
        }
    }

    return {
        handleAddItem,
        handleGetCart,
        handleIncreamentCartItem,
        handleDecreamentCartItem,
        handleRemoveCartItem,
        handleCheckout
    }
}