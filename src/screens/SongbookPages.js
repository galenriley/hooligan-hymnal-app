import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import withUnstated from '@airship/with-unstated';
import GlobalDataContainer from '../containers/GlobalDataContainer';
import { FontSizes } from '../constants';
import { RegularText } from '../components/StyledText';
import SongView from '../components/SongView';
import i18n from '../i18n';
import { DefaultColors, Skin } from '../../config';

let defaultChapterTitle = i18n.t('screens.songbook.defaultchaptertitle');
const screenWidth = Dimensions.get('window').width;
const firstValidPageIndex = 0;

class SongbookPages extends React.Component {
  state = {
    chapter_title: defaultChapterTitle,
    tocButtonDisplay: true,
    songViews: [],
    songs: [],
    pageCount: 0
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerTitle: i18n.t('screens.songbook.title')
    })

    let songViews = [];
    let songs = [];
    let pageCount = 0;
    this.props.globalData.state.songbook.chapters.forEach(chapterChild => {
      chapterChild.songs.forEach((songChild, index) => {
        try {
          let item = this.props.globalData.state.songs.filter(song => song._id === songChild._id)[0];
          console.log("found song: " + item)
          item.chapter_title = chapterChild.chapter_title;
          pageCount++;
          songs.push({ index: pageCount, song: item });
          songViews.push(
            <View
              key={index + "-" + item._id}
              chapter_title={chapterChild.chapter_title}
              style={{ flex: 1, width: screenWidth, textAlign: i18n.getRTLTextAlign(), writingDirection: i18n.getWritingDirection() }}>
              <SongView song={item} pageCount={pageCount} />
            </View>
          );
        } catch (err) {
          console.log(songChild._id + ' not found in songs database, ' + err);
        }
      });
    });

    this.setState({ songViews, songs, pageCount });
  }

  _handlePressTOCButton = () => {
    this.scrollToToC();
  };

  _onSongbookMomentumScrollEnd = ({ nativeEvent }) => {
    const pageIndex = Math.round(nativeEvent.contentOffset.x / screenWidth);

    if (this.state.pageCount + 1 === pageIndex) {
      this.setState({
        tocButtonDisplay: false,
        chapter_title: i18n.t('screens.songbook.tableofcontents')
      });
    } else if (firstValidPageIndex <= pageIndex) {
      this.setState({
        tocButtonDisplay: true,
        chapter_title: this.state.songs[pageIndex - firstValidPageIndex].song
          .chapter_title
      });
    } else {
      this.setState({
        tocButtonDisplay: true,
        chapter_title: defaultChapterTitle
      });
    }
  };

  scrollToSong = () => {
    const { currentSong } = this.props.globalData.state;
    this.setState({
      tocButtonDisplay: true,
      chapter_title: currentSong.chapter_title
    });
    this._scrollView.scrollTo({
      x: (currentSong.page - 1 + firstValidPageIndex) * screenWidth,
      y: 0,
      animated: false
    });
  };

  render() {
    console.log("SongbookPages " + JSON.stringify(this.props.route.params))
    console.log(this.state.songViews.length)

    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <RegularText style={styles.chapterText}>{this.state.chapter_title}</RegularText>
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView key={'songbookScrollView'}
            ref={view => (this._scrollView = view)}
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            horizontal={true}
            pagingEnabled={true}
            onMomentumScrollEnd={this._onSongbookMomentumScrollEnd}>
            {this.state.songViews}
          </ScrollView>
        </View>

        <RectButton
          style={styles.tocButtonStyle}
          onPress={() => this.props.navigation.goBack()}
          underlayColor="#fff">
          <MaterialCommunityIcons
            name="table-of-contents"
            size={23}
            style={{
              color: DefaultColors.ButtonText,
              marginVertical: 3,
              marginHorizontal: 5,
              backgroundColor: 'transparent'
            }}
          />
          <RegularText style={styles.tocButtonText}>
            {i18n.t('screens.songbook.tableofcontents')}
          </RegularText>
        </RectButton>
      </View>
    );
  }
}

export default withUnstated(SongbookPages, { globalData: GlobalDataContainer });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Skin.Songbook_Background
  },
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    textAlign: i18n.getRTLTextAlign()
  },
  chapterText: {
    textAlign: 'center',
  },
  tocButtonStyle: {
    backgroundColor: Skin.Songbook_ToCButtonBackground,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 0,
    width: 100 + '%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexDirection: i18n.getFlexDirection()
  },
  tocButtonText: {
    fontSize: FontSizes.normalButton,
    color: '#fff',
    textAlign: 'center'
  },
})
