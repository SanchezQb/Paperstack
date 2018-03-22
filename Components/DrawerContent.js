import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Dimensions, TouchableOpacity, Share, Linking} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Content, List, ListItem, Button, Icon } from 'native-base';



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#222',
    paddingTop: '4%',

  },
  link: {
    color: '#eee',
    fontSize: (( Dimensions.get('window').height) * 0.02),
    marginLeft: '4%'

  },
  close: {
    width:  (( Dimensions.get('window').height) * 0.018),
    height:  (( Dimensions.get('window').height) * 0.018),
    marginLeft: '92%',
    marginTop: (( Dimensions.get('window').height) * 0.03)
    
  },
  logo: {
    width:  (( Dimensions.get('window').height) * 0.2),
    height:  (( Dimensions.get('window').height) * 0.2),
    marginLeft: '24%'
  },
  version: {
    color: '#fff',
    textAlign: 'center',
    marginTop: '1%'
  },
  listitem: {
    backgroundColor: '#222',
    marginTop: '2%',
    marginBottom: '2%',
    borderColor: '#000'
  },
  list: {
    marginTop: '5%',
    marginLeft: '3%'
  },
  close: {
    color: '#fff', 
    fontSize: (( Dimensions.get('window').height) * 0.045),
    marginTop: '8%',
    marginLeft: '90%'

  }
});

class DrawerContent extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }

  static contextTypes = {
    drawer: PropTypes.object,
  }
  open() {
    Linking.openURL('https://play.google.com/store/apps/details?id=com.paperstack').catch(err => console.error('An error occurred', err));
  }
  openTwitter() {
    Linking.openURL('https://twitter.com/getpaperstack').catch(err => console.error('An error occurred', err));
  }
  _shareTextMessage () {
    Share.share({
      message: "Get the best High Resolution Wallpapers. Download Paperstack from the Google Play Store. Go to https://play.google.com/store/apps/details?id=com.paperstack"
    })
    .then((result) => console.log(result))
    .catch(err => console.log(err))
  }
  openMail() {
    Linking.openURL('mailto:hellopaperstack@gmail.com').catch(err => console.error('An error occurred', err));
  }
  

  render() {
    return (
      <View style={styles.container}>
        <Container>
          <Content>
            <Button iconRight transparent onPress={() => Actions.drawerClose()}>
              <Icon name="ios-close" style={styles.close} />
            </Button>
            <List style={styles.list}>
              <ListItem style={styles.listitem} onPress={() => this.open()}>
                <Icon name="md-star" style={{color: '#e2e2e2', fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                <Text style={styles.link}>Rate the app</Text>
              </ListItem>
              <ListItem style={styles.listitem} onPress={() => this.openTwitter()}>
                <Icon name="logo-twitter" style={{color: '#e2e2e2', fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                <Text style={styles.link}>Follow on Twitter</Text>
              </ListItem>
              <ListItem style={styles.listitem} onPress={() => this._shareTextMessage()}>
                <Icon name="md-share" style={{color: '#e2e2e2', fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                <Text style={styles.link}>Share the app</Text>
              </ListItem>
              <ListItem style={styles.listitem} onPress={() => this.openMail()}>
                <Icon name="md-help-circle" style={{color: '#e2e2e2', fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                <Text style={styles.link}>Help & Feedback</Text>
              </ListItem>
            </List>
          </Content>
        </Container>
      </View >
    );
  }
}

export default DrawerContent;