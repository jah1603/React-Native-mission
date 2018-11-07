import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import {ImageBackground} from 'react-native';
import DatePicker from 'react-native-datepicker';
import CircleSlider from 'react-native-circle-slider';
import Modal from 'react-native-modal';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import { Font } from 'expo';
import t from 'tcomb-form-native';

// const Weather = require('./models/Weather.js');
import { getWeatherData } from './models/Helper.js';
import { returnWeatherData } from './models/Helper.js';
import { Helper } from './models/Helper.js';

import axios from 'axios';


const Form = t.form.Form;

const User = t.struct({
  location: t.String
});

const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10,
      width: '80%',
      alignSelf: 'center'
    },
  },
  controlLabel: {
    normal: {
      color: 'transparent',
      fontSize: 0,
      marginBottom: 7,
      fontWeight: 'bold'
    },
    // the style applied when a validation error occours
    error: {
      color: 'red',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
    }
  }
}


const options = {
  fields: {
    location: {
      placeholder: "Where are you getting married?",
      placeholderTextColor: "#24b599",
      error: 'Please enter a place or postcode',
      textAlign: 'center',
      fontSize: 28,
      fontWeight: 'bold',
      opacity: '50%'
    },
    date: {
      mode: 'date',
      dialogMode: 'spinner'
    },
  },
  stylesheet: formStyles,
};

export default class App extends Component {


  constructor(props) {
  super(props);
  this.processSubmit = this.processSubmit.bind(this);
  this.toggleModal = this.toggleModal.bind(this);
  this.getWeatherData = this.getWeatherData.bind(this);
  this.getCoordinates = this.getCoordinates.bind(this);
}


  state = {
   fontLoaded: false,
   dateSelected: 0,
   isModalVisible: false,
   weather: null,
   position: null,
   searchedLocation: null,
   icon: '',
 };

  // handleSubmit = () => {
  //   const value = this._form.getValue();
  //   console.log('value: ', value);
  // }

  async componentDidMount() {
    await Font.loadAsync({
      'open-raleway': require('./assets/fonts/Raleway-Regular.ttf'),
    });

     this.setState({ fontLoaded: true });
  }

  convertSecondsToCalendarDate(){
    var fractionOfYear = this.state.dateSelected / 365;
    var secondsInAYear = 31536000;
    var seconds = fractionOfYear * secondsInAYear;

    var dateToDisplay = new Date(seconds * 1000);
    var months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
    var month = months[dateToDisplay.getMonth()];
    var date = dateToDisplay.getDate();

    return `${date} ${month}`;
  }

  getVal(val) {
        console.warn(val);
    }

  processSubmit(){
    var date = 1541427789;
    var lat = 42.3601;
    var long = -71.0589;
    const value = this._form.getValue()
    console.log('value: ', value.location);
    var self = this;
    // var location = `${lat}, ${long}`

    this.setState( {searchedLocation: value.location}, function(){ this.getCoordinates(self.state.searchedLocation) });
  }

    toggleModal(){

      console.log("ICON", this.state.icon);

      this.setState({ isModalVisible: !this.state.isModalVisible });

    }


    getCoordinates(location){

      const url = `http://weather2wed.herokuapp.com/longlat/${location}`
      var self = this;

        axios.get(url).then((response) => {

          var position = [parseFloat(response.data.items[1].lat), parseFloat(response.data.items[1].long)]


          this.setState({
            coordinatesDataLoaded: true,
            position: position,
          }, function(){this.getWeatherData(`${self.state.position[0]},${self.state.position[1]}`, 1541427789)})
    }).catch(function(error){
      console.log(error);
      console.log("Error fetching coordinates data.");
    })
    }


    getWeatherData = function(location, seconds){
        const url = `http://weather2wed.herokuapp.com/weather/${location}/${seconds}`
        console.log("RETRIEVING WEAther");
        axios.get(url).then(response => {

          console.log("data", this.data);
          this.setState({
            weather: response.data,
            icon: `${response.data.daily.data[0].icon}`
          }, function(){this.toggleModal()})

    }).catch(function(error){
      console.log(error);
      console.log("Error fetching weather data.");
    })
    }

