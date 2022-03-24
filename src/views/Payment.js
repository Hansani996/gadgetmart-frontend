import React from 'react';
import Headers from '../containers/default-layout/Header';
import Cookies from "js-cookie";
import {EmailValidation, MobileValidation, RequireValidation} from "../Validation";
import axios from "axios";
import Footer from "../containers/default-layout/Footer";
import {BASE_URL} from "../const/const";

class Checkout extends React.Component {

    state = {
        error: false,
        error2: false,
        error3: false,
        loading: false,
        loading2: false,
        name: '',
        address: '',
        customer: undefined,
        edit: false,
        success: false
    };

    componentWillMount(){
        let token = Cookies.get('token');
        if (token === undefined) {
            this.props.history.push('/')
        }
        this.setState({
            customer: JSON.parse(Cookies.get('customer')),
            address: JSON.parse(Cookies.get('customer')).address,
            mobile: JSON.parse(Cookies.get('customer')).contact,
        })
    }

    placeOrder = () => {
        this.setState({error: false,error3: false,loading: true});

        let cart = Cookies.get('CartItems');
        let total = 0;
        let orderDetails = [];
        if (cart === undefined) {
            cart = [];
        } else {
            cart = JSON.parse(cart);
        }
        cart.map(item => {
            let price = item.price;
            if (item.discount !== null && item.discount !== 0) {
                price = (item.price - (item.price / 100 * item.discount));
            }

            total += (price*item.qty) + item.deliveryCost;
            orderDetails.push(item)
        });

        const data = {
            user_id: this.state.customer.userId,
            address: this.state.customer.address,
            contact: this.state.customer.contact,
            totalCost: total,
            orderDetail: orderDetails,
        };
        const header = {
            Authorization: 'Bearer '+Cookies.get('token')
        }

        axios.post(BASE_URL+'/order',data, {
            headers: header
        })
            .then(res => {
                console.log(res.data);
                if (res.data){
                    Cookies.remove('CartItems');
                    this.setState({error3: true,loading: false,success: true});
                } else {
                    this.setState({error3: true,loading: false,success: false});
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({error3: true,loading: false,success: false});
                if (error.response.status === 401){
                    Cookies.remove('token');
                    this.props.history.push('/checkout');
                }
            });
    };

    updateUser = () => {
        this.setState({error2: false,loading2: true});
        if (RequireValidation(this.state.address) ||
            MobileValidation(this.state.mobile)) {
            this.setState({error2: true,loading2: false});
            return;
        }
        const data = {
            ...this.state.customer,
            contact: this.state.mobile,
            address: this.state.address
        };
        this.setState({error2: false,loading2: false,edit: false,customer:data});
    };

    render() {
        let cart = Cookies.get('CartItems');
        let total = 0;
        if (cart === undefined) {
            cart = [];
        } else {
            cart = JSON.parse(cart);
        }

        return (
            <div>
                <Headers history={this.props.history}/>
                <main className="main">
                    <nav aria-label="breadcrumb" className="breadcrumb-nav">
                        <div className="container marginTop">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a onClick={() => this.props.history.push('/')}><i
                                    className="icon-home"/></a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">Place a order</li>
                            </ol>

                            <div className="container">

                                {
                                    !this.state.success && cart.length === 0 ?
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body add-cart-box text-center">
                                                    <p>Your cart empty add some items before make order!</p>

                                                    <div className="btn-actions">
                                                        <a>
                                                            <button onClick={()=>this.props.history.push('/')} className="btn-primary" data-dismiss="modal">Continue</button>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> :
                                        <>
                                            {
                                                !this.state.error3 ?
                                                    <div className="row">

                                                        <div className="col-lg-8">
                                                            <ul className="checkout-steps">
                                                                <li>


                                                                        {
                                                                            this.state.loading ?
                                                                                <div className="loading-overlay loading-overlay2">
                                                                                    <div className="bounce-loader">
                                                                                        <div className="bounce1"></div>
                                                                                        <div className="bounce2"></div>
                                                                                        <div className="bounce3"></div>
                                                                                    </div>
                                                                                </div> :
                                                                                <div className="form-footer">
                                                                                    <button
                                                                                        style={{height: 50, borderRadius: 50}}
                                                                                        type="submit"
                                                                                        className="btn btn-primary"
                                                                                        onClick={()=>this.placeOrder()}
                                                                                    >Place Order
                                                                                    </button>
                                                                                </div>
                                                                        }

                                                                </li>
                                                            </ul>
                                                        </div>

                                                        <div className="col-lg-4">
                                                            <div className="order-summary">
                                                                <h3>Summary</h3>

                                                                <h4>
                                                                    <a data-toggle="collapse" href="#order-cart-section"
                                                                       className="collapsed"
                                                                       role="button" aria-expanded="false"
                                                                       aria-controls="order-cart-section">
                                                                        {cart.length} products in Cart</a>
                                                                </h4>

                                                                <div className="collapse" id="order-cart-section">
                                                                    <table className="table table-mini-cart">
                                                                        <tbody>
                                                                        {
                                                                            cart.map((item, index) => {
                                                                                let price = item.price;
                                                                                if (item.discount !== null && item.discount !== 0) {
                                                                                    price = (item.price - (item.price / 100 * item.discount)) + item.deliveryCost;
                                                                                }

                                                                                total += price ;
                                                                                return(
                                                                                    <tr key={index}>
                                                                                        <td className="product-col">
                                                                                            <figure className="product-image-container">
                                                                                                <a onClick={() => this.props.history.push('/product', {item: item})}
                                                                                                   className="product-image">
                                                                                                    <img src={item.image}
                                                                                                         alt="product"/>
                                                                                                </a>
                                                                                            </figure>
                                                                                            <div>
                                                                                                <h2 className="product-title">
                                                                                                    <a onClick={() => this.props.history.push('/product', {item: item})}
                                                                                                    >{item.name}</a>
                                                                                                </h2>

                                                                                                <span
                                                                                                    className="product-qty">Qty: {item.qty}</span>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="price-col">LKR. {price.toFixed(2)}</td>
                                                                                    </tr>
                                                                                )
                                                                            })
                                                                        }
                                                                        </tbody>
                                                                    </table>
                                                                </div>

                                                                <h4 className='mt-2'>Total amount: Rs. {total.toFixed(2)}</h4>
                                                            </div>

                                                            <div className="checkout-info-box">
                                                                <h3 className="step-title">Delivery To:
                                                                    <a onClick={()=>this.setState({edit: !this.state.edit})}
                                                                       title="Edit" className="step-title-edit"><span
                                                                        className="sr-only">Edit</span>
                                                                        <i className={this.state.edit?"icon-cancel":"icon-pencil"}>

                                                                        </i></a>
                                                                </h3>

                                                                {
                                                                    !this.state.edit ?
                                                                        <>
                                                                            {
                                                                                this.state.customer !== undefined ?
                                                                                    <address>
                                                                                        {this.state.customer.name}<br/>
                                                                                        {this.state.customer.address} <br/>
                                                                                        {this.state.customer.contact}
                                                                                    </address> : null
                                                                            }
                                                                        </> :
                                                                        <>
                                                                            <div className="form-group required-field">
                                                                                <label>Address </label>
                                                                                <input
                                                                                    type="text"
                                                                                    value={this.state.address}
                                                                                    onChange={(e)=>this.setState({address:e.target.value})}
                                                                                    className="form-control"/>
                                                                            </div>
                                                                            <div className="form-group required-field">
                                                                                <label>Phone Number </label>
                                                                                <input
                                                                                    type="number"
                                                                                    value={this.state.mobile}
                                                                                    onChange={(e)=>this.setState({mobile:e.target.value})}
                                                                                    className="form-control"/>
                                                                            </div>
                                                                            {
                                                                                this.state.error2 &&  <a className="forget-pass">
                                                                                    Please input valid data!</a>
                                                                            }
                                                                            {
                                                                                this.state.loading2 ?
                                                                                    <div className="loading-overlay loading-overlay2">
                                                                                        <div className="bounce-loader">
                                                                                            <div className="bounce1"></div>
                                                                                            <div className="bounce2"></div>
                                                                                            <div className="bounce3"></div>
                                                                                        </div>
                                                                                    </div> :
                                                                                    <div className="form-footer">
                                                                                        <button style={{height: 50, borderRadius: 50}}
                                                                                                onClick={()=>this.updateUser()}
                                                                                                className="btn btn-primary">UPDATE
                                                                                        </button>
                                                                                    </div>
                                                                            }
                                                                        </>
                                                                }

                                                            </div>
                                                        </div>

                                                    </div>
                                                    :
                                                    <div className="modal-dialog" role="document">
                                                        <div className="modal-content">
                                                            <div className="modal-body add-cart-box text-center">
                                                                <p>{
                                                                    this.state.success ? 'Your order has been placed successfully.' :
                                                                        'Something went wrong in place order try again later.'
                                                                }</p>

                                                                <div className="btn-actions">
                                                                    <a>
                                                                        {
                                                                            this.state.success ?
                                                                                <button onClick={()=>this.props.history.push('/')} className="btn-primary" data-dismiss="modal">Continue</button> :
                                                                                <button onClick={()=>this.setState({error3: false})} className="btn-primary" data-dismiss="modal">Retry</button>
                                                                        }
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
                                        </>
                                }
                            </div>

                        </div>
                    </nav>
                </main>
                <Footer/>
            </div>
        )
    }
}

export default Checkout;
