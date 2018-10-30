/*jshint esversion: 6 */
/*jshint ignore:start */

import React, { Component } from 'react';
import {Map, GoogleApiWrapper, InfoWindow, Marker} from 'google-maps-react';

const mapStyles = {
  width: '100%',
  height: '100%'
};

export class MapContainer extends Component {
  state={
    showingInfoWindow: false, //Hide or show the infowindow
    activeMarker: {}, //shows active marker upon click
    selectedPlace: {} //shows the infowindow upon selected place
  }

  //eventlisteneers for the markers
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  }

  onMarkerClose = props => {
    if(this.state.showingInfoWindow){
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      });
    }
  };


  render(){
    return(
      <Map
        google={this.props.google}
        zoom={14}
        styles={mapStyles}
        initialCenter={{
         lat: -1.2884,
         lng: 36.8233
        }}
      >
        <Marker 
          onClick={this.onMarkerClick}
          name={'Kenyatta International Convention Centre'}
        />
        <InfoWindow 
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={this.onMarkerClose}
        >
          <div>
            <h4>{this.state.selectedPlace.name}</h4>
          </div>
        </InfoWindow>
      </Map>         
    );
  }
}

export default GoogleApiWrapper({
  apiKey:'AIzaSyCmqUn32zlQU4mjmm17Ktd1qQQNUwXuavo',
})(MapContainer);

