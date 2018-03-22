import React, { Component } from 'react';
import Grid from 'react-native-photo-grid';
import { ActivityIndicator, Image, TouchableOpacity, View, RefreshControl, BackHandler, Dimensions, StyleSheet, Button, Text} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { AdMobBanner, AdMobInterstitial } from 'react-native-admob'
import SocketIOClient from 'socket.io-client'

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    backgroundColor: '#000', 
    marginRight: 1, 
    marginLeft: 1, 
    borderRadius: 3,  
    width: (( Dimensions.get('window').width) * 0.33), 
    height: (( Dimensions.get('window').height) * 0.33)
  }
})

class Popular extends Component {
  constructor(props) {
    super(props);
      this.socket = SocketIOClient('https://paperstack.ml')
      this.state = { items: [], isLoading: true, refreshing: false, counter: 0, error: false };
      this.socket.on('update', () => {
        return fetch('https://paperstack.ml/search')
        .then((response) => response.json())
        .then((response) => {
          if(response.popular.length % 3 == 0) {
            this.setState({
              isLoading: false,
              items: response.popular
          })
          }
          else {
            this.setState({
              isLoading: false,
              items: response.popular.splice(0, response.popular.length - response.popular.length % 3)
            })
          }
        })
      })
      this.baseState = this.state
    }

  componentDidMount() {
    this.fetchPhotos()

    }

    fetchPhotos() {
      return fetch('https://paperstack.ml/search')
      .then((response) => response.json())
      .then((response) => {
        if(response.popular.length % 3 == 0) {
          this.setState({
            isLoading: false,
            items: response.popular
        })
        }
        else {
          this.setState({
            isLoading: false,
            items: response.popular.splice(0, response.popular.length - response.popular.length % 3)
          })
        }
          
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
        this.fetchPhotos()
      }
    _onRefresh() {
      this.setState({refreshing: true})
      this.fetchPhotos().then(() => {
        this.setState({
          refreshing: false
        })
      })
    }
    adCounter() {
      this.setState({ counter: this.state.counter + 1})
        if(this.state.counter !== 0 && this.state.counter % 3 == 0) {
          this.showAd()
        }
      }
    showAd() {
      AdMobInterstitial.setAdUnitID('ca-app-pub-6762059104295133/7515481453');
      AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
      }

  render() {
    const photos = this.state.items
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
      
      return (
        <View style={{flex: 1, flexDirection: 'column'}}>
              <View style={{width: (Dimensions.get('window').width) / 3,  borderColor: 'teal', borderTopWidth: 3, marginLeft:"66.66%" }}></View>
              <Grid
                  data = { this.state.items }
                  itemsPerRow = { 3 }
                  counterfunc= {this.adCounter.bind(this)}
                  renderItem = { this.renderItem }
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                      />
                    }
                  />
                  <AdMobBanner
                    adSize="fullBanner"
                    adUnitID="ca-app-pub-6762059104295133/5645122311"
                   
                  />       
        </View>
      );
    }
    
    renderItem(photos) {
      const goToSingle = (data) =>{ 
        Actions.single({data: photos})
        this.counterfunc()
      }
      return(
            <TouchableOpacity
              key = {photos._id}
              style={styles.touchable}
              activeOpacity = {0.6}
              onPress={goToSingle}
              >
                <Image
                  resizeMode = "cover"
                  style = {{ flex: 1 }}
                  source={{uri: photos.thumbnail}}
                />  
            </TouchableOpacity>
        
      )
    }

  }

  export default Popular