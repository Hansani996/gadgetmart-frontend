import React, {Component} from 'react';
import './App.css';
import Home from './views/Home';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Payment from "./views/Payment";
import Product from "./views/Product";
import Cart from "./views/Cart";
import Checkout from "./views/Checkout";
import User from "./views/User";


class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" name="Home Page" component={Home}/>
                    <Route exact path="/payment" name="Payments" component={Payment}/>
                    <Route exact path="/product" name="Product" component={Product} />
                    <Route exact path="/cart" name="Cart" component={Cart} />
                    <Route exact path="/checkout" name="Checkout" component={Checkout} />
                    <Route exact path="/user" name="User" component={User}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
