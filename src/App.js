/*jshint esversion: 6 */
/*jshint ignore:start */

import React, { Component } from 'react';
import './App.css';
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class App extends Component {
   state = {
     venues: [],
     query: '',
     markers: [],
   } 

   componentDidMount(){
    this.getMapPoints();
   }

   renderMap = () => {
    loadGoogleMapAPIAsync("https://maps.googleapis.com/maps/api/js?key=<API_KEY>&callback=initMap")
    window.initMap = this.initMap;
   } 

   initMap = (venues) => {
    //create a map
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 28.639137482296025, lng: 77.24626003720249},
      zoom: 13
    });
    window.map = map;
    window.infoWindow = new window.google.maps.InfoWindow()
    var markers = [];
    var bounds = new window.google.maps.LatLngBounds();
    var highlightedIcon=this.makeMarkerIcon('FFFF24');
    var defaultIcon = this.makeMarkerIcon('0091ff');
    let showInfoWindow = (e, item, index) => {
        this.showInfoWindow(e, item, index);
      }
    //Display the markers and infowindow dynamically
    let effectiveVenues = venues || this.state.venues;
    effectiveVenues.map( (item, index) => {
      var marker = new window.google.maps.Marker({
      position: {lat: item.venue.location.lat, lng: item.venue.location.lng},
      //add animation drop
      animation: window.google.maps.Animation.DROP,
      icon: defaultIcon
      });
      this.state.markers.push(marker);
      //adding event listeners on markers
      marker.addListener('click', function(e){
        showInfoWindow(e, item, index);    
      });
      marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
      });
      marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
      });
      marker.setMap(map);
      bounds.extend({lat: item.venue.location.lat, lng: item.venue.location.lng});
    });
  }
   makeMarkerIcon = (markerColor) =>  {
        var markerImage = new window.google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new window.google.maps.Size(21, 34),
          new window.google.maps.Point(0, 0),
          new window.google.maps.Point(10, 34),
          new window.google.maps.Size(21,34));
        return markerImage;
  }
  getMapPoints = () => {
     const venuesEndpoint = 'https://api.foursquare.com/v2/venues/explore?';
     const params = {
      client_id: 'ILBI4230FZV5LMBRSXOFJGDNCC1CYWYGZ31K4TNM5Q2M2PCQ', //Client ID obtained by getting developer access
      client_secret: 'Z00DX4DOS4QEK13MHHM4QFNFB4G4JX0S5TSJKP2ZMLEFEWHF', //Client Secret obtained by getting developer access
      limit: 15, //The max number of venues to load
      v: '20130619', //The version of the API.
      near: 'New Delhi',
      radius: 5000,
      section: 'arts' 
    };
    fetch(venuesEndpoint + new URLSearchParams(params), {
        method: 'GET'
      }).then(response => response.json()).then( response => {
         this.setState({venues: response.response.groups[0].items}, this.renderMap()); //calling rendering of Map
      }).catch(err => {
        var parentDiv = document.getElementsByClassName('gridContainer');
        var errorElement = document.createElement('h2');
        errorElement.innerHtml='Unable to load Data';
        parentDiv.appendChild(errorElement);  
      })
    }
  
  updateQuery = (value) => {
    this.setState({ query: value.trim() })
  }
  
  showInfoWindow = (e, venue, index) => {
    let marker = this.state.markers[index];
    var contentString;
    //displaying streetview for each marker
    var streetViewService = new window.google.maps.StreetViewService();
    var radius = 50;
    function getStreetView(data, status) {
      contentString = `${venue.venue.name}` + ', ' + `${venue.venue.location.address}` + ' New Delhi';
      if (status === window.google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = window.google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          window.infoWindow.setContent('<div>' + contentString + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new window.google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        window.infoWindow.setContent('<div>' + contentString + '</div>' +
          '<div>No Street View Found</div>');
      }
    }      
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    //update the infowindow content
     //window.infoWindow.setContent(contentString);
    //open an info window
    window.infoWindow.open(window.map, marker)
  }
  
  render(){
   const query = this.state.query;
   let showingVenues
    if(query){  //create a regexp object with contents of input field
      const match = new RegExp(escapeRegExp(query), 'i') //escapeRegExp converts spl chr of query into string litel
      showingVenues = this.state.venues.filter( item => match.test(item.venue.name)) //'i' is for case insenstive
      this.initMap(showingVenues);
    }else {                                 
      showingVenues = this.state.venues;
    }
    //sort by is helper fun that helps to sort an array of objects based on any prop of that obj
    // {JSON.stringify(this.state)} loging query value on page to be used inside return
    showingVenues.sort(sortBy('name'));
     var venueList = showingVenues.map( (item, index) => 
      <li key={index} onClick={e => this.showInfoWindow(e, item, index)}>{item.venue.name}</li>
    );
 
    return ( 
      <div className="wrapper">
        <h1>Art and Museums in New Delhi</h1>
        <main>
          <div className="gridContainer">
            <div className="listSideBar">
              <input 
                    className='search-venues'
                    type='text'
                    placeholder='Search venues'
                    value={query}
                    onChange={ (event) => this.updateQuery(event.target.value) }
              />
              <ul id="venue-list">
                {venueList}
              </ul>
            </div>
            <div className="mapCenter">  
              <div id="map"></div>
            </div>  
          </div>  
        </main>
      </div>  
    );
  }
}




// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"
    // async defer></script>

function loadGoogleMapAPIAsync(url){
  var index = window.document.getElementsByTagName('script')[0]
  var script = window.document.createElement('script')
  script.src=url
  script.async=true
  script.defer=true
  index.parentNode.insertBefore(script, index)
}    
export default App;


