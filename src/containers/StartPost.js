import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import colors from '../config/colors';
import {Header, Icon, Input} from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Timestamp} from '../utils';
import {CreatePostRequest} from '../redux/reducers/post/actions';

const {width, height} = Dimensions.get('window');
const numColumns = 3;
const PADDING = 10;
const cW = (width - PADDING * 2 * numColumns) / numColumns;
const cH = cW;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerCont: {
    borderBottomWidth: 0,
    backgroundColor: '#FFF',
  },
  headerText: {
    color: colors.black,
    fontSize: 17,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F2F3F6',
  },
  flexGrow: {
    flexGrow: 1,
  },
  mainView: {padding: 0},
  imageView: {
    // height: 100,
    width: '100%',
    backgroundColor: colors.gray,
    borderRadius: 2,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  view: {padding: 5, flexDirection: 'row'},
  imageStyles: {
    height: 50,
    width: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.brown,
  },
  personText: {fontSize: 17, color: colors.black, left: 15},
  text: {fontSize: 20, color: colors.black},

  card: {
    padding: PADDING,
    // backgroundColor: '#f004',
  },
  cardImageView: {
    height: cH,
    width: cW,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  cardImage: {
    height: '100%',
    width: '100%',
  },
});

class StartPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      caption: '',
      loading: false,
    };
  }

  validate = () => {
    const {caption} = this.state;
    if (!caption || caption.trim() === '') {
      Alert.alert('Warning', 'Please add post description');
      return;
    }

    this.uploadPost();
  };

  setUploading = (bool) => {
    this.setState({loading: bool});
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  uploadPost = () => {
    const {caption} = this.state;
    const {user, dispatch} = this.props;
    const userInfo = user?.user?.userInfo;
    this.setUploading(true);
    const imageList = [...this.state.files];
    const tasks = imageList.map(async (img, index) => {
      // const blob = await uriToBlob(img.uri);
      const extension = img.path.split('.').pop()?.toLocaleLowerCase();
      const rq = await storage()
        .ref(
          `posts/${userInfo?.username || 'others'}/${
            new Date().getTime() + Math.random()
          }.${extension}`,
        )
        .putFile(img.path);
      const downloadUri = await storage()
        .ref(rq.metadata.fullPath)
        .getDownloadURL();
      return {
        uri: downloadUri,
        // width: img.width,
        // height: img.height,
        extension: extension,
        // fullSize: img.fullSize,
        tags: [],
      };
    });
    Promise.all(tasks)
      .then(async (resultList) => {
        console.log(resultList);
        let tagUsername = [];
        resultList.map((img) => {
          img.tags.map((tag) => tagUsername.push(tag.username));
        });
        const regex = /@[a-zA-Z0-9._]{4,}/g;
        let m;
        while ((m = regex.exec(caption)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          m.forEach((match, groupIndex) => {
            tagUsername.push(match.slice(1));
          });
        }
        tagUsername = Array.from(new Set(tagUsername));
        this.setUploading(false);
        const postData = {
          altText: '',
          content: caption,
          create_at: Timestamp(),
          isVideo: false,
          permission: 1,
          notificationUsers: userInfo?.username ? [userInfo.username] : [],
          likes: [],
          tagUsername,
          source: resultList,
          // address: {
          //   ...address,
          //   keyword: generateUsernameKeywords(address.place_name || ''),
          // },
          userId: userInfo?.username,
        };
        console.log('postData', postData);
        await dispatch(CreatePostRequest(postData));
        this.goBack();
      })
      .catch((e) => {
        console.log(e);
        this.setUploading(false);
      });
    // }
  };

  openOptions = () => {
    if (this.ActionSheet) {
      this.ActionSheet.show();
    }
  };

  handleActionSheet = async (index) => {
    let {files} = this.state;
    if (index === 0) {
      try {
        const images = await ImageCropPicker.openCamera({
          cropping: true,
        });
        files = files.concat([images]);
        this.setState({files});
      } catch (error) {
        Alert.alert(
          'Error',
          error && error.message ? error.message : 'Unknown Error',
        );
      }
    }

    if (index === 1) {
      try {
        const images = await ImageCropPicker.openPicker({
          multiple: true,
        });
        console.log(images);
        files = files.concat(images);
        this.setState({files});
      } catch (error) {
        Alert.alert(
          'Error',
          error && error.message ? error.message : 'Unknown Error',
        );
      }
    }

    // if (index === 2) {
    //   try {
    //     const images = await ImageCropPicker.openCamera({
    //       mediaType: 'video',
    //     });
    //     console.log(images);
    //     files = files.concat([images]);
    //     this.setState({files});
    //   } catch (error) {
    //     Alert.alert(
    //       'Error',
    //       error && error.message ? error.message : 'Unknown Error',
    //     );
    //   }
    // }

    // if (index === 3) {
    //   try {
    //     const images = await ImageCropPicker.openPicker({
    //       mediaType: 'video',
    //     });
    //     console.log(images);
    //     files = files.concat([images]);
    //     this.setState({files});
    //   } catch (error) {
    //     Alert.alert(
    //       'Error',
    //       error && error.message ? error.message : 'Unknown Error',
    //     );
    //   }
    // }

    // if (index === 4) {
    // }
  };

  removeFile = (index) => () => {
    const {files} = this.state;
    files.splice(index, 1);
    this.setState({files});
  };

  render() {
    const {user, navigation} = this.props;
    const {caption, files, loading} = this.state;
    const userInfo = user?.user?.userInfo;
    return (
      <View style={styles.container}>
        <Header
          barStyle="dark-content"
          statusBarProps={{
            backgroundColor: colors.white,
          }}
          centerComponent={<Text style={styles.headerText}>START POST</Text>}
          leftComponent={
            <Icon
              name="ios-close"
              type="ionicon"
              color={colors.black}
              size={30}
              onPress={() => navigation.goBack()}
            />
          }
          rightComponent={
            loading ? (
              <ActivityIndicator color={colors.red} size="small" />
            ) : (
              <Text
                onPress={this.validate}
                style={{color: colors.red, fontSize: 15}}>
                Post
              </Text>
            )
          }
          backgroundColor="#0000"
          containerStyle={styles.headerCont}
        />

        <View style={styles.mainView}>
          <View style={styles.imageView}>
            <View style={styles.view}>
              <Image
                source={{uri: userInfo?.avatarURL}}
                style={styles.imageStyles}
              />
              <Text style={styles.personText}>
                {userInfo?.fullname || userInfo?.username || ''}
              </Text>
            </View>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.silver}
              placeholder="Write descrption"
              value={caption}
              onChangeText={(val) => this.setState({caption: val})}
              numberOfLines={4}
              multiline
              containerStyle={{marginVertical: 10}}
              inputStyle={{textAlignVertical: 'top', height: 100}}
              inputContainerStyle={{
                backgroundColor: colors.white,
                borderRadius: 5,
                padding: 10,
                borderBottomWidth: 0,
              }}
            />

            {/* <View style={{flexDirection: 'row', width: '100%'}}>
              <TouchableOpacity
                onPress={this.openOptions}
                style={{
                  height: 100,
                  width: 100,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}>
                <Icon
                  name="ios-add"
                  type="ionicon"
                  color={colors.white}
                  size={30}
                />
              </TouchableOpacity>
              {files.map((ele) => {
                return (
                  <View
                    style={{
                      height: 100,
                      width: 100,
                      backgroundColor: colors.primary,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}>
                    <Image
                      source={{uri: ele.path}}
                      style={{height: '100%', width: '100%'}}
                    />
                  </View>
                );
              })}
            </View> */}
          </View>
        </View>
        <FlatList
          data={[{add: true}, ...files]}
          numColumns={numColumns}
          // style={{flex: 1}}
          contentContainerStyle={{flexGrow: 1}}
          renderItem={({item, index}) => {
            if (item.add) {
              return (
                <View style={styles.card}>
                  <TouchableOpacity
                    onPress={this.openOptions}
                    style={styles.cardImageView}>
                    <Icon
                      name="ios-add"
                      type="ionicon"
                      color={colors.white}
                      size={cW * 0.6}
                    />
                  </TouchableOpacity>
                </View>
              );
            }
            return (
              <View style={styles.card}>
                <TouchableOpacity style={styles.cardImageView}>
                  <Image source={{uri: item.path}} style={styles.cardImage} />
                </TouchableOpacity>
                <Icon
                  name="ios-close"
                  activeOpacity={0.9}
                  onPress={this.removeFile(index - 1)}
                  Component={TouchableOpacity}
                  type="ionicon"
                  size={30}
                  color={colors.white}
                  containerStyle={{
                    position: 'absolute',
                    height: 30,
                    width: 30,
                    top: 0,
                    right: 0,
                    borderRadius: 10,
                    backgroundColor: colors.red,
                  }}
                />
              </View>
            );
          }}
        />

        <ActionSheet
          ref={(o) => {
            this.ActionSheet = o;
          }}
          title={'Select option'}
          options={[
            'Add photo from camera',
            'Add photo from gallery',
            // 'Add video from camera',
            // 'Add video from gallery',
            // 'Add document from gallery',
            'Cancel',
          ]}
          cancelButtonIndex={2}
          destructiveButtonIndex={2}
          onPress={this.handleActionSheet}
        />
      </View>
    );
  }
}

StartPost.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.any).isRequired,
};

StartPost.defaultProps = {};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(StartPost);
