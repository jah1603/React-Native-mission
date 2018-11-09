import React, { Component } from 'react';
import { WebView, View, Text, TextInput, ScrollView, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import {ImageBackground} from 'react-native';
import DatePicker from 'react-native-datepicker';
import CircleSlider from 'react-native-circle-slider';
import Modal from 'react-native-modal';
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import FitImage from 'react-native-fit-image';
import Carousel from 'react-native-snap-carousel';
import { Font} from 'expo';
import t from 'tcomb-form-native';
import key from './google.js';
import MapView from 'react-native-maps';
import SunCalc from 'suncalc';

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
      placeholder: "Where (place or postcode)?",
      placeholderTextColor: "white",
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
   dateSelected: null,
   isModalVisible: false,
   weather: null,
   position: null,
   searchedLocation: null,
   icon: '',
   loadingInProcess: null
 };

  // handleSubmit = () => {
  //   const value = this._form.getValue();
  //   console.log('value: ', value);
  // }

  async componentDidMount() {
    await Font.loadAsync({
      'Raleway-Regular': require('./assets/fonts/Raleway-Regular.ttf'),
    });

     this.setState({ fontLoaded: true });
     console.log("FONT LOADED", this.state.fontLoaded);
  }

  convertSecondsToCalendarDate(){
    var fractionOfYear = this.state.dateSelected / 365;
    var secondsInAYear = 31536000;
    var seconds = fractionOfYear * secondsInAYear;

    var dateToDisplay = new Date(seconds * 1000);
    var months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
    var month = months[dateToDisplay.getMonth()];
    var date = dateToDisplay.getDate();

    if (!this.state.dateSelected){
      return 'Slide to select date'
    }
    else {
      return `${date} ${month}`;
    }
  }

  moonPhase(){

    return SunCalc.getMoonIllumination(this.moonPhaseDate(this.dateForRequest(this.state.dateSelected))).phase;
  }

  moonPhaseDateTreatment(userDate){


  }

  convertMoonPhaseNumberToName(moonPhaseNumber) {


  if (moonPhaseNumber <= 0.01 && moonPhaseNumber >= 0){
    var moonPhaseName = 'New moon'
  }
  else if(moonPhaseNumber <= 0.245 && moonPhaseNumber > 0.01){
    var moonPhaseName = 'Waxing crescent moon'
  }
  else if(moonPhaseNumber <= 0.255 && moonPhaseNumber > 0.245){
    var moonPhaseName = 'First quarter moon'
  }
  else if(moonPhaseNumber > 0.49 && moonPhaseNumber <= 0.51){
    var moonPhaseName = 'Full moon'
  }
  else if(moonPhaseNumber <= 0.49 && moonPhaseNumber > 0.255){
    var moonPhaseName = 'Waxing gibbous moon'
  }
  else if(moonPhaseNumber <= 0.755 && moonPhaseNumber > 0.745){
    var moonPhaseName = 'Last quarter moon'
  }
  else if(moonPhaseNumber <= 0.755 && moonPhaseNumber >= 0.51 ){
    var moonPhaseName = 'Waning gibbous moon'
  }
  else{
    var moonPhaseName = 'Waning crescent moon'
  }
  return moonPhaseName;
};


  moonPhaseImage(phaseImageName){

    switch(phaseImageName) {

    case "new_moon.jpg": return require("./assets/icons/new_moon.jpg");
    case "waxing_crescent.jpg": return require("./assets/icons/waxing_crescent.jpg");
    case "first_quarter.jpg": return require("./assets/icons/first_quarter.jpg");
    case "full_moon.jpg": return require("./assets/icons/full_moon.jpg");
    case "waxing_gibbous.jpg": return require("./assets/icons/waxing_gibbous.jpg");
    case "last_quarter.jpg": return require("./assets/icons/last_quarter.jpg");
    case "waning_gibbous.jpg": return require("./assets/icons/waning_gibbous.jpg");
    case "waning_crescent.jpg": return require("./assets/icons/waning_crescent.jpg");

  }

  }

  convertMoonPhaseNumberToImageName(moonPhaseNumber) {

  if (moonPhaseNumber <= 0.01 && moonPhaseNumber >= 0){
    var moonPhaseName = 'new_moon.jpg'
  }
  else if(moonPhaseNumber <= 0.245 && moonPhaseNumber > 0.01){
    var moonPhaseName = 'waxing_crescent.jpg'
  }
  else if(moonPhaseNumber <= 0.255 && moonPhaseNumber > 0.245){
    var moonPhaseName = 'first_quarter.jpg'
  }
  else if(moonPhaseNumber > 0.49 && moonPhaseNumber <= 0.51){
    var moonPhaseName = 'full_moon.jpg'
  }
  else if(moonPhaseNumber <= 0.49 && moonPhaseNumber > 0.255){
    var moonPhaseName = 'waxing_gibbous.jpg'
  }
  else if(moonPhaseNumber <= 0.755 && moonPhaseNumber > 0.745){
    var moonPhaseName = 'last_quarter.jpg'
  }
  else if(moonPhaseNumber <= 0.755 && moonPhaseNumber >= 0.51 ){
    var moonPhaseName = 'waning_gibbous.jpg'
  }
  else{
    var moonPhaseName = 'waning_crescent.jpg'
  }
  return moonPhaseName;
};

  convertSecondsToCalendarDateForOutputText(){
    var fractionOfYear = this.state.dateSelected / 365;
    var secondsInAYear = 31536000;
    var seconds = fractionOfYear * secondsInAYear;

    var dateToDisplay = new Date(seconds * 1000);
    var months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
    var month = months[dateToDisplay.getMonth()];
    var date = dateToDisplay.getDate();

    if (!this.state.dateSelected){
      return '1 January';
    }
    else {
      return `${date} ${month}`;
    }
  }

  getVal(val) {
        console.warn(val);
    }

  processSubmit(){
    var self = this;
    // var location = `${lat}, ${long}`

    this.setState({ loadingInProcess: true }, function(){this.getCoordinates(self.state.searchedLocation)})
  }

    toggleModal(){

      console.log("ICON", this.state.icon);

      this.setState({ loadingInProcess: false }, function(){this.setState({ isModalVisible: !this.state.isModalVisible })});

    }

    dateForRequest(dateChosen){
      var newYearsDay2019 = 1483228800;
      var fractionOfYear = dateChosen / 365;
      var secondsInAYear = 31536000;
      var seconds = fractionOfYear * secondsInAYear;

      return seconds + 1483228800;
    }

    moonPhaseDate(date){
      return new Date(date*1000)
    }


    getCoordinates(location){

      const url = `http://weather2wed.herokuapp.com/longlat/${location}`
      var self = this;

        axios.get(url).then((response) => {

          var position = [parseFloat(response.data.items[0].lat), parseFloat(response.data.items[0].long)]
          console.log("DATE SEARCHED", self.state.dateSelected);
          this.setState({
            coordinatesDataLoaded: true,
            position: position,
          }, function(){this.getWeatherData(`${self.state.position[0]},${self.state.position[1]}`, self.dateForRequest(self.state.dateSelected))})
    }).catch(function(error){
      console.log(error);
      console.log("Error fetching coordinates data.");
    })
    }


    getWeatherData = function(location, seconds){
      console.log("API Key", key);
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
      case "snow": return require("./assets/weather_icons/png/037-snowflake.png");
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


  updateLocationState(searchedLocation){
    this.setState({
      searchedLocation: searchedLocation
    })

  }

  render() {
    var self = this;


    if (self.state.loadingInProcess === true){
      return (

        <ImageBackground
                 source={require('./assets/affair-anniversary-beach.png')}
                 style={styles.backgroundStyle}
                 >

        <View style={styles.container}>
        {
     this.state.fontLoaded ? (

       <View>
       <Text style={{ fontFamily: 'Raleway-Regular', paddingBottom: '7.5%', fontSize: 45, fontWeight: '400', textAlign: 'center',  color: "white"}}>
         Weather2Wed
       </Text>
       </View>
     ) : null
   }
          <View style={{paddingBottom: '10%'}}>
          <TextInput
        style={{height: 40, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 19}}
        onChangeText={(searchedLocation) => {this.updateLocationState(searchedLocation)}}
        value={this.state.searchedLocation} placeholder='Where? Place or postcode' placeholderTextColor='white'
        underlineColorAndroid='transparent'
      />

          </View>

          <View style={{ width: '100%', height: '50%', alignItems: 'center'}}>
          <CircleSlider style={{position: 'relative', top: '10%', paddingTop: '100%'}}
        arcDirection={'CW'}
              backgroundColor={"white"}
              value={0}
              btnRadius={10}
              btnColor={'#24b599'}
              sliderRadius={110}
              sliderWidth={17.5}
              startDegree={0}
              maxValue={365}
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
      <Text style={{fontSize: 25, fontWeight: 'normal', color: "white", textShadowColor: '#103356', textShadowOffset: {width: -2.5, height: 2.5}, textShadowRadius: 10}}>
      {`${this.convertSecondsToCalendarDate()}`}
      </Text>
      </View>

          <View style={styles.buttonContainer}>
          <TouchableOpacity
          style={styles.button}
          onPress={this.processSubmit}>
          <Image source={require('./assets/weather2wed_button.jpg')} style={{height: 100, width: 100 }}/>
          </TouchableOpacity>
        </View>

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
                 <Text style={{color: 'white', padding: 5, fontSize: 20}}>Typical weather in '{this.state.searchedLocation}' for {this.convertSecondsToCalendarDateForOutputText()}: '{this.state.weather.hourly.summary}'</Text>
            ) :   <Text style={{color: 'white', padding: 5, fontSize: 20}}>Typical weather in '{this.state.searchedLocation}' for {this.convertSecondsToCalendarDateForOutputText()}: (Hardcoded) Light rain starting in the evening.</Text>
          }

            </View>

          {
       this.state.weather ? (
         <View style={styles.resultsWrapper}>

         <ScrollView>

         <View style={styles.weatherItem}>

         <Image source={ this.getImage(this.state.icon) } style={{width: 75, height: 75}}/>

         <Text style={styles.weatherItemText}> Average temp: { this.fahrenheitToCelsius(this.state.weather.hourly.data[14].temperature) }°C</Text>

         </View>

         <View style={styles.weatherItem}>
         <Image source={require('./assets/icons/rain_chance.png')} style={{width: 75, height: 75}}/>
         <Text style={styles.weatherItemText}> Chance of rain: { Math.round(this.state.weather.daily.data[0].precipProbability * 100) }%</Text>
         </View>

         <View style={styles.weatherItem}>
         <Image source={require('./assets/icons/sunset.png')} style={{width: 75, height: 75}}/>
         <Text style={styles.weatherItemText}> Sunrise: { this.timeConverterToHours(this.state.weather.daily.data[0].sunriseTime) }, Sunset: { this.timeConverterToHours(this.state.weather.daily.data[0].sunsetTime) }</Text>
         </View>

         <View style={styles.weatherItem}>
         <Image source={ this.moonPhaseImage(this.convertMoonPhaseNumberToImageName(this.moonPhase())) } style={{width: 75, height: 75}}/>
         <Text style={styles.weatherItemText}>{this.convertMoonPhaseNumberToName(this.moonPhase())} (estimate)</Text>
         </View>

         <View style={styles.weatherItem}>
         <Image source={require('./assets/icons/temperature.png')} style={{width: 75, height: 75}}/>
         <Text style={styles.weatherItemText}>Low: {this.fahrenheitToCelsius(this.state.weather.daily.data[0].temperatureLow)}°C at { this.timeConverterToHours(this.state.weather.daily.data[0].temperatureLowTime) }, High: {this.fahrenheitToCelsius(this.state.weather.daily.data[0].temperatureHigh)}°C at { this.timeConverterToHours(this.state.weather.daily.data[0].temperatureHighTime) } </Text>
         </View>

         <View style={styles.weatherItem}>
         <Image source={require('./assets/icons/humidity.jpg')} style={{width: 75, height: 75}}/>
         <Text style={styles.weatherItemText}>Humidity: { this.state.weather.daily.data[0].humidity*100 }%</Text>
         </View>

         <View style={styles.weatherItem}>
         <Image source={require('./assets/icons/wind-speed.png')} style={{width: 75, height: 75}}/>
         <Text style={styles.weatherItemText}>Wind speed: {this.state.weather.daily.data[0].windSpeed} mph</Text>
         </View>

         <View style={styles.lastWeatherItem}>
         <Image source={require('./assets/icons/clouds.png')} style={{width: 75, height: 75}}/>
         <Text style={styles.weatherItemText}>Cloud cover: { this.state.weather.daily.data[0].cloudCover * 100 }%</Text>
         </View>

         </ScrollView>

         </View>

       ) : <Text> </Text>
     }

     <TouchableOpacity onPress={this.toggleModal} style={{justifyContent: 'center', height: '10%'}}>
     <View style={{justifyContent: 'center'}}>
       <Image source={require('./assets/darksky.png')} style={{ height: 33.98509187, width: 150, marginLeft: 75 }}/>
     </View>
     </TouchableOpacity>

            </View>

          </Modal>

        </View>
      </ImageBackground>

      )

    }

    else {
          return (
      <ImageBackground
               source={require('./assets/affair-anniversary-beach.png')}
               style={styles.backgroundStyle}
               >

      <View style={styles.container}>
      {
   this.state.fontLoaded ? (

     <View>
     <Text style={{ fontFamily: 'Raleway-Regular', paddingBottom: '7.5%', fontSize: 45, fontWeight: '400', textAlign: 'center',  color: "white"}}>
       Weather2Wed
     </Text>
     </View>
   ) : null
 }
        <View style={{paddingBottom: '10%'}}>
        <TextInput
      style={{height: 40, borderColor: 'white', borderWidth: 1, textAlign: 'center', fontWeight: 'normal', fontSize: 19}}
      onChangeText={(searchedLocation) => {this.updateLocationState(searchedLocation)}}
      value={this.state.searchedLocation} placeholder='Where? Place or postcode' placeholderTextColor='white'
      underlineColorAndroid='transparent'
    />

        </View>

        <View style={{ width: '100%', height: '50%', alignItems: 'center'}}>
        <CircleSlider style={{position: 'relative', top: '10%', paddingTop: '100%'}}
			arcDirection={'CW'}
            backgroundColor={"white"}
            value={0}
            btnRadius={10}
            btnColor={'#24b599'}
            sliderRadius={110}
            sliderWidth={17.5}
            startDegree={0}
            maxValue={365}
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
    <Text style={{fontSize: 25, fontWeight: 'normal', color: "white", textShadowColor: '#103356', textShadowOffset: {width: -2.5, height: 2.5}, textShadowRadius: 10}}>
    {`${this.convertSecondsToCalendarDate()}`}
    </Text>
    </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.button}
        onPress={this.processSubmit}>
        <Image source={require('./assets/weather2wed_button.jpg')} style={{height: 100, width: 100 }}/>
        </TouchableOpacity>
      </View>

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
               <Text style={{color: 'white', padding: 5, fontSize: 20}}>Typical weather in '{this.state.searchedLocation}' for {this.convertSecondsToCalendarDateForOutputText()}: '{this.state.weather.hourly.summary}'</Text>
          ) :   <Text style={{color: 'white', padding: 5, fontSize: 20}}>Typical weather in '{this.state.searchedLocation}' for {this.convertSecondsToCalendarDateForOutputText()}: (Hardcoded) Light rain starting in the evening.</Text>
        }

          </View>

        {
     this.state.weather ? (
       <View style={styles.resultsWrapper}>

       <ScrollView>


       <View style={styles.weatherItem}>

       <Image source={ this.getImage(this.state.icon) } style={{width: 75, height: 75}}/>

       <Text style={styles.weatherItemText}> Average temp: { this.fahrenheitToCelsius(this.state.weather.hourly.data[14].temperature) }°C</Text>

       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/rain_chance.png')} style={{width: 75, height: 75}}/>
       <Text style={styles.weatherItemText}> Chance of rain: { Math.round(this.state.weather.daily.data[0].precipProbability * 100) }%</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/sunset.png')} style={{width: 75, height: 75}}/>
       <Text style={styles.weatherItemText}> Sunrise: { this.timeConverterToHours(this.state.weather.daily.data[0].sunriseTime) }, Sunset: { this.timeConverterToHours(this.state.weather.daily.data[0].sunsetTime) }</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={ this.moonPhaseImage(this.convertMoonPhaseNumberToImageName(this.moonPhase())) } style={{width: 75, height: 75}}/>
       <Text style={styles.weatherItemText}>{this.convertMoonPhaseNumberToName(this.moonPhase())} (estimate)</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/temperature.png')} style={{width: 75, height: 75}}/>
       <Text style={styles.weatherItemText}>Low: {this.fahrenheitToCelsius(this.state.weather.daily.data[0].temperatureLow)}°C at { this.timeConverterToHours(this.state.weather.daily.data[0].temperatureLowTime) }, High: {this.fahrenheitToCelsius(this.state.weather.daily.data[0].temperatureHigh)}°C at { this.timeConverterToHours(this.state.weather.daily.data[0].temperatureHighTime) } </Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/humidity.jpg')} style={{width: 75, height: 75}}/>
       <Text style={styles.weatherItemText}>Humidity: { this.state.weather.daily.data[0].humidity*100 }%</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/wind-speed.png')} style={{width: 75, height: 75}}/>
       <Text style={styles.weatherItemText}>Wind speed: {this.state.weather.daily.data[0].windSpeed} mph</Text>
       </View>

       <View style={styles.weatherItem}>
       <Image source={require('./assets/icons/clouds.png')} style={{width: 75, height: 75}}/>
       <Text style={styles.weatherItemText}>Cloud cover: { this.state.weather.daily.data[0].cloudCover * 100 }%</Text>
       </View>

       <View style={styles.lastWeatherItem}>
        <MapView style={styles.map}
        scrollEnabled={false}
        toolbarEnabled={false}
        zoomEnabled={true}
        zoomControlEnabled={true}
        region={{
          latitude: self.state.position[0],
          longitude: self.state.position[1],
          latitudeDelta: 1,
          longitudeDelta: 1
        }}
        >

        <MapView.Marker
          coordinate={{
            latitude: self.state.position[0],
            longitude: self.state.position[1]
          }}
          title={'You searched:'}
          description={`'${this.state.searchedLocation}'`}
          />

        </MapView>
       </View>

       </ScrollView>

       </View>

     ) : <Text> </Text>
   }

   <TouchableOpacity onPress={this.toggleModal} style={{justifyContent: 'center', height: '10%'}}>
   <View style={{justifyContent: 'center'}}>
     <Image source={require('./assets/darksky.png')} style={{ height: 33.98509187, width: 150, marginLeft: 75 }}/>
   </View>
   </TouchableOpacity>

          </View>

        </Modal>

      </View>
    </ImageBackground>
    );
  }
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
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#24b599",
    padding: 15
  },
  lastWeatherItem: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderColor: "#24b599",
    padding: 15,
    height: 500
  },
  weatherItemText: {
    flex: 1,
    flexWrap: 'wrap',
    paddingLeft: 25,
    fontSize: 18
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
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  tableContainer: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  tableHead: { height: 40, backgroundColor: '#24b599' },
  tableText: { margin: 6 }
});
