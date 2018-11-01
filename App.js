import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {ImageBackground} from 'react-native';

import { Font } from 'expo';
import t from 'tcomb-form-native';

const Form = t.form.Form;

const User = t.struct({
  location: t.String,
  date: t.Date
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
     <Text style={{ fontFamily: 'open-raleway', fontSize: 40, textAlign: 'center', color: '#24b599', paddingBottom: '40%' }}>
       Weather2Wed
     </Text>
   ) : null
 }

        <Form
          style={{alignItems: 'center', justifyContent: 'center', flex: 1, position: 'relative', top: '50%'}}
          ref={c => this._form = c}
          type={User}
          options={options}
        />

        <Button
          title="Check weather!"
          onPress={this.handleSubmit}
          color='#24b599'
        />
      </View>
    </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: 'transparent'
  },
  backgroundStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  buttonStyle: {
    color:  '#24b599'
  }
});
