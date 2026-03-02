<template>
    <div>
        <div v-if="!loaded">
            <br>
            <div v-for="(n,ii) in 5" :key="ii" class="userlist loadinglist box">
                <div class="single-user-list">
                    <div class="row">
                        <div class="col-md-2 col-3">
                            <div class="single-user-profile-picture">
                                <div class="loading" style="height:125px"></div>
                                
                            </div>
                        </div>
                        <div class="col-md-6 col-6">
                            <div class="single-user-content">
                                <p class="loading" style="height:55px">
                                    
                                </p>
                                <p class="loading" style="height:55px">
                                    
                                </p>
                            </div>
                        </div>
                        <div class="col-md-4 col-3">
                            <div class="single-user-actions">
                                <div class="single-user-content">
                                <p class="loading" style="height:55px">
                                
                                </p>
                                <p class="loading" style="height:55px">
                                    
                                </p>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div v-if="loaded">
            <br>
            <show-users :profiles="profiles"></show-users>
        </div>
        <div v-if="loaded && profiles.length == 0">
            <h5>No profiles found.</h5>
        </div>
    </div>
</template>

<style scoped>
   
</style>

<script>


import axios from 'axios';
import { constants } from '@/constants';
import { useToast } from 'vue-toastification';
import common from '@/common';
import { Preferences } from '@capacitor/preferences';
import router from './../../../routes/index';
/*import SaveButton from '../UI/SaveButton.vue';*/
import ShowUsers from './ShowUsers.vue';


export default {
    name: 'ProfileFamily',
    components:{
        ShowUsers
    },
    data : function(){
        return {
                toast: useToast(),
                profiles:[],
                profile_id: '',
                loaded: false
            }
    },
    methods : {

        fetchProfileFamily: function(){
            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-family', {
                    profile_id:that.profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                   
                    that.profiles = response.data;
                    
                    that.loaded = true;
                    
                }).catch(error => {
                    if(error.response){
                        if(error.response.status == 401){
                            Preferences.remove({ key: 'token' });
                            router.push({path:'/'});
                        }else{

                            if(error.response.status != 400){
                                that.toast.error("Unknown error occured");
                            }else{
                                that.toast.error(error.response.data);
                            }
                        

                        }
                    
                    }else{
                        that.toast.error("Error: Please check your internet connection");
                    }
                });
            });
        }

    },
    created(){
        
    },
    mounted(){

        let urlSegments = this.$route.path.split('/');
        let profile_id = urlSegments[(urlSegments.length-1)];
        
        if(profile_id == ''){
            profile_id = urlSegments[(urlSegments.length-2)];
            
        }
        this.profile_id = profile_id;
        
        this.fetchProfileFamily(this.profile_id);

    }
}
</script>