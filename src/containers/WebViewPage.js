import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Header, Icon} from 'react-native-elements';
import {WebView} from 'react-native-webview';
import colors from '../config/colors';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    // backgroundColor: '#0000',
  },
  webview: {
    flex: 1,
    // height: height,
    // width: width,
    // backgroundColor: '#F004',
    // zIndex: 1122,
  },
  loadingContainer: {
    // flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainerText: {
    fontSize: 20,
    marginTop: 10,
    color: colors.black,
  },
});

class WebViewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderLoading = () => {
    console.log('loading');
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.emptyContainerText}>Loading...</Text>
      </View>
    );
  };

  renderError = () => {
    return (
      <View style={styles.loadingContainer}>
        <Icon name="md-warning" type={'ionicon'} size={50} color={colors.red} />
        {/* <ActivityIndicator color={colors.primary} size="large" /> */}
        <Text style={styles.emptyContainerText}>Error in Loading content</Text>
      </View>
    );
  };

  render() {
    const {navigation, route} = this.props;
    const url = route?.params?.url || '';
    console.log('url', url);
    return (
      <View style={styles.container}>
        <Header
          barStyle="dark-content"
          statusBarProps={{
            backgroundColor: colors.white,
          }}
          leftComponent={
            <Icon
              name="chevron-left"
              color="#000"
              size={40}
              onPress={() => navigation.goBack()}
            />
          }
          backgroundColor="#FFF"
          containerStyle={styles.headerCont}
        />
        {url !== '' ? (
          <WebView
            source={{uri: url}}
            // source={{uri: 'https://google.com'}}
            style={styles.webview}
            renderLoading={this.renderLoading}
            startInLoadingState
            pullToRefreshEnabled
            javaScriptEnabled
            allowFileAccess
            //   scalesPageToFit
            //   originWhitelist={['*']}
            containerStyle={{backgroundColor: '#F004'}}
            renderError={this.renderError}
            onLoadEnd={(e) => console.log('load end')}
          />
        ) : null}
      </View>
    );
  }
}

WebViewPage.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

WebViewPage.defaultProps = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WebViewPage);
