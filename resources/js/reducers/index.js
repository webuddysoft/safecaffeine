import { combineReducers } from 'redux';
import auth from './auth';
import user from './user';
import drinks from './drinks';

export default combineReducers({
  auth,
  user,
  drinks
});