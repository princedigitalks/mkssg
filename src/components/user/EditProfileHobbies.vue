<template>
    <div>
       <div>
            <router-link :to="'/edit-profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back</router-link>
            &nbsp;
            <router-link :to="'/profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back to profile</router-link>
            <br>
       
            <div v-if="!loaded">
                <br>
                <div class="box loading" style="min-height:100px"></div>
                <br>
                <div class="box loading" style="min-height:100px"></div>
                <br>
                <div class="box loading" style="min-height:100px"></div>
                <br>
                <div class="box loading" style="min-height:100px"></div>
                <br>
                <div class="box loading" style="min-height:100px"></div>
            </div>
            <form action="javascript:;" method="POST" v-if="loaded">
                <div class="box p-4 pb-2 mt-4" v-for="(hobby, ei) in hobbies" :key="ei"> 
                    <a href="javascript:;" class="btn btn-primary" @click="removeHobby(ei)"><TrashIcon /></a>
                    <div class="clearfix"></div>
                    <br>
                    <div class="form-floating mb-3">
                        <input class="form-control rounded-3" id="hobby_name" v-model="hobby.hobby_name" type="text" placeholder="Enter hobby name">
                        <label for="hobby_name">Hobby name</label>
                    </div>

                    
                   
                    
                </div>
               
                <div class="mt-4">
                    <SaveButton :loading="false" buttonText="Add New" :full_width="true" :big_button="true" @clicked="addNewHobby"></SaveButton>
                </div>
                
                <div class="mt-4">
                    <SaveButton :loading="loading" buttonText="Save" :full_width="true" :big_button="true" icon="CheckIcon" @clicked="saveHobby"></SaveButton>
                </div>
            </form>
            
            
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
import SaveButton from '../UI/SaveButton.vue';
import BackIcon from 'vue-material-design-icons/ArrowLeft.vue';
import TrashIcon from 'vue-material-design-icons/TrashCan.vue';

export default {
    name: 'EditProfileHobbies',
    components:{
        BackIcon,
        TrashIcon,
        SaveButton
    },
    data : function(){
        return {
                loaded : false,
                toast:useToast(),
                loading: false,
                hobbies:[],
                profile_id: ''
            }
    },
   
    methods : {

       

        addNewHobby : function(){
            this.hobbies.push({
                hobby_name : ''
            });
        },

        removeHobby : function(index){
            this.hobbies.splice(index, 1);
        },

        saveHobby : function(){

            let that = this;
            this.loading = true;
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/save-profile-hobbies-after-edit/'+that.profile_id, { hobbies: that.hobbies },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {

                    that.toast.success(response.data);
                   
                    that.loading = false;
                    
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
                            that.loading = false;

                        }
                    
                    }else{
                        that.toast.error("Error: Please check your internet connection");
                        that.loading = false;
                    }
                });
            });

        },

        fetchHobbies: function(profile_id){
            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-hobbies-to-edit', {
                    profile_id: profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {

                    for(let z = 0 ; z < response.data.length ; z++){
                        that.hobbies.push(response.data[z]);
                    }

                    
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
       
        
        this.profile_id = profile_id;

        this.fetchHobbies(profile_id);


    }
}
</script>