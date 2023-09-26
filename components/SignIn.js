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
import { auth, googleProvider } from "../Firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import googleButton from "../assets/googleButton.png";

export default function SignIn() {
  const navigation = useNavigation();



  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        //user is not signed in , navigate to audiojournal
        navigation.navigate("AudioJournal");
      } else {
        Alert.alert("user sigend in");
      }
    });
    //clean up subscription when component mounts
    return () => unsubscribe();
  }, []); //Empty dependency

  const handleSignUp = () => {
    navigation.navigate("SignUp"); //navigate to signIn page
    console.log("Proceed btn pressed ,to Audi Journal");
  };

  const handleForgotPassword = () => {
    console.log("password forgot");
  };

  const signinPg = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("Proceed btn pressed to Audio Journal");
        navigation.navigate("AudioJournal"); //navigate to signIn page
      })
      .catch((error) => {
        Alert.alert("Error siging In ");
        console.log("Error siging In ", error);
      });
  }; // signing end bracket

  const signinwithgoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigation.navigate("AudioJournal"); //navigate to signIn page
      console.log("Proceed btn pressed ,to Audi Journal");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  }; //google end bracket

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
            <Pressable style={styles.actionButton} onPress={() => signinPg()}>
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
