<template>
  <router-view></router-view>
</template>

<script>

import './assets/js/global';

import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { App as CapacitorApp } from '@capacitor/app';

export default {
  name: 'App',

  data : function(){
    return {
      
    }
  },

  methods : {
    
    getFCMToken : function(){
      if(Capacitor.getPlatform() != 'web'){

        PushNotifications.requestPermissions().then(result => {
          
          PushNotifications.register();
        });
        
        PushNotifications.addListener('registration', (token) => {
          Preferences.set({ key: 'android_token', value: token.value });
        });
      }else{
        Preferences.set({ key: 'android_token', value: 'web' });
      }
    }
      
  },

  created(){
    
    this.getFCMToken();
    
  },
  mounted(){
    CapacitorApp.addListener('backButton', ({canGoBack}) => {
    
    
    if(!canGoBack){
      CapacitorApp.exitApp();
    } else {
      window.history.back();
    }
    

    
  });
  }
  
}

</script>

<style>
@import './assets/css/_vars.css';
@import './assets/css/bootstrap.min.css';
@import './assets/css/font.css';
@import './assets/css/global.css';
@import './assets/css/_media.css';

#app {
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
