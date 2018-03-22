import React, { Component } from 'react';
import { Container, Header, Item, Input, Icon, Button, Text, StyleProvider, Content, CardItem } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { BackHandler, TouchableOpacity, Image, View, ActivityIndicator, Dimensions, StyleSheet, ScrollView ,FlatList } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Grid from 'react-native-photo-grid';
import { AdMobBanner } from 'react-native-admob';

const styles = StyleSheet.create({
    titleText: {
        height: (( Dimensions.get('window').height) * 0.0425), 
        color: '#FFF', 
        paddingLeft: 10, 
        paddingTop: 5, 
        fontSize: (( Dimensions.get('window').height) * 0.02)
    },
    relatedText: {
        padding: (( Dimensions.get('window').height) * 0.040),
        color: '#fff'
    },
    touchable: {
        flex: 1, 
        marginRight: 1,
        backgroundColor: '#000', 
        marginLeft: 1, 
        borderRadius: 3,  
        width: (( Dimensions.get('window').width) * 0.33), 
        height: (( Dimensions.get('window').height) * 0.33)
      }
})
                                
class Search extends Component {
    constructor() {
        super();
        this.state = {
            value: '',
            posts: [],
            related: [],
            message: "Search for posts"
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount () {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    onBackPress () {
        Actions.pop();
        return true;
    }

    search() {
        return fetch(`https://paperstack.ml/search/${this.state.value}`)
        .then((response) => response.json())
        .then((response) => {
            if(this.state.value.indexOf(" ") !== -1){
                this.setState({
                    posts: response.post_with_broken_tags,
                    related: response.all_related_to_posts_with_broken_tags
            })
            }
            else {
                this.setState({
                    posts: response.posts_with_tags,
                    related: response.related_to_posts_with_tags
                })
            }
            
        }).then((response) => {
            if(this.state.posts.length == 0) {
                this.setState({
                    message: "There are no items matching your search"
                })
            }
        })
    }
    renderContent() {
        if (this.state.posts.length > 0) {
            return(
                <ScrollView>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                    <Grid
                        data = { this.state.posts}
                        itemsPerRow = { 3 }
                        renderItem = { this.renderItem.bind(this) }
                    />
                    </View>
                    <Text style={styles.relatedText}>Related Photos</Text>
                    <View style={{flex: 1, flexDirection: 'column'}}>
                    <Grid
                        data = { this.state.related}
                        itemsPerRow = { 3 }
                        renderItem = { this.renderRelatedItem.bind(this) }
                    />
                    </View>
                </ScrollView>
                 
            )
        }
        else {
            return (
                <View style={{height: 670, flex: 1, alignItems: 'center'}}>
                    <Text style={{color: '#aaa', marginTop: 100}}>{this.state.message}</Text>
                </View>
            )
        }
    }
    
    render() {
        const photos = this.state.posts
        const related = this.state.related
        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{backgroundColor: '#222'}}>
                    <Header searchBar rounded style={{backgroundColor: '#222', borderColor: '#ccc', marginTop: (( Dimensions.get('window').height) * 0.038)}}>
                    <Item style={{backgroundColor: '#ccc'}}>
                        <Icon name="ios-search" />
                        <Input placeholder=" Search Paperstack"
                            style={{backgroundColor: '#222', color: '#eee'}} 
                            onChangeText={(text) => {
                                this.setState({
                                    value: text.toLowerCase()
                                })
                            }}
                            onSubmitEditing={(value) => {
                                this.search()
                        }} />
                    </Item>
                    <Button transparent>
                        <Text>Search</Text>
                    </Button>
                    </Header>
                    {this.renderContent()}
                    <AdMobBanner
                        adSize="fullBanner"
                        adUnitID="ca-app-pub-6762059104295133/4352963230"
                        
                        />
                </Container>
        </StyleProvider>
    );
  }
    renderItem(photos) {
        const goToSingle = (data) => Actions.single({data: photos});
                return (
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
        renderRelatedItem(related) {
            const goToSingle = (data) => Actions.single({data: related});
                    return (
                        <TouchableOpacity
                            key = {related._id}
                            style={styles.touchable}
                            activeOpacity = {0.6}
                            onPress={goToSingle}
                            >
                            <Image
                                resizeMode = "cover"
                                style = {{ flex: 1 }}
                                source={{uri: related.thumbnail}}
                                />  
                        </TouchableOpacity>
    
    
                )
            }
        
  }
  
  export default Search



