import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
//Main
import Interactions from '../pages/interaction';
import Admin from '../pages/admin';
// Profile/interaction
import ConsultorProfile from '../pages/interaction/profile/consultor';
import ClientProfile from '../pages/interaction/profile/client';
import ConversationConsultor from '../pages/interaction/conversations/consultor/conversation';
import ConversationClient from '../pages/interaction/conversations/client/conversation';
//Request
import RequestConsultorDescription from "../pages/interaction/requests/consultor/requestDescription";
import RequestClientDescription from '../pages/interaction/requests/client/requestDescription';
//Sesion
import Signup from '../pages/signup';
import Login from '../pages/login/login';
import IntroConsultor from '../pages/login/consultor/intro';
import IntroClient from '../pages/login/client/intro';
import Splash from '../pages/login/splash';
//Amin/Client
import ClientBalance from '../pages/admin/client/clientBalance';

//Profile/admin
import Withdraw from '../pages/admin/modals/withdrawModal';
import ChannelSetup from '../pages/admin/consultor/channelSetup'
import ChannelPrices from '../pages/admin/consultor/channelPrices';
import ConsultorDescription from '../pages/admin/consultor/consultorDescription';
import ConsultorData from '../pages/admin/consultor/consultorData';
import ConsultorQuestions from '../pages/admin/consultor/consultorQuestions';
import ConsultorSchedule from '../pages/admin/consultor/consultorSchedule';
import ConsultorBalance from '../pages/admin/consultor/consultorBalance';
import ConsultorCategories from '../pages/admin/consultor/consultorCategories';
import ConsultorVideo from '../pages/admin/consultor/consultorVideo';
import VerifyAccount from '../pages/admin/consultor/verifyAccount';
//Steps/consultor
import Step1MainData from '../pages/signup/steps/consultor/step1MainData';
import Step2Channels from '../pages/signup/steps/consultor/step2Channels';
import Step3Questions from '../pages/signup/steps/consultor/step3Questions';
import Step4Categories from '../pages/signup/steps/consultor/step4Categories';
import SuccessSignupConsultor from '../pages/signup/steps/consultor/successSignup';
//Steps/consultor
import Step1MainDataClient from '../pages/signup/steps/client/step1MainData';
import Step2Interests from '../pages/signup/steps/client/step2Interests';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Interacción') {
            iconName = focused
              ? 'phone'
              : 'phone';
          } else if (route.name === 'Actividad') {
            iconName = focused ? 'history' : 'history';
          }
          else if (route.name === 'Admin') {
            iconName = focused ? 'user' : 'user';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={20} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#03b388',
        inactiveTintColor: '#dcdcdc',
        paddingBottom: 20,
        labelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen name="Interacción"  component={Interactions}/>
      <Tab.Screen name="Admin" component={Admin} />
    </Tab.Navigator>
  );
}

function AldelNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>

        <Stack.Screen 
          name="Splash" 
          component={Splash} 
          options={{header: () => null}}
        />

        <Stack.Screen 
          name="Signup" 
          component={Signup} 
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="IntroConsultor"
          component={IntroConsultor}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="Withdraw"
          component={Withdraw}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="Step1MainData"
          component={Step1MainData}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="Step2Channels"
          component={Step2Channels}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="Step3Questions"
          component={Step3Questions}
          options={{header: () => null,  gestureEnabled: false}}
        />  

        <Stack.Screen 
          name="Step4Categories" 
          component={Step4Categories} 
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen 
          name="SuccessSignupConsultor" 
          component={SuccessSignupConsultor} 
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="IntroClient"
          component={IntroClient}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="Step1MainDataClient"
          component={Step1MainDataClient}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="Step2Interests"
          component={Step2Interests}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="Index"
          component={MyTabs}
          options={{header: () => null,  gestureEnabled: false}}
          initialParams={{ accepted: false }}
        />

        <Stack.Screen
          name="Interacción"
          component={Interactions}
          options={{header: () => null,  gestureEnabled: false}}
        />

        <Stack.Screen
          name="RequestConsultorDescription"
          component={RequestConsultorDescription}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="RequestClientDescription"
          component={RequestClientDescription}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConversationConsultor"
          component={ConversationConsultor}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConversationClient"
          component={ConversationClient}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ChannelSetup"
          component={ChannelSetup}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ChannelPrices"
          component={ChannelPrices}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConsultorSchedule"
          component={ConsultorSchedule}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConsultorDescription"
          component={ConsultorDescription}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConsultorData"
          component={ConsultorData}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConsultorQuestions"
          component={ConsultorQuestions}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConsultorCategories"
          component={ConsultorCategories}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConsultorVideo"
          component={ConsultorVideo}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="VerifyAccount"
          component={VerifyAccount}
          options={{header: () => null,  gesturesEnabled: false}}
        />      

        <Stack.Screen
          name="ConsultorBalance"
          component={ConsultorBalance}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ClientBalance"
          component={ClientBalance}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ConsultorProfile"
          component={ConsultorProfile}
          options={{header: () => null,  gesturesEnabled: false}}
        />

        <Stack.Screen
          name="ClientProfile"
          component={ClientProfile}
          options={{header: () => null,  gesturesEnabled: false}}
        />  
      </Stack.Navigator>

    </NavigationContainer>
  );
}

export default AldelNavigation;
