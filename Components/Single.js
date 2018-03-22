import React, { Component } from 'react';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text, StyleProvider,  Content, Card, CardItem } from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { Actions } from 'react-native-router-flux';
import { Platform, BackHandler, Image, Alert, CameraRoll, TouchableOpacity, View, StatusBar, Dimensions, StyleSheet, TouchableWithoutFeedback, NativeModules } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import * as Progress from 'react-native-progress';
import { AdMobBanner } from 'react-native-admob'
import WallPaperManager from 'react-native-wallpaper-manager'

const styles = StyleSheet.create({
    headerShow: {
        elevation: 0,
        position: 'absolute', 
        backgroundColor: 'rgba(0, 0, 0, 0)', 
        zIndex: 1, 
        marginTop: (( Dimensions.get('window').height) * 0.038)
    },
    headerHide: {
        display: 'none'
    },
    cardShow: {
        position: 'absolute', 
        bottom: '0%', 
        backgroundColor: '#222', 
        opacity: 0.7, 
        width: Dimensions.get('window').width, 
        height: ((Dimensions.get('window').height) * 0.24)
    },
    cardHide: {
        display: 'none'
    },
    downloadText: {
        color: '#fff',  
        fontSize: (( Dimensions.get('window').height) * 0.018)
    },
    titleText: {
        color: "#FFF", 
        fontSize: (( Dimensions.get('window').height) * 0.024)
    },
    creatorText: {
        color: "#EEE", 
        fontSize: (( Dimensions.get('window').height) * 0.02)
    },
    resolutionText: {
        color: '#fff',  
        fontSize: (( Dimensions.get('window').height) * 0.0165)
    }
})

class Single extends Component {
    constructor() {
        super();
        this.state = {
            progress: 0,
            animated: false,
            show: false,
            wallpaper: false,
            message: "Set wallpaper",
            downloaded: ''
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    onBackPress () {
        Actions.pop();
        return true;
    }

      saveToCameraRoll(image) {
        if (Platform.OS === 'android') {
        let dirs = RNFetchBlob.fs.dirs
        RNFetchBlob
        .config({
            path: dirs.PictureDir + `/Paperstack/${this.props.data.title}.jpg`
        })
        .fetch('GET', this.props.data.link)
        .progress({count: 10},(received, total) => {
            this.setState({
                progress: ((received / total)),
                animated: true
            })
            
        })
        .then((res) => {
            this.addDownload()
            .then(() => {
                Alert.alert('Saved', 'Photo added to Gallery')
                this.setState({
                    downloaded: 'done',
                })
            }  
            )
            .then(RNFetchBlob.fs.scanFile([{path: res.path()}]))
        })
        } else {
        CameraRoll.saveToCameraRoll(this.props.data.link)
            .then(Alert.alert('Saved', 'Photo added to camera roll!'))
        }
    }
    displayContent() {
        if(this.state.progress === 0) {
            return (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={styles.downloadText}>Download</Text>
                    <Button transparent onPress={(image) => this.saveToCameraRoll(this.props.data)}>
                        <Icon name="md-download" style={{color: '#fff', fontSize: (( Dimensions.get('window').height) * 0.030)}} />
                    </Button>
                    
                </View>     
            )
        }
        else if (this.state.downloaded == '') {
            return (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Button transparent>
                        <Progress.Circle 
                            animated = {this.state.animated}
                            progress= {this.state.progress}
                            size = {20}
                            color={'#fff'}
                        />
                    </Button>
                    <Text style={styles.downloadText}></Text>
                </View>
            )
        }
        else{
            return (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Button transparent >
                        <Icon  name="ios-checkmark-circle" style={{color: '#fff'}} />
                    </Button>
                    <Text style={styles.downloadText}></Text>
                </View>
            )
        }
    }
    setWallpaper(image) {
        this.setState({
            message: "Setting..."
        })
        const imageURI = this.props.data.link
        WallPaperManager.setWallpaper({uri: imageURI}, (res) => {
            console.log(res)
            if(res.status == 'error') {
                Alert.alert('Failed', 'Check internet connection' )
                this.setState({
                    message: "Set Wallpaper"
                })
            }
            else {
                Alert.alert('Success', 'Wallpaper Set' )
                this.setState({
                    wallpaper: !this.state.wallpaper,
                    message: "Wallpaper Set"
                })
            }
            
        })
    }
    displayWallpaper() {
        if(this.state.wallpaper === false) {
            return(
                <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'center'}}>
                    <Text style={styles.downloadText}>{this.state.message}</Text>
                    <Button transparent onPress={() => this.setWallpaper(this.props.data.link)}>   
                        <Icon name='md-image' style={{color: '#fff', fontSize: (( Dimensions.get('window').height) * 0.023)}} /> 
                    </Button>   
                </View>
            )
        }
        else {
            return (
                <View style={{flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: 'center'}}>
                    <Text style={styles.downloadText}>{this.state.message}</Text>
                    <Button transparent onPress={() => this.setWallpaper(this.props.data.link)}>   
                        <Icon name='md-image' style={{color: '#fff', fontSize: (( Dimensions.get('window').height) * 0.023)}} /> 
                    </Button>
                    
                </View>
            )
        }
    }
 
    toggleStatus() {
        this.setState({
            show: !this.state.show
        })
    }
    
    addDownload() {
        return fetch(`https://paperstack.ml/download/post/${this.props.data._id}`)
    }

    render() {
        const image = this.props.data
        return(
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Header style={[styles.headerShow, this.state.show && styles.headerHide]}>
                    <StatusBar
                        backgroundColor="rgba(0, 0, 0, 0)"
                        translucent={true}
                    />
                        <Left>
                            <Button transparent onPress={() => Actions.pop()} style={{marginTop: 5}}>
                                <Icon name='arrow-back' style={{fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                            </Button>
                        </Left>
                        <Right>
                            <Button iconRight transparent onPress={() => Actions.search()}>
                                <Icon name="search"  style={{fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                            </Button>
                        </Right>
                    </Header>
                    <Content>
                        <CardItem cardBody>
                            <TouchableWithoutFeedback onPress={() => {this.toggleStatus()}}>
                                <Image
                                    resizeMode = "cover"
                                    style = {{ flex: 1, width: null, height: Dimensions.get('window').height }}
                                    source={{uri: this.props.data.thumbnail}}
                                />
                            </TouchableWithoutFeedback>
                            <CardItem style={[styles.cardShow, this.state.show && styles.cardHide]}>
                                <View style={{flex: 1, bottom: '10%'}}>
                                    <Text style={styles.titleText}>{this.props.data.title}</Text>
                                    <Text style={styles.creatorText}>{this.props.data.creator.name}</Text>
                                    <Text style={styles.creatorText}></Text>
                                    <Text style={styles.resolutionText}>{this.props.data.resolution}</Text>
                                </View>
                                
                                <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', bottom: '25%'}}>
                                    {this.displayContent()}
                                    {this.displayWallpaper()}  
                                </View>
                                <AdMobBanner
                                    style={{position: 'absolute', bottom: 0}}
                                    adSize="fullBanner"
                                    adUnitID="ca-app-pub-6762059104295133/6385651080"
                                   
                                />
                            </CardItem>
                        </CardItem>
                    </Content> 
                </Container>
            </StyleProvider>
        )
    }
  }

  export default Single