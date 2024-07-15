import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  // SafeAreaView,
  // StatusBar,
  Dimensions,
  // SafeAreaView,
} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import Calendar from '../libs/react-native-events-calendar';
// import {Agenda} from 'react-native-calendars';
import CalendarStrip from 'react-native-calendar-strip';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Header, Icon} from 'react-native-elements';
import { FetchEventsRequest } from '../redux/reducers/event/actions';

let {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    // backgroundColor: '#FFF',
    backgroundColor: colors.gray,
  },
  emptyContainer: {
    flex: 1,
    // width: '100%',
    // height: 150,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainerText: {
    fontSize: 20,
    color: colors.silver,
  },

  eventView: {
    // width: 100
    backgroundColor: '#4CE5B1',
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  eventText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventSubText: {
    fontSize: 11,
    color: colors.white,
    // fontWeight: 'bold',
  },
});

class EventCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          color: '#F4EFDB',
          start: '2020-11-03 08:00',
          end: '2020-11-03 11:30',
          title: 'Continental Alumni Summit ',
        },
        {
          color: '#F4EFDB',
          start: '2020-11-03 11:00',
          end: '2020-11-03 14:00',
          title: 'CD2030 Conference ',
        },
        {
          color: '#F4EFDB',
          start: '2020-11-03 12:00',
          end: '2020-11-03 14:00',
          title: 'CD2030 Conference ',
        },
        {
          color: '#F4EFDB',
          start: '2020-11-03 15:00',
          end: '2020-11-03 16:00',
          title: 'ABT - Technical Learning Series ',
        },
        {
          color: '#F4EFDB',
          start: '2020-11-03 17:00',
          end: '2020-11-03 18:00',
          title: 'Financial Management for Entrepre…',
        },
      ],
      selectedDate: moment().toDate(),
      event: {},
      day: null,
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

  eventClicked = (event) => {
    const {navigation} = this.props;
    console.log(event.extraData);
    navigation.navigate('EventDetails', {
      eventItem: event.extraData,
    });
  };

  load = async () => {
    const {dispatch} = this.props;
    try {
      await dispatch(FetchEventsRequest());
    } catch (error) {
      console.log(error);
    }
  };

  getEvents = () => {
    const {
      event: {events},
    } = this.props;
    let ary = [];
    if (_.isArray(events) && events.length) {
      events.map((ele) => {
        ary.push({
          color: '#F4EFDB',
          // color: "#"+((1<<24)*Math.random()|0).toString(16),
          start: moment(
            `${ele.date} ${ele.start_time}` || '',
            'YYYY-MM-DD hh:mm A',
          ).format('YYYY-MM-DD HH:mm'),
          end: moment(
            `${ele.date} ${ele.end_time}` || '',
            'YYYY-MM-DD hh:mm A',
          ).format('YYYY-MM-DD HH:mm'),
          title: ele.title,
          extraData: ele,
        });
      });
    }
    console.log(ary);
    return ary;
  };

  getEventHeader = () => {
    const {
      event: {events},
    } = this.props;
    let ary = [];
    if (_.isArray(events) && events.length) {
      events.map((ele) => {
        const dd = moment(ele.date);
        if (dd.isValid()) {
          ary.push({
            date: moment(ele.date),
            dots: [
              {
                color: colors.pink,
                selectedColor: colors.white,
              },
            ],
          });
        }
      });
    }
    return ary;
  };

  renderEvent = (event) => {
    return (
      <View>
        <Text>{event.title}</Text>
      </View>
    );
  };

  renderHeader = () => {
    const markedDates = this.getEventHeader();
    console.log('renderHeader', this.state.selectedDate);
    return (
      <CalendarStrip
        ref={(o) => {
          this.CalendarStrip = o;
        }}
        calendarAnimation={{type: 'sequence', duration: 30}}
        // daySelectionAnimation=
        scrollable
        daySelectionAnimation={{
          type: 'background',
          duration: 200,
          // borderWidth: 1,
          // borderHighlightColor: 'white',
          highlightColor: colors.pink,
        }}
        selectedDate={this.state.selectedDate}
        onDateSelected={this.onDateSelected}
        // calendarHeaderContainerStyle={{}}
        style={{height: 60}}
        calendarHeaderStyle={{color: '#000'}}
        calendarColor={'#F7F8FA'}
        dateNumberStyle={{color: '#ACB1C0'}}
        dateNameStyle={{color: '#ACB1C0'}}
        highlightDateNumberStyle={{color: 'white'}}
        highlightDateNameStyle={{color: 'white'}}
        disabledDateNameStyle={{color: '#ACB1C0'}}
        disabledDateNumberStyle={{color: '#ACB1C0'}}
        showMonth={false}
        calendarHeaderContainerStyle={{
          height: 0,
          width: 0,
        }}
        // markedDatesStyle={{
        //   color: '#000',
        //   backgroundColor: '#F004',
        //   borderRadius: 10,
        // }}
        markedDates={markedDates}
        // calendarHeaderPosition={}
        // datesWhitelist={datesWhitelist}
        // datesBlacklist={datesBlacklist}
        // iconLeft={require('./img/left-arrow.png')}
        // iconRight={require('./img/right-arrow.png')}
        iconLeft={false}
        iconRight={false}
        iconContainer={{flex: 0.1}}
      />
    );
  };

  today = () => {
    // this.setState({});
    const today = moment().format('YYYY-MM-DD');
    this.goToDate(today);
  };

  onDateSelected = (val) => {
    console.log('onDateSelected', val);
    this.setState({selectedDate: val}, () => {
      if (val.isValid && val.isValid()) {
        const vM = val.format('YYYY-MM-DD');
        this.goToDate(vM);
      }
    });
  };

  goToDate = (date) => {
    if (this.Calendar) {
      this.Calendar._goToDate(date);
    }
  };

  setSelectedDate = (ddd) => {
    const dM = moment(ddd, 'YYYY-MM-DD').toDate();
    console.log(dM);
    // this.setState({selectedDate: dM}, () => {
    if (this.CalendarStrip) {
      this.CalendarStrip.setSelectedDate(dM);
    }
    // });
  };

  render() {
    const {navigation} = this.props;
    const {day} = this.state;

    // console.log(day);
    let heading = '';
    if (day && day.timestamp) {
      heading = moment(day.timestamp).format('MMMM');
    }

    const events = this.getEvents();

    return (
      <View style={styles.container}>
        <Header
          statusBarProps={{
            backgroundColor: '#F7F8FA',
            barStyle: 'dark-content',
          }}
          leftComponent={
            <Icon
              name="chevron-left"
              color={colors.black}
              size={30}
              onPress={() => navigation.goBack()}
            />
          }
          backgroundColor={colors.white}
          centerComponent={{
            text: heading === '' ? 'Events Calendar' : heading,
            style: {color: colors.black, fontSize: 15},
          }}
          rightComponent={
            // loading ? (
            //   <ActivityIndicator color={colors.red} size="small" />
            // ) : (
            <Text
              onPress={this.today}
              style={{color: colors.red, fontSize: 15}}>
              Today
            </Text>
            // )
          }
          containerStyle={styles.headerCont}
        />
        <View style={{flex: 1}}>
          <Calendar
            onRef={(o) => {
              this.Calendar = o;
            }}
            eventTapped={this.eventClicked}
            events={events}
            width={width}
            size={30}
            renderHeader={this.renderHeader}
            dateChanged={this.setSelectedDate}
            initDate={moment().format('YYYY-MM-DD')}
            // virtualizedListProps={{
            //   key
            // }}
            // scrollToFirst
          />
          {/* <Agenda
            // The list of items that have to be displayed in agenda. If you want to render item as empty date
            // the value of date key has to be an empty array []. If there exists no value for date key it is
            // considered that the date in question is not yet loaded
            items={{
              '2020-11-8': [],
              '2020-11-9': [],
              '2020-11-10': [
                {name: 'item 1 - any js object', subText: '8:00 AM - 5:00 PM'},
              ],
              '2020-11-11': [
                {name: 'item 2 - any js object', subText: '8:00 AM - 5:00 PM'},
              ],
              '2020-11-12': [],
              '2020-11-13': [
                {name: 'item 3 - any js object', subText: '8:00 AM - 5:00 PM'},
                {name: 'any js object', subText: '6:00 PM - 10:00 PM'},
              ],
              '2020-11-14': [],
            }}
            // Callback that gets called when items for a certain month should be loaded (month became visible)
            loadItemsForMonth={(month) => {
              console.log('trigger items loading');
            }}
            // Callback that fires when the calendar is opened or closed
            onCalendarToggled={(calendarOpened) => {
              console.log(calendarOpened);
            }}
            // Callback that gets called on day press
            onDayPress={(day) => {
              console.log('day pressed');
            }}
            // Callback that gets called when day changes while scrolling agenda list
            onDayChange={(day) => {
              console.log('day changed');
              this.setState({day});
            }}
            // Initially selected day
            selected={'2020-11-13'}
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            minDate={'2012-05-10'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            maxDate={'2050-05-30'}
            // Max amount of months allowed to scroll to the past. Default = 50
            pastScrollRange={50}
            // Max amount of months allowed to scroll to the future. Default = 50
            futureScrollRange={50}
            // Specify how each item should be rendered in agenda
            renderItem={(item, firstItemInDay) => {
              return (
                <View style={styles.eventView}>
                  <Text style={styles.eventText}>{item.name}</Text>
                  <Text style={styles.eventSubText}>{item.subText}</Text>
                </View>
              );
            }}
            // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
            // renderDay={(day, item) => {
            //   return <View><Text>day render</Text></View>;
            // }}
            // Specify how empty date content with no items should be rendered
            // renderEmptyDate={() => {
            //   return <View><Text>No Events today</Text></View>;
            // }}
            // Specify how agenda knob should look like
            // renderKnob={() => {
            //   return <View />;
            // }}
            // Specify what should be rendered instead of ActivityIndicator
            renderEmptyData={() => {
              return (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyContainerText}>No Events</Text>
                </View>
              );
            }}
            // Specify your item comparison function for increased performance
            rowHasChanged={(r1, r2) => {
              return r1.text !== r2.text;
            }}
            // Hide knob button. Default = false
            // hideKnob={true}
            // By default, agenda dates are marked if they have at least one item, but you can override this if needed
            // markedDates={{
            //   '2020-05-10': {selected: true, marked: true},
            //   '2020-05-11': {marked: true},
            //   '2020-05-13': {disabled: true},
            // }}
            // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
            disabledByDefault={true}
            // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
            onRefresh={() => console.log('refreshing...')}
            // Set this true while waiting for new data from a refresh
            refreshing={false}
            // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
            refreshControl={null}

            // Agenda theme
            theme={
              {
                // "stylesheet.day.basic": {

                // },
                dotColor: colors.pink,

                selectedDayBackgroundColor: colors.pink,
                selectedDotColor: colors.pink,
                selectedDayTextColor: colors.white,
                // ...calendarTheme,
                // agendaDayTextColor: 'yellow',
                // agendaDayNumColor: 'green',
                // agendaTodayColor: 'red',
                // agendaKnobColor: 'blue',
              }
            }
            // Agenda container style
            style={{
              backgroundColor: colors.white,
            }}
          /> */}
        </View>
      </View>
    );
  }
}

EventCalendar.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

EventCalendar.defaultProps = {};

const mapStateToProps = (state) => ({
  event: state.event,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(EventCalendar);
