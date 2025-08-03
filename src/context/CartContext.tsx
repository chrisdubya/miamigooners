import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'

export interface CartItem {
  variantId: string
  productId: string
  productTitle: string
  variantTitle: string
  price: {
    amount: string
    currencyCode: string
  }
  image?: {
    url: string
    altText: string
  }
  quantity: number
  availableForSale: boolean
}

interface CartState {
  items: CartItem[]
  totalQuantity: number
}

type CartAction = 
  | { type: 'ADD_ITEM'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; variantId: string }
  | { type: 'UPDATE_QUANTITY'; variantId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] }

const initialState: CartState = {
  items: [],
  totalQuantity: 0
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.variantId === action.item.variantId)
      
      let newItems: CartItem[]
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.item, quantity: 1 }]
      }
      
      return {
        items: newItems,
        totalQuantity: newItems.reduce((total, item) => total + item.quantity, 0)
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.variantId !== action.variantId)
      return {
        items: newItems,
        totalQuantity: newItems.reduce((total, item) => total + item.quantity, 0)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        const newItems = state.items.filter(item => item.variantId !== action.variantId)
        return {
          items: newItems,
          totalQuantity: newItems.reduce((total, item) => total + item.quantity, 0)
        }
      }
      
      const newItems = state.items.map(item =>
        item.variantId === action.variantId
          ? { ...item, quantity: action.quantity }
          : item
      )
      
      return {
        items: newItems,
        totalQuantity: newItems.reduce((total, item) => total + item.quantity, 0)
      }
    }
    
    case 'CLEAR_CART':
      return initialState
    
    case 'LOAD_CART':
      return {
        items: action.items,
        totalQuantity: action.items.reduce((total, item) => total + item.quantity, 0)
      }
    
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('miami-gooners-cart')
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart)
        dispatch({ type: 'LOAD_CART', items })
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('miami-gooners-cart', JSON.stringify(state.items))
  }, [state.items])

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', item })
  }

  const removeItem = (variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', variantId })
  }

  const updateQuantity = (variantId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', variantId, quantity })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}