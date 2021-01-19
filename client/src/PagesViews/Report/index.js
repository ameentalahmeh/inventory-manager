import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    MDBContainer,
    MDBTypography,
    MDBTable,
    MDBTableBody,
    MDBTableHead
} from "mdbreact";
import NavBar from "../../Components/NavBar";
import "./report.css";
import "../../Style/shared-style.css";


const Report = () => {

    const [report, setReport] = useState(null);
    const [getReportError, setGetReportError] = useState(null);

    const getReport = () => axios.get(`/api/report`)


    useEffect(() => {
        try {
            getReport()
                .then((fetchedReport) => {
                    let { data } = fetchedReport && fetchedReport.data && fetchedReport.data;
                    setReport(data)
                })
        } catch (error) {
            setGetReportError(error.message)
        }
    }, [])

    return (
        <div>
            <NavBar activeKey="4" />
            {
                getReportError ?
                    <div> {getReportError} </div>
                    :
                    <MDBContainer className="mainContainer reportContainer">
                        <MDBTypography variant="h4-responsive" colorText="blue"> Product Balance:</MDBTypography>

                        {
                            report ?
                                <MDBTable hover bordered>
                                    <MDBTableHead color="primary-color" textWhite>
                                        <tr>
                                            <th>#</th>
                                            <th>Product</th>
                                            <th>Warehouse</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </MDBTableHead>
                                    <MDBTableBody>
                                        {
                                            report.map((row, idx) => {
                                                let { product, warehouse, qty } = row;
                                                return (
                                                    <tr key={idx}>
                                                        <td>{idx + 1}</td>
                                                        <td>{product}</td>
                                                        <td>{warehouse}</td>
                                                        <td>{qty}</td>
                                                    </tr>)
                                            })
                                        }
                                    </MDBTableBody>
                                </MDBTable>
                                :
                                <p>Please wait few seconds for report preparing </p>
                        }

                    </MDBContainer>
            }
        </div>

    );
}

export default Report;