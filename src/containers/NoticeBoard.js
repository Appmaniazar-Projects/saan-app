import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import SearchComponent from '../components/SearchComponent';
import {Header, Icon} from 'react-native-elements';
// import MaterialTabs from 'react-native-material-tabs';
import {FetchNoticeBoardRequest} from '../redux/reducers/event/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F3F6',
  },
  flexGrow: {
    flexGrow: 1,
  },
  rightContainerStyle: {
    height: 50,
    width: 50,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftContainerStyle: {
    height: 0,
    width: 0,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconView: {
    height: 36,
    width: 36,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    paddingVertical: 20,
    backgroundColor: '#FFF',
    marginVertical: 10,
  },
  sliderHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLeftText: {
    color: colors.black,
    fontSize: 24,
  },
  sliderRightText: {
    color: colors.primary,
    fontSize: 16,
  },
  storyView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  storyImage: {
    // height: 40,
    // width: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginBottom: 15,
    height: 180,
    width: 135,
    // backgroundColor: colors.primary,
  },
  storyName: {
    fontSize: 12,
    color: colors.white,
  },
  w100: {
    width: '100%',
  },
  absUserView: {
    position: 'absolute',
    bottom: 15,
    left: 10,
    right: 10,
    padding: 10,
    flexDirection: 'row',
  },
  userImageView: {
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.pink,
    borderWidth: 3,
    borderRadius: 15,
    marginRight: 10,
  },
  userImage: {
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  userName: {
    // flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  opportunityView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  opportunityImage: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginBottom: 15,
    height: 135,
    width: 135,
  },
  opportunityText: {
    fontSize: 14,
    color: colors.black,
  },
  opportunityLocation: {
    fontSize: 13,
    color: colors.silver,
  },

  eventView: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  eventImage: {
    borderRadius: 10,
    backgroundColor: colors.primary,
    marginBottom: 15,
    height: 135,
    width: 135,
  },
  eventText: {
    fontSize: 14,
    color: colors.black,
  },
  eventLocation: {
    fontSize: 13,
    color: colors.silver,
  },
  emptyContainer: {
    // flex: 1,
    width: '100%',
    height: 150,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainerText: {
    fontSize: 20,
    color: colors.silver,
  },
  loadingContainer: {
    flex: 1,
    // width: '100%',
    // height: 150,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class NoticeBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      stories: [{name: 'Grant'}, {name: 'Mpho'}, {name: 'Nolitha'}],
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
      events: [
        {
          id: 1,
          name: 'Radio Presentation',
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
          name: 'Radio Presentation',
          subname: 'Dublin',
        },
        {
          id: 5,
          name: 'Junior Engineer Meet',
          subname: 'Berlin',
        },
        {
          id: 6,
          name: 'Senior Engineers meet',
          subname: 'Washington DC',
        },
      ],
      loading: false,
    };
  }

  componentDidMount() {
    this.addNavigationEvents();
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
    this.load();
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {};

  setLoading = (bool) => {
    this.setState({loading: bool});
  };

  load = async () => {
    const {dispatch} = this.props;
    console.log('load');
    this.setLoading(true);
    // await dispatch(FetchStoryListRequest());
    await dispatch(FetchNoticeBoardRequest());
    this.setLoading(false);
  };

  setSelectedTab = (index) => {
    this.setState({selectedTab: index});
  };

  seeAllOpportunity = () => {
    const {navigation} = this.props;
    navigation.navigate('Opportunities');
  };

  openEvent = (item) => () => {
    const {navigation} = this.props;
    navigation.navigate('EventDetails', {
      eventItem: item,
    });
  };

  seeAllEvents = () => {
    const {navigation} = this.props;
    console.log('EventCalendar');
    navigation.navigate('EventCalendar');
  };

  createEvent = () => {
    const {navigation} = this.props;
    navigation.navigate('CreateEvent');
  };

  renderStoryCards = () => {
    const {stories} = this.state;
    return (
      <View style={styles.listHeader}>
        {/* <View style={styles.sliderHead}>
          <Text style={styles.sliderLeftText}>Network</Text>
          <Text style={styles.sliderRightText}>See All</Text>
        </View> */}
        <FlatList
          horizontal
          style={styles.w100}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flexGrow}
          data={stories}
          keyExtractor={(item, index) => String(`${item.name}_${index}`)}
          renderItem={({item}) => {
            return (
              <View style={styles.storyView}>
                <Image source={{uri: ''}} style={styles.storyImage} />
                <View style={styles.absUserView}>
                  <View style={styles.userImageView}>
                    <Image source={{uri: ''}} style={styles.userImage} />
                  </View>
                  <View style={styles.userName}>
                    <Text style={styles.storyName}>{item.name}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  renderOpportunityCards = () => {
    const {event} = this.props;
    const {opportunities} = event.board;
    return (
      <View style={styles.listHeader}>
        <View style={styles.sliderHead}>
          <Text style={styles.sliderLeftText}>Opportunities</Text>
          <Text onPress={this.seeAllOpportunity} style={styles.sliderRightText}>
            See All
          </Text>
        </View>
        <FlatList
          horizontal
          style={styles.w100}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flexGrow}
          data={opportunities || []}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyContainerText}>
                No Opportunities found
              </Text>
            </View>
          }
          keyExtractor={(item, index) => String(`${item.name}_${index}`)}
          renderItem={({item}) => {
            // console.log(item);
            return (
              <View style={styles.opportunityView}>
                <Image
                  source={{uri: item.image}}
                  style={styles.opportunityImage}
                />
                <View>
                  <Text style={styles.opportunityText}>{item.title}</Text>
                  <Text style={styles.opportunityLocation}>
                    {item.location}
                  </Text>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };

  renderEventCards = () => {
    const {event} = this.props;
    const {events} = event.board;
    return (
      <View style={styles.listHeader}>
        <View style={styles.sliderHead}>
          <Text style={styles.sliderLeftText}>Events</Text>
          <Text onPress={this.seeAllEvents} style={styles.sliderRightText}>
            See All
          </Text>
        </View>
        <FlatList
          horizontal
          style={styles.w100}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flexGrow}
          data={events || []}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyContainerText}>No Events found</Text>
            </View>
          }
          keyExtractor={(item, index) => String(`${item.name}_${index}`)}
          renderItem={({item}) => {
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.eventView}
                onPress={this.openEvent(item)}>
                <Image source={{uri: item.image}} style={styles.eventImage} />
                <View>
                  <Text style={styles.eventText}>{item.title}</Text>
                  <Text style={styles.eventLocation}>{item.place}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  render() {
    const {event} = this.props;
    const {loading} = this.state;
    // console.log(event);
    return (
      <View style={styles.container}>
        <Header
          barStyle="dark-content"
          statusBarProps={{
            backgroundColor: colors.white,
          }}
          rightContainerStyle={styles.rightContainerStyle}
          leftContainerStyle={styles.leftContainerStyle}
          leftComponent={null}
          rightComponent={
            <Icon
              name="ios-add"
              type="ionicon"
              color={colors.white}
              size={26}
              containerStyle={styles.addIconView}
              onPress={this.createEvent}
              // onPress={() => navigation.goBack()}
            />
          }
          centerContainerStyle={styles.centerContainerStyle}
          centerComponent={<SearchComponent />}
          backgroundColor="#0000"
          containerStyle={styles.headerCont}
        />

        {/* <MaterialTabs
          items={['Travel', 'Game', 'Dance', 'Sport']}
          selectedIndex={selectedTab}
          onChange={this.setSelectedTab}
          barColor={colors.white}
          textStyle={{
            textTransform: 'capitalize',
            fontWeight: 'normal',
            fontSize: 20,
          }}
          indicatorColor="#0000"
          activeTextColor="#000"
          inactiveTextColor={colors.silver}
        /> */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.emptyContainerText}>Loading...</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flexGrow}
            style={styles.scrollView}>
            {/* {this.renderStoryCards()} */}
            {event.board && this.renderOpportunityCards()}
            {event.board && this.renderEventCards()}
          </ScrollView>
        )}
      </View>
    );
  }
}

NoticeBoard.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

NoticeBoard.defaultProps = {};

const mapStateToProps = (state) => ({
  event: state.event,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(NoticeBoard);
