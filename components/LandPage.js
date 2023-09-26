import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, StyleSheet, Text, Image, Pressable } from "react-native";

function LandPage() {
  const navigation = useNavigation();

  const navigatetoSignIn =() =>{
    navigation.navigate("SignIn") //navigate to signIn page
    console.log("Proceed btn pressed")
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.appName}> Bubbles Audio Journal</Text>
      </View>
      <View style={styles.middleContainer}>
        <Image style={styles.image} source={require("../assets/retroLady.jpg")} />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.actionContainer}>
        <Pressable
              style={styles.actionButton}
              title="Head to Sign In"
              onPress={navigatetoSignIn}
            >
              <Text style={styles.signIn}>PROCEED</Text>
            </Pressable>

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
  },
  topContainer: {
    // backgroundColor: "blue",
    height: "20%",
    justifyContent: "center",
    alignItems:"center",  //BRING THE NAME TO THE CENTER 
  },
  appName: {
    // color: "white",
    fontSize: 40,
    fontWeight: "bold",
    fontFamily: "C",
    alignItems: "center"
  },
  middleContainer: {
    // backgroundColor:"red",
    height: "60%",
  },
  image: {
    width: '100%',
    height: 440,
    borderRadius: 90,
  },
  bottomContainer: {
    // backgroundColor: "green",
    height: "20%",
  },
  actionContainer:{
    height: 60,
    marginTop: 10,
    justifyContent: "center", //ALIGNS THE  CONTENT IN THE BUTTON IN THE CENTER ?
    alignItems: "center"  //MOVES THE WHOLE BUTTON TO THE CENTER OF THE PAGE 

  },
  actionButton: {
    backgroundColor: "#654321", //Dark Brown color
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    width: 280, //width of the save button ,
    height: 56,
    marginVertical: 12,
  },

  signIn: {
    color: "#FFF",
    fontSize: 19,
    fontWeight: "bold",
  },
});

export default LandPage;
