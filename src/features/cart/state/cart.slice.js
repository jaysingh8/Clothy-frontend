import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        totalPrice: 0,
        currency: "INR"
    },
    reducers: {
        setItems: (state, action) => {
            const { items, totalPrice, currency } = action.payload
            state.items = items || []
            state.totalPrice = totalPrice || 0
            state.currency = currency || "INR"
        },
        addItem: (state, action) => {
            state.items.push(action.payload)
        },
        increamentCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            const item = state.items.find(item => {
                const itemProductId = item.product?._id || item.product
                const itemVariantId = item.variant
                
                if (itemProductId !== productId) return false
                
                if (!variantId && !itemVariantId) return true
                if (variantId && itemVariantId) return itemVariantId.toString() === variantId
                
                return false
            })

            if (item) item.quantity += 1
        },
        decreamentCartItem: (state, action) => {
            const { productId, variantId } = action.payload

            const itemIndex = state.items.findIndex(item => {
                const itemProductId = item.product?._id || item.product
                const itemVariantId = item.variant
                
                if (itemProductId !== productId) return false
                
                if (!variantId && !itemVariantId) return true
                if (variantId && itemVariantId) return itemVariantId.toString() === variantId
                
                return false
            })

            if (itemIndex !== -1) {
                const item = state.items[itemIndex]
                if (item.quantity > 1) {
                    item.quantity -= 1
                } else {
                    state.items.splice(itemIndex, 1)
                }
            }
        },
        removeCartItem: (state, action) => {
            const { productId, variantId } = action.payload
                
            state.items = state.items.filter(item => {
                const itemProductId = item.product?._id || item.product
                const itemVariantId = item.variant
                
                if (itemProductId !== productId) return true
                
                if (!variantId && !itemVariantId) return false
                if (variantId && itemVariantId) return itemVariantId.toString() !== variantId
                
                return true
            })
        }
    }
})

export const { setItems, addItem, increamentCartItem, decreamentCartItem, removeCartItem } = cartSlice.actions

export default cartSlice.reducer
