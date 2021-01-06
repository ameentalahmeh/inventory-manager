import React, { useState, useEffect } from "react";
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
        <div className="Location">
        </div>
    );
}

export default Product;
