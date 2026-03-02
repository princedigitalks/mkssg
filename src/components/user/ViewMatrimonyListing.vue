<template>
    <div>
        
       
        <!--<div class="box loading">
            123
        </div>-->

        
        <div v-if="loaded">
            <div class="box p-4 pb-3">
                <h5>{{ matri.profile.first_name }} {{ matri.profile.middle_name }} {{ matri.profile.last_name }}</h5>
                <SaveButton v-if="!matri.editable" :loading="report_profile_flag" buttonText="Report" :full_width="true" :big_button="false" @clicked="reportMatri(matri.id)" style="display:block"></SaveButton>
                <br>
                <SaveButton class="mb-4" v-if="matri.editable" :textsize="true" :loading="removeLoading" buttonText="Delete" :full_width="true" :big_button="true" @clicked="removeBio(matri.id)"></SaveButton>
                <div class="row">
                    <div class="col-md-6">
                        <router-link :to="'/profile/'+matri.profile.id" class="btn btn-primary btn-lg display-block">View Profile</router-link>
                    </div>
                    <div class="col-md-6 phone-mt">
                        <router-link v-if="matri.editable" :to="'/upload-bio/'+matri.profile.id" class="btn btn-primary btn-lg display-block">Edit</router-link>
                    </div>
                    
                </div>
                
                
                <br>
                <div class="feed-block">
                    <div class="post-images">
                         <vue-picture-swipe :ref="'swiperef_matri'" :items="matri.post_images"></vue-picture-swipe>
                    </div>
                </div>
                <br />
                <a :href="matri.bio_file" class="btn btn-primary btn-lg w-100 display-block"><DownloadIcon />&nbsp;Download Bio Data</a>
                
               
                <br>
                <p><strong>Preferences</strong>
                    <br>
                    <span v-html="matri.preferences_text"></span>
                </p>
            </div>
        </div>

       
    </div>
</template>

<style scoped>
    
</style>


<script>




import axios from 'axios';
import { constants } from '@/constants';

import common from '@/common';
import { Preferences } from '@capacitor/preferences';
import { useToast } from 'vue-toastification';
import router from './../../../routes/index';
import VerifiedIcon from 'vue-material-design-icons/CheckDecagram.vue';
import DownloadIcon from 'vue-material-design-icons/Download.vue';
import SaveButton from '../UI/SaveButton.vue';
import VuePictureSwipe from 'vue-picture-swipe';

export default {
    name: 'MyMatrimonyListings',

    components:{
        VerifiedIcon,
        SaveButton,
        VuePictureSwipe,
        DownloadIcon
       
    },
    data : function(){
        return {
            toast: useToast(),
            lgal: null,
            report_profile_flag: false,
            profile_id: '',
            matri: '',
            removeLoading: false,
            loaded: false,
            loading: false,
            matri_id: ''
        }
    },
    methods : {

        reportMatri : function(matri_id){
            let that = this;
            
            that.report_profile_flag = true;
            
            common.fetchToken(function(token){

                axios.post(constants.APIURL+'/report-matri', {
                    matri_id:matri_id
                }, {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }).then(response => {
                    
                    that.report_profile_flag = false;
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
                        that.report_profile_flag = false;
                    }else{
                        that.report_profile_flag = false;
                        that.toast.error("Error: Please check your internet connection");
                    }

                });

            });
        },

        removeBio : function(matri_id){
            let that = this;
            that.removeLoading = true;
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/remove-matrimony-listing', {
                    matri_id:matri_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    that.toast.success(response.data);
                    router.push({path: '/matrimony-listings'});
                    
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

        fetchSingleMatrimonyListing: function(matri_id){
            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-single-matrimony-listing', {
                    matri_id:matri_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    that.matri = response.data;
                    
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

        showInfoToast : function(thetype){
            this.toast.info('This person is a '+thetype);
        }
        
    },
    mounted(){

        let urlSegments = this.$route.path.split('/');

        let matri_id = urlSegments[(urlSegments.length-1)];
        
        this.matri_id = matri_id;
       
        this.fetchSingleMatrimonyListing(matri_id);
        
    }

}
</script>