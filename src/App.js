import React  from 'react';
import SearchList from './SearchList'
import './App.css';

class App extends React.Component {

  state={
    places:[
         {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
         {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
         {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
         {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
         {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
         {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
       ],
       map:{},
       markers:[],
       infoWindow:{}
  }

  componentDidMount(){
   window.initMap = this.initMap;
   // Asynchronously load the Google Maps script, passing in the callback reference
   loadMapJS(
     "https://maps.googleapis.com/maps/api/js?key=AIzaSyCU348OAoZQOxoODvDfrQee3Zg6fqPlv6g&callback=initMap"
   );
  }

  initMap = ()=>{
    let bounds = new window.google.maps.LatLngBounds();
    let infoWindow = new window.google.maps.InfoWindow();
    let mapDiv = document.getElementById("map");
    mapDiv.style.height = window.innerHeight + "px";
    let map = new window.google.maps.Map(mapDiv, {
      center:this.state.center,
      zoom:5
    });
    let markers = [];
    this.setState({
      map:map,
      infoWindow:infoWindow
    });
    this.state.places.map((place)=>{
      let marker = new window.google.maps.Marker({
        map:map,
        position:place.location,
        title:place.title
      });
      markers.push(marker);
      place.marker = marker;
      bounds.extend(marker.position);
      marker.addListener("click" , ()=>{
        this.openInfoWindow(marker);
      });
      return place;
    });
    map.fitBounds(bounds);
  }

  updateCenter=(place)=>{
    this.state.map.setCenter(place.location);
    this.openInfoWindow(place.marker);
  }

   loadJS(src) {
      let ref = window.document.getElementsByTagName("script")[0];
      let script = window.document.createElement("script");
      script.src = src;
      script.async = true;
      ref.parentNode.insertBefore(script, ref);
  }

  openInfoWindow(marker){
    if(this.state.infoWindow.marker !== null){
      this.state.infoWindow.setContent(`<div>${marker.title}</div>`);
      this.state.infoWindow.open(this.state.map , marker);
    }
     this.state.infoWindow.addListener("closeclick", ()=>{
     this.state.infoWindow.setContent(null);
   });
  }

  render() {
    return (
      <div className="App">
      <SearchList
      openInfoWindow={this.openInfoWindow}
      places={this.state.places}
      updateCenter={this.updateCenter}/>
      <div id="map" />
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
}
