
import { combineReducers } from  'redux';
import aldel from './aldel';
import adminReducer from './admin/adminReducer';
import questionsReducer from './admin/questionsReducer';
import channelsReducer from './admin/channelsReducer';
import profilerReducer from './profile/profileReducer';
import interactionsReducer from './interactions/interactionsReducer';
import searchReducer from './search/searchReducer';
import categoriesReducer from './admin/categoriesReducer';
import conversationConfigReducer from './interactions/conversationConfigReducer';
import balanceReducer from './admin/balanceReducer';
import dictionaryReducer from './dictionaryReducer';
import messagesReducer from './interactions/messagesReducer';

export default combineReducers({
    aldel: aldel,
    adminData: adminReducer, 
    questionsData: questionsReducer, 
    channelsData: channelsReducer,
    profileData: profilerReducer,
    interactionsData: interactionsReducer,
    searchListData: searchReducer,
    categoriesData: categoriesReducer, 
    conversationConfigData: conversationConfigReducer, 
    balanceData: balanceReducer, 
    dictionaryData: dictionaryReducer,
    messagesData: messagesReducer,
});
