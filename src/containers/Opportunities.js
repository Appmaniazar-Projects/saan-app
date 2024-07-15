import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Header, Icon} from 'react-native-elements';
import Share from 'react-native-share';
import { FetchOpportunitiesRequest, LoadMoreOpportunityRequest } from '../redux/reducers/event/actions';
import { LIMIT_OPPORTUNITY_PER_LOADING } from '../redux/reducers/event/types';

const {height, width} = Dimensions.get('window');
const padding = 15;

const itemW = width / 2;
const itemH = itemW;

const imgW = (width - padding * 4) / 2;
const imgH = imgW;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
    // backgroundColor: '#F2F3F6',
  },
  flexGrow: {
    flexGrow: 1,
  },

  opportunityView: {
    // paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 15,
    position: 'relative',
    overflow: 'hidden',
    padding: padding,
    // height: itemH,
    width: itemW,
  },
  opportunityImage: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginBottom: 15,
    height: imgH,
    width: imgW,
  },
  opportunityDetailsView: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  opportunityText: {
    fontSize: 14,
    color: colors.black,
  },
  opportunityLocation: {
    fontSize: 13,
    color: colors.silver,
  },
  shareIcon: {
    position: 'absolute',
    top: padding,
    right: padding,
    padding: 5,
  },
  headerText: {
    color: colors.black,
    fontSize: 24,
  },
  footerLoader: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainerText: {
    fontSize: 20,
    color: colors.silver,
  },
});

class Opportunities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oppportunities: [
        {
          id: 1,
          name: 'Radio Presenter',
          subname: 'Cape Town',
        },
        {
          id: 2,
          name: 'Junior Engineer',
          subname: 'Berlin',
        },
        {
          id: 3,
          name: 'Google I/O',
          subname: 'Washington DC',
        },
        {
          id: 4,
          name: 'Radio Presenter',
          subname: 'Cape Town',
        },
        {
          id: 5,
          name: 'Junior Engineer',
          subname: 'Berlin',
        },
        {
          id: 6,
          name: 'Google I/O',
          subname: 'Washington DC',
        },
      ],
      refreshing: false,
      loadingMore: false,
    };
  }

  share = (item) => async () => {
    // console.log(item);
    try {
      const res = await Share.open({
        title: 'Opportunity from SAAN App',
        message: `Hi, please checkout this amazing opportunity of position ${item.title} in ${item.company} at ${item.location}, `,
        url: `https://saan-app.firebaseapp.com/opportunities/${item.uid}`,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  openOpportunity = (item) => () => {
    const {navigation} = this.props;
    const url = `https://saan-app.firebaseapp.com/opportunities/${item.uid}`;
    navigation.navigate('WebViewPage', {url});
  };

  componentDidMount() {
    this.addNavigationEvents();
    this.load();
  }

  componentWillUnmount() {
    this.removeNavigationEvents();
  }

  addNavigationEvents = () => {
    const {navigation} = this.props;
    this.didFocus = navigation.addListener('focus', this.onDidFocus);
    this.willBlur = navigation.addListener('blur', this.onWillBlur);
  };

  removeNavigationEvents = () => {
    if (this.didFocus) {
      this.didFocus();
    }
    if (this.willBlur) {
      this.willBlur();
    }
  };

  // eslint-disable-next-line no-unused-vars
  onDidFocus = (payload) => {
    // this.load();
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {};

  setRefreshing = (bool) => {
    // refreshing
    this.setState({refreshing: bool});
  };
  setLoadingMore = (bool) => {
    // refreshing
    this.setState({loadingMore: bool});
  };

  load = async () => {
    const {dispatch} = this.props;
    console.log('load');
    this.setRefreshing(true);
    // await dispatch(FetchStoryListRequest());
    await dispatch(FetchOpportunitiesRequest());
    this.setRefreshing(false);
  };

  onRefresh = async () => {
    const {dispatch} = this.props;
    const {refreshing} = this.state;
    console.log('onRefresh');
    if (!refreshing) {
      this.setRefreshing(true);
      // await dispatch(FetchStoryListRequest());
      await dispatch(FetchOpportunitiesRequest());
      this.setRefreshing(false);
    }
  };

  onLoadMore = async () => {
    const {dispatch} = this.props;
    const {loadingMore, refreshing} = this.state;
    console.log('onLoadMore');
    if (!loadingMore && !refreshing) {
      this.setLoadingMore(true);
      await dispatch(LoadMoreOpportunityRequest());
      this.setLoadingMore(false);
    }
  };

  render() {
    const {navigation, event} = this.props;
    const {refreshing, loadingMore} = this.state;
    const {opportunity} = event;
    return (
      <View style={styles.container}>
        <Header
          barStyle="dark-content"
          statusBarProps={{
            backgroundColor: colors.white,
          }}
          centerComponent={<Text style={styles.headerText}>Opportunities</Text>}
          leftComponent={
            <Icon
              name="chevron-left"
              color={colors.black}
              size={40}
              onPress={() => navigation.goBack()}
            />
          }
          backgroundColor="#0000"
          containerStyle={styles.headerCont}
        />

        <FlatList
          data={opportunity || []}
          style={styles.scrollView}
          contentContainerStyle={styles.flexGrow}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyContainerText}>
                No Opportunities found
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefresh}
            />
          }
          onEndReachedThreshold={0.1}
          refreshing={refreshing}
          onRefresh={this.onRefresh}
          onEndReached={
            (opportunity || []).length < LIMIT_OPPORTUNITY_PER_LOADING
              ? null
              : this.onLoadMore
          }
          // onEndReached={this.onLoadMore}
          ListFooterComponent={
            loadingMore && (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={colors.primary} size="small" />
              </View>
            )
          }
          renderItem={({item}) => {
            // console.log('item', item.image);
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={this.openOpportunity(item)}
                style={styles.opportunityView}>
                <Image
                  source={{uri: item.image}}
                  style={styles.opportunityImage}
                  // onError={(e) => console.log(e)}
                />
                <View style={styles.opportunityDetailsView}>
                  <Text numberOfLines={1} style={styles.opportunityText}>
                    {item.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.opportunityLocation}>
                    {item.location}
                  </Text>
                </View>

                <Icon
                  name="share"
                  color={colors.black}
                  size={30}
                  Component={TouchableOpacity}
                  containerStyle={styles.shareIcon}
                  onPress={this.share(item)}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

Opportunities.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

Opportunities.defaultProps = {};

const mapStateToProps = (state) => ({
  event: state.event,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Opportunities);
