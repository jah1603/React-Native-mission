import React, { Component } from 'react';
import axios from 'axios';

const Helper = function (){
  weatherDataLoaded: false;
  data: null;
}

Helper.prototype.bindEvents = function (location, date) {
      this.getWeatherData(location, date);
     }

Helper.prototype.getWeatherData = function(location, seconds){
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


// export default class Weather extends Component {
//
//   state = {
//     weatherDataLoaded: false,
//     data: null
//   }
//
//   getWeatherData(location, seconds){
//       const url = `http://localhost:8083/weather/${location}/${seconds}`
//
//       axios.get(url).then(response => {
//         this.setState({
//           weatherDataLoaded: true,
//           data: response.data,
//         })
//   }).catch(function(error){
//     console.log(error);
//     console.log("Error fetching weather data.");
//   })
//   }
// }

export function bindEvents(){}
