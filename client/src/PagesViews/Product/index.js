import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import moment from "moment";
import {
    MDBTypography,
    MDBContainer,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBIcon,
    MDBLink,
    MDBCloseIcon
} from "mdbreact";
import NavBar from "../../Components/NavBar";
import List from "../../Components/List";
import Details from "../../Components/Details";
import Popup from "../../Components/Popup";

import "../../Style/shared-style.css";
import "./product.css";

const Product = () => {

    const [products, setProducts] = useState(null);
    const [productMovements, setProductMovements] = useState(null);

    const [createProductModelOpen, setCreateProductModelOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);


    const [selectedMovement, setSelectedMovement] = useState(null);
    const [selectedMovementIndex, setSelectedMovementIndex] = useState(null);

    const [selectedPropertyIdx, setSelectedPropertyIdx] = useState(null);
    const [updatedProductProperty, setUpdatedProductProperty] = useState(null);

    const [newMovment, setNewMovement] = useState({});
    const [createMovementModelOpen, setCreateMovementModelOpen] = useState(false);
    const [updateMovementModelOpen, setUpdateMovementModelOpen] = useState(false);

    const [getDataError, setGetDataErrors] = useState(null);
    const [requestFeedback, setRequestFeedback] = useState(null);
    const [isUpdateProductProperityError, setIsUpdateProductProperityError] = useState(null)



    // Functions

    const getProducts = () => axios.get(`/api/products`)

    const getProductMovements = () => axios.get(`/api/productmovements`)

    // Product Functions 
    const addProduct = (createdProduct) => {
        if (Object.keys(createdProduct).length <= 0) {
            setRequestFeedback({ "error": "The (name) field can't be empty!" })
        } else {
            axios
                .post(`/api/product`, createdProduct)
                .then((response) => {
                    let { data } = response;
                    if (data && !data.error) {
                        setTimeout(() => {
                            setRequestFeedback(data.message)
                            getProducts()
                                .then((fetchedProducts) => {
                                    let { data } = fetchedProducts && fetchedProducts.data && fetchedProducts.data;
                                    setProducts(data)
                                })
                        }, '200');
                    } else {
                        setRequestFeedback({ "error": data.error })
                    }

                })
                .catch((err) => {
                    console.log(err.message);
                })
        }
    }

    const updateProductProperty = (propLabel) => {

        axios
            .put(`/api/product/${selectedProduct.product_id}`, updatedProductProperty)
            .then((response) => {
                let { data } = response;
                if (data && !data.error) {
                    selectedProduct[propLabel] = updatedProductProperty[propLabel];
                    setTimeout(() => {
                        setUpdatedProductProperty(null)
                        setSelectedPropertyIdx(null)
                        setRequestFeedback(data.message)
                        setSelectedProduct(selectedProduct)
                        getProducts()
                            .then((fetchedProducts) => {
                                let { data } = fetchedProducts && fetchedProducts.data && fetchedProducts.data;
                                setProducts(data)
                            })
                    }, '100');

                } else {
                    setRequestFeedback({ "error": data.error })
                    setIsUpdateProductProperityError(true)
                }

            })
            .catch((err) => {
                console.log(err.message);
            })
    }

    // Movement Functions 
    const addMovement = (createdMovement, product_id) => {

        newMovment['product_id'] = product_id;

        if (createdMovement['movement_timestamp']) {
            newMovment['movement_timestamp'] = moment(createdMovement['movement_timestamp']).format("YYYY-MM-DD HH:mm:ss")
        }

        if (createdMovement) {
            Object.keys(createdMovement).forEach(key => {
                newMovment[key] = createdMovement[key];
            })
            setNewMovement(newMovment)
        }

        axios
            .post(`/api/productmovement`, newMovment)
            .then((response) => {
                let { data } = response;
                if (data && !data.error) {
                    setTimeout(() => {
                        setRequestFeedback(data.message)
                        getProductMovements()
                            .then((fetchedProductMovements) => {
                                let { data } = fetchedProductMovements && fetchedProductMovements.data && fetchedProductMovements.data;
                                setProductMovements(data)
                            })
                    }, '200');
                } else {
                    setRequestFeedback({ "error": data.error })
                }

            })
            .catch((err) => {
                console.log(err.message);
            })
    }

    const updateMovementProperties = (updatedMovement, movement_id) => {

        if (updatedMovement['movement_timestamp']) {
            updatedMovement['movement_timestamp'] = moment(updatedMovement['movement_timestamp']).format('YYYY/MM/DD HH:mm:ss')
        }

        axios
            .put(`/api/productmovement/${movement_id}`, updatedMovement)
            .then((response) => {
                let { data } = response;
                if (data && !data.error) {
                    setTimeout(() => {
                        setRequestFeedback(data.message)
                        getProductMovements()
                            .then((fetchedProductMovements) => {
                                let { data } = fetchedProductMovements && fetchedProductMovements.data && fetchedProductMovements.data;
                                setProductMovements(data)
                            })
                    }, '200');
                } else {
                    setRequestFeedback({ "error": data.error })
                }
            })
            .catch((err) => {
                console.log(err.message);
            })
    }


    useEffect(() => {
        try {
            getProducts()
                .then((fetchedProducts) => {
                    let { data } = fetchedProducts && fetchedProducts.data && fetchedProducts.data;
                    setProducts(data)
                })
                .then(() => {
                    getProductMovements()
                        .then((fetchedProductMovements) => {
                            let { data } = fetchedProductMovements && fetchedProductMovements.data && fetchedProductMovements.data;
                            setProductMovements(data)
                        })
                })
        } catch (error) {
            setGetDataErrors(error.message)
        }
    }, [])


    // Handlers 

    const handleMovementEditIconClick = (selectedMovement, Index) => {
        setSelectedMovement(selectedMovement)
        setSelectedMovementIndex(Index)
        setUpdateMovementModelOpen(true)
        setRequestFeedback(null)
    }

    const handleMovementCreateClick = () => {
        setSelectedMovement(null)
        setNewMovement({})
        setCreateMovementModelOpen(true)
        setRequestFeedback(null)
    }

    const handleProductCreateClick = () => {
        setCreateProductModelOpen(true)
        setRequestFeedback(null)
    }

    // Varaibles
    let product_name = selectedProduct ? selectedProduct.name : null;
    let selectedProductMovements = productMovements && selectedProduct && productMovements.filter(productMovement => productMovement.product_id === selectedProduct.product_id)
    let productPropertiesLabels = { "name": "Name" };
    let movementPropertiesLabels = { "Date": "movement_timestamp", "Source": "from_location", "Destination": "to_location", "Quantity": "qty" };

    if (requestFeedback && !requestFeedback['error']) {
        setTimeout(() => {
            setRequestFeedback(null)
        }, '2000')
    }

    return (
        <div>
            <NavBar activeKey="2" />

            {
                requestFeedback ?
                    requestFeedback['error'] ?
                        isUpdateProductProperityError ?
                            <div class="alert alert-danger">
                                <strong> {requestFeedback['error']} </strong>
                                <MDBCloseIcon onClick={() => setRequestFeedback(null)} />
                            </div>
                            :
                            null
                        :
                        <div class="alert alert-success">
                            <strong> {requestFeedback} </strong>
                        </div>
                    :
                    null
            }

            {
                getDataError ?
                    <div> {getDataError} </div>
                    :
                    <MDBContainer className="mainContainer">
                        <MDBContainer className="subContainer">
                            {
                                products && products.length > 0 ?
                                    <Fragment>
                                        <div className="ItemsSectionTitle">
                                            <MDBTypography variant="h4-responsive" colorText="blue"> Products List:</MDBTypography>
                                            <MDBIcon onClick={() => handleProductCreateClick()} icon="plus" className="newItemIcon newProductIcon"> </MDBIcon>
                                        </div>
                                        <List
                                            items={products}
                                            setSelectedItem={setSelectedProduct}
                                            selectedItem={selectedProduct}
                                            setSelectedPropertyIdx={setSelectedPropertyIdx}
                                            item_id="product_id"
                                            itemVal="name"
                                        />
                                    </Fragment>

                                    :
                                    <p style={{ color: "red" }}>
                                        <strong>No products. <MDBLink className="CreateProductsLink" onClick={() => handleProductCreateClick()}> Create Product </MDBLink></strong>
                                    </p>
                            }

                            {
                                createProductModelOpen ?
                                    <Popup
                                        title={`Create New Product`}
                                        eventHandler={addProduct}
                                        handlerBtnValue="Create"
                                        itemPropertiesLabels={{ "Name": "name" }}
                                        isModelOpen={createProductModelOpen}
                                        setIsModelOpen={setCreateProductModelOpen}
                                        data={{ requestFeedback }}
                                    />
                                    :
                                    null
                            }
                        </MDBContainer>

                        <div className="vl"></div>

                        <MDBContainer className="subContainer">
                            {
                                selectedProduct ?
                                    <Fragment>
                                        <MDBTypography variant="h4-responsive" colorText="blue">{product_name} Product Details:</MDBTypography>

                                        <Details
                                            selectedItem={selectedProduct}
                                            itemPropertiesLabels={productPropertiesLabels}
                                            selectedPropertyIdx={selectedPropertyIdx}
                                            setSelectedPropertyIdx={setSelectedPropertyIdx}
                                            setUpdatedItemProperty={setUpdatedProductProperty}
                                            updateItemProperty={updateProductProperty}
                                            setIsUpdateItemProperityError={setIsUpdateProductProperityError}
                                        />

                                        <div className="line"></div>

                                        {
                                            selectedProductMovements && selectedProductMovements.length > 0 ?
                                                <MDBContainer className="subContainer">
                                                    <div className="ItemsSectionTitle">
                                                        <p style={{ marginTop: "1rem" }}><strong>{product_name} Product Movements </strong>  ({selectedProductMovements.length} Movements) <strong>:</strong> </p>
                                                        <MDBIcon onClick={() => handleMovementCreateClick()} icon="plus" className="newItemIcon"> </MDBIcon>
                                                    </div>

                                                    <MDBTable hover bordered>
                                                        <MDBTableHead color="primary-color" textWhite>
                                                            <tr>
                                                                <th>#</th>
                                                                <th>Date</th>
                                                                <th>Source</th>
                                                                <th>Destination</th>
                                                                <th>Quantity</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </MDBTableHead>
                                                        <MDBTableBody>
                                                            {
                                                                selectedProductMovements.map((movement, idx) => {
                                                                    let { movement_timestamp, from_location, to_location, qty } = movement;
                                                                    return (
                                                                        <tr key={idx}>
                                                                            <td>{idx + 1}</td>
                                                                            <td>{moment(movement_timestamp).utc().format('YYYY/MM/DD hh:mm A')}</td>
                                                                            <td>{from_location}</td>
                                                                            <td>{to_location}</td>
                                                                            <td>{qty}</td>
                                                                            <td>
                                                                                <MDBBtn
                                                                                    className="EditBtn"
                                                                                    color="blue"
                                                                                    onClick={() => handleMovementEditIconClick(movement, idx)}
                                                                                >
                                                                                    Edit
                                                                                </MDBBtn>
                                                                            </td>
                                                                        </tr>)
                                                                })
                                                            }
                                                        </MDBTableBody>
                                                    </MDBTable>

                                                    {
                                                        updateMovementModelOpen && selectedMovement ?
                                                            <Popup
                                                                title={`Update ${product_name} Movement (# ${selectedMovementIndex + 1})`}
                                                                eventHandler={updateMovementProperties}
                                                                handlerBtnValue="Update"
                                                                itemPropertiesLabels={movementPropertiesLabels}
                                                                isModelOpen={updateMovementModelOpen}
                                                                setIsModelOpen={setUpdateMovementModelOpen}
                                                                data={{ 'id': selectedMovement.movement_id, updatedItem: selectedMovement, requestFeedback }}
                                                            />
                                                            :
                                                            null
                                                    }


                                                </MDBContainer>
                                                :
                                                <p style={{ color: "red" }}>
                                                    <strong>{product_name} Product doesn't has movements. <MDBLink className="CreateMovementsLink" onClick={() => handleMovementCreateClick()}> Create Movement </MDBLink></strong>
                                                </p>
                                        }

                                        {
                                            createMovementModelOpen && selectedProduct ?
                                                <Popup
                                                    title={`Create ${product_name} Movement`}
                                                    eventHandler={addMovement}
                                                    handlerBtnValue="Create"
                                                    itemPropertiesLabels={movementPropertiesLabels}
                                                    isModelOpen={createMovementModelOpen}
                                                    setIsModelOpen={setCreateMovementModelOpen}
                                                    data={{ 'id': selectedProduct.product_id, requestFeedback }}
                                                />
                                                :
                                                null
                                        }

                                    </Fragment>
                                    :
                                    <p> Pick a product to show its info </p>
                            }
                        </MDBContainer>
                    </MDBContainer>
            }
        </div >
    );
}

export default Product;