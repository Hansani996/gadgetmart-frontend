import React from 'react';
import Headers from '../containers/default-layout/Header';
import Cookies from "js-cookie";
import {EmailValidation, MobileValidation, RequireValidation} from "../Validation";
import axios from "axios";
import Footer from "../containers/default-layout/Footer";
import {BASE_URL} from "../const/const";
import {ToastUtil} from "../util/ToastUtil";

class Checkout extends React.Component {

    state = {
        login: true,
        error: false,
        loading: false,
        email: '',
        password: '',
        name: '',
        address: '',
        number: '',
        token: false
    };

    login = () => {
        this.setState({error: false,loading: true});
        if (EmailValidation(this.state.email) || RequireValidation(this.state.password)) {
            this.setState({error: true,loading: false});
            return;
        }
        axios.post(BASE_URL+'/auth/login',{
            username: this.state.email,
            password: this.state.password
        })
            .then(res => {
                console.log(res.data);
                if (res.data.state){
                    Cookies.set('token',res.data.token);
                    Cookies.set('customer',JSON.stringify(res.data));
                    this.setState({
                        loading: false,
                    });
                } else {
                    this.setState({error: true,loading: false});
                }
            })
            .catch(error => {
                console.log(error);
                this.setState({error: true,loading: false});
            });
    };

    signUp = () => {
        this.setState({error: false});
        if (EmailValidation(this.state.email) ||
            RequireValidation(this.state.name) ||
            RequireValidation(this.state.address) ||
            MobileValidation(this.state.number) ||
            RequireValidation(this.state.password )) {
            this.setState({error: true,loading: false});
            return;
        }
        axios.post(BASE_URL+'/auth/register',{
            userName: this.state.email,
            password: this.state.password,
            name: this.state.name,
            email: this.state.email,
            contact: this.state.number,
            address: this.state.address
        })
            .then(res => {
                console.log(res.data);
                if (res.data){
                    this.login();
                } else {
                    this.setState({error: true,loading: false});
                    ToastUtil.showErrorToast('User Not Found')
                }
            })
            .catch(error => {
                console.log(error);
                ToastUtil.showErrorToast('User Not Found')
                this.setState({error: true,loading: false});
            });
    };

    render() {
        let cart = Cookies.get('CartItems');
        let token = Cookies.get('token');
        if (cart === undefined) {
            cart = [];
        } else {
            cart = JSON.parse(cart);
        }

        if (token !== undefined) {
            this.props.history.push('/payment')
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
                                <li className="breadcrumb-item active" aria-current="page">Checkout</li>
                            </ol>

                            <div className="container">
                                <ul className="checkout-progress-bar">
                                    <li>
                                        <span>Shipping</span>
                                    </li>
                                    <li>
                                        <span>Review &amp; Payments</span>
                                    </li>
                                </ul>
                                <div className="row">
                                    {
                                        this.state.login ?
                                            <div className="col-lg-8">
                                                <ul className="checkout-steps">
                                                    <li>
                                                        <h2 className="step-title">Login</h2>

                                                        <p>If you already have an account with us. Sign in or Join with
                                                            us.</p>

                                                        <form onSubmit={(e)=> {
                                                            e.preventDefault();
                                                            this.login();
                                                        }}>
                                                            <div className="form-group required-field">
                                                                <label>Email Address </label>
                                                                <input
                                                                    type="text"
                                                                    value={this.state.email}
                                                                    onChange={(e)=>this.setState({email:e.target.value})}
                                                                    className="form-control"/>
                                                            </div>

                                                            <div className="form-group required-field">
                                                                <label>Password </label>
                                                                <input
                                                                    type="password"
                                                                    value={this.state.password}
                                                                    onChange={(e)=>this.setState({password:e.target.value})}
                                                                    className="form-control"/>
                                                            </div>

                                                            {
                                                                this.state.error &&  <a className="forget-pass">
                                                                    Email or Password not matched!</a>
                                                            }

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
                                                                        >LOGIN
                                                                        </button>

                                                                        <a>Don't have an account?
                                                                            <a onClick={() => this.setState({error: false,login: false})}
                                                                               className="forget-pass">
                                                                                Sign Up</a></a>
                                                                    </div>
                                                            }

                                                        </form>
                                                    </li>
                                                </ul>
                                            </div> :
                                            <div className="col-lg-8">
                                                <ul className="checkout-steps">
                                                    <li>
                                                        <h2 className="step-title">Register</h2>

                                                        <p>Join with us.</p>

                                                        <form onSubmit={(e)=> {
                                                            e.preventDefault();
                                                            this.signUp();
                                                        }}>
                                                            <div className="form-group required-field">
                                                                <label>Full Name </label>
                                                                <input
                                                                    type="text"
                                                                    value={this.state.name}
                                                                    onChange={(e)=>this.setState({name:e.target.value})}
                                                                    className="form-control"/>
                                                            </div>

                                                            <div className="form-group">
                                                                <label>Password </label>
                                                                <input
                                                                    type="password"
                                                                    value={this.state.password}
                                                                    onChange={(e)=>this.setState({password:e.target.value})}
                                                                    className="form-control"/>
                                                            </div>

                                                            <div className="form-group required-field">
                                                                <label>Billing Address </label>
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
                                                                    value={this.state.number}
                                                                    onChange={(e)=>this.setState({number:e.target.value})}
                                                                    className="form-control"/>
                                                            </div>

                                                            <div className="form-group required-field">
                                                                <label>Email Address </label>
                                                                <input
                                                                    type="text"
                                                                    value={this.state.email}
                                                                    onChange={(e)=>this.setState({email:e.target.value})}
                                                                    className="form-control"/>
                                                            </div>

                                                            {
                                                                this.state.error &&  <a className="forget-pass">
                                                                    Please input valid data!</a>
                                                            }

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
                                                                        <button style={{height: 50, borderRadius: 50}}
                                                                                type="submit"
                                                                                className="btn btn-primary">REGISTER
                                                                        </button>
                                                                        <a>Already have an account?
                                                                            <a onClick={() => this.setState({error: false,login: true})}
                                                                               className="forget-pass">
                                                                                Sign In</a></a>
                                                                    </div>
                                                            }

                                                        </form>
                                                    </li>
                                                </ul>
                                            </div>
                                    }

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
                                                        cart.map((item, index) => (
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
                                                                <td className="price-col">LKR. {item.price.toFixed(2)}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>
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
