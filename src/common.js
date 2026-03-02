import { Preferences } from '@capacitor/preferences';

export default{
    checkAuth: function(fun){
        const value = Preferences.get({ key: 'token' });
        let token_value = '';
        value.then(function(val){
            
            if(val.value != '' && val.value != null && typeof val.value !== 'undefined'){
                fun(true);
            }else{
                fun(false);
            }

        });
    },

    fetchToken: function(fun){
        const value = Preferences.get({ key: 'token' });
        let token_value = '';
        value.then(function(val){
            
            if(val.value != '' && val.value != null && typeof val.value !== 'undefined'){
                fun(val.value);
            }else{
                fun(null);
            }

        });
    },

    fetchAndroidToken: function(fun){
        const value = Preferences.get({ key: 'android_token' });
        let token_value = '';
        value.then(function(val){
            
            if(val.value != '' && val.value != null && typeof val.value !== 'undefined'){
                fun(val.value);
            }else{
                fun(null);
            }

        });
    }

};