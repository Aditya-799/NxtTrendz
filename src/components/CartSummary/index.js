import CartContext from '../../context/CartContext'
import './index.css'

const CartSummary = () => {
  return (
    <CartContext.Consumer>
      {value => {
        const {TotalcartValue, cartList} = value
        const cartlength = cartList.length
        return (
          <>
            <div className="check-out-section">
              <h1 className="total-order">
                Order Total:<span className="">{TotalcartValue}</span>
              </h1>
              <p>{cartlength} items in cart</p>
            </div>
            <div className="button-container">
              <button type="button" className="checkout-button">
                Checkout
              </button>
            </div>
          </>
        )
      }}
    </CartContext.Consumer>
  )
}

export default CartSummary
