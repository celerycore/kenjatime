import {mountSetup} from './native-setup.js';
import {createBrowserEngineHost} from './browser-engine-host.js';
mountSetup(createBrowserEngineHost());
