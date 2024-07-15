import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {GiftedChat} from 'react-native-gifted-chat';
import colors from '../config/colors';
import {Header, Icon} from 'react-native-elements';
import {
  CreateEmptyConversationRequest,
  CreateMessageRequest,
  MakeSeenRequest,
} from '../redux/reducers/message/actions';
import {messagesTypes, seenTypes} from '../redux/reducers/message/types';
import ActionSheet from 'react-native-actionsheet';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.silver,
  },
  headerCont: {
    borderBottomWidth: 0,
    // backgroundColor: '#F7F8FA',
  },
  iconDisable: {
    backgroundColor: '#0000',
  },
  iconContainer: {
    width: 60,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absView: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absLoader: {
    height: 150,
    width: 150,
    backgroundColor: '#0008',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class MessageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uploading: false,
      selectedPhotos: [],
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
    console.log('onDidFocus chat');
    const {dispatch, conversation, route, user} = this.props;
    // console.log(params);
    // if (params) {
    //   if (params.user) {
    //     // console.log(params.user);
    //     this.props.createConversion(params.user);
    //   }

    //   if (params.conversionId) {
    //     this.props.fetchAllMessagesConversion(params.conversionId);
    //   }
    // }
    const targetUsername = route.params.username;
    if (!conversation) {
      dispatch(CreateEmptyConversationRequest(targetUsername));
      return;
    }
    if (conversation.messageList.length > 0) {
      const myUsername = user.user.userInfo?.username || '';
      const isMyMessage = conversation.messageList[0].userId === myUsername;
      const unRead =
        !isMyMessage && conversation.messageList[0].seen === seenTypes.NOTSEEN;
      if (unRead) {
        dispatch(
          MakeSeenRequest(
            conversation.messageList[0].userId,
            conversation.messageList[0].uid,
          ),
        );
      }
    }
  };

  // eslint-disable-next-line no-unused-vars
  onWillBlur = (payload) => {
    // console.log('onWillBlur');
    // firebaseSDK.refOff();
  };

  setUploadingImage = (bool) => {
    this.setState({uploading: bool});
  };

  onUploadImage = async () => {
    this.setUploadingImage(true);
    const {selectedPhotos} = this.state;
    const {dispatch, user, route} = this.props;
    const myUsername = user.user.userInfo?.username || '';
    const targetUsername = route.params.username;
    if (selectedPhotos.length > 0) {
      const timestamp = new Date().getTime();
      const uploadTasks = selectedPhotos.map(async (img, index) => {
        // const img = photos[index].node.image;
        const {path} = img;
        const extension = path.split('.').pop()?.toLowerCase();
        // const blob = await uriToBlob(img.uri)
        const rq = await storage()
          .ref(
            `messages/${myUsername}/${
              new Date().getTime() + Math.random()
            }.${extension}`,
          )
          .putFile(path);
        const downloadUri = await storage()
          .ref(rq.metadata.fullPath)
          .getDownloadURL();
        return downloadUri;
      });

      try {
        const rs = await Promise.all(uploadTasks);
        const sendingTask = rs.map(async (uri, index) => {
          const message = {
            uid: timestamp + index,
            create_at: timestamp,
            type: messagesTypes.IMAGE,
            sourceUri: uri,
            seen: 0,
            image: uri,
            user: this.getUser(),
            // width: photos[index].node.image.width,
            // height: photos[index].node.image.height,
          };
          dispatch(CreateMessageRequest(message, targetUsername));
        });

        await Promise.all(sendingTask);
        this.setState({uploading: false, selectedPhotos: []});
      } catch (error) {
        console.log(error);
        this.setState({uploading: false}, () => {
          Alert.alert('Error', "Can't upload photos. please try again later!!");
        });
      }
    }
  };

  onSend = (messages = []) => {
    const {dispatch, route} = this.props;
    for (let i = 0; i < messages.length; i++) {
      if (i === 0) {
        const {text, user} = messages[i];
        // console.log(user);
        const targetUsername = route.params.username;
        if (text.length > 0) {
          const msg = {
            seen: 0,
            type: 1,
            text,
            user,
            create_at: new Date().getTime(),
          };
          dispatch(CreateMessageRequest(msg, targetUsername));
        }
      }
    }
  };

  handleActionSheet = async (index) => {
    let {selectedPhotos} = this.state;
    if (index === 0) {
      try {
        const image = await ImagePicker.openCamera({
          // width: 400,
          // height: 400,
          // cropping: true,
          mediaType: 'photo',
        });
        console.log(image);
        selectedPhotos = selectedPhotos.concat([image]);
        this.setState({selectedPhotos}, this.onUploadImage);
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          error && error.message ? error.message : 'Unknown Error',
        );
      }
    }
    if (index === 1) {
      try {
        const image = await ImagePicker.openPicker({
          // width: 400,
          // height: 400,
          // cropping: true,
          multiple: true,
          mediaType: 'photo',
        });
        console.log(image);
        selectedPhotos = selectedPhotos.concat(image);
        this.setState({selectedPhotos}, this.onUploadImage);
      } catch (error) {
        console.log(error);
        Alert.alert(
          'Error',
          error && error.message ? error.message : 'Unknown Error',
        );
      }
    }

    // if (index === 2) {
    //   this.removeImage();
    // }
  };

  showActionSheet = () => {
    if (this.ActionSheet) {
      this.ActionSheet.show();
    }
  };

  renderAvatar = (props) => {
    const {currentMessage} = props;
    if (currentMessage && currentMessage.user) {
      // eslint-disable-next-line camelcase
      const {user} = currentMessage;
      console.log('renderAvatar', user);
      return (
        <Image
          // eslint-disable-next-line camelcase
          source={{uri: user.avatar}}
          key={currentMessage.id}
          style={styles.userAvatar}
        />
      );
    }
    return null;
  };

  getUser = () => {
    const {user} = this.props;
    const userInfo = user.user.userInfo;
    if (!userInfo) {
      return {};
    }
    return {
      _id: userInfo.username,
      avatar: userInfo.avatarURL,
      name: userInfo.username || userInfo.fullname,
      // _id: 'user_oybbb3',
    };
  };

  propOnSend = (props) => () => {
    const {text, messageIdGenerator, user: pUser, onSend} = props;
    if (text && onSend) {
      onSend(
        {
          text: text.trim(),
          user: pUser,
          _id: messageIdGenerator(),
        },
        true,
      );
    }
  };

  renderSend = (props) => {
    return (
      <Icon
        name="md-send-sharp"
        type="ionicon"
        color={colors.primary}
        onPress={this.propOnSend(props)}
        size={28}
        Component={TouchableOpacity}
        disabledStyle={styles.iconDisable}
        containerStyle={styles.iconContainer}
      />
    );
  };

  renderActions = () => {
    return (
      <Icon
        name="md-image-outline"
        type="ionicon"
        Component={TouchableOpacity}
        size={28}
        onPress={this.showActionSheet}
        color={colors.primary}
        disabledStyle={styles.iconDisable}
        containerStyle={styles.iconContainer}
      />
    );
  };

  render() {
    const {conversation, user} = this.props;
    const userInfo = user.user.userInfo;
    const {uploading} = this.state;
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
              color={colors.black}
              size={30}
              onPress={this.props.navigation.goBack}
            />
          }
          backgroundColor={colors.white}
          centerComponent={{
            text:
              conversation?.ownUser.fullname ||
              conversation?.ownUser.username ||
              '',
            style: {color: colors.black, fontSize: 15},
          }}
          rightComponent={
            <Icon
              name="dots-three-vertical"
              type="entypo"
              color={colors.black}
              size={15}
            />
          }
          containerStyle={styles.headerCont}
        />
        {conversation && userInfo ? (
          <GiftedChat
            messages={conversation.messageList || []}
            keyboardShouldPersistTaps="handled"
            onSend={this.onSend}
            user={this.getUser()}
            placeholder={'Write a comment ...'}
            maxComposerHeight={200}
            scrollToBottom
            alignTop
            messagesContainerStyle={{flexGrow: 1}}
            showUserAvatar
            renderSend={this.renderSend}
            renderActions={this.renderActions}
            renderAvatar={this.renderAvatar}
          />
        ) : null}

        {uploading ? (
          <View style={styles.absView}>
            <View style={styles.absLoader}>
              <ActivityIndicator size="large" color={colors.white} />
            </View>
          </View>
        ) : null}
        <ActionSheet
          ref={(o) => {
            this.ActionSheet = o;
          }}
          title={'Select option'}
          options={['Camera', 'Gallery', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={this.handleActionSheet}
        />
      </View>
    );
  }
}

MessageDetails.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

MessageDetails.defaultProps = {};

const mapStateToProps = (state, props) => {
  // const myUsername = state.user.user.userInfo?.username || '';
  const targetUsername = props.route.params.username;
  const conversation = state.messages.filter(
    (group) => group.ownUser.username === targetUsername,
  )[0];
  // user: state.auth.user,
  // messages: state.message.messages,
  return {
    user: state.user,
    conversation,
    myCurrentBlockAccounts:
      state.user.setting?.privacy?.blockedAccounts?.blockedAccounts || 0,
  };
};

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageDetails);
