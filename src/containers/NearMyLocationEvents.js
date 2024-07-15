import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

class NearMyLocationEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>NearMyLocationEvents</Text>
      </View>
    );
  }
}

NearMyLocationEvents.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

NearMyLocationEvents.defaultProps = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NearMyLocationEvents);
