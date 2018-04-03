/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import InputButton from './src/NumberPad';

const inputButtons = [
  [7, 8, 9, '/'],
  [4, 5, 6, '*'],
  [1, 2, 3, '-'],
  ['.', 0, 'Del', '+'],
  ['=']
];


export default class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      previousInputValue: 0,
      calculatedValue: 0,
      selectedSymbol: null,
      inputValue: 0,
      displayValue: ""
    }
  }

  _renderInputButtons() {
    let views = [];

    for (var r = 0; r < inputButtons.length; r ++) {
        let row = inputButtons[r];

        let inputRow = [];
        for (var i = 0; i < row.length; i ++) {
            let input = row[i];

            inputRow.push(
              <InputButton
                  value={input}
                  highlight={this.state.selectedSymbol === input}
                  onPress={this._onInputButtonPressed.bind(this, input)}
                  onLongPress={ input == 'Del' ? this._onInputButtonLongPressed.bind(this, input) : null }
                  key={r + "-" + i} />
          );
        }
        views.push(<View style={styles.inputRow} key={"row-" + r}>{inputRow}</View>)
    }
    return views;
  }
  _onInputButtonLongPressed(input) {
    // alert('LongPress');
    this.setState({
      displayValue:"",
      calculatedValue:0,
      inputValue: 0
    });
  }
  _onInputButtonPressed(input) {
    // alert(input)
    switch (typeof input) {
      case 'number':
        this.setState({
          inputValue: this.state.previousInputValue
        })
        return this._handleNumberInput(input)
      case 'string':
        this.setState({
          previousInputValue:0,
          inputValue: eval(this.state.previousInputValue + this.state.selectedSymbol + this.state.inputValue),
          selectedSymbol:null
        })
        return this._handleStringInput(input)
    }
  }

  _handleNumberInput(num) {
    let value = (this.state.inputValue * 10) + num;
    if (this.state.displayValue == "")
    {
      this.setState({
        inputValue: value,
        displayValue: value.toString()
      })
    } else {
      this.setState({
        inputValue: value,
        displayValue: this.state.displayValue + num.toString()
      })
    }
  }

  _handleStringInput(str) {
    switch (str) {
        case '/':
        case '*':
        case '+':
        case '-':
          this.setState({
              selectedSymbol: str,
              previousInputValue: this.state.inputValue,
              inputValue: 0,
              displayValue: this.state.displayValue + str
          });
          break;
        case '=':
          let symbol = this.state.selectedSymbol,
              value = this.state.inputValue,
              previousInputValue = this.state.previousInputValue;

          if (!symbol) {
              return;
          }

          this.setState({
              // previousInputValue: 0,
              calculatedValue: eval(previousInputValue + symbol + value),
              // inputValue: eval(previousInputValue + symbol + value),
              // selectedSymbol: null
          });
          break;
        case "Del":
          value = Math.floor(this.state.inputValue / 10)
          this.setState({
            displayValue: value,
            inputValue: value
          })
          break;
    }
  }

  render() {
    return (
        <View style={styles.mainView}>
            <View style={styles.displayView}>
              <Text style={styles.displayText}>{this.state.displayValue}</Text>
            </View>
            <View style={{backgroundColor: '#9e9e9e'}}>
              <Text style={styles.displayText}>{this.state.calculatedValue}</Text>
            </View>
            <View style={styles.numberPad}>
              {this._renderInputButtons()}
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
      flex: 1
  },

  displayView: {
      flex: 2,
      backgroundColor: '#757575'
  },

  displayText: {
    color: 'white',
    fontSize: 38,
    fontWeight: 'bold',
    textAlign: 'right',
    padding: 20
  },

  numberPad: {
      flex: 5,
      backgroundColor: '#eeeeee'
  },

  inputRow: {
    flex: 1,
    flexDirection: 'row'
  }
});
