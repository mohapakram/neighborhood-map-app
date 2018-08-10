import React  from 'react';


const ListItem = (props)=>{
    return(
      <li onClick={()=>{
        props.updateCenter(props.place)
        props.openInfoWindow.bind(this , props.place)
      }}>{props.place.title}</li>
    )
};

export default ListItem;
