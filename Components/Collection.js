import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text, StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { ActivityIndicator, Image, TouchableOpacity, View, BackHandler, Dimensions, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Grid from 'react-native-photo-grid';
import { AdMobBanner } from 'react-native-admob'

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

class Collection extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            collection: {},
            collection_posts: [],
            error: false
        }
        this.baseState = this.state
    }
      componentDidMount() {
        this.fetchCollections()
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        
        }
      componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
      }
       onBackPress () {
        Actions.pop();
        return true;
      }

      fetchCollections() {
        return fetch(`https://paperstack.ml/collection/${this.props.data._id}`)
        .then((response) => response.json())
        .then((response) => {
            this.setState({
                isLoading: false,
                collection: response.collections, 
                collection_posts: response.postarray
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
    render() {
    const photos = this.state.collection_posts
    
    if (this.state.isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#222'}}>
          <ActivityIndicator size="large" color="#198c8c" />
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
      <StyleProvider style={getTheme(material)}>
            <Container style={{backgroundColor: '#222'}}>
              <Header style={{marginTop: (( Dimensions.get('window').height) * 0.038)}}>
                <Left>
                  <Button transparent onPress={() => Actions.pop()}>
                    <Icon name='arrow-back' style={{fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                  </Button>
                </Left>
                  <Body>
                    <Title style={{fontSize: (( Dimensions.get('window').height) * 0.024)}}>{this.props.data.name}</Title>
                  </Body> 
                  <Right>
                  <Button iconRight transparent onPress={() => Actions.search()}>
                    <Icon name="search" style={{fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                  </Button>
                </Right>  
              </Header>
              <View style={{flex: 1, flexDirection: 'column'}}>
                <Grid
                  data = { this.state.collection_posts }
                  itemsPerRow = { 3 }
                  renderItem = { this.renderItem }
                />
              </View>
             <AdMobBanner
                adSize="fullBanner"
                adUnitID="ca-app-pub-6762059104295133/9532278899"
                />
            </Container>
      </StyleProvider>
            
    );
  }
  
  renderItem(photos) {
    const goToSingle = (data) => Actions.single({data: photos});
    return(
          <TouchableOpacity
              key = {photos._id}
              style={styles.touchable}
              activeOpacity = {0.6}
              onPress={goToSingle}
              >
                <Image
                  resizeMode = "cover"
                  style={{flex: 1}}
                  source={{uri: photos.thumbnail}}
                />  
            </TouchableOpacity>      
    )
  }
    
}

export default Collection