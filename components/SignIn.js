import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Pressable,
  Image,
  Alert,
} from "react-native";

import googleButton from "../assets/googleButton.png";

export default function SignIn() {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userToken, setUserToken] = useState(null);


   const firebaseBaseUrl = "https://identitytoolkit.googleapis.com/v1/accounts";

   const FIREBASE_API_KEY = "AIzaSyBOtZWA25ABIVdRDw56v4oo2tRgbssw49g"; // My API key
   
   const checkAuthentication = async () => {
     try {
       const firebaseAuthCheckUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`;
   
       // Make a GET request to the Firebase Authentication REST API to check user authentication
       const response = await fetch(firebaseAuthCheckUrl, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           idToken:userToken,
         }),
       });
   
       if (response.ok) {
         // User is authenticated, navigate to the "Audio Journal" page
         setUserToken(userToken); // Store the user's ID token in the state
         navigation.navigate("AudioJournal");
       } else {
         // User not authenticated
         Alert.alert("User not signed in");
       }
     } catch (error) {
       Alert.alert("Error checking authentication state");
       console.error("Error checking authentication state", error);
     }
   };
   
   //  useEffect to run the checkAuthentication function when the component mounts
   useEffect(() => {
     checkAuthentication();
   }, []); // The empty dependency array ensuring it only runs once when the component mounts
   
 

  const  signInWithEmail = () =>{
    //constructing the request payload (body of the communication)
    const requestBody = {
      email: email ,
      password: password,
      returnSecureToken : true,
    };

    //make POST request to Firebase REST API FOR EMAIL AND PASSWORD sign-in
    fetch(`${firebaseBaseUrl}:signInWithPassword?key=${FIREBASE_API_KEY}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
    .then((response)=> response.json())
    .then((data)=>{
      if(data.idToken){
        //  set the user's ID token in the state
        setUserToken(data.idToken);
        //Succefull sign-in , navigate to the next screen
        navigation.navigate("AudioJournal");
      }else{
        Alert.alert("Error siging in");
        console.log("Error signing in " , data.error)
      }
    })
    .catch((error)=>{
      Alert.alert("Error signing in");
      console.log("Error signing in" , error);
    });

  };


  //Other Functions to  handle signing in Buttons 

  const handleSignUp = () => {
    navigation.navigate("SignUp"); //navigate to signIn page
    console.log("Proceed btn pressed ,to Audi Journal");
  };

  const handleForgotPassword = () => {
    console.log("password forgot");
  };


  const signinwithgoogle = async () => {
    console.log("Sign in with google")
    //Implement this logic when your all done and you are adding touches to your project , usign Rest API 
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image
          style={styles.image}
          source={require("../assets/blackcasset.jpg")}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={styles.actionContainer}>
            <Pressable style={styles.actionButton} onPress={signInWithEmail}>
              <Text style={styles.signIn}>SIGN IN </Text>
            </Pressable>

            <TouchableOpacity onPress={() => signinwithgoogle()}>
              <Image source={googleButton} style={styles.actionButton} />
            </TouchableOpacity>
          </View>
          <View style={styles.navlogs}>
            <View style={styles.signUpOpt}>
              <Text style={styles.noAccText}>Haven't Signed Up? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.forgotPassWordCont}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassWordText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFEBCD", //blanched Almond color
    alignItems: "center",
  },
  topContainer: {
    height: 280,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },
  appName: {
    // color: "white",
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "C",
    alignItems: "center",
  },
  image: {
    width: 350,
    height: 280,
    borderRadius: 100,
  },

  bottomContainer: {
    flex: 1,
    width: "50%",
    // backgroundColor: "red",
    alignItems: "center",
  },

  innerContainer: {
    height: 380,
    // backgroundColor:"#CD7F32", //BRONZE
    borderRadius: 25,
    padding: 20,
    width: 320,
  },
  textInput: {
    //fields for email and password
    borderRadius: 15,
    // borderColor: "#654321", ///Dark Brown
    borderWidth: 1,
    padding: 10,
    height: 40,
    marginVertical: 12, //spaces in between the input areas
  },

  actionContainer: {
    height: "40%",
    marginTop: 10,
    // backgroundColor: 'red', //include these for checking purposes
    justifyContent: "center",
  },

  actionButton: {
    backgroundColor: "#654321", //Dark Brown color
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    width: 295, //width of the save button ,
    height: 47,
    marginVertical: 13,
  },

  signIn: {
    color: "#FFF",
    fontSize: 19,
    fontWeight: "bold",
  },
  navlogs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 8,
  },

  signUpOpt: {
    flexDirection: "row",
    alignItems: "center",
  },
  forgotPassWordCont: {
    flexDirection: "row",
    alignItems: "center",
    // alignContent: "center",
    // flex: 2,
  },
  forgotPassWordText: {
    color: "blue",
    textDecorationLine: "underline",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    // textAlignVertical: 5 ,
  },
});
