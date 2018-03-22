import React, { Component } from 'react';
import { ActivityIndicator, Image, TouchableOpacity, View, ScrollView, RefreshControl, Dimensions, StyleSheet, Button } from 'react-native';
import { Container, Content, CardItem, Text } from 'native-base'
import { Actions } from 'react-native-router-flux';
import { AdMobBanner, AdMobInterstitial } from 'react-native-admob'
import SocketIOClient from 'socket.io-client'

const styles = StyleSheet.create({
  touchable: {
    backgroundColor: '#000'
  }
})

class Category extends Component {
  constructor(props) {
    super(props);
    this.socket = SocketIOClient('https://paperstack.ml')
    this.state = { collections: [], isLoading: true, posts: [], refreshing: false, counter: 0, error: false };

    this.socket.on('updatecollection', () => {
      return fetch('https://paperstack.ml/api/collections')
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          collections: response.collections,
          posts: response.postarray
        })
      })
    })
    this.baseState = this.state
  }

adCounter() {
  this.setState({ counter: this.state.counter + 1})
    if(this.state.counter !== 0 && this.state.counter % 3 == 0) {
      this.showAd()
    }
  }
showAd() {
  AdMobInterstitial.setAdUnitID('ca-app-pub-6762059104295133/3200691338');
  AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
  }

  componentDidMount() {
   this.fetchCollections();
  }
  fetchCollections() {
    return fetch('https://paperstack.ml/api/collections')
   .then((response) => response.json())
   .then((response) => {
       this.setState({
           isLoading: false,
           collections: response.collections,
           posts: response.postarray
       })
   })
   .catch(error => {
    this.setState({
      isLoading: false,
      error: true
    })
  })
  }
  reset = () => {
    this.setState(this.baseState)
    this.fetchCollections()
  }
  _onRefresh() {
    this.setState({refreshing: true})
    this.fetchCollections().then(() => {
      this.setState({
        refreshing: false
      })
    })
  }
  
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="#198c8c"/>
        </View>
      );
    }
    else if (this.state.error) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: '#fff'}}>Could not load wallpapers :(</Text>
          <Text></Text>
          <Text></Text>
          <Button onPress={() => {this.reset()}} title="RETRY" color='#198c8c'></Button>
        </View>
        
      )
    }
      let collections;
      if(this.state.collections.length > 0 ) {
        collections = this.state.collections.map((collection) => {
        if(collection.posts.length > 0) {
          var random = collection.posts[Math.floor(Math.random()*collection.posts.length)]
          var display_photo = this.state.posts.find(post => post._id === random._id)
          return (
            <Content key = {collection._id}>
              <TouchableOpacity
                style = {styles.touchable}
                activeOpacity = {0.6}
                onPress={() => {
                  Actions.collection({data: collection})
                  this.adCounter()
                }}
                >
                <CardItem cardBody >
                  <Image
                    resizeMode = "cover"
                    style = {{ flex: 1, width: null, height: (( Dimensions.get('window').height) * 0.36) }}
                    source={{uri: display_photo.thumbnail}}
                  />
                </CardItem>
                <CardItem cardBody style={{position: 'absolute', bottom: 0, opacity: 0.6}} >
                <Content style={{ backgroundColor: '#000',  width: null}}>
                  <Text style={{height: (( Dimensions.get('window').height) * 0.065), color: '#FFF', paddingLeft: 10, paddingTop: 10,  fontSize: (( Dimensions.get('window').height) * 0.024)}}>{collection.name}</Text>
                </Content>
                </CardItem>    
              </TouchableOpacity>
            </Content>
          )}

    else {
      return(
       null
  )}})} else {
      collections = (null)
  }
  return (
      <View style={{flex: 1}}>
      <View style={{width: (Dimensions.get('window').width) / 3,  borderColor: 'teal', borderTopWidth: 3, marginLeft: "33.3%" }}></View>
        <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
                      />
                    } >
            {collections}
          </ScrollView>
          <AdMobBanner
              adSize="fullBanner"
              adUnitID="ca-app-pub-6762059104295133/2278914333"
              />
        </View>
  )
  }

}

export default Category