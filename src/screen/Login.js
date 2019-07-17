import React, {Component} from 'react'
import {TextInput,
    View,
    StyleSheet,
    TouchableOpacity
    } from 'react-native'
import {Container, Header, Content, Form, Item, Input, Label, Button, Text, Icon} from 'native-base'
import axios from 'axios'
import CONSTANT from '../../Url'
import AsyncStorage from '@react-native-community/async-storage'

export default class Login extends Component{
    constructor(){
        super()
        this.state={
            username:"",
            password:"",
            response:[],
            showPassword:false
        }
    }
    async componentWillMount(){
        const token = await AsyncStorage.getItem('@token')
        if(token != undefined){
            const config = {
                headers: { 
                    Authorization: 'Bearer '+token 
                }
            }
            const rest = await axios.get(`${CONSTANT.URL}api/v1/auth`, config)
            .then(res => {     
                this.setState({response: res.data})
                this.props.navigation.navigate('Home',{
                    user_id: this.state.response.id
                })
            })
            .catch(err => {console.log(err)})
            
        }
        
        

        // if(rest){
        //     this.props.navigation.navigate('Home',{
        //         this.state.response.id
        //     }) 
            
        // }
    }
    
    async handleLogin(){
        const username = this.state.username
        const password = this.state.password
        const rest = await axios.post(CONSTANT.URL+'api/v1/login', {
        username,
        password
        })
        .then(res => {
        this.setState({response: res.data})
        })
        .catch(err => {
            alert("Username atau password salah")
            console.log(err)
        })

        if(this.state.response.token.token != undefined){
            await AsyncStorage.setItem('@token', this.state.response.token.token)
            console.log("Token pas login")
            console.log(this.state.response.token.token)
            let user_id = this.state.response.user.id
            
            this.props.navigation.navigate('Home',{
                user_id
            })
        }else{
            alert("Username atau password salah")
            // await AsyncStorage.setItem('@token', undefined)
        }
        
    }
    showPassword(){
        {this.state.showPassword==false?this.setState({showPassword:true}):this.setState({showPassword:false})}
        
    }
    render(){
        return(
           <Container style={styles.container}>
               <Text transparent style={styles.labelLogo}>ChatApp</Text>
               
                <Content style={styles.content}>
                    <Form style={styles.form}>
                        <Item>
                            <Icon type="SimpleLineIcons"
                                name="user"
                                size={25}
                                style={styles.iconUser}/>
                            <Input style={styles.inputUsername}
                                    value={this.state.username}
                                    onChangeText={(username) => this.setState({username})}
                                    placeholder={"Username"}
                                    placeholderTextColor={'white'}/>
                        </Item>
                        <Item>
                            <Icon type="SimpleLineIcons"
                                    name="lock"
                                    size={25}
                                    style={styles.iconLock}/>
                            <Input style={styles.inputPassword}
                                    value={this.state.password}
                                    onChangeText={(password) => this.setState({password})}
                                    secureTextEntry={this.state.showPassword==false?true:false}
                                    placeholder={"Password"}
                                    placeholderTextColor={'white'}/>
                            <TouchableOpacity onPress={()=>this.showPassword()}>
                                <Icon type="Entypo"
                                    name={this.state.showPassword==false?"eye":"eye-with-line"}
                                    size={25}
                                    style={styles.iconEye}/>
                            </TouchableOpacity>
                        </Item>
                    </Form>
                    <Button style={styles.button}
                        onPress={()=>this.handleLogin()}>
                        <Text styles={{textAlign:'center'}}>Log in</Text>
                    </Button>
                </Content>
            </Container>   
        )
    }
}
let styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        // backgroundColor:'#e07509'
        backgroundColor:'#126cfc',
    },
    topView:{
        flex: 8,
        // justifyContent:'center',
        // alignItems:'center',
        margin: 10,
    },
    button:{
        backgroundColor:'#ffb300',
        width: 400,
        textAlign: 'center',
        alignItems:'center',
        justifyContent:'center',
        marginTop: 80
    },
    content:{
        
    },
    inputUsername:{
        // borderBottomWidth: 1,
        borderColor: 'white',
        fontSize:14,
        color:'white',
    }, 
    inputPassword:{
        // borderBottomWidth: 1,
        borderColor: 'white',
        color:'white',
        fontSize:14,
        
    },
    iconUser:{
        color:'white',
    },
    iconLock:{
        color:'white'
    },
    iconEye:{
        color:'white'
    },  
    form:{
        marginTop:50,
        
    },
    labelLogo:{
        marginTop:80,
        fontSize: 30,
        fontWeight:'bold',
        backgroundColor:'#126cfc',
        color:'white'
    }
})