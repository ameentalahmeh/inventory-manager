import React from "react";
import {
    MDBListGroup,
    MDBListGroupItem,
} from "mdbreact";



const List = (props) => {
    
    let { items, setSelectedItem, setSelectedPropertyIdx, selectedItem, item_id, itemVal } = props;

    const onSelectItem = (item) => {
        setSelectedItem(item);
        setSelectedPropertyIdx(null)
    }
    
    return (
        <MDBListGroup style={{ width: "90%" }}>
            {
                items && items.map((item, idx) => {
                    return (
                        <MDBListGroupItem
                            key={idx}
                            onClick={() => onSelectItem(item)}
                            active={selectedItem && selectedItem[item_id] === item[item_id]}
                        >
                            {item[itemVal]}
                        </MDBListGroupItem>
                    )
                })
            }
        </MDBListGroup>
    )
}

export default List;