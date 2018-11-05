import React, { Component } from 'react';
import axios from 'axios';

export default class Coordinates extends Component {

  state = {
    coordinatesDataLoaded: false,
    data: null
  }

  getCoordinates(location){
    const url = `http://localhost:8080/longlat/${location}`

      axios.get(url).then(response => {

        this.setState({
          coordinatesDataLoaded: true,
          position: [parseFloat(response.items[0].lat), parseFloat(response.items[0].long)],
        })
  }).catch(function(error){
    console.log(error);
    console.log("Error fetching coordinates data.");
  })
  }
}
