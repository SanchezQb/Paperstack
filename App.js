import React, { Component } from 'react';
import { Router, Scene, Stack, Drawer } from 'react-native-router-flux';
import Feed from './Components/Feed'
import Category from './Components/Category'
import Single from './Components/Single';
import Search from './Components/Search';
import Collection from './Components/Collection';
import Popular from './Components/Popular';
import DrawerContent from './Components/DrawerContent'
import NavBar from './Components/NavBar';
import PropTypes from 'prop-types'
import OneSignal from 'react-native-onesignal'
import { BackHandler, Text, View, StatusBar, Dimensions } from 'react-native';

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string
}
const TabIcon = (props) => {
  return (
    <View >
      <Text style={{color: props.focused ? '#198c8c' :'#ccc', fontSize: (Dimensions.get('window').height) * 0.016}}>{props.title}</Text>
    </View>
    
  );
}


export default class App extends Component {
  componentDidMount () {
    OneSignal.configure({})
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress () {
   BackHandler.exitApp()
  }
  
  render() {
    const width = (Dimensions.get('window').height / 2.7)
    return (
      <View style={{flex: 1,}}>
        <StatusBar
          backgroundColor="rgba(0, 0, 0, 0)"
          translucent={true}
          />
        <Router titleStyle={{color: '#fff'}} sceneStyle={{backgroundColor: '#222'}}>
          <Drawer
                hideNavBar
                key="root"
                contentComponent={DrawerContent}
                drawerWidth={width}
                hideDrawerButton={false}
              >
          <Stack key="root2" tintColor="#222" navBar = {NavBar} tabBarStyle={{ backgroundColor: '#222'}}>
              <Scene 
                key = "tabbar"
                tabs = {true}
                activeTintColor="teal"
                inactiveTintColor="#ccc"
                labelStyle={{fontSize: 13}}
                showLabel={false}
                icon={TabIcon}
                >
                <Scene key = "feed" title = "FEED" >
                  <Scene key="feed" component={Feed} title="Feed" hideNavBar= {true} />
                </Scene>
                <Scene key = "category" title = "CATEGORY">
                  <Scene key="category" component={Category} title="Category" hideNavBar= {true} />
                </Scene>
                <Scene key = "popular" title = "POPULAR">
                  <Scene key="popular" component={Popular} title="Popular" hideNavBar= {true} />
                </Scene>
              </Scene>
                <Scene key="single" component={Single} title="Single" hideNavBar= {true} />
                <Scene key="search" component={Search} title="Search" hideNavBar= {true}  />
                <Scene key="collection" component={Collection} title="Collection" hideNavBar= {true}  />  
          </Stack>
          </Drawer>
        </Router>
      </View>
    )
  }
}