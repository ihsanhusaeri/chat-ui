import React, {Component} from 'react'
import {
    StyleSheet,
    View,
    Text,
    Image,
    BackHandler, 
    TouchableOpacity,
    FlatList
}from 'react-native'
import {
    Header,
    Left,
    Icon,
    Button,
    Right
}from 'native-base'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import CONSTANT from '../../Url'
import {ListItem} from 'react-native-elements'
import Dialog, {DialogContent} from 'react-native-popup-dialog'

export default class Home extends Component{
    constructor(){
        super()
        this.state={
            userId:null,
            groups:[],
            message:[],
            dialogVisible:false
        }
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackPress);
      }
    componentDidMount(){
        const { navigation } = this.props;
        const propsId = navigation.getParam("user_id")
        this.setState({userId:propsId})
        
        this.fetchAllGroup() 
    }
    handleBackPress = () => {
        BackHandler.exitApp();
        return true;
    }
    async fetchAllGroup(){
        const token = await AsyncStorage.getItem('@token')
        
        //console.log(token)
        const config = {
            headers: { 
                Authorization: 'Bearer '+token 
            }
        }
        const rest = await axios.get(`${CONSTANT.URL}api/v1/groups/${this.state.userId}`, config)
        .then(res => {
            this.setState({groups: res.data.groups})})
        .catch(err => console.log(err))

        // console.log(this.state.groups)
        
    } 
    handlePressView(group){
        const idUser = this.state.userId
        this.props.navigation.navigate('Chat',{
            groupId:group.id,
            groupName:group.name,
            userId:this.state.userId
        })
    }
    handleLogout(){
        AsyncStorage.clear()
        this.props.navigation.navigate('Login')
    }
    render(){
        return(
            <View style={styles.container}>
                <Header style={styles.header}>
                <Left style={styles.leftHeader}>
                    <View>
                        <Text style={styles.headerText}>ChatApp</Text>
                    </View>
                </Left>
                <Right>
                    <Button transparent
                        onPress={()=> this.setState({dialogVisible:true})}>
                        <Icon type="SimpleLineIcons"
                            name="options-vertical"/>
                    </Button>
                </Right>        
                </Header>
                <View style={styles.viewBody}>
                    {/* <ScrollView>
                        {this.state.groups.map(group =>(
                        
                            <TouchableOpacity onPress={()=>this.handlePressView(group.id)}
                                            key={group.id}>
                                <View style={styles.groupView}>
                                    <View style={styles.groupImage}>
                                        <Image source={require('../asset/img/group_icon2.png')} 
                                            style={styles.groupIcon}/>
                                    </View>
                                    <View style={styles.groupTextView}>
                                        <Text style={styles.groupTitle}>{group.name}</Text>
                                        <Text style={styles.lastGroupChat}>Last Group Chat</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        
                        ))}   
                    </ScrollView> */}
                    <FlatList 
                        data={this.state.groups}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={()=>this.handlePressView(item)}
                                            key={item.id}>
                                <View style={styles.groupView}>
                                    <View style={styles.groupImage}>
                                        <Image source={require('../asset/img/group_icon2.png')} 
                                            style={styles.groupIcon}/>
                                    </View>
                                    <View style={styles.groupTextView}>
                                        <Text style={styles.groupTitle}>{item.name}</Text>
                                        <Text style={styles.lastGroupChat}>Last Group Chat</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View> 
                <Dialog
                    style={styles.dialog}
                    visible={this.state.dialogVisible}
                    onTouchOutside={()=>{
                        this.setState({dialogVisible:false})
                    }}
                    >
                    <DialogContent style={styles.dialogContent}>
                        <View style={styles.viewDialogContent}>
                            <Icon type="AntDesign"
                                name="logout"
                                style={styles.iconLogout}/>
                            <Button full transparent
                                style={styles.buttonDialog}
                                onPress={()=>{
                                    this.setState({dialogVisible:false})
                                    this.handleLogout()
                                }}
                            >
                            <Text style={styles.textLogout}>Logout</Text>
                            </Button>
                        </View>
                    </DialogContent>
                </Dialog>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header:{
        backgroundColor:'#126cfc',
    },
    headerText:{
        fontWeight:'bold',
        fontSize: 20,
        color:'white'
    },
    leftHeader:{
        alignItems: 'flex-start',
        justifyContent:'flex-start',
        
    },
    viewHeader:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
    buttonLogout:{
        right:20
    },
    viewBody:{
        flex: 8,
        alignItems:'flex-start',
        justifyContent: 'flex-start'
    },
    groupIcon:{
        height: 40,
        width: 40,
    },
    groupView:{
        flexDirection:'row',
        flex:1,
    },
    groupImage:{
        padding: 10
    },
    groupTextView:{
        borderBottomColor: 'grey',
        borderBottomWidth: 0.6,
        width: 340,
    },
    groupTitle:{
        fontWeight: 'bold',
        fontSize: 16,
        paddingTop:5,
        paddingBottom: 3
    },
    lastGroupChat:{
        fontSize:14,

    },
    buttonDialog:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
    },
    dialog:{
        alignItems:'center', 
        justifyContent:'center'
    },
    dialogContent:{
        height:100, 
        width:200, 
        alignItems:'center',
        justifyContent:'center'
    },
    viewDialogContent:{
        flexDirection:'row',
        alignContent:'center',
        justifyContent:'center'
    },
    iconLogout:{
        paddingRight:10,
        right:10, 
        transform: [{ rotate: '180deg'}],
        color:'red'

    },
    textLogout:{
        fontWeight:'bold',
        top:5,
        color:'red'
    }
})
