import React  from 'react';
import SearchList from './SearchList';
import escapeRegExp from 'escape-string-regexp';
import './App.css';

class App extends React.Component {

  state={
    authFailure:false,
    places:[
         {title: "Library of Alexandria" , search: "Library_of_Alexandria" , location : {lat:31.209192 , lng:29.909255}},
         {title: 'Great Pyramid of Giza', search: 'Great_Pyramid_of_Giza' , location: {lat: 29.977510, lng:31.132453}},
         {title: 'Abu Simbel temples', search: 'Abu_Simbel_temples', location: {lat: 22.337490, lng: 31.625799}},
         {title: 'Karnak Temple Complex', search: 'Karnak Temple_Complex', location: {lat: 25.719144, lng: 32.657227}},
         {title: 'Abydos', search : 'Abydos' ,location: {lat: 26.184853, lng: 31.922815}},
         {title: 'The Great Sphinx of Giza', search: 'Great_Sphinx_of_Giza' , location: {lat:29.975557, lng: 31.137482}}
        ],
       map:{},
       markers:[],
       infoWindow:{},
       query:""
  }

  componentDidMount(){
   window.initMap = this.initMap;

   window.gm_authFailure = ()=> {
     this.setState({
       authFailure:true
     });
   };

   // Asynchronously load the Google Maps script, passing in the callback reference
   loadMapJS(
     "https://maps.googleapis.com/maps/api/js?key=AIzaSyCU348OAoZQOxoODvDfrQee3Zg6fqPlv6g&callback=initMap"
   );
  }

  initMap = ()=> {
    let bounds = new window.google.maps.LatLngBounds();
    let infoWindow = new window.google.maps.InfoWindow();
    let mapDiv = document.getElementById("map");
    mapDiv.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(mapDiv);
    let markers = [];
    this.state.places.map((place)=>{
      let marker = new window.google.maps.Marker({
        map:map,
        position:place.location,
        title:place.title
      });
      marker.search = place.search;
      markers.push(marker);
      place.marker = marker;
      bounds.extend(marker.position);
      marker.addListener("click" , ()=>{
        this.openInfoWindow(marker);
      });
      return place;
    });
    this.setState({
      map:map,
      infoWindow:infoWindow,
      markers:markers
    });
    map.fitBounds(bounds);
  }

  updateCenter=(place)=>{
    this.state.map.setCenter(place.location);
    this.openInfoWindow(place.marker);
  }

  filter=(query)=>{
     this.setState({ query: query.trim() });
  }

  hideMarkers=()=>{
   this.state.markers.map((marker)=>{
     marker.setMap(null);
     return marker;
   });
  }

  showCurrentMarkers(list){
    let bounds = new window.google.maps.LatLngBounds();
    list.map((place)=>{
      place.marker.setMap(this.state.map);
      bounds.extend(place.marker.position);
      return place;
    });
    if(list.length > 1){
          this.state.map.fitBounds(bounds);
    }

  }

  showMarkers=()=>{
    this.state.markers.map((marker)=>{
      marker.setMap(this.state.map);
      return marker;
    });
  }

  openInfoWindow(marker){
    fetch("https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search="+marker.search)
    .then((resp)=> {
        return resp.json()
    }).then((data)=>{
      console.log(data);
      if(this.state.infoWindow.marker !== null){
        this.state.infoWindow.setContent(`<div>${data[2][0]}</div>`);
        this.state.infoWindow.open(this.state.map , marker);
      }
       this.state.infoWindow.addListener("closeclick", ()=>{
       this.state.infoWindow.setContent(null);
     });
   }).catch((error)=>{
      console.log(error);
      this.state.infoWindow.setContent(`<div>error loading content</div>`);
   });
  }



  render() {
    const  { places , query , authFailure } = this.state;
    let list;
    if (query) {
     const match = new RegExp(escapeRegExp(query), 'i');
     list = places.filter((place) => match.test(place.title));
     this.hideMarkers();
     this.showCurrentMarkers(list);
     } else {
     list = places;
     this.showMarkers();
   }
    return (
      <div className="App">
      {
        authFailure ? (
          <h1 className="error-msg"> error <span>:</span> authFailure</h1>
        ):(
          <div>
          <SearchList
          filter={this.filter}
          openInfoWindow={this.openInfoWindow}
          places={list}
          updateCenter={this.updateCenter}/>
          <div id="map" />
          </div>
        )
      }

      </div>
    );
  }
}

export default App;

function loadMapJS(src) {
  let ref = window.document.getElementsByTagName("script")[0];
  let script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);
};
