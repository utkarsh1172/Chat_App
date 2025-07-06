/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
const {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
  } = require('react-native');
  import {useNavigation} from '@react-navigation/native';
  import styles from './style';
  import Feather from 'react-native-vector-icons/Feather';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  import Fontisto from 'react-native-vector-icons/Fontisto';
  import Error from 'react-native-vector-icons/MaterialIcons';
  import {useState} from 'react';
  import axios from 'axios'  
  function RegisterPage({props}) {
    const [name, setName] = useState('');
    const [nameVerify, setNameVerify] = useState(false);
    const [email, setEmail] = useState('');
    const [emailVerify, setEmailVerify] = useState(false);
    const [mobile, setMobile] = useState('');
    const [mobileVerify, setMobileVerify] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState(false);
    const [showPassword, setShowPassword] = useState(true);

      const navigation = useNavigation()
    function  handleSubmit () {
    
      console.log("Worikgn")
      const userData = {
        name:name,
        email:email,
        password:password,
        mobile:mobile
      }
      if(nameVerify && emailVerify && passwordVerify && mobileVerify){
        
      axios.post('http://192.168.1.102:5001/register',userData) 
      .then(res => {console.log(res.data) 
        if(res.data.status === "ok"){
        Alert.alert("Registered Successfullly")
        navigation.navigate('Login')
        
        }
        else(
          Alert.alert(JSON.stringify(res.data))
        )
      })
      .catch(e => { console.log("Error:", e)
        Alert.alert("Error",JSON.stringify(e.data))
      }) }
      else{
        Alert.alert("Filll the Details first")
      }
    }
  
    function handleName(e) {
      const nameVar = e.nativeEvent.text;
      setName(nameVar);
      setNameVerify(false);
  // eslint-disable-next-line no-trailing-spaces
  
      if (nameVar.length > 1) {
        setNameVerify(true);
      }
    }
    function handleEmail(e) {
      const emailVar = e.nativeEvent.text;
      setEmail(emailVar);
      setEmailVerify(false);
      if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
        setEmail(emailVar);
        setEmailVerify(true);
      }
    }
    function handleMobile(e) {
      const mobileVar = e.nativeEvent.text;
      setMobile(mobileVar);
      setMobileVerify(false);
      if (/[6-9]{1}[0-9]{9}/.test(mobileVar)) {
        setMobile(mobileVar);
        setMobileVerify(true);
      }
    }
    function handlePassword(e) {
      const passwordVar = e.nativeEvent.text;
      setPassword(passwordVar);
      setPasswordVerify(false);
      if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
        setPassword(passwordVar);
        setPasswordVerify(true);
      }
    }
    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={true}
        style={{backgroundColor: 'white'}}>
      
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../../assets/signUp.png')}
            />
          </View>
          <KeyboardAvoidingView
          style={{ flex: 1 }}
              // behavior={Platform.OS === "ios" ? "padding" : "height"}
              // keyboardVerticalOffset={40}
            >
          <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Register!!!</Text>
            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#7d48ff"
                style={styles.smallIcon}
              />
              <TextInput
                placeholder="Name"
                placeholderTextColor="#999" 
                style={styles.textInput}
                onChange={e => handleName(e)}
              />
              {name.length < 1 ? null : nameVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
            </View>
            {name.length < 1 ? null : nameVerify ? null : (
              <Text
                style={{
                  marginLeft: 20,
                  color: 'red',
                }}>
                Name sholud be more then 1 characters.
              </Text>
            )}
            <View style={styles.action}>
              <Fontisto
                name="email"
                color="#7d48ff"
                size={24}
                style={{marginLeft: 0, paddingRight: 5}}
              />
              <TextInput
                placeholder="Email"
                style={styles.textInput}
                placeholderTextColor="#999" 
                autoCapitalize="none" // 
                 keyboardType="email-address"
                onChange={e => handleEmail(e)}
              />
              {email.length < 1 ? null : emailVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
            </View>
            {email.length < 1 ? null : emailVerify ? null : (
              <Text
                style={{
                  marginLeft: 20,
                  color: 'red',
                }}>
                Enter Proper Email Address
              </Text>
            )}
            <View style={styles.action}>
              <FontAwesome
                name="mobile"
                color="#7d48ff"
                size={35}
                style={{paddingRight: 10, marginTop: -7, marginLeft: 5}}
              />
              <TextInput
                placeholder="Mobile"
                placeholderTextColor="#999" 
                style={styles.textInput}
                 keyboardType="phone-pad" 
                onChange={e => handleMobile(e)}
                maxLength={10}
              />
              {mobile.length < 1 ? null : mobileVerify ? (
                <Feather name="check-circle" color="green" size={20} />
              ) : (
                <Error name="error" color="red" size={20} />
              )}
            </View>
            {mobile.length < 1 ? null : mobileVerify ? null : (
              <Text
                style={{
                  marginLeft: 20,
                  color: 'red',
                }}>
                Phone number with 6-9 and remaing 9 digit with 0-9
              </Text>
            )}
            <View style={styles.action}>
              <FontAwesome name="lock" color="#7d48ff" style={styles.smallIcon} />
              <TextInput
                placeholder="Password"
                style={styles.textInput}
                placeholderTextColor="#999" 
                onChange={e => handlePassword(e)}
                secureTextEntry={showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {password.length < 1 ? null : !showPassword ? (
                  <Feather
                    name="eye-off"
                    style={{marginRight: -10}}
                    color={passwordVerify ? 'green' : 'red'}
                    size={23}
                  />
                ) : (
                  <Feather
                    name="eye"
                    style={{marginRight: -10}}
                    color={passwordVerify ? 'green' : 'red'}
                    size={23}
                  />
                )}
              </TouchableOpacity>
            </View>
            {password.length < 1 ? null : passwordVerify ? null : (
              <Text
                style={{
                  marginLeft: 20,
                  color: 'red',
                }}>
                Uppercase, Lowercase, Number and 6 or more characters.
              </Text>
            )}
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
              <View>
                <Text style={styles.textSign}>Register</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
  export default RegisterPage;