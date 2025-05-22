import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
    TotalcartValue: 0, // Initial value
  }

  // Helper function to calculate total cart value
  // This function is now internal and called within setState updates
  calculateTotalCartValue = (cartItems) => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Add item to cart or increment quantity if already present
  addCartItem = product => {
    this.setState(prevState => {
      let isUpdated = false
      const newCartList = prevState.cartList.map(eachItem => {
        if (eachItem.id === product.id) {
          isUpdated = true
          return {...eachItem, quantity: eachItem.quantity + 1}
        }
        return eachItem
      })

      const finalCartList = isUpdated ? newCartList : [...prevState.cartList, {...product, quantity: 1}] // Ensure new products start with quantity 1
      const newTotalCartValue = this.calculateTotalCartValue(finalCartList)

      return {
        cartList: finalCartList,
        TotalcartValue: newTotalCartValue,
      }
    })
  }

  // Increment quantity of a specific cart item
  incrementCartItemQuantity = id => {
    this.setState(prevState => {
      const updatedCartList = prevState.cartList.map(eachItem => {
        if (eachItem.id === id) {
          return {...eachItem, quantity: eachItem.quantity + 1}
        }
        return eachItem
      })
      const newTotalCartValue = this.calculateTotalCartValue(updatedCartList)
      return {
        cartList: updatedCartList,
        TotalcartValue: newTotalCartValue,
      }
    })
  }

  // Decrement quantity of a specific cart item
  decrementCartItemQuantity = id => {
    this.setState(prevState => {
      const updatedCartList = prevState.cartList.map(eachItem => {
        if (eachItem.id === id && eachItem.quantity > 1) {
          return {...eachItem, quantity: eachItem.quantity - 1}
        }
        return eachItem
      })
      const newTotalCartValue = this.calculateTotalCartValue(updatedCartList)
      return {
        cartList: updatedCartList,
        TotalcartValue: newTotalCartValue,
      }
    })
  }

  // Remove all items from the cart
  removeAllCartItems = () => {
    this.setState({
      cartList: [],
      TotalcartValue: 0, // Reset total value when cart is empty
    })
  }

  // Remove a specific item from the cart
  removeCartItem = id => {
    this.setState(prevState => {
      const newCartList = prevState.cartList.filter(eachItem => eachItem.id !== id)
      const newTotalCartValue = this.calculateTotalCartValue(newCartList)
      return {
        cartList: newCartList,
        TotalcartValue: newTotalCartValue,
      }
    })
  }

  render() {
    const {cartList, TotalcartValue} = this.state

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          removeAllCartItems: this.removeAllCartItems,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          TotalcartValue, // Provide the calculated total value
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route to="/not-found" component={NotFound} />
          <Redirect to="/not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
