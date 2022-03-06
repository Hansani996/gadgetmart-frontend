import React, {Component} from 'react';
import {Spinner} from "reactstrap";
import Headers from '../containers/default-layout/Header';
import Cookies from 'js-cookie';
import Footer from "../containers/default-layout/Footer";

class Product extends Component {

    state = {
        loading: true,
        item: {},
        qty: this.props.location.state.item.qty ?? 1
    };

    componentWillMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        console.log(this.props.location.state.item)
        this.setState({
            item: this.props.location.state.item,
            loading: false
        })
    }

    addToCart = (i) => {
        let cart = Cookies.get('CartItems');
        if (cart === undefined) {
            cart = [];
            cart.push({
                ...i,
                qty: this.state.qty
            })
        } else {
            cart = JSON.parse(cart);
            cart.push({
                ...i,
                qty: this.state.qty
            });

            cart = cart
                .map(e => e['id'])

                // store the keys of the unique objects
                .map((e, i, final) => final.indexOf(e) === i && i)

                // eliminate the dead keys & store unique objects
                .filter(e => cart[e]).map(e => cart[e])

            cart = cart.map(item => {
                if (item.id === i.id) {
                    return {
                        ...i,
                        qty: Number(this.state.qty)
                    }
                } else {
                    return item;
                }
            })

            console.log(cart)
        }
        Cookies.remove('CartItems');
        Cookies.set('CartItems', JSON.stringify(cart));
        this.setState({
            loading: false
        });
        this.props.history.push('./cart');
    };


    render() {
        return (
            <div>
                <Headers history={this.props.history}/>
                <main className="main">

                    <nav aria-label="breadcrumb" className="breadcrumb-nav">
                        <div className="container">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a onClick={() => this.props.history.push('/')}><i
                                    className="icon-home"/></a>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">Product Item</li>
                            </ol>
                        </div>
                    </nav>

                    <div className="container mb-6">
                        <div className="product-single-container product-single-default product-quick-view">
                            {
                                this.state.loading ?
                                    <Spinner size={'small'} color={'black'}/> :
                                    <div className="row row-sparse">
                                        <div className="marginTop col-lg-6 product-single-gallery">
                                            <div className="product-slider-container">
                                                <div className="product-single-carousel owl-theme">
                                                    <img
                                                        src={this.state.item.image}
                                                        alt="product" widht="300"
                                                        height="300"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-lg-6 product-single-details">
                                            <h1 className="product-title">{this.state.item.name}</h1>

                                            <div className="price-box">
                                                {
                                                    this.state.item.discount && this.state.item.discount !== 0 ?
                                                        <>
                                                            <span
                                                                className="old-price">Rs. {this.state.item.price.toFixed(2)}</span>
                                                            <span
                                                                className="product-price">Rs. {(this.state.item.price -
                                                                (this.state.item.price / 100 * this.state.item.discount))
                                                                .toFixed(2)}</span>
                                                        </>
                                                        :
                                                        <span
                                                            className="product-price">Rs. {this.state.item.price.toFixed(2)}</span>
                                                }
                                            </div>

                                            <div className="product-desc">
                                                <p>{this.state.item.description}</p>
                                                <p>Brand : {this.state.item.brand}</p>
                                            </div>

                                            <hr className="divider"/>

                                            {
                                                this.state.item.soldOut ?
                                                    <a className="btn btn-danger add-cart" title="Sold Out">Sold
                                                        Out</a> :
                                                    <div className="product-action">
                                                        <div className="product-single-qty">
                                                            <input
                                                                value={this.state.qty}
                                                                onChange={e => {
                                                                    if (e.target.value > 0)
                                                                        this.setState({qty: e.target.value})
                                                                }}
                                                                className="horizontal-quantity form-control"
                                                                style={{marginBottom: 0}}
                                                                type="number"/>
                                                        </div>
                                                        <a onClick={() => this.addToCart(this.state.item)}
                                                           className="btn btn-dark add-cart" title="Add to Cart">Add to
                                                            Cart</a>
                                                    </div>
                                            }

                                            <hr className="divider"/>

                                            <div className="icon-containermy">
                                                <div className="row">
                                                    <div className="icon-des icon-res">
                                                        <img src="https://buyabans.com/assets/images/warranty.png"/>
                                                    </div>
                                                    <div className="icon-des icon-title-res">Warranty</div>
                                                    <div className="icon-des icon-dis">:
                                                        <span
                                                            id="item_warranty_period">&nbsp; {this.state.item.warranty}</span>

                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="icon-des icon-res">
                                                        <img src="https://buyabans.com/assets/images/transport.png"/>
                                                    </div>
                                                    <div className="icon-des icon-title-res">Delivery</div>
                                                    <div className="icon-des icon-dis">: &nbsp; 2 - 5 Working Days
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="icon-des icon-res">
                                                        <img src="https://buyabans.com/assets/images/location.png"/>
                                                    </div>
                                                    <div className="icon-des icon-title-res">Delivery Fee</div>
                                                    <div className="icon-des icon-dis">: &nbsp; {
                                                        this.state.item.deliveryCost === 0 ? 'Free Delivery' :
                                                            'Rs. ' + this.state.item.deliveryCost.toFixed(2)
                                                    }
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                            }

                        </div>

                    </div>
                </main>
                <Footer/>
            </div>
        )
    }
}

export default Product
