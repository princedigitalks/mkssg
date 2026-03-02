<template>
    <div>
        <div v-if="!loaded">
            <div v-for="(n,ii) in 15" :key="ii" class="userlist loadinglist box">
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
        <div v-if="loaded && profiles.length == 0">
            <h5>No profiles found.</h5>
        </div>
        <ShowUsers v-if="loaded" :profiles="profiles"></ShowUsers>
        
    </div>
</template>

<style scoped>
  
    .userlist.loadinglist{
        padding:20px 20px 5px 20px;
        margin-bottom: 25px;
    }
    .userlist{
        padding:20px;
        margin-bottom: 25px;
    }
</style>

<script>


import axios from 'axios';
import { constants } from '@/constants';

import common from '@/common';
import { Preferences } from '@capacitor/preferences';
import { useToast } from 'vue-toastification';
import router from './../../../routes/index';
import SaveButton from '../UI/SaveButton.vue';
import VerifiedIcon from 'vue-material-design-icons/CheckDecagram.vue';

import ShowUsers from './ShowUsers.vue';

export default {
    name: 'search',
    components:{
        SaveButton,
        VerifiedIcon,
        ShowUsers
    },
    data : function(){
        return {
            toast: useToast(),
            loaded: false,
            profiles : []
        }
    },
    methods : {

       
        fetchFamilyMembers: function(){
            let that = this;
            
            common.fetchToken(function(token){
                axios.get(constants.APIURL+'/fetch-family-members',{
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
    beforeCreate(){
        document.body.scrollTop = 0;
    },
    created(){
        document.body.scrollTop = 0;
        
    },
    mounted(){

        document.body.scrollTop = 0;

        this.fetchFamilyMembers();


    }
}
</script>