import React, { useState, useEffect } from "react";
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
        <div className="Location">
        </div>
    );
}

export default Location;
