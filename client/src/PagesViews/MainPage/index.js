import React, { Fragment } from "react";
import { MDBView, MDBMask, MDBBtn } from "mdbreact";
import NavBar from "../../Components/NavBar";
import headerImage from "../../Images/header-image.jpg";
import './main-page.css';

const MainPage = () => {
    return (
        <Fragment>
            <NavBar activeKey="1" />
            <MDBView src={headerImage}>
                <MDBMask overlay="black-light" className="flex-center flex-column text-white text-center">
                    <div className="DetailsDiv">
                        <h2>ERPMax Shop</h2>
                        <h6>Web app to manage inventory of a list of products in respective warehouses </h6>
                    </div>
                    <div className="BtnsDiv">
                        <MDBBtn href="/product" color="blue">Products</MDBBtn>
                        Or
                        <MDBBtn href="/location" color="blue">Locations</MDBBtn>
                    </div>
                </MDBMask>
            </MDBView>
        </Fragment>
    );
}

export default MainPage;