import React, { useState, useEffect, Fragment } from "react";
import NavBar from "../../Components/NavBar";
// import "./Product.css";

const Product = () => {

    // Get Products
    const [products, setProducts] = useState(null);

    useEffect(() => {
        fetch('/api/products').then(res => res.json()).then(fetchedProducts => {
            setProducts(fetchedProducts)
        });
    }, []);

    console.log(products);
    return (
        <Fragment>
            <NavBar activeKey="2" />
        </Fragment>
    );
}

export default Product;
