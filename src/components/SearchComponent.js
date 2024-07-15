import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import colors from '../config/colors';

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 14,
  },
  inputContainerStyle: {
    backgroundColor: '#F1F2F6',
    height: 40,
    borderRadius: 10,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  containerStyle: {width: '100%'},
});

class SearchComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Input
        placeholder="Search"
        renderErrorMessage={false}
        placeholderTextColor={colors.silver}
        leftIcon={
          <Icon
            name="ios-search"
            type="ionicon"
            color={colors.silver}
            size={20}
          />
        }
        inputStyle={styles.inputStyle}
        autoCapitalize="none"
        autoCorrect={false}
        inputContainerStyle={styles.inputContainerStyle}
        containerStyle={styles.containerStyle}
      />
    );
  }
}

export default SearchComponent;
