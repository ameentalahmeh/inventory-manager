import React, { Fragment } from 'react';
import { MDBContainer, MDBInput, MDBIcon } from "mdbreact";


const Details = (props) => {

    let {
        selectedItem,
        itemPropertiesLabels,
        selectedPropertyIdx,
        setSelectedPropertyIdx,
        setUpdatedItemProperty,
        updateItemProperty,
        setIsUpdateItemPropertyOpen } = props;


    const handleItemEditIconClick = (propIndex, propLabel) => {
        setIsUpdateItemPropertyOpen(true)
        setSelectedPropertyIdx(propIndex);
        setUpdatedItemProperty({ [propLabel]: selectedItem[propLabel] });
    }

    return (

        <MDBContainer className="subContainer">
            {
                Object.keys(selectedItem).map((propLabel, idx) => {
                    return (
                        itemPropertiesLabels[propLabel] ?
                            <div key={idx} style={{ display: selectedPropertyIdx === idx ? "contents" : "inline-block" }}>
                                <strong> {itemPropertiesLabels[propLabel]}: </strong>
                                {
                                    selectedPropertyIdx === idx ?
                                        <Fragment>
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <MDBInput
                                                    type="text"
                                                    valueDefault={selectedItem[propLabel]}
                                                    onChange={(e) => setUpdatedItemProperty({ [propLabel]: e.target.value })}
                                                />
                                                <MDBIcon
                                                    className="updateConfirmIcon"
                                                    size="1x"
                                                    icon="check-circle"
                                                    far
                                                    onClick={() => updateItemProperty(propLabel)}
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
                                            {selectedItem[propLabel]}  <MDBIcon size="1x" icon="edit"
                                                onClick={() => handleItemEditIconClick(idx, propLabel)}
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

    )

}

export default Details