import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import moment from 'moment';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Header, Icon, Input} from 'react-native-elements';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  EventCommentRequest,
  FetchEventCommentListRequest,
  LoadMoreEventCommentListRequest,
} from '../redux/reducers/event/actions';
import {timestampToString} from '../utils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  UserView: {padding: 20},
  AlumniText: {
    color: colors.white,
    fontSize: 30,
    // fontFamily: fonts.Bold,
  },
  QualityText: {
    color: colors.white,
    fontSize: 15,
    // fontFamily: fonts.Regular,
  },
  LocationView: {flexDirection: 'row', padding: 10},
  HolidayText: {
    color: colors.white,
    fontSize: 15,
    // fontFamily: fonts.Regular,
  },
  ClockView: {flexDirection: 'row', padding: 10},
  DateTime: {
    color: colors.white,
    fontSize: 15,
    // fontFamily: fonts.Regular,
  },
  Views: {flexDirection: 'row', justifyContent: 'space-between'},
  ViewsImages: {
    padding: 10,
    flexDirection: 'row',
  },
  PersonView: {
    height: 30,
    width: 30,
    backgroundColor: colors.white,
    borderRadius: 50,
  },
  PersonView1: {
    height: 30,
    width: 30,
    backgroundColor: colors.white,
    borderRadius: 50,
    left: 5,
  },
  PersonView2: {
    height: 30,
    width: 30,
    backgroundColor: colors.white,
    borderRadius: 50,
    left: 10,
  },
  PersonViews3: {
    height: 30,
    width: 30,
    backgroundColor: colors.Pink,
    borderRadius: 50,
    left: 15,
  },
  PersonText: {
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
    top: 5,
  },
  LikeView: {paddingTop: 10, flexDirection: 'row', paddingRight: 10},
  HeartIcon: {flexDirection: 'row'},
  LikeText: {paddingRight: 15},
  LikesTexts: {
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
    top: 5,
    left: 5,
  },
  CommentView: {flexDirection: 'row'},
  CommentText: {paddingRight: 15},
  likeText: {
    fontSize: 13,
    color: colors.white,
    textAlign: 'center',
    top: 5,
    left: 5,
  },
  HeaderStyle: {
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    backgroundColor: colors.orange1,
    position: 'relative',
    overflow: 'hidden',
  },
  iconStyle: {color: colors.white, fontSize: 15},

  bottomContainer: {
    height: 70,
    width: '100%',
    backgroundColor: colors.silver2,
  },
  TextView: {
    flexDirection: 'row',
  },
  input: {
    width: '80%',
    height: 35,
    borderColor: colors.gray2,
    borderRadius: 25,
    backgroundColor: colors.White,
    borderWidth: 1,
    margin: 15,
    paddingLeft: 20,
  },
  SendView: {
    marginTop: 20,
  },
  SendIcon: {
    color: colors.yellow,
    fontSize: 25,
  },

  MainView: {
    flexDirection: 'row',
    padding: 10,
  },
  ImageView: {
    height: 50,
    width: 50,
    backgroundColor: colors.silver,
    borderRadius: 50,
  },
  Title: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    // fontFamily: fonts.semibold,
  },
  UserName: {
    color: colors.black,
    // fontFamily: fonts.semibold,
    fontSize: 17,
    fontWeight: 'bold',
  },
  NameView: {padding: 5, paddingLeft: 10},
  HoursText: {color: colors.silver, fontSize: 12},
  ImageStyle: {height: 50, width: 50, borderRadius: 30},
  TipsText: {paddingLeft: 70},
  Reply: {paddingLeft: 70, padding: 20},
  TitleRow: {borderBottomWidth: 1, borderColor: colors.white2},
  Tips: {color: colors.black, fontSize: 17},
  ReplyText: {color: colors.silver, fontSize: 15},
  emptyContainer: {
    flex: 1,
    // backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainerText: {
    fontSize: 20,
    color: colors.black,
  },
});

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loadingMore: false,
      commenting: false,
      comment: '',
      data: [
        {
          id: 1,
          name: 'Grant Bellairs',
          subText: '2 hours ago',
          tips:
            'If you are an exchange alumni, you sure don’t want to miss this opportunity to connect with others.',
        },
        {
          id: 2,
          name: 'Mpho Matamela',
          subText: '3 hours ago',
          tips:
            'I am super excited. At this moment, as I sit here typing this up, I truly can not wait for this event.',
        },
      ],
      eventData: {},
    };
  }

  componentDidMount() {
    this.addNavigationEvents();
    // this.load();
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

  // load = () => {
  //   const {route} = this.props;
  //   this.setState({eventData: route?.params?.eventItem || {}});
  // };

  setRefreshing = (bool) => {
    // refreshing
    this.setState({refreshing: bool});
  };
  setLoadingMore = (bool) => {
    // refreshing
    this.setState({loadingMore: bool});
  };

  getEvent = () => {
    const {route} = this.props;
    let event = null;
    if (route.params && route.params.eventItem) {
      event = route.params.eventItem;
    }
    return event;
  };

  load = async () => {
    const {dispatch} = this.props;
    const event = this.getEvent();
    this.setState({eventData: event || {}});
    this.setRefreshing(true);
    // await dispatch(FetchStoryListRequest());
    await dispatch(FetchEventCommentListRequest(event?.uid || '', event));
    this.setRefreshing(false);
  };

  onRefresh = async () => {
    const {dispatch} = this.props;
    const {refreshing} = this.state;
    const event = this.getEvent();
    if (!refreshing) {
      this.setRefreshing(true);
      await dispatch(FetchEventCommentListRequest(event?.uid || '', event));
      this.setRefreshing(false);
    }
  };
  onLoadMore = async () => {
    const {dispatch} = this.props;
    const {loadingMore} = this.state;
    const event = this.getEvent();
    if (!loadingMore) {
      this.setLoadingMore(true);
      await dispatch(LoadMoreEventCommentListRequest(event?.uid || ''));
      this.setLoadingMore(false);
    }
  };

  addComment = async () => {
    const {comment} = this.state;
    const {dispatch} = this.props;
    try {
      this.setState({commenting: true});
      const event = this.getEvent();
      await dispatch(EventCommentRequest(event?.uid, comment));
      this.setState({commenting: false, comment: ''});
    } catch (error) {
      console.log(error);
      this.setState({commenting: false});
    }
  };

  renderItem = ({item}) => {
    return (
      <View>
        <View style={styles.MainView}>
          {/* <View style={styles.ImageView} /> */}
          <Image
            source={{
              uri: item.ownUser?.avatarURL,
            }}
            style={styles.ImageView}
          />
          <View style={styles.NameView}>
            <Text style={styles.UserName}>
              {item?.ownUser?.fullname || item?.ownUser?.username || ''}
            </Text>
            <Text style={styles.HoursText}>
              {timestampToString(item.create_at?.toMillis() || 0)}
            </Text>
          </View>
        </View>
        <View style={styles.TitleRow}>
          <View style={styles.TipsText}>
            <Text style={styles.Tips}>{item.content}</Text>
          </View>
          <View style={styles.Reply}>
            {/* <Text style={styles.ReplyText}>Reply</Text> */}
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {eventData, commenting, comment} = this.state;
    const {navigation, event} = this.props;
    // console.log("eventData", eventData);
    const btnDisable = commenting || !comment || comment.trim() === '';
    return (
      <View style={styles.container}>
        <View style={styles.HeaderStyle}>
          <Image
            source={{uri: eventData.image}}
            style={StyleSheet.absoluteFill}
          />
          <Header
            statusBarProps={{
              barStyle: 'light-content',
              backgroundColor: colors.orange1,
            }}
            leftComponent={
              <Icon
                name="chevron-thin-left"
                type="entypo"
                iconStyle={styles.iconStyle}
                onPress={() => navigation.goBack()}
              />
            }
            backgroundColor={'#0000'}
            // rightComponent={
            //   <Icon
            //     name="dots-three-vertical"
            //     type="entypo"
            //     iconStyle={styles.iconStyle}
            //   />
            // }
            containerStyle={{
              borderBottomWidth: 0,
            }}
          />
          <View style={styles.UserView}>
            <Text style={styles.AlumniText}>{eventData.title}</Text>
            <Text style={styles.QualityText}>{eventData.content}</Text>
          </View>
          <View style={styles.LocationView}>
            <Icon name="location" type="evilicon" color={colors.white} />
            <Text style={styles.HolidayText}>{eventData.place}</Text>
          </View>
          <View style={styles.ClockView}>
            <Icon name="clock" type="evilicon" color={colors.white} />
            {/* <Text style={styles.DateTime}>
              25 August, 2019 7:30 am - 6:00 pm
            </Text> */}
            <Text style={styles.DateTime}>
              {moment(eventData.date, 'YYYY-MM-DD').format('DD MMM[,] YYYY')}
              {', '}
              {`${
                eventData.start_time && eventData.end_time
                  ? `${eventData.start_time || ''} - ${
                      eventData.end_time || ''
                    }`
                  : ''
              }`}
            </Text>
          </View>
          {/* <View style={styles.Views}>
            <View style={styles.ViewsImages}>
              <View style={styles.PersonView} />
              <View style={styles.PersonView1} />
              <View style={styles.PersonView2} />
              <View style={styles.PersonViews3}>
                <Text style={styles.PersonText}>+5</Text>
              </View>
            </View>
            <View style={styles.LikeView}>
              <TouchableOpacity style={styles.HeartIcon}>
                <Icon
                  name="heart"
                  type="foundation"
                  size={30}
                  color={colors.pink}
                />
              </TouchableOpacity>
              <View style={styles.LikeText}>
                <Text style={styles.LikesTexts}>1125</Text>
              </View>
              <TouchableOpacity style={styles.CommentView}>
                <Icon
                  name="comment-dots"
                  type="font-awesome-5"
                  size={25}
                  color={colors.gray1}
                />
              </TouchableOpacity>
              <View style={styles.CommentText}>
                <Text style={styles.likeText}>348</Text>
              </View>
            </View>
          </View> */}
        </View>

        <View style={{flex: 1}}>
          <FlatList
            data={event.eventComments || []}
            style={{flex: 1}}
            contentContainerStyle={{flexGrow: 1, padding: 15}}
            // data={this.state.data}
            keyExtractor={(item) => String(item.id)}
            renderItem={this.renderItem}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyContainerText}>No Comments yet</Text>
              </View>
            }
          />

          <View style={styles.bottomContainer}>
            <Input
              value={this.state.comment}
              onChangeText={(comment) =>
                this.setState({
                  comment,
                })
              }
              placeholder={'Write a comment ...'}
              style={styles.input}
              rightIcon={
                <Icon
                  name="ios-send-sharp"
                  type="ionicon"
                  color={btnDisable ? colors.gray : colors.primary}
                  disabled={btnDisable}
                  onPress={this.addComment}
                  size={28}
                  Component={TouchableOpacity}
                  disabledStyle={{
                    backgroundColor: '#0000',
                  }}
                  iconStyle={styles.SendIcon}
                />
              }
            />
          </View>
          <KeyboardSpacer />
        </View>
      </View>
    );
  }
}

EventDetails.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

EventDetails.defaultProps = {};

const mapStateToProps = (state) => ({
  event: state.event,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
