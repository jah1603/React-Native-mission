import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Image } from 'react-native';
import {ImageBackground} from 'react-native';
import DatePicker from 'react-native-datepicker';
import CircleSlider from 'react-native-circle-slider';

import { Font } from 'expo';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const User = t.struct({
  location: t.String
});

const formStyles = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      marginBottom: 10
    },
  },
  controlLabel: {
    normal: {
      color: '#24b599',
      fontSize: 18,
      marginBottom: 7,
      fontWeight: '600'
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
      auto: 'placeholders',
      error: 'Please enter a place or postcode'
    },
    date: {
      mode: 'date',
      dialogMode: 'spinner'
    },
  },
  stylesheet: formStyles,
};

export default class App extends Component {

  state = {
   fontLoaded: false,
 };

  handleSubmit = () => {
    const value = this._form.getValue();
    console.log('value: ', value);
  }

  async componentDidMount() {
    await Font.loadAsync({
      'open-raleway': require('./assets/fonts/Raleway-Regular.ttf'),
    });

     this.setState({ fontLoaded: true });
  }

  render() {
    return (
      <ImageBackground
               source={require('./assets/wedding_rain.jpg')}
               style={styles.backgroundStyle}
               >

      <View style={styles.container}>
      {
   this.state.fontLoaded ? (
     <Text style={{ fontFamily: 'open-raleway', fontSize: 40, textAlign: 'center', color: '#24b599', paddingBottom: '20%' }}>
       Weather2Wed
     </Text>
   ) : null
 }
        <View style={{paddingBottom: '10%'}}>
        <Form
          style={{alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', top: '50%'}}
          ref={c => this._form = c}
          type={User}
          options={options}
          underlineColorAndroid="transparent"
        />
        </View>

        <View style={{backgroundColor: 'pink', width: '100%', height: '50%', alignItems: 'center'}}>
        <CircleSlider style={{position: 'relative', top: '10%'}}
			arcDirection={'CW'}
            backgroundColor={"white"}
            btnRadius={15}
            sliderRadius={110}
            sliderWidth={25}
            startDegree={0}
            maxValue={360}
            onPressInnerCircle={(value) => console.log(`Inner: ${value}`)}
            onPressOuterCircle={(value) => console.log(`Outer: ${value}`)}
            onValueChange={(value) => console.log(`Changed: ${value}`)}
            endGradient={"#A6FFCB"}
            startGradient={"#12D8FA"}
		/>
    </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.button}
        onPress={()=>{alert("you clicked me!")}}
        >
        <Image source={require('./assets/weather2wed_button.jpg')} style={{height: '100%', width: '100%'}}/>
        </TouchableOpacity>
      </View>

      </View>
    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 50,
    padding: 20,
    backgroundColor: 'transparent'
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'skyblue',
    alignItems: 'center'
  },
  backgroundStyle: {
    width: '100%',
    height: '100%'
  },
  button: {
    alignItems: 'center',
    position: 'absolute',
    top: '40%',
    height: '39.5%',
    width: '35%'
  }
});
