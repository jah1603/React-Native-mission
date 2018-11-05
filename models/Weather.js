import React, { Component } from 'react';
import axios from 'axios';

export default class Weather extends Component {

  state = {
    weatherDataLoaded: false,
    data: null
  }

  getWeatherData(location, seconds){
      const url = `http://localhost:8083/weather/${location}/${seconds}`

      axios.get(url).then(response => {
        this.setState({
          weatherDataLoaded: true,
          data: response.data,
        })
  }).catch(function(error){
    console.log(error);
    console.log("Error fetching weather data.");
  })
  }
}
