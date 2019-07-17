import React, {Component} from 'react'
import {View, 
    ListView,
    Keyboard,
    StyleSheet,
    TouchableHighlight,
    Alert,
    FlatList,
    TouchableOpacity,
    Image
    }from 'react-native'
import {Text, Header, Button, Icon, Input, Card, InputGroup, Footer, Left, Right} from 'native-base'
import axios from 'axios'
import { ScrollView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'
import CONSTANT from '../../Url'

export default class Chat extends Component{
    constructor(){
        super()
       
        this.state={
            userId: null,
            groupId:null,
            message:"",
            iconSend: "send",
            time:new Date(),
            messages:[],
            showDeleteButton: false,
            showCancelButton: false,
            showSendButton:false,
            messageId: null,
            groupName:""
        }
       
    }
    componentDidMount(){
        
        const { navigation } = this.props;
        const propsGroupId = navigation.getParam("groupId")
        this.setState({groupId:propsGroupId})

        const propsUserId = navigation.getParam("userId")
        this.setState({userId:propsUserId})

        const propsGroupName = navigation.getParam("groupName")
        this.setState({groupName:propsGroupName})
        
        setInterval(() => {
            this.fetchAll()
        }, 500)
        
    }
    async fetchAll(){
        const token = await AsyncStorage.getItem('@token')
        
        const config = {
            headers: { 
                Authorization: 'Bearer '+token 
            }
        }
        const rest = await axios.get(`${CONSTANT.URL}api/v1/messages/${this.state.groupId}`, config)
        .then(res => {
            this.setState({messages: res.data.data})})
        .catch(err => console.log(err))

        console.log(this.state.messages)
    }
    
    async handleSend(){
        const token = await AsyncStorage.getItem('@token')
        
        const config = {
            headers: { 
                Authorization: 'Bearer '+token 
            }
        }
        const {groupId, message, userId} = this.state
        const rest = await axios.post(`${CONSTANT.URL}api/v1/messages`,{
            userId,
            groupId, 
            message    
        }, config)

        if (rest) {
            this.setState({ message: "", showSendButton:false})  
            Keyboard.dismiss()
        }else{
            alert("gagal simpan")
        }
        // this.refreshState()
    }
    handleDelete(){
        this.confirm()
       
    }
    confirm(){
        Alert.alert(
            'Delete Message',
            'Do you want to proceed?',
            [
              {text: 'No', onPress: () => this.refreshState(), style: 'cancel'},
              {text: 'Yes', onPress: () => this.deleteMessage()},
            ]
          );
    }
    async deleteMessage(){
        const token = await AsyncStorage.getItem('@token')
        
        const config = {
            headers: { 
                Authorization: 'Bearer '+token 
            }
        }
        const rest = await axios.delete(`${CONSTANT.URL}api/v1/messages/${this.state.messageId}`, config)

        if(rest){
            alert("Pesan berhasil dihapus")
        }else{
            alert("Gagal hapus")
        }
        this.refreshState()
    }
    handleCancel(){
        this.refreshState()
    }
    refreshState(){
        this.setState({showDeleteButton:false, showCancelButton:false, message:""})
        Keyboard.dismiss()
    }
    
    
    handleLongPress(message){
        
        this.setState({showDeleteButton:true, messageId: message.id})
        
    }
    
    handleMessage(message){
        this.setState({message:message})
        message.length > 0 ?this.setState({showSendButton:true}):this.setState({showSendButton:false})
        
        console.log(message.length)
    }
    handleBackToHome(){
        this.props.navigation.navigate('Home')
    }
    
    render(){
        return(
            
            <View style={styles.container}>
                
                <Header style={styles.header}>
                    <Left>
                        <View style={styles.viewHeader}>
                            <Button transparent
                                    onPress={() => this.handleBackToHome()}>
                                <Icon type="MaterialIcons"
                                    name="arrow-back"/>
                            </Button>
                            <Image source={require('../asset/img/group_icon2.png')} 
                                                style={styles.groupIcon}/>
                            <Text style={styles.textHeader}>{this.state.groupName}</Text>
                        </View>
                    </Left>
                    <Right>
                        {this.state.showDeleteButton && 
                            <View style={{flexDirection:'row'}}>
                                <Button transparent style={styles.buttonDelete} 
                                        onPress={()=> this.handleDelete()}>
                                    <Icon type="AntDesign"
                                        name="delete"/>
                                </Button>
                                <Button transparent style={styles.buttonCancel} 
                                    onPress={()=> this.handleCancel()}>
                                    <Icon type="MaterialIcons"
                                        name="cancel"/>
                                </Button>
                            </View>
                        }    
                    </Right>
                </Header>
                <View style={{flex:8}}>
                    {/* <ScrollView>
                          {this.state.messages.map(message => (
                            // <ScrollView>
                            //     <TouchableHighlight onLongPress={messge.user_id == this.state.userId ?()=>this.handlePress(message):null}
                            //             style={styles.touchable}>
                            //         <View style= {message.user_id == this.state.userId ? styles.chatViewRight : styles.chatViewLeft}>
                            //             <Text style={styles.textName}>Username</Text>
                            //             <Text style={styles.textChat}>Message</Text>
                            //         </View>
                            //     </TouchableHighlight>
                            // </ScrollView> 
                            
                                <TouchableHighlight style={styles.touchable}>
                                    <View style={message.user_id == this.state.userId?styles.chatViewRight:styles.chatViewLeft}>
                                        <Text style={message.user_id == this.state.userId?styles.textNameRight:styles.textNameLeft}>
                                            {message.username}
                                        </Text>
                                        <Text style={message.user_id == this.state.userId?styles.textChatRight:styles.textChatLeft}>
                                            {message.chatText}
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            
                        ))} 
                    </ScrollView> */}
                    
                    <FlatList inverted
                        data={this.state.messages}
                        renderItem={({ item }) => (
                            <TouchableOpacity onLongPress={item.user_id == this.state.userId ?()=>this.handleLongPress(item):null}
                                style={styles.touchable}>
                                <View style={item.user_id == this.state.userId?styles.chatViewRight:styles.chatViewLeft}>
                                    <Text style={item.user_id == this.state.userId?styles.textNameRight:styles.textNameLeft}>
                                        {item.username}
                                    </Text>
                                    <Text style={item.user_id == this.state.userId?styles.textChatRight:styles.textChatLeft}>
                                        {item.chatText}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                    
                    
                </View>
                    <Footer>
                        <View style={styles.footerView}>
                            <Input placeholder={"Type here..."}
                                        style={styles.textType}
                                        value={this.state.message}
                                        onChangeText={(message)=>this.handleMessage(message)} />
                            {/* <Button style={styles.buttonSend} 
                                onPress={this.state.iconSend == "send"?()=>this.handleSend():()=>this.handleEdit()}>
                                <Icon type="MaterialIcons" 
                                    name={this.state.iconSend}/>
                            </Button> */}
                            {this.state.showSendButton &&
                                <Button style={styles.buttonSend} 
                                    onPress={()=>this.handleSend()}>
                                    <Icon type="MaterialIcons" 
                                        name={this.state.iconSend}/>
                                </Button>
                            }
                        </View>
                    </Footer>
                    
                </View>       
        )
    }
}
let styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: '#e3e5e8'
    },
    textType:{
        flex: 8
    },
    header:{
        backgroundColor:'#126cfc'
    },
    viewHeader:{
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center'
    },
    groupIcon:{
        height: 25,
        width: 25,
        borderRadius:10,
        alignSelf:'center'
    },
    chatViewLeft:{
        backgroundColor: 'white',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius:25,
        borderTopRightRadius:25,
        alignSelf:'flex-start',
        margin: 10,
        minWidth:'25%',
        maxWidth:300
    },
    chatViewRight:{
        backgroundColor:'#f7ef52',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius:25,
        borderTopLeftRadius:25,
        alignSelf:'flex-end',
        margin: 10,
        minWidth:'25%',
        maxWidth:300
    },
    buttonSend:{
        height: 60,
        backgroundColor:'#edb602'
    },
    buttonLogout:{
        backgroundColor: '#edb602'
    },
    buttonDelete:{
        backgroundColor: '#edb602'
    },
    buttonCancel:{
        backgroundColor: '#edb602'
    },
    footer:{
        backgroundColor: 'white'
    },

    footerView:{
        flex:2, 
        flexDirection:'row', 
        justifyContent:'center',
        alignItems:'center', 
        backgroundColor:'white'
    },
    touchable:{
        
    },
    textHeader:{
        fontSize:20,
        color:'white',
        fontWeight:'bold',
        left:10,
        alignSelf:'center'
    },  
    textNameLeft:{
        fontWeight: 'bold',
        left: 5,
        paddingLeft: 5,
        paddingBottom: 5,
        paddingRight: 5,
    },
    textChatLeft:{
        left:5,
        paddingBottom:10,
        paddingRight:15,
        paddingLeft:5,
    },
    textNameRight:{
        fontWeight: 'bold',
        right: 5,
        paddingLeft:15,
        paddingBottom: 5,
        paddingRight: 15,
        alignSelf:'flex-end'
    },
    textChatRight:{
        right:5,
        paddingBottom:10,
        paddingLeft:15,
        paddingRight:15,
        alignSelf:'flex-end'
    }

})