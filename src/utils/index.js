// import {firestore, storage} from 'firebase';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {PermissionsAndroid} from 'react-native';
import {store} from '../redux/store/configureStore';
import {MAPBOX_ACCESS_TOKEN, CLASSIFY_API} from '../constants';
import Share from 'react-native-share';
export const timestampToString = (create_at, suffix) => {
  let diffTime = (new Date().getTime() - (create_at || 0)) / 1000;
  if (diffTime < 60) {
    diffTime = 'Just now';
  } else if (diffTime > 60 && diffTime < 3600) {
    diffTime =
      Math.floor(diffTime / 60) +
      (Math.floor(diffTime / 60) > 1
        ? suffix
          ? ' minutes'
          : 'm'
        : suffix
        ? ' minute'
        : 'm') +
      (suffix ? ' ago' : '');
  } else if (diffTime > 3600 && diffTime / 3600 < 24) {
    diffTime =
      Math.floor(diffTime / 3600) +
      (Math.floor(diffTime / 3600) > 1
        ? suffix
          ? ' hours'
          : 'h'
        : suffix
        ? ' hour'
        : 'h') +
      (suffix ? ' ago' : '');
  } else if (diffTime > 86400 && diffTime / 86400 < 30) {
    diffTime =
      Math.floor(diffTime / 86400) +
      (Math.floor(diffTime / 86400) > 1
        ? suffix
          ? ' days'
          : 'd'
        : suffix
        ? ' day'
        : 'd') +
      (suffix ? ' ago' : '');
  } else {
    diffTime = new Date(create_at || 0).toDateString();
  }
  return diffTime;
};
export const convertDateToTimeStampFireBase = (date) => {
  return new firestore.Timestamp(
    Math.floor(date.getTime() / 1000),
    date.getTime() - Math.floor(date.getTime() / 1000) * 1000,
  );
};
export const generateUsernameKeywords = (fullText) => {
  const keywords = [];
  const splitedText = fullText.split('');
  splitedText.map((s, index) => {
    const temp = splitedText.slice(0, index + 1).join('');
    keywords.push(temp);
  });
  return Array.from(new Set(keywords));
};
export const findUsersByName = async (q) => {
  let users = [];
  const ref = firestore();
  const rq = await ref
    .collection('users')
    .where('keyword', 'array-contains', q)
    .get();
  rq.docs.map((x) => {
    const user = x.data();
    users.push(user);
  });
  users = users.filter(
    (u) => u.username !== store.getState().user.user.userInfo?.username,
  );
  return users;
};
export const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error('uriToBlob failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
};
export const searchLocation = (query) => {
  return new Promise((resolve, reject) => {
    fetch(
      `http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
        query.trim(),
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
    )
      .then((res) => res.json())
      .then((data) => {
        const address = [];
        const result = data;
        result.features.map((feature) => {
          address.push({
            id: feature.id,
            place_name: feature.place_name,
            center: feature.center,
          });
        });
        resolve(address);
      })
      .catch((err) => reject(err));
  });
};
export const sharePost = (post) => {
  const options = {
    activityItemSources: [
      {
        // For sharing url with custom title.
        placeholderItem: {
          type: 'url',
          content: 'https://www.facebook.com/photo.php?fbid=619895371910790',
        },
        item: {
          default: {
            type: 'url',
            content: 'https://www.facebook.com/photo.php?fbid=619895371910790',
          },
        },
        subject: {
          default: post.content || '',
        },
        linkMetadata: {
          originalUrl:
            'https://www.facebook.com/photo.php?fbid=619895371910790',
          url: 'https://www.facebook.com/photo.php?fbid=619895371910790',
        },
      },
      {
        // For sharing text.
        placeholderItem: {type: 'text', content: post.content || ''},
        item: {
          default: {type: 'text', content: 'Hello....'},
          message: null,
        },
        linkMetadata: {
          // For showing app icon on share preview.
          title:
            'https://img.favpng.com/9/25/24/computer-icons-instagram-logo-sticker-png-favpng-LZmXr3KPyVbr8LkxNML458QV3.jpg',
        },
      },
      {
        // For using custom icon instead of default text icon at share preview when sharing with message.
        placeholderItem: {
          type: 'url',
          content: 'a',
        },
        item: {
          default: {
            type: 'text',
            content: `${post.ownUser?.username} has been posted a image`,
          },
        },
        linkMetadata: {
          title: `${post.ownUser?.username} has been posted a image`,
          icon:
            'https://img.favpng.com/9/25/24/computer-icons-instagram-logo-sticker-png-favpng-LZmXr3KPyVbr8LkxNML458QV3.jpg',
        },
      },
    ],
  };
  Share.open(options);
};
export const shareProfile = (user) => {
  const options = {
    activityItemSources: [
      {
        // For sharing url with custom title.
        placeholderItem: {
          type: 'url',
          content: user.avatarURL || '',
        },
        item: {
          default: {type: 'url', content: user.avatarURL || ''},
        },
        subject: {
          default: user.username || '',
        },
        linkMetadata: {
          originalUrl: user.avatarURL || '',
          url: user.avatarURL || '',
        },
      },
      {
        // For sharing text.
        placeholderItem: {type: 'text', content: user.username || ''},
        item: {
          default: {type: 'text', content: `${user.username} on Instagram`},
          message: null,
        },
        linkMetadata: {
          // For showing app icon on share preview.
          title:
            'https://img.favpng.com/9/25/24/computer-icons-instagram-logo-sticker-png-favpng-LZmXr3KPyVbr8LkxNML458QV3.jpg',
        },
      },
      {
        // For using custom icon instead of default text icon at share preview when sharing with message.
        placeholderItem: {
          type: 'url',
          content: user.avatarURL || '',
        },
        item: {
          default: {
            type: 'text',
            content: `${user.username} on Instagram`,
          },
        },
        linkMetadata: {
          title: `${user.username} on Instagram`,
          icon: user.avatarURL,
        },
      },
    ],
  };
  Share.open(options);
};
export const Timestamp = () => {
  const curDate = new Date();
  const second = Math.floor(curDate.getTime() / 1000);
  const nanosecond = curDate.getTime() - second * 1000;
  return new firestore.Timestamp(second, nanosecond);
};
/* eslint-disable no-useless-escape */
export const convertToFirebaseDatabasePathName = (text) => {
  return text
    .replace(/\./g, '!')
    .replace(/#/g, '@')
    .replace(/\$/g, '%')
    .replace(/\[/g, '&')
    .replace(/\]/g, '*');
};
export const revertFirebaseDatabasePathName = (text) => {
  return text
    .replace(/\!/g, '.')
    .replace(/\@/g, '#')
    .replace(/\%/g, '$')
    .replace(/\&/g, '[')
    .replace(/\*/g, ']');
};
/* eslint-enable no-useless-escape */
export const uploadSuperImages = (images) => {
  const ref = firestore();
  const myUsername = store.getState().user.user.userInfo?.username || '';
  return images.map(async (img, index) => {
    let uid = new Date().getTime() + index;
    img.texts = img.texts.map((txt) => {
      delete txt.animRatio;
      delete txt.animX;
      delete txt.animY;
      return txt;
    });
    img.labels = img.labels.map((label) => {
      delete label.animRatio;
      delete label.animX;
      delete label.animY;
      return label;
    });
    // const blob = await uriToBlob(img.uri);
    const rq = await storage()
      .ref(
        `story/${myUsername || 'others'}/${
          new Date().getTime() + Math.random()
        }.${img.extension.toLowerCase()}`,
      )
      .putFile(img.uri);
    // eslint-disable-next-line prettier/prettier
      // .put(blob, {
    //   contentType: `image/${img.extension.toLowerCase()}`,
    // });

    const downloadUri = await storage()
      .ref(rq.metadata.fullPath)
      .getDownloadURL();
    ref
      .collection('superimages')
      .doc(`${uid}`)
      .set(
        Object.assign(Object.assign({}, img), {
          uri: downloadUri,
          uid,
          userId: myUsername,
        }),
      );
    return {
      sourceId: uid,
      hashtags: Array.from(
        new Set(
          img.labels.filter((x) => x.type === 'hashtag').map((x) => x.text),
        ),
      ),
      mention: Array.from(
        new Set(
          img.labels
            .filter((x) => x.type === 'people')
            .map((x) => x.text.slice(1)),
        ),
      ),
      address: Array.from(
        new Set(
          img.labels
            .filter((x) => x.type === 'address')
            .map((x) => ({
              place_name: x.text,
              id: x.address_id,
            })),
        ),
      ),
    };
  });
};
export const getImageClass = (url) => {
  return new Promise((resolve, reject) => {
    const data = new FormData();
    data.append('URL', url);
    resolve('art');
    // fetch(CLASSIFY_API, {
    //   method: 'POST',
    //   body: data,
    // })
    //   .then((res) => res.json())
    //   .then((result) => {
    //     if (result.success) {
    //       resolve(result.class_name);
    //     } else {
    //       reject('Error');
    //     }
    //   });
  });
};
export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export const hasAndroidPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }
  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};
export const hasAndroidCameraPermission = async () => {
  const permission = PermissionsAndroid.PERMISSIONS.CAMERA;
  const hasPermission = await PermissionsAndroid.check(permission);
  if (hasPermission) {
    return true;
  }
  const status = await PermissionsAndroid.request(permission);
  return status === 'granted';
};
// export const askStoragePermission = async () => {
// };
