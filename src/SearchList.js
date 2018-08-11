import React , { Component } from 'react';
import ListItem from './ListItem'

class SearchList extends Component{

render() {
  return(
    <div className="search-list">
      <input
        onChange={
          (e)=>{
            this.props.filter(e.target.value);
          }
        }
        role="search"
        className="search-input"
        type="text"
        placeholder="search"
      />
      <ul className="places-list">
        {
          this.props.places.map((place , index)=>{
            return(
              <ListItem
              openInfoWindow={this.props.openInfoWindow.bind(this)}
              key={index}
              place={place}
              updateCenter={this.props.updateCenter}/>
            )
          })
        }
      </ul>
 </div>
  )
}

}


export default SearchList;
