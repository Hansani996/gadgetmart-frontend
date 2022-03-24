import React, {Component} from 'react';
import Footer from '../containers/default-layout/Footer';
import Headers from '../containers/default-layout/Header';
import slider1 from '../assets/assets/images/slider/slider_1.jpg'

import axios from 'axios';
import {BASE_URL} from "../const/const";
import Pagination from '@material-ui/lab/Pagination';

export default class Home extends Component {

    state = {
        categories: [],
        items: [],
        loading: false,
        page: 1,
        search: ''
    };

    getAllItems = () => {
        axios.get(BASE_URL + '/item', {})
            .then(res => {
                this.setState({
                    items: res.data
                })
            })
            .catch(err => {
                console.log(err)
            });
        this.setState({
            loading: false
        });
    };


    componentWillMount() {
        this.setState({
            loading: true
        });

        this.getAllItems();
    }

    render() {
        let items = [], brands = [];

        this.state.items.map(item => {
            let search = item.name.toLowerCase().startsWith(this.state.search) || item.name.toLowerCase().includes(this.state.search);

            if (this.state.search === '') {
                items.push(item);
            } else {
                if (search) {
                    items.push(item);
                }
            }
        })
        let pages = Math.ceil(items.length / 8);
        let data = items.slice((this.state.page - 1) * 8, this.state.page * 8);
        let brandAvailable = brands.length > 0;
        let itemStyle = brandAvailable ? "col-lg-9 col-md-9 m-t-6" : "col-lg-12 col-md-12 m-t-6";
        return (
            <div>
                <Headers history={this.props.history}/>
                <main className="main">

                    <div className="container mb-6">

                        <div className="marginTop banner ">
                            <img className="owl-lazy slide-bg"
                                 src={'https://images.freekaamaal.com/post_images/1578392330.png'}
                                 data-src={slider1} alt="banner"
                                 width="1120" height="445"/>
                            <div className="banner-layer slide-1 banner-layer-left banner-layer-middle text-right">

                            </div>
                        </div>


                        <section className="p-t-3 mt-3">
                            <h2 className="section-title ls-n-20 m-b-1 line-height-1 text-center">Best Products On
                                Sale</h2>
                            <div className="row offerItems mb-3">

                                {
                                    this.state.items.map((item, index) => {
                                        if (item.discount !== 0) {
                                            return (
                                                <Item
                                                    key={index}
                                                    item={item}
                                                    onAdd={() => this.setState({added: true})}
                                                    brandAvailable={false}
                                                    props={this.props}/>
                                            );
                                        }
                                    })
                                }
                            </div>

                        </section>

                        <section id='items' className="mt-3">

                            <div
                                className="header-center flex-1 ml-0 justify-content-end justify-content-lg-start m-b-3">
                                <div
                                    className="header-search header-search-inline header-search-category w-lg-max pr-2 pr-lg-0">
                                    <a
                                        href="#"
                                        className="search-toggle header-icon d-none d-sm-inline-block d-lg-none mr-0"
                                        role="button"
                                    >
                                        <i className="icon-search-3"/>
                                    </a>
                                    <form action="#" method="get">
                                        <div className="header-search-wrapper">
                                            <input
                                                type="search"
                                                className="form-control"
                                                placeholder="Search..."
                                                value={this.state.search}
                                                onChange={e => this.setState({search: e.target.value})}
                                            />

                                            <button className="btn icon-search-3"/>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="row mt-5">

                                <div className={itemStyle}>
                                    <h2 className="section-title ls-n-20 m-b-1 line-height-1 text-center "
                                        data-animation-delay="100"
                                        data-animation-duration="1500">All Items</h2>
                                    <div className="row">
                                        {
                                            data.map((item, index) => {
                                                return (
                                                    <Item
                                                        key={index}
                                                        item={item}
                                                        onAdd={() => this.setState({added: true})}
                                                        brandAvailable={brandAvailable}
                                                        props={this.props}/>
                                                );
                                            })
                                        }
                                    </div>
                                    <Pagination count={pages} onChange={(event, page) => this.setState({page: page})}/>
                                </div>
                            </div>
                        </section>

                        <div className="m-b-1"/>

                    </div>
                </main>
                <Footer/>
            </div>
        );
    }
}

export const Item = ({item, props, brandAvailable}) => {

    let itemStyle = brandAvailable ? "col-6 col-md-4 col-lg-3" : "col-6 col-md-3";
    return (
        <div className={itemStyle}>
            <div className="product-default inner-quickview inner-icon"
                 data-animation-name="fadeInRightShorter">
                <figure style={{boxShadow: "none!important"}}>
                    <a onClick={() => props.history.push('/product', {item: item})}>
                        <img
                            src={item.image}
                            alt="product" widht="400"
                            height="400"/>
                    </a>

                    <div className="label-group">
                        {
                            item.discount && item.discount !== 0 ?
                                <span
                                    className="product-label label-sale">save {item.discount}%</span>
                                : null
                        }
                    </div>
                </figure>
                <div className="product-details" onClick={() => props.history.push('/product', {item: item})}>
                    <div className="category-wrap">
                        <div className="category-list">
                            <a
                                className="product-category">{item.brand + " by " + item.shop}</a>
                        </div>
                    </div>
                    <h2 className="product-title">
                        <a>{item.name}</a>
                    </h2>

                    {
                        item.soldOut ?
                            <div className="price-box">
                                <span className="product-price">Rs. {item.price.toFixed(2)}</span>
                                <span className="old-price mb-3">Sold out</span>
                            </div> :
                            <div className="price-box">
                                {
                                    item.discount && item.discount !== 0 ?
                                        <>
                                            <span className="old-price mb-3">Rs. {item.price.toFixed(2)}</span>

                                            <span
                                                className="product-price mt-3">Rs. {(item.price - (item.price / 100 * item.discount))
                                                .toFixed(2)}</span>
                                        </>
                                        :
                                        <span className="product-price">Rs. {item.price.toFixed(2)}</span>
                                }
                            </div>
                    }


                </div>
            </div>

        </div>
    )
};



