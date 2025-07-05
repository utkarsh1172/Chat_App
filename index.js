/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import GlobalState from './context';
import AppNavigator from './App';

const Root = () => (
  <GlobalState>
    <AppNavigator />
  </GlobalState>
);

AppRegistry.registerComponent(appName, () => Root);
