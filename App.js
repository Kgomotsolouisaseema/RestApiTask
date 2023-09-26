import 'react-native-gesture-handler';        //Rememebr to uncomment when routing to pages later 
// import Reanimated from 'react-native-reanimated';

import { StyleSheet } from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandPage from './components/LandPage';
import SignUp from './components/SignUp';
// import SignOut from './components/SignOut'; // added the function to the audio journal page
import SignIn from './components/SignIn';
import AudioJournal from './components/AudioJournal';


export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer initialRouteName="Home">
      <Stack.Navigator>
        <Stack.Screen name="Home" component={LandPage} /> 
        <Stack.Screen name="SignIn" component={SignIn} />
         <Stack.Screen name="AudioJournal"component={AudioJournal} />
        <Stack.Screen name="SignUp" component={SignUp} />
       
        {/* <Stack.Screen name="SignOut" component={SignOut} /> */}

        
      </Stack.Navigator>


    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
