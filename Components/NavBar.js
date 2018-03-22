import React, { Component } from 'react';
import { Container, Header, Text, Left, Right, Body, Title, StyleProvider, Button, Icon, Drawer } from 'native-base';
import { Dimensions, Share, Linking} from 'react-native'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import { Actions } from 'react-native-router-flux'

export default class NavBar extends Component {
 
    render() {
        return (
            <StyleProvider style={getTheme(material)}>
              <Header style={{marginTop: '5%', backgroundColor: 'rgba(0, 0, 0, 0)'}}>
                <Left>
                  <Icon name="md-menu" style={{marginLeft: '16%', fontSize: (( Dimensions.get('window').height) * 0.03)}} onPress={() => Actions.drawerOpen()} />
                </Left>
                <Body>
                  <Title style={{marginLeft: '-16%', fontSize: (( Dimensions.get('window').height) * 0.024)}}>Paperstack</Title>
                </Body>
                <Right>
                  <Button iconRight transparent onPress={() => Actions.search()}>
                    <Icon name="search" style={{fontSize: (( Dimensions.get('window').height) * 0.024)}} />
                  </Button>
                </Right>
              </Header>
            </StyleProvider>
        )
    }
   
}

