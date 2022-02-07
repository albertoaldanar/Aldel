import 'react-native-gesture-handler';
import React, {Component} from "react";
import { Provider } from 'react-redux';
import OneSignal from 'react-native-onesignal';
import * as firebase from 'firebase';
import {StripeProvider} from '@stripe/stripe-react-native';
//local imports
import AldelNavigation from "./navigation/nav";
import store from './redux/store';
import firebaseConfig from '../src/firebase/config';

class App extends Component {

    constructor(props){
		super(props);
    }

    async componentDidMount() {
        if(!firebase.apps.length){
            firebase.initializeApp(firebaseConfig);
    
            firebase.firestore().settings({ experimentalForceLongPolling: true });
        }

        OneSignal.setLogLevel(6, 0);
        OneSignal.setAppId("5b239f1e-4de7-46c9-958b-ce4f80c9249b");
        
        const deviceState = await OneSignal.getDeviceState();
        
        console.log("DEvice---", deviceState);
    }      

    onIds(device) {
        console.log('Device info: ', device);
    }

    render(){
        return(
            <Provider store={store}>
                <StripeProvider publishableKey='pk_test_51J7jDTJvBpvZl6iKwankC9RO2Fp5bBu7W2xxbvi4b1S0NS8HqXC0QwMRB2Z9q16jqOGPR8Ufr10BQ1eg9vtbgpz2000SDzNOWd'>
                    <AldelNavigation />
                </StripeProvider>
            </Provider>
        );
    }
}

export default App;
