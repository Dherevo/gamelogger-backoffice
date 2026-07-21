import { createApp } from 'vue';
import { App, Table } from 'lib';
import AppMain from './App.vue';
import config from './config/environments/config';
import routes from './config/routes';
import http from './config/httpConfig';
import locales from './assets/translations/locales';
import packageJSON from '../package.json';
import { http as httpLib } from 'lib';
//import baseComponent from './modules/baseComponent';

////////////////// CSS Styles
import './assets/styles.scss';
//////////////////////////

// Create APP
const app = createApp(AppMain);

// Initialize lib
App.init(packageJSON.version, app, config, routes, locales);

// Root redirect guard
App.router.beforeEach((to: any, _from: any, next: any) => {
    if (to.path === '/') {
        next(httpLib.token.get() ? '/patients' : '/login');
    } else {
        next();
    }
});

// Descomenta para usar el baseComponent
// baseComponent(app);

// Initialize things here:
http();                         // HTTP Client configuration

// Default table configuration:
Table.defaultTable(table => {
    table
        .useVisibility()
        .resizeColumns();
})

// Mount app
app.mount('#app');