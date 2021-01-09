import React from "react";
import { MDBView, MDBMask, MDBBtn } from "mdbreact";
import NavBar from "../../Components/NavBar";
import headerImage from "../../Images/header-image.jpg";
import './main-page.css';

const MainPage = (props) => {
    let { history } = props;
    return (
        <div>
            <NavBar activeKey="1" />
            <MDBView src={headerImage}>
                <MDBMask overlay="black-light" className="flex-center flex-column text-white text-center">
                    <div className="DetailsDiv">
                        <h2>ERPMax</h2>
                        <h5>Shop Management Application</h5>
                        <p>ERPMax enables you to manage inventory of a list of products in the respective warehouses  </p>
                    </div>
                    <div>
                        <MDBBtn onClick={() => history.push("/product")} color="blue">Products</MDBBtn>
                        Or
                        <MDBBtn onClick={() => history.push("/location")} color="blue">Locations</MDBBtn>
                    </div>
                </MDBMask>
            </MDBView>
        </div>
    );
}

export default MainPage;