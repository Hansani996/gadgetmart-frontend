import React from 'react';
import Headers from '../containers/default-layout/Header';
import Cookies from "js-cookie";
import Footer from "../containers/default-layout/Footer";

class Cart extends React.Component {

    removeProduct = (item) => {
        let cart = JSON.parse(Cookies.get('CartItems'));
        let cart2 = [];
        cart.map(i => {
            if (i.id !== item.id) {
                cart2.push(i);
            }
        });
        Cookies.set('CartItems', JSON.stringify(cart2));
        this.setState({
            loading: true
        });
    };

    clearCart = () => {
        Cookies.remove('CartItems');
        this.setState({
            loading: true
        });
    };

    render() {
        let cart = Cookies.get('CartItems');
        if (cart === undefined) {
            cart = [];
        } else {
            cart = JSON.parse(cart);
        }
        let total = 0;
        let delivery = 0;
        return (
            <div>
                <Headers history={this.props.history}/>
                <main className="main">
                    <nav aria-label="breadcrumb" className="breadcrumb-nav">
                        <div className="container">
                            <ol className="breadcrumb marginTop">
                                <li className="breadcrumb-item"><a onClick={() => this.props.history.push('/')}><i
                                    className="icon-home"/></a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">Shopping Cart</li>
                            </ol>
                        </div>
                    </nav>

                    <div className="container">

                        <div className="row">
                            <div className="col-lg-8">
                                <div className="cart-table-container">
                                    <table className="table table-cart">
                                        <thead>
                                        <tr>
                                            <th className="product-col">Product</th>
                                            <th className="price-col">Item Price</th>
                                            <th className="qty-col">Qty</th>
                                            <th className="price-col">Total Price</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {
                                            cart.map((item, index) => {
                                                let price = item.price;
                                                if (item.discount !== null && item.discount !== 0) {
                                                    price = (item.price-(item.price/100*item.discount));
                                                }
                                                total += price * item.qty;
                                                delivery += item.deliveryCost;
                                                return (
                                                    <>
                                                        <tr className="product-row">
                                                            <td className="product-col">
                                                                <figure className="product-image-container">
                                                                    <a onClick={() => this.props.history.push('/product', {item: item})}
                                                                       className="product-image">
                                                                        <img src={item.image} alt="product"/>
                                                                    </a>
                                                                </figure>
                                                                <h2 className="product-title">
                                                                    <a onClick={() => this.props.history.push('/product', {item: item})}
                                                                    >{item.name}</a>
                                                                </h2>
                                                            </td>
                                                            <td>Rs. {price.toFixed(2)}</td>
                                                            <td>{item.qty}</td>
                                                            <td>Rs. {(price * item.qty).toFixed(2)}</td>
                                                        </tr>
                                                        <tr className="product-action-row">
                                                            <td colSpan="4" className="clearfix">

                                                                <div className="float-right">
                                                                    <a onClick={() => this.props.history.push('/product', {item: item})}
                                                                       title="Edit product" className="goCart btn-edit">
                                                                        <span className="sr-only">Edit</span>
                                                                        <i className="icon-pencil"/></a>
                                                                    <a onClick={() => this.removeProduct(item)}
                                                                       title="Remove product"
                                                                       className="goCart btn-remove">
                                                                        <span className="sr-only">Remove</span>
                                                                        <i className="icon-minus-squared"/></a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })
                                        }

                                        </tbody>

                                        <tfoot>
                                        <tr>
                                            <td colSpan="4" className="clearfix">
                                                <div className="float-left">
                                                    <a onClick={() => this.props.history.push('/')}
                                                       className="btn btn-outline-secondary">Continue
                                                        Shopping</a>
                                                </div>

                                                <div className="float-right">
                                                    <a onClick={() => this.clearCart()}
                                                       className="btn btn-outline-secondary btn-clear-cart">Clear
                                                        Shopping Cart</a>
                                                </div>
                                            </td>
                                        </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="cart-summary">
                                    <h3>Summary</h3>

                                    <table className="table table-totals">
                                        <tbody>
                                        <tr>
                                            <td>Subtotal</td>
                                            <td>Rs. {total.toFixed(2)}</td>
                                        </tr>

                                        <tr>
                                            <td>Delivery Charge</td>
                                            <td>Rs. {delivery.toFixed(2)}</td>
                                        </tr>
                                        </tbody>
                                        <tfoot>
                                        <tr>
                                            <td>Order Total</td>
                                            <td>Rs. {total.toFixed(2)}</td>
                                        </tr>
                                        </tfoot>
                                    </table>

                                    <div className="checkout-methods">
                                        <a style={{color: 'white'}}
                                           onClick={()=>this.props.history.push('./Checkout')}
                                           className="btn btn-block btn-sm btn-primary">Go
                                            to Checkout</a>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </main>
                <Footer/>
            </div>
        )
    }
}

export default Cart;
