import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import moment from "moment";
import {
    MDBListGroup,
    MDBTypography,
    MDBListGroupItem,
    MDBContainer,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBIcon,
    MDBInput,
    MDBModal,
    MDBModalHeader,
    MDBModalFooter,
    MDBModalBody,
    MDBInputGroup,
    MDBLink
} from "mdbreact";
import NavBar from "../../Components/NavBar";
import "./product.css";

const Product = () => {

    const [products, setProducts] = useState(null);
    const [productMovements, setProductMovements] = useState(null);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedMovement, setSelectedMovement] = useState(null);

    const [selectedPropertyIdx, setSelectedPropertyIdx] = useState(null);
    const [updatedProductProperty, setUpdatedProductProperty] = useState(null);

    const [isUpdateModelOpen, setIsUpdateModelOpen] = useState(false);
    const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
    const [isCreateModelOpenByAddIcon, setIsCreateModelOpenByAddIcon] = useState(false);

    const [changeDate, setChangeDate] = useState(false);
    const [getDataError, setGetDataErrors] = useState(null);
    const [, setUpdateRequestFeedback] = useState(null);

    // Functions

    const getProducts = () => axios.get(`/api/products`)

    const getProductMovements = () => axios.get(`/api/productmovements`)

    const updateProductProperty = (propLabel) => {
        axios
            .put(`/api/product/${selectedProduct.id}`, updatedProductProperty)
            .then((response) => {
                let { data, statusText } = response;
                if (statusText === "OK") {
                    selectedProduct[propLabel] = updatedProductProperty[propLabel];
                    setTimeout(() => {
                        setUpdatedProductProperty(null)
                        setSelectedPropertyIdx(null)
                        setUpdateRequestFeedback(data.Message)
                        setSelectedProduct(selectedProduct)
                        getProducts()
                            .then((fetchedProducts) => {
                                let { data } = fetchedProducts && fetchedProducts.data && fetchedProducts.data;
                                setProducts(data)
                            })
                    }, '100');

                } else {
                    setUpdateRequestFeedback(data.Error)
                }

            })
            .catch((err) => {
                console.log(err.message);
            })
    }

    const updateMovementProperties = (updatedMovement) => {

        let { movement_id } = updatedMovement;
        delete updatedMovement['movement_id'];
        delete updatedMovement['product_id'];
        delete updatedMovement['firstMovementDate'];

        updatedMovement['movement_timestamp'] = moment(updatedMovement['movement_timestamp']).format("YYYY-MM-DD hh:mm:ss");

        axios
            .put(`/api/productmovement/${movement_id}`, updatedMovement)
            .then((response) => {
                let { data, statusText } = response;
                if (statusText === "OK") {
                    setTimeout(() => {
                        setChangeDate(false)
                        setSelectedMovement(null)
                        setUpdateRequestFeedback(data.Message)
                        getProductMovements()
                            .then((fetchedProductMovements) => {
                                let { data } = fetchedProductMovements && fetchedProductMovements.data && fetchedProductMovements.data;
                                setProductMovements(data)
                            })
                    }, '200');
                } else {
                    setUpdateRequestFeedback(data.Error)
                }

            })
            .catch((err) => {
                console.log(err.message);
            })
    }

    const addMovement = (createdMovement, product_id) => {
        createdMovement['product_id'] = product_id;
        createdMovement['movement_timestamp'] = moment(createdMovement['movement_timestamp']).format("YYYY-MM-DD hh:mm:ss");
        console.log(createdMovement);

        axios
            .post(`/api/productmovement`, createdMovement)
            .then((response) => {
                let { data, statusText } = response;
                if (statusText === "OK") {
                    setTimeout(() => {

                        setUpdateRequestFeedback(data.Message)
                        getProductMovements()
                            .then((fetchedProductMovements) => {
                                let { data } = fetchedProductMovements && fetchedProductMovements.data && fetchedProductMovements.data;
                                setProductMovements(data)
                            })
                    }, '200');
                } else {
                    setUpdateRequestFeedback(data.Error)
                }

            })
            .catch((err) => {
                console.log(err);
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
    const handleProductEditIconClick = (propIndex, propLabel) => {
        setSelectedPropertyIdx(propIndex);
        setUpdatedProductProperty({ [propLabel]: selectedProduct[propLabel] });
    }

    const handleMovementEditIconClick = (selectedMovement) => {
        selectedMovement['firstMovementDate'] = selectedMovement['movement_timestamp'];
        setSelectedMovement(selectedMovement);
        setIsUpdateModelOpen(true);
    }

    const handleMovementCreateconClick = () => {
        setIsCreateModelOpen(true);
    }

    const createMovementIconAction = () => {
        setIsCreateModelOpenByAddIcon(true);
    }

    // Varaibles
    let product_name = selectedProduct ? selectedProduct.name : null;
    let selectedProductMovements = productMovements && selectedProduct && productMovements.filter(productMovement => productMovement.product_id === selectedProduct.id)
    let productPropertiesLabels = { "name": "Name", "warehouse": "Warehouse", "qty": "Quantity" };
    let movementPropertiesLabels = { "Date": "movement_timestamp", "Source": "from_location", "Destination": "to_location", "Quantity": "qty" };
    let newMovement = {};

    return (
        <div>
            <NavBar activeKey="2" />
            {
                getDataError ?
                    <div> {getDataError} </div>
                    :
                    <MDBContainer className="mainContainer">
                        <MDBContainer className="subContainer">
                            <MDBTypography variant="h4-responsive" colorText="blue"> Products List:</MDBTypography>
                            <MDBListGroup style={{ width: "90%" }}>
                                {
                                    products && products.map(({ product_id, name, warehouse, qty }, idx) => {
                                        return (
                                            <MDBListGroupItem
                                                key={idx}
                                                onClick={() => setSelectedProduct({
                                                    id: product_id,
                                                    name,
                                                    warehouse,
                                                    qty
                                                })}
                                                active={selectedProduct && selectedProduct.id === product_id}
                                            >
                                                {name}
                                            </MDBListGroupItem>
                                        )
                                    })
                                }
                            </MDBListGroup>
                        </MDBContainer>
                        <div className="vl"></div>
                        <MDBContainer className="subContainer">
                            {
                                selectedProduct ?
                                    <Fragment>
                                        <MDBTypography variant="h4-responsive" colorText="blue">{product_name} Product Details:</MDBTypography>
                                        <MDBContainer className="subContainer">
                                            {
                                                Object.keys(selectedProduct).map((propLabel, idx) => {
                                                    return (
                                                        productPropertiesLabels[propLabel] ?
                                                            <div key={idx} style={{ display: selectedPropertyIdx === idx ? "contents" : "inline-block" }}>
                                                                <strong> {productPropertiesLabels[propLabel]}: </strong>
                                                                {
                                                                    selectedPropertyIdx === idx ?
                                                                        <Fragment>
                                                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                                                <MDBInput
                                                                                    type="text"
                                                                                    valueDefault={selectedProduct[propLabel]}
                                                                                    onChange={(e) => setUpdatedProductProperty({ [propLabel]: e.target.value })}
                                                                                />
                                                                                <MDBIcon
                                                                                    className="updateConfirmIcon"
                                                                                    size="1x"
                                                                                    icon="check-circle"
                                                                                    far
                                                                                    onClick={() => updateProductProperty(propLabel)}
                                                                                />
                                                                                <MDBIcon
                                                                                    className="updateCancelItcon"
                                                                                    size="1x"
                                                                                    icon="times-circle"
                                                                                    far
                                                                                    onClick={() => setSelectedPropertyIdx(null)}
                                                                                />
                                                                            </div>

                                                                        </Fragment>
                                                                        :
                                                                        <Fragment>
                                                                            {selectedProduct[propLabel]}  <MDBIcon
                                                                                size="1x"
                                                                                icon="edit"
                                                                                onClick={() => handleProductEditIconClick(idx, propLabel)}
                                                                            />
                                                                        </Fragment>
                                                                }
                                                            </div>
                                                            :
                                                            null
                                                    )
                                                })
                                            }
                                        </MDBContainer>

                                        <div className="line"></div>

                                        {
                                            selectedProductMovements && selectedProductMovements.length > 0 ?
                                                <MDBContainer className="subContainer">
                                                    <div className="productMovementSectionTitle">
                                                        <p style={{ marginTop: "1rem" }}><strong>{product_name} Product Movements </strong>  ({selectedProductMovements.length} Movements) <strong>:</strong> </p>
                                                        <MDBIcon onClick={() => setIsCreateModelOpenByAddIcon(true)} icon="plus" className="newMovmentIcon"> </MDBIcon>
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
                                                                            <td>{new Date(movement_timestamp).toLocaleString()}</td>
                                                                            <td>{from_location}</td>
                                                                            <td>{to_location}</td>
                                                                            <td>{qty}</td>
                                                                            <td>
                                                                                <MDBBtn
                                                                                    className="EditBtn"
                                                                                    color="blue"
                                                                                    onClick={() => handleMovementEditIconClick(movement)}
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
                                                        selectedMovement ?
                                                            <MDBModal isOpen={isUpdateModelOpen} backdrop={true} centered>
                                                                <MDBModalHeader toggle={() => setIsUpdateModelOpen()} titleClass="modelTitle" >Update {product_name} Movement (# {selectedMovement.movement_id})</MDBModalHeader>
                                                                <MDBModalBody>
                                                                    {
                                                                        Object.keys(movementPropertiesLabels).map((mPropLabel, idx) => {

                                                                            let inputType = changeDate && mPropLabel === "Date" ? 'datetime-local' : mPropLabel === 'Quantity' ? 'number' : 'text';
                                                                            let currentInputValue = selectedMovement[movementPropertiesLabels[mPropLabel]];
                                                                            let valueDefault = mPropLabel === "Date" ? moment(currentInputValue).format("YYYY-MM-DD hh:mm:ss") : currentInputValue;
                                                                            let firstMovementDate = moment(selectedMovement['firstMovementDate']).format("YYYY-MM-DD hh:mm:ss");

                                                                            return (
                                                                                <MDBContainer key={idx}>
                                                                                    <MDBInputGroup
                                                                                        containerClassName="mb-3 flex"
                                                                                        prepend={mPropLabel}
                                                                                        type={inputType}
                                                                                        valueDefault={valueDefault}
                                                                                        onChange={(e) => selectedMovement[movementPropertiesLabels[mPropLabel]] = e.target.value}
                                                                                        value={!changeDate && mPropLabel === "Date" ? firstMovementDate : undefined}
                                                                                    />
                                                                                    {
                                                                                        mPropLabel === "Date" ?
                                                                                            <MDBLink
                                                                                                link={undefined}
                                                                                                onClick={() => setChangeDate(!changeDate)}
                                                                                                className="ChangeDateLink"> {!changeDate ? 'Change Date' : 'Cancel'}
                                                                                            </MDBLink>
                                                                                            :
                                                                                            null
                                                                                    }
                                                                                    {
                                                                                        mPropLabel === 'Destination' ?
                                                                                            <MDBLink to='/location' target="_blank" className="BrowseLocationsLink"> Browse locations </MDBLink>
                                                                                            :
                                                                                            null
                                                                                    }
                                                                                </MDBContainer>
                                                                            )
                                                                        })
                                                                    }

                                                                </MDBModalBody>
                                                                <MDBModalFooter>
                                                                    <MDBBtn color="primary" onClick={() => updateMovementProperties(selectedMovement)}>Update</MDBBtn>
                                                                </MDBModalFooter>
                                                            </MDBModal>
                                                            :
                                                            null
                                                    }

                                                </MDBContainer>
                                                :
                                                <Fragment>
                                                    <p style={{ color: "red" }}>
                                                        <strong>{product_name} Product doesn't has movements. <MDBLink className="CreateMovementsLink" onClick={() => handleMovementCreateconClick()}> Create Movement </MDBLink></strong>
                                                    </p>

                                                    {
                                                        isCreateModelOpenByAddIcon || (selectedProduct && isCreateModelOpen)?
                                                            <MDBModal isOpen={isCreateModelOpen} backdrop={true} centered>
                                                                <MDBModalHeader toggle={() => setIsCreateModelOpen(!isCreateModelOpen)} titleClass="modelTitle" >Create {product_name} Movement</MDBModalHeader>

                                                                <MDBModalBody>
                                                                    {
                                                                        Object.keys(movementPropertiesLabels).map((mPropLabel, idx) => {
                                                                            let inputType = mPropLabel === "Date" ? 'datetime-local' : mPropLabel === 'Quantity' ? 'number' : 'text';
                                                                            return (
                                                                                <MDBContainer key={idx}>
                                                                                    <MDBInputGroup
                                                                                        containerClassName="mb-3 flex"
                                                                                        prepend={mPropLabel}
                                                                                        type={inputType}
                                                                                        onChange={(e) => newMovement[movementPropertiesLabels[mPropLabel]] = e.target.value}
                                                                                    />
                                                                                    {
                                                                                        mPropLabel === 'Destination' ?
                                                                                            <MDBLink to='/location' target="_blank" className="BrowseLocationsLink"> Browse locations </MDBLink>
                                                                                            :
                                                                                            null
                                                                                    }
                                                                                </MDBContainer>
                                                                            )
                                                                        })
                                                                    }

                                                                </MDBModalBody>

                                                                <MDBModalFooter>
                                                                    <MDBBtn color="primary" onClick={() => addMovement(newMovement, selectedProduct.id)}>Create</MDBBtn>
                                                                </MDBModalFooter>
                                                            </MDBModal>
                                                            :
                                                            null
                                                    }
                                                </Fragment>
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