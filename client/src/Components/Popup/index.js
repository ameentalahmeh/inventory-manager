import React, { useState } from "react";
import moment from "moment";
import {
    MDBContainer,
    MDBLink,
    MDBInputGroup,
    MDBModal,
    MDBModalHeader,
    MDBModalBody,
    MDBModalFooter,
    MDBBtn,
    MDBTypography
} from "mdbreact";

const Popup = (props) => {

    const [changeDate, setChangeDate] = useState(false);

    let { title, eventHandler, handlerBtnValue, itemPropertiesLabels, isModelOpen, setIsModelOpen, data } = props;
    let { selectedMovement, id, requestFeedback } = data;
    let popupItem = {};

    if (requestFeedback && !requestFeedback['error']) {
        setIsModelOpen(!isModelOpen)
    }

    return (

        <MDBModal isOpen={isModelOpen} backdrop={true} centered>
            <MDBModalHeader toggle={() => setIsModelOpen(false)} titleClass="modelTitle" >{title}</MDBModalHeader>

            <MDBModalBody>
                {
                    Object.keys(itemPropertiesLabels).map((propLabel, idx) => {
                        let inputType = propLabel === "Date" ? 'datetime-local' : propLabel === 'Quantity' ? 'number' : 'text';
                        let currentInputValue = selectedMovement && selectedMovement[itemPropertiesLabels[propLabel]];
                        let valueDefault = propLabel === "Date" ? moment(currentInputValue).format("YYYY-MM-DD hh:mm:ss") : currentInputValue;

                        return (
                            <MDBContainer key={idx}>
                                <MDBInputGroup
                                    containerClassName="mb-3 flex"
                                    prepend={propLabel}
                                    type={handlerBtnValue === "Update" && !changeDate && propLabel === "Date" ? 'text' : inputType}
                                    valueDefault={valueDefault}
                                    onChange={(e) => (popupItem[itemPropertiesLabels[propLabel]] = e.target.value)}
                                />
                                {
                                    handlerBtnValue === "Update" && propLabel === "Date" ?
                                        <MDBLink
                                            link={undefined}
                                            onClick={() => setChangeDate(!changeDate)}
                                            className="ChangeDateLink"> {!changeDate ? 'Change Date' : 'Cancel'}
                                        </MDBLink>
                                        :
                                        null
                                }
                                {
                                    propLabel === 'Destination' ?
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
                <MDBBtn color="primary" onClick={() => eventHandler(popupItem, id)}>{handlerBtnValue}</MDBBtn>
                <MDBTypography colorText="red"> {requestFeedback && requestFeedback['error'] ? requestFeedback['error'] : null} </MDBTypography>
            </MDBModalFooter>
        </MDBModal>
    )
}

export default Popup;