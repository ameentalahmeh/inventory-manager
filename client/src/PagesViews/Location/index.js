import React, { useState, useEffect, Fragment } from "react";
import NavBar from "../../Components/NavBar";
// import "./Location.css";

const Location = () => {

    // Get Locations
    const [locations, setLocations] = useState(null);

    useEffect(() => {
        fetch('/api/locations').then(res => res.json()).then(fetchedLocations => {
            setLocations(fetchedLocations)
        });
    }, []);

    console.log(locations);
    return (
        <Fragment>
            <NavBar activeKey="3" />
        </Fragment>
    );
}

export default Location;
