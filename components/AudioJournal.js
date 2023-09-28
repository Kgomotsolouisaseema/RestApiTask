import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  Alert,
} from "react-native";
import { Audio, getStatusAsync } from "expo-av";
import theicon from "../assets/theicon.jpg";
import { TouchableOpacity } from "react-native";

const RecordingOptions = {
  isMeteringEnabled: true,
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
};

const projectId = "audio-recorder-restapi";
const apiKey = "AIzaSyBOtZWA25ABIVdRDw56v4oo2tRgbssw49g";
const collectionName = "Recordings";
const  storageBucket= "audio-recorder-restapi.appspot.com";

const AudioRecorder = () => {
  const navigation = useNavigation();

  const [currentUser, setUser] = useState(null);
  const [recording, setRecording] = useState(null);
  const [audioTitle, setAudioTitle] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [selectedAudioURL, setSelectedAudioURL] = useState(null);
  const [recordings, setRecordings] = useState([
    { id: 1, title: "Recording 1" },
  ]);
  // const [isRecording, setIsRecording] = useState(false);
  const [sound, setSound] = useState(null);

  // const firebaseBaseUrl = "https://identitytoolkit.googleapis.com/v1/accounts";

  useEffect(() => {
    const firebaseAuthCheckUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?key=${apiKey}`;

    // `https://firestore.googleapis.com/v1/projects/audio-recorder-restapi/databases/(default)/documents/Recordings?key=AIzaSyBOtZWA25ABIVdRDw56v4oo2tRgbssw49g`;


    const checkUserAuthenticated = async () => {
      try {
        const user = currentUser;
        if (!user) {
          //User is not authenticated ,set user to null and return
          setUser(null);
          return;
        }
        //Retrieve the id token
        const idToken = await user.getIdToken();
        //make a GET request to your REST API TO CHECK if user is authenticated
        const response = await fetch(firebaseAuthCheckUrl, {
          method: "GET", //using GET method for retrieving data
          headers: {
            "Content-Type ": "application/json",
            //Include the ID token in the authentication header
            Authorization: `Bearer ${idToken}`,
          },

          body: JSON.stringify({
            currentUser: user.uid,
          }),
        });
        if (response.ok) {
          //user authenticated ,  handle response or set user
          const data = await response.json();
          setUser(data.user); //Update the user state the authenticated user data
        } else {
          //user not authenticated
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking user authentication:", error);
      }
    };

    checkUserAuthenticated();
  }, []);

  // const loadRecordings = async () => {
  //   try {
  //     console.log("loading recordings function")
  //     const firestoreDatafetch = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?key=${apiKey}`;
  //     //Make a Get request to your REST API endpoint to fetch recordings
  //     const response = await fetch(firestoreDatafetch, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //       },
  //     });
  //     if (response.ok) {
  //       //if the response is successfull (status code 200),parse the JSON data
  //       const data = await response.json();

  //       //Assume that the api response returns an array of recordings
  //       setRecording(data); //update state with loaded recordeings
  //     } else {
  //       console.error("Error loading recordings:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error loading recordings: ", error);
  //   }
  // };

  // useEffect(() => {
  //   loadRecordings();
  // }, []);

  

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const recordingObject = new Audio.Recording();
        await recordingObject.prepareToRecordAsync(RecordingOptions);
        await recordingObject.startAsync();
        setRecording(recordingObject);
        console.log("Recording started..");
      } else {
        console.warn("Audio recording permission not granted.");
      }
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  }

  const timeoutDuration = 300000; // Timeout duration in milliseconds

  // Define a function to create a timeout promise
  function createTimeoutPromise(timeout) {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timed out")); // You can customize the error message
      }, timeout);
    });
  }

  const timeoutPromise = createTimeoutPromise(timeoutDuration);

  async function stopRecording() {
    console.log("Stopping recording..");

    if (!recording) {
      console.warn("Recording is not active.");
      return;
    }

    try {
      //stop the recording here
      await recording.stopAndUnloadAsync();

      //SET AUDIO MODE TO DISALLOW RECORDING
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

        const {status } = await recording.createNewLoadedSoundAsync();
        
        // console.log("Recording uploading success:", responseData);

        const uri = recording.getURI();

        // Fetch the audio recording file as a Blob
        const recordingBlob = await fetch(uri).then((res) => res.blob());

         // SAVING TO FIREBASE STORAGE ALSO
         const storageEndpoint = `https://firebasestorage.googleapis.com/v1/b/${storageBucket}/o/${encodeURIComponent(audioTitle)}`;

         const storageResponse = await fetch(storageEndpoint, {
           method: "POST",
          headers: {"Content-Type": "application/json"},
           body: recordingBlob,
         });

         const data = await storageResponse.json();
         console.log(data)
         try {
            let recordingUrl = ""
             const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${encodeURIComponent(audioTitle)}?alt=media&token=${data.downloadTokens}`;
             recordingUrl = downloadUrl;
             console.log('File uploaded successfully. Download URL:', recordingUrl);
             setSelectedAudioURL(recordingUrl);
         } catch (err){
             console.log('File did not upload' , err);
         }


        //MAKE AN POST REQUEST TO CREATE A NEW DOCUMENT IN FIRESTORE
        const firestoreEndpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?&key=${apiKey}`;
       const audipUrl = '12'
        const firestoreData = {
          "fields": {
            "title": { 
            "stringValue": `${audioTitle}` 
          },
          "duration": {
            "stringValue":`${getDurationFormatted(status.durationMillis)}`
          },
            "url": {
              "stringValue": `${selectedAudioURL}`
            }
          }
        };

        const firestoreResponse = await fetch(firestoreEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(firestoreData),
        });


       

        if (storageResponse) {
          //Succefully uploaded the audio to firebase storage
          console.log("Audio recording uploaded to firebase storage.");
        } else {
          //Error handling for uploading audio
          console.error(
            "Error uploading audio recording to firebase storage:",
            storageResponse.status,
            storageResponse.statusText
          );
        }
      // } else if (response.status === 401) {
        //Unathorized error ,user needs to log in again
        console.error("Unauthorized. Please log in again.");
        //Maybe navigate the user to a login screen
        navigation.navigate("Home");
      // } else {
        //HANDLE OTHER STATUS CODES ECT
        console.error(
          "Error uploading recording: ",
          response.status,
          response.statusText
        );
      // }

      //Reseting the audio and AudioTitle
      setRecording(null);
      setAudioTitle("");
    } catch (error) {
      if (error.message === "Request timeout") {
        //Handle timeout error
        console.error("Request timed out. Please try again.");
      } else if (error.message === "Network request failed ") {
        //Network error ,send alert to user
        Alert.alert("Please Check your Network Connection ");
        console.error(
          "Network request failed . Please check you internet connection "
        );
      } else {
        console.error("An error occured:", error);
      }
    }
  } //end of stop recording function
  
   //Get the duration
   function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }


  //Playing Sounds
  async function playSound(downloadURL) {
    try {
      if (!downloadURL) {
        console.warn("Audio URL is null or undefined.");
        return; // Don't attempt to play if the URL is missing
      }

      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync({
        uri: downloadURL,
      });
      setSound(sound);

      console.log("Playing Sound");
      await sound.playAsync();
    } catch (error) {
      console.error("Failed to play sound", error);
    }
  }

  useEffect(() => {
    return () => {
      if (sound) {
        console.log("Unloading Sound");
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const editRecordingTitle = (index) => {
    console.log("edit btn clicked ");
    setEditTitle(index);
    setAudioTitle(recordings[index].title);
  };

  //edit title function
  const updateTitle = async (index, id) => {
    const record = recordings[index];
    console.log("edit btn clicked ", record);

    try {
      await updateDoc(doc(db, "recordings", record.id), {
        title: audioTitle,
      });

      const updatedRecordings = [...recordings]; // Create a copy of recordings
      updatedRecordings[index].title = audioTitle; // Update the title in the copied array
      setRecordings(updatedRecordings); // Set the updated array
      setEditTitle(""); // Clear the edit title state
    } catch (error) {
      console.error("Error editing recording title", error);
    }
  };

  const deleteRecording = async (id) => {
    try {
      await deleteDoc(doc(db, "recordings", id));
      const updatedRecordings = recordings.filter(
        (recording) => recording.id !== id
      );
      setRecordings(updatedRecordings);
    } catch (error) {
      console.error("Error deleting recording", error);
    }
  };

  const logout = async () => {
    try {
      await auth.signOut().then(() => {
        console.log("Signed out success");
        navigation.navigate("Home");
      });
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  }; //google end bracket

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.titleNew}
        placeholder="New Title"
        value={audioTitle}
        onChangeText={(text) => setAudioTitle(text)}
      />
      <View style={styles.ImageContainer}>
        <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
          <Image source={theicon} style={styles.imagePress} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recordings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => {
          try {
            return (
              <View key={index} style={styles.listItem}>
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => setSelectedAudioURL(item.url)}
                >
                  <Text>{item.title}</Text>
                </TouchableOpacity>

                {editTitle === index ? (
                  <TouchableOpacity
                    style={styles.btn}
                    title="Edit"
                    onPress={() => updateTitle(index, item.id)}
                  >
                    <Text style={styles.btntext}>Update</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.btn}
                    title="Edit"
                    onPress={() => editRecordingTitle(index)}
                  >
                    <Text style={styles.btntext}>Edit</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.btn}
                  title="Delete"
                  onPress={() => deleteRecording(item.id)}
                >
                  <Text style={styles.btntext}>Delete</Text>
                </TouchableOpacity>
              </View>
            );
          } catch (error) {
            console.error("Error rendering FlatList item:", error);
            return null;
          }
        }}
      />
      <View>
        <TouchableOpacity
          style={styles.titleNew}
          title="Play"
          onPress={() => playSound(selectedAudioURL)}
        >
          <Text style={styles.signIn}>Play Sound</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.titleNew} title="Logout" onPress={logout}>
        <Text style={styles.signIn}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFEBCD", //blanched Almond color
    alignItems: "center",
    justifyContent: "center",
  },
  ImageContainer: {
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    // flex: 2,
    marginTop: 100, //moves the image in the center of the page
  },
  imagePress: {
    width: 280,
    height: 280,
    borderRadius: 100,
    padding: 15,
  },
  //STYLES FOR THE AREA WHERE I PUT IN THE TITLE OF THE AUDIO
  titleNew: {
    // backgroundColor:"red",
    borderColor: "#654321",
    borderWidth: 4,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyItems: "center",
    textAlign: "center",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#654321", //Dark Brown color for the line around the recording names
  },
  btn: {
    backgroundColor: "#654321",
    marginHorizontal: 12,
    width: 52,
    borderRadius: 10,
  },
  btntext: {
    color: "white",
    textAlign: "center",
    margin: 5, //gives the space ,
  },
  input: {
    flex: 1,
    borderWidth: 3,
    borderColor: "#654321",
    padding: 5,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  // actionContainer: {
  //   height: 60,
  //   marginTop: 10,
  //   borderRadius: 10,
  //   backgroundColor: "red",
  //   justifyContent: "center", //ALIGNS THE  CONTENT IN THE BUTTON IN THE CENTER ?
  //   alignItems: "center", //MOVES THE WHOLE BUTTON TO THE CENTER OF THE PAGE
  // },
  signIn: {
    color: "black",
    fontSize: 19,
    fontWeight: "bold",
  },
});

export default AudioRecorder;
