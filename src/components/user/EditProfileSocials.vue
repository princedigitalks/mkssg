<template>
    <div>
        <div>
            <router-link :to="'/edit-profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back</router-link>
            &nbsp;
            <router-link :to="'/profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back to profile</router-link>
            <br>
            <br>
            <div v-if="!loaded">
                <div class="box loading" style="height:200px"></div>
                <br>
                <div class="box loading" style="height:200px"></div>
                <br>
                <div class="box loading" style="height:200px"></div>
            </div>
            
            
            
            <div class="box p-4" v-if="loaded">
                <form action="javascript:;" method="POST">

                    <div class="form-floating mb-3">
                        <input class="form-control rounded-3" id="facebook" v-model="socials.facebook" type="text" placeholder="Enter area name">
                        <label for="facebook">Facebook</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input class="form-control rounded-3" id="twitter" v-model="socials.twitter" type="text" placeholder="Enter area name">
                        <label for="twitter">Twitter</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input class="form-control rounded-3" id="instagram" v-model="socials.instagram" type="text" placeholder="Enter area name">
                        <label for="instagram">Instagram</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input class="form-control rounded-3" id="linkedin" v-model="socials.linkedin" type="text" placeholder="Enter area name">
                        <label for="linkedin">Linkedin</label>
                    </div>

                   


                    <div class="mt-2">
                        <SaveButton :loading="loading" buttonText="Save" :full_width="true" :big_button="true" icon="CheckIcon" @clicked="saveInfo"></SaveButton>
                    </div>

                </form>
            </div>
        </div>

    </div>
</template>

<style scoped>
   .cropper {
	width: 100%;
    max-height:400px;
	background: #DDD;
}

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

export default {
    name: 'EditProfileSocials',
    components:{
        SaveButton,
        BackIcon
    },
    data : function(){
        return {
                loading: false,
                loaded: false,
                profile_id: '',
                
                toast: useToast(),
                socials: {
                    facebook: '',
                    twitter: '',
                    instagram: '',
                    linkedin: '',
                    profile_id: ''
                }
            }
    },
    methods : {

        fetchProfileSocials : function(profile_id){

            let that = this;
           
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-socials', {
                    profile_id: profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    that.socials = response.data;

                    
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

        },

        saveInfo: function(){
          
                
            this.loading = true;

            let that = this;
            that.socials.profile_id = that.profile_id;
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/save-edited-socials', that.socials,{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    that.loading = false;
                    that.fetchProfileSocials(that.profile_id);
                    that.toast.success(response.data);
                    
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
                        that.loading = false;
                    }else{
                        that.loading = false;
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
        this.fetchProfileSocials(profile_id);
    }
}
</script>