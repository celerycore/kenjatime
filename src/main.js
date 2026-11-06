import './style.css';
import {appShell} from './app-shell.js';
import {mountApp} from './app-runtime.js';
document.querySelector('#app').innerHTML=appShell;
mountApp({arena:document.body.dataset.mode==='arena'});
