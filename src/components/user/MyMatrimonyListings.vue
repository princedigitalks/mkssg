<template>
    <div>
        
        <br>

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

        <div v-if="loaded && matris.length == 0">
            <h5>No profiles have been listed by you.</h5>
        </div>

        <div>
            <div class="userlist box" v-for="(matri, pi) in matris" :key="pi">
            <div class="single-user-list">
                <div class="row">
                    <div class="col-md-2 col-3">
                        <div class="single-user-profile-picture">
                            <img :src="matri.profile.profile_image+'&rand='+Math.random()" class="img img-fluid img-circle">
                        </div>
                    </div>
                    <div class="col-md-6 col-6">
                        <div class="single-user-content">
                            <router-link :to="'/profile/'+matri.profile.id" ><span class="username"><strong>{{ matri.profile.first_name }} {{ matri.profile.middle_name }} {{ matri.profile.last_name }}</strong></span></router-link>
                                
                                <a href="javascript:;"><VerifiedIcon @click="showInfoToast('core contributor')" v-if="matri.profile.checkmark_available != 0 && matri.profile.checkmark_type == 1" fillColor="#0091c1"></VerifiedIcon>
                                <VerifiedIcon @click="showInfoToast('temporary contributor')" v-if="matri.profile.checkmark_available != 0 && matri.profile.checkmark_type == 2" fillColor="#8d8d8d"></VerifiedIcon>
                                <VerifiedIcon @click="showInfoToast('volunteer')" v-if="matri.profile.checkmark_available != 0 && matri.profile.checkmark_type == 3" fillColor="#b6c100"></VerifiedIcon></a>
                            
                            
                         
                            <span><strong></strong>
                            <br>
                            Lives in {{ matri.profile.area_name }}<br>
                            Relation: {{ matri.profile.relation }}
                            </span>
                        </div>
                    </div>
                    <div class="col-md-4 col-3">
                        <div class="single-user-actions">
                            <SaveButton :textsize="true" :loading="matri.profile.loading" buttonText="View" :full_width="true" :big_button="false" @click="viewMatrimonyListing(matri.id)"></SaveButton>
                            <div class="clearfix"></div>
                            
                        </div>
                    </div>
                </div>
                
            </div>
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
import SaveButton from '../UI/SaveButton.vue';

export default {
    name: 'MyMatrimonyListings',

    components:{
        VerifiedIcon,
        SaveButton
       
    },
    data : function(){
        return {
            toast: useToast(),
            profile_id: '',
            matris: [],
            loaded: false,
            loading: false
        }
    },
    methods : {

        viewMatrimonyListing : function(matri_id){
            router.push({path: '/matrimony-listings/view/'+matri_id});
        },

        fetchMyMatrimonyLsting: function(){
            let that = this;
            
            common.fetchToken(function(token){
                axios.get(constants.APIURL+'/fetch-my-matrimony-listing',{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    that.matris = response.data;
                    
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
        /*let urlSegments = this.$route.path.split('/');
        let profile_id = urlSegments[(urlSegments.length-1)];
        
        if(profile_id == ''){
            profile_id = urlSegments[(urlSegments.length-2)];
            
        }
        this.profile_id = profile_id;
        */
        this.fetchMyMatrimonyLsting();
       
    }

}
</script>