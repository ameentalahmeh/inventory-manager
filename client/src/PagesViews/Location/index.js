import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import {
    MDBTypography,
    MDBContainer,
    MDBIcon,
    MDBLink,
    MDBCloseIcon
} from "mdbreact";
import NavBar from "../../Components/NavBar";
import List from "../../Components/List";
import Details from "../../Components/Details";
import Popup from "../../Components/Popup";

import "../../Style/shared-style.css";
import "./location.css";


const Location = () => {

    const [products, setProducts] = useState(null);
    const [locations, setLocations] = useState(null);

    const [selectedLocation, setSelectedLocation] = useState(null);

    const [selectedPropertyIdx, setSelectedPropertyIdx] = useState(null);
    const [updatedLocationProperty, setUpdatedLocationProperty] = useState(null);

    const [createProductModelOpen, setCreateProductModelOpen] = useState(false);
    const [createLocationModelOpen, setCreateLocationModelOpen] = useState(false);

    const [getDataError, setGetDataErrors] = useState(null);
    const [requestFeedback, setRequestFeedback] = useState(null);
    const [isUpdateLocationProperityError, setIsUpdateLocationProperityError] = useState(null)

    // Functions

    const getProducts = () => axios.get(`/api/products`)

    const getLocations = () => axios.get(`/api/locations`)

    const updateLocationProperty = (propLabel) => {

        axios
            .put(`/api/location/${selectedLocation.location_id}`, updatedLocationProperty)
            .then((response) => {
                let { data } = response;
                if (data && !data.error) {
                    selectedLocation[propLabel] = updatedLocationProperty[propLabel];
                    setTimeout(() => {
                        setUpdatedLocationProperty(null)
                        setSelectedPropertyIdx(null)
                        setRequestFeedback(data.message)
                        setSelectedLocation(selectedLocation)
                        getLocations()
                            .then((fetchedLocations) => {
                                let { data } = fetchedLocations && fetchedLocations.data && fetchedLocations.data;
                                setLocations(data)
                            })
                    }, '100');

                } else {
                    setRequestFeedback({ "error": data.error })
                    setIsUpdateLocationProperityError(true)
                }

            })
            .catch((err) => {
                console.log(err.message);
            })
    }

    const addLocation = (createdLocation) => {

        if (Object.keys(createdLocation).length <= 0) {
            setRequestFeedback({ "error": "The (city) field/s can't be empty!" })
        } else {
            axios
                .post(`/api/location`, createdLocation)
                .then((response) => {
                    let { data } = response;
                    if (data && !data.error) {
                        setTimeout(() => {
                            setRequestFeedback(data.message)
                            getLocations()
                                .then((fetchedLocations) => {
                                    let { data } = fetchedLocations && fetchedLocations.data && fetchedLocations.data;
                                    setLocations(data)
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

    const addProduct = (createdProduct, prod_location_id) => {
        createdProduct['prod_location_id'] = prod_location_id;
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

    useEffect(() => {
        try {
            getLocations()
                .then((fetchedLocations) => {
                    let { data } = fetchedLocations && fetchedLocations.data && fetchedLocations.data;
                    setLocations(data)
                })
                .then(() => {
                    getProducts()
                        .then((fetchedProducts) => {
                            let { data } = fetchedProducts && fetchedProducts.data && fetchedProducts.data;
                            setProducts(data)
                        })
                })
        } catch (error) {
            setGetDataErrors(error.message)
        }
    }, [])


    // Handlers 

    const handleLocationCreateIconClick = () => {
        setCreateLocationModelOpen(true)
        setRequestFeedback(null)
    }

    const handleProductCreateIconClick = () => {
        setCreateProductModelOpen(true)
        setRequestFeedback(null)
    }


    // Varaibles
    let location_city = selectedLocation ? selectedLocation.city : null;
    let selectedLocationProducts = products && selectedLocation && products.filter(product => product.prod_location_id === selectedLocation.location_id)
    let locationPropertiesLabels = { "city": "City" };
    let productPropertiesLabels = { "Name": "name", "Warehouse": "warehouse", "Quantity": "qty" };


    if (requestFeedback && !requestFeedback['error']) {
        setTimeout(() => {
            setRequestFeedback(null)
        }, '2000')
    }

    return (
        <div>
            <NavBar activeKey="3" />
            {
                requestFeedback ?
                    requestFeedback['error'] ?
                        isUpdateLocationProperityError ?
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
                            <div className="locationsListSectionTitle">
                                <MDBTypography variant="h4-responsive" colorText="blue"> Locations List:</MDBTypography>
                                <MDBIcon onClick={() => handleLocationCreateIconClick()} icon="plus" className="newLocationIcon"> </MDBIcon>
                            </div>
                            <List
                                items={locations}
                                setSelectedItem={setSelectedLocation}
                                selectedItem={selectedLocation}
                                setSelectedPropertyIdx={setSelectedPropertyIdx}
                                item_id="location_id"
                                itemVal="city"
                            />

                            {
                                createLocationModelOpen ?
                                    <Popup
                                        title={`Create new location`}
                                        eventHandler={addLocation}
                                        handlerBtnValue="Create"
                                        itemPropertiesLabels={{ 'City': 'city' }}
                                        isModelOpen={createLocationModelOpen}
                                        setIsModelOpen={setCreateLocationModelOpen}
                                        data={{ requestFeedback }}
                                    />
                                    :
                                    null
                            }

                        </MDBContainer>

                        <div className="vl"></div>

                        <MDBContainer className="subContainer">
                            {
                                selectedLocation ?
                                    <Fragment>
                                        <MDBTypography variant="h4-responsive" colorText="blue">{location_city} Location Details:</MDBTypography>

                                        <Details
                                            selectedItem={selectedLocation}
                                            itemPropertiesLabels={locationPropertiesLabels}
                                            selectedPropertyIdx={selectedPropertyIdx}
                                            setSelectedPropertyIdx={setSelectedPropertyIdx}
                                            setUpdatedItemProperty={setUpdatedLocationProperty}
                                            updateItemProperty={updateLocationProperty}
                                            setIsUpdateItemProperityError={setIsUpdateLocationProperityError}
                                        />

                                        <div className="line"></div>

                                        {
                                            selectedLocationProducts && selectedLocationProducts.length > 0 ?
                                                <MDBContainer className="subContainer">
                                                    <div className="locationProductsSectionTitle">
                                                        <p style={{ marginTop: "1rem" }}><strong>{location_city} Location Products </strong>  ({selectedLocationProducts.length} Products) <strong>:</strong></p>
                                                        <MDBIcon onClick={() => handleProductCreateIconClick()} icon="plus" className="newProductIcon"> </MDBIcon>
                                                    </div>

                                                    <div>





                                                    </div>

                                                    {
                                                        createProductModelOpen && selectedLocation ?
                                                            <Popup
                                                                title={`Create Product in ${location_city} Location`}
                                                                eventHandler={addProduct}
                                                                handlerBtnValue="Create"
                                                                itemPropertiesLabels={productPropertiesLabels}
                                                                isModelOpen={createProductModelOpen}
                                                                setIsModelOpen={setCreateProductModelOpen}
                                                                data={{ 'id': selectedLocation.location_id, requestFeedback }}
                                                            />
                                                            :
                                                            null
                                                    }


                                                </MDBContainer>
                                                :
                                                <Fragment>
                                                    <p style={{ color: "red" }}>
                                                        <strong>{location_city} Location doesn't has products. <MDBLink className="CreateProductsLink" onClick={() => handleProductCreateIconClick()}> Create Product </MDBLink></strong>
                                                    </p>
                                                </Fragment>
                                        }

                                    </Fragment>
                                    :
                                    <p> Pick a location to show its info </p>
                            }
                        </MDBContainer>
                    </MDBContainer>
            }
        </div >
    );
}

export default Location;