import React from "react";
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBIcon } from "mdbreact";

// indigo
const NavBar = (props) => {
    let { activeKey } = props;
    return (
        <MDBNavbar color="blue" dark expand="md">
            <MDBNavbarBrand href="/">
                <MDBIcon inverse fixed icon="store" /> <strong className="white-text">ERPMax</strong>
            </MDBNavbarBrand>
            <MDBNavbarNav left>
                <MDBNavItem active={activeKey === "1"}>
                    <MDBNavLink to="/">Home</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={activeKey === "2"}>
                    <MDBNavLink to="/product">Products</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={activeKey === "3"}>
                    <MDBNavLink to="/location">Locations</MDBNavLink>
                </MDBNavItem>
                <MDBNavItem active={activeKey === "4"}>
                    <MDBNavLink to="/report">Report</MDBNavLink>
                </MDBNavItem>
            </MDBNavbarNav>
        </MDBNavbar >
    );
}

export default NavBar;