    fahrenheitToCelsius = function (fahrenheit) {
      const celsius = Math.round(((fahrenheit - 32)/1.8));
      return celsius;
    };

     getImage(icon) {
      switch(icon) {
      case "partly-cloudy-day": return require("./assets/icons/partly-cloudy-day.png");
      case "partly-cloudy-day": return require("./assets/icons/partly-cloudy-day.png");
      case "fog": return require("./assets/icons/fog.png");
      case "clear-day": return require("./assets/icons/clear-day.png");
      case "clear-night": return require("./assets/icons/clear-night.png");
      case "clouds": return require("./assets/icons/clouds.png");
      case "cloudy": return require("./assets/icons/cloudy.png");
      case "partly-cloudy-night1": return require("./assets/icons/partly-cloudy-night1.png");
      case "partly-cloudy-night": return require("./assets/icons/partly-cloudy-night.png");
      case "pine": return require("./assets/icons/pine.png");
      case "rain": return require("./assets/icons/rain.png");
      case "raining": return require("./assets/icons/raining.png");
      case "sleet": return require("./assets/icons/sleet.png");
      case "wind": return require("./assets/icons/wind.png");
      case "wind1": return require("./assets/icons/wind1.png");
  }
}


  timeConverterToHours = function (UNIX_timestamp) {

  var a = new Date(UNIX_timestamp * 1000);

  var hour = a.getHours(); // makes time easier to read (presumes wedding is pm!)
  var min = a.getMinutes();
  if (min < 10){
    min = `0${min}`;
  }
  if (hour > 12){
  var time = hour-12 + ':' + min + ' pm'  ;
  }
  else if (hour == 12){
  var time = hour + ':' + min + ' pm' + ' (midday)'  ;
  }
  else if (hour == 0){
  var time = 12 + ':' + min + ' pm' + ' (midnight)'  ;
  }
  else{
  var time = hour + ':' + min + ' am'  ;
  }

  return time;
  }

  render() {
    var self = this;
    return (
      <ImageBackground
               source={require('./assets/bride8.jpeg')}
               style={styles.backgroundStyle}
               >

      <View style={styles.container}>
      {
   this.state.fontLoaded ? (

     <View>
     <Text style={{ fontFamily: 'open-raleway', paddingBottom: '7.5%', fontSize: 40, textAlign: 'center', fontWeight: 'bold', color: "#24b599"}}>
       Weather2Wed
     </Text>
     </View>
   ) : null
 }
        <View style={{paddingBottom: '10%'}}>
        <Form
          style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: "#24b599"}}
          ref={c => this._form = c}
          type={User}
          options={options}
          color="#12D8FA"
          textAlign="center"
          underlineColorAndroid="rgba(0,0,0,0)"
        />
        </View>

        <View style={{ width: '100%', height: '50%', alignItems: 'center'}}>
        <CircleSlider style={{position: 'relative', top: '10%', paddingTop: '100%'}}
			arcDirection={'CW'}
            backgroundColor={"white"}
            value={0}
            btnRadius={15}
            btnColor={'#24b599'}
            sliderRadius={110}
            sliderWidth={25}
            startDegree={0}
            maxValue={370.069444444}
            onPressInnerCircle={(value) => console.log(`Inner: ${value}`)}
            onPressOuterCircle={(value) => console.log(`Outer: ${value}`)}
            onValueChange={val => this.setState({ dateSelected: val })}
            onSlidingComplete={val => this.getVal(val)}
            endGradient={"#A6FFCB"}
            startGradient={"#12D8FA"}
            showValue={'true'}
            textColor={'black'}
            textSize={20}
		/>
    <Text style={{fontSize: 20, color: "#24b599"}}>
    {`${this.convertSecondsToCalendarDate()}`}
    </Text>
    </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.button}
        onPress={this.processSubmit}>
        <Image source={require('./assets/weather2wed_button.jpg')} style={{height: '60%', width: '52%'}}/>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <Modal
        isVisible={this.state.isModalVisible}
        style={styles.modalContainer}
        >
          <TouchableOpacity onPress={this.toggleModal} style={{ height: 22}}>
            <Image source={require('./assets/image.png')} style={{height: 22, width: 22, marginBottom: 10, position: 'relative', left:'91%'}}/>
          </TouchableOpacity>

          <View style={{flex: 1, backgroundColor: 'transparent'}}>

          <View style={{backgroundColor: '#24b599', borderTopRightRadius: 5, borderTopLeftRadius: 5}}>
        {
          this.state.weather ? (
               <Text style={{color: 'white', padding: 5}}>Typical weather for {this.convertSecondsToCalendarDate()}: {this.state.weather.hourly.summary}</Text>
          ) :   <Text style={{color: 'white', padding: 5}}>Typical weather for {this.convertSecondsToCalendarDate()}: (Hardcoded) Light rain starting in the evening.</Text>
        }

          </View>

        {
     this.state.weather ? (
       <View style={styles.resultsWrapper}>

       <View style={styles.weatherItem}>
       <Image source={ this.getImage(this.state.icon) } style={{width: '25%', height: '90%'}}/>
       <Text style={styles.weatherItemText}> Average temp: { this.fahrenheitToCelsius(this.state.weather.hourly.data[14].temperature) }°C</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/rain_chance.png')} style={{width: '25%', height: '90%'}}/>
       <Text style={styles.weatherItemText}> Chance of rain: { Math.round(this.state.weather.daily.data[0].precipProbability * 100) }%</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/sunset.png')} style={{width: '25%', height: '90%'}}/>
       <Text style={styles.weatherItemText}> Sunrise: { this.timeConverterToHours(this.state.weather.daily.data[0].sunriseTime) }, Sunset: { this.timeConverterToHours(this.state.weather.daily.data[0].sunsetTime) }</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/waning_gibbous.jpg')} style={{width: '25%', height: '90%'}}/>
       <Text style={styles.weatherItemText}>Moon phase: {this.state.weather.hourly.data[0].apparentTemperature}</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/temperature.png')} style={{width: '25%', height: '90%'}}/>
       <Text style={styles.weatherItemText}>Low: {this.fahrenheitToCelsius(this.state.weather.daily.data[0].temperatureLow)}°C at { this.timeConverterToHours(this.state.weather.daily.data[0].temperatureLowTime) }, High: {this.fahrenheitToCelsius(this.state.weather.daily.data[0].temperatureHigh)}°C at { this.timeConverterToHours(this.state.weather.daily.data[0].temperatureHighTime) } </Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/humidity.jpg')} style={{width: '25%', height: '90%'}}/>
       <Text style={styles.weatherItemText}>Humidity: { this.state.weather.daily.data[0].humidity*100 }%</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/wind-speed.png')} style={{width: '25%', height: '90%'}}/>
       <Text style={styles.weatherItemText}>Wind speed: {this.state.weather.daily.data[0].windSpeed} mph</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/clouds.png')} style={{width: '25%', height: '90%'}}/>
       <Text style={styles.weatherItemText}>Cloud cover: { this.state.weather.daily.data[0].cloudCover * 100 }%</Text>
       </View>

       <TouchableOpacity onPress={this.toggleModal} style={{justifyContent: 'center', height: '10%'}}>
       <View>
         <Image source={require('./assets/darksky.png')} style={{position: 'relative', top: '0%', height: '70%', width: '70%'}}/>
       </View>
       </TouchableOpacity>

       </View>

     ) : <Text> </Text>
   }


          </View>
        </Modal>
      </ScrollView>
      </View>
    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginTop: 45,
    padding: 20,
    backgroundColor: 'transparent'
  },
  resultsWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  weatherItem: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: "#24b599"
  },
  weatherItemText: {
    flex: 1,
    flexWrap: 'wrap'
  },
  buttonContainer: {
    alignItems: 'center',
    height: '25%'
  },
  backgroundStyle: {
    width: '100%',
    height: '100%'
  },
  button: {
    alignItems: 'center',
    position: 'absolute',
    top: '20%',
    height: '100%',
    width: '50%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    padding: 20,
    backgroundColor: 'white'
  },
  tableContainer: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  tableHead: { height: 40, backgroundColor: '#24b599' },
  tableText: { margin: 6 }
});
