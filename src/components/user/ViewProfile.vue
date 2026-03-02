<template>
    <div>
        <div v-if="!loaded">   
            <div class="box loading" style="height:300px">
            
            </div>
            <br>
            <div class="box loading" style="height:200px">
                
            </div>
            <br>
            <div class="box loading" style="height:60px">
                
            </div>
            <br>
            <div class="box loading" style="height:100px">
                
            </div>
            <br>
            <div class="row">
                <div class="col-md-6">
                    <div class="box loading" style="height:500px">
                
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="box loading" style="height:500px">
                
                    </div>
                </div>
            </div>
        </div>
        
        <div class="box" v-if="loaded">
            <div class="profile-head">
                <div class="profile-cover-image">
                    
                    <vue-picture-swipe ref="swiperef_ci" :items="[{
                        src: profile.cover_image,
                        thumbnail: profile.cover_image,
                        w:1200,
                        h:900
                    }]"></vue-picture-swipe>
                    
                    <div class="profile-picture5">
                    
                    <vue-picture-swipe ref="swiperef_pi" :items="[{
                        src: profile.profile_image,
                        thumbnail: profile.profile_image_thumb,
                        w:1200,
                        h:900
                    }]"></vue-picture-swipe>
                    </div>
                    
                    
                   
                </div>
                <br>
                <div style="margin-top:-30px">
                
                <router-link v-if="profile.editable" class="btn btn-primary btn-sm btn-edit-profile" :to="'/edit-profile/'+profile_id"><EditIcon :size="16" />&nbsp;Edit</router-link>
                
                
                
                <p class="text-center profile-name">{{ profile.first_name }} {{ profile.middle_name }} {{ profile.last_name }}<span v-if="profile.nickname != ''">&nbsp;({{ profile.nickname }})</span>&nbsp;<a href="javascript:;"><VerifiedIcon @click="showInfoToast('core contributor')" v-if="profile.checkmark_available != 0 && profile.checkmark_type == 1" fillColor="#0091c1"></VerifiedIcon><VerifiedIcon @click="showInfoToast('temporary contributor')" v-if="profile.checkmark_available != 0 && profile.checkmark_type == 2" fillColor="#8d8d8d"></VerifiedIcon>
                                <VerifiedIcon @click="showInfoToast('volunteer')" v-if="profile.checkmark_available != 0 && profile.checkmark_type == 3" fillColor="#b6c100"></VerifiedIcon></a></p>
                
                <div class="profile-social-links-wrapper">
                    <ul class="profile-social-links">
                        <li v-for="(social_c, si) in social" :key="si">
                            <a v-if="social_c.link_type == 'facebook'" :href="social_c.link" target="_blank"><FacebookIcon :size="28" fillColor="#3b5998" /></a>
                            <a v-if="social_c.link_type == 'twitter'" :href="social_c.link" target="_blank"><TwitterIcon :size="28" fillColor="#1DA1F2" /></a>
                            <a v-if="social_c.link_type == 'instagram'" :href="social_c.link" target="_blank"><InstagramIcon :size="28" fillColor="#d62976" /></a>
                            <a v-if="social_c.link_type == 'linkedin'" :href="social_c.link" target="_blank"><LinkedinIcon :size="28" fillColor="#0e76a8" /></a>
                            
                        </li>
                        
                    </ul>
                    <div class="clearfix"></div>
                </div>
                <br>
                <span v-if="profile.website != ''" class="text-center display-block pb-4">
                    <a :href="profile.website" target="_blank">{{ profile.website }}</a>
                </span>
                </div>
            </div>
            <SaveButton v-if="!profile.editable" :loading="report_profile_flag" buttonText="Report" :full_width="true" :big_button="false" @clicked="reportProfile(profile.id)" style="margin-top:15px;display:block"></SaveButton>
        </div>
        
        
        <span v-if="loaded" ref="scrolltospan" class="show-phone"></span>
        <br v-if="loaded">
        
        <div v-if="loaded" class="box profile-nav-links">
            <nav class="nav nav-pills nav-justified">
                <router-link class="nav-link" @click="setActiveCls('profile', true)" :class="{'active':activecls.info}" :to="'/profile/'+profile_id">Info</router-link>
                <router-link class="nav-link" @click="setActiveCls('family', true)" :class="{'active':activecls.family}" :to="'/profile/family/'+profile_id">Family</router-link>
                <router-link class="nav-link" @click="setActiveCls('education', true)" :class="{'active':activecls.education}" :to="'/profile/education/'+profile_id">Education</router-link>
                <router-link class="nav-link" @click="setActiveCls('work', true)" :class="{'active':activecls.work}" :to="'/profile/work/'+profile_id">Work</router-link>
                <router-link class="nav-link" @click="setActiveCls('hobbies', true)" :class="{'active':activecls.hobbies}" :to="'/profile/hobbies/'+profile_id">Hobbies</router-link>
                <router-link class="nav-link" @click="setActiveCls('donations', true)" :class="{'active':activecls.donations}" :to="'/profile/donations/'+profile_id">Donations</router-link>
            </nav>
           
        
        </div>
        <span v-if="loaded">
            <router-view></router-view>
        </span>
       
    </div>
</template>

<style scoped>


.fade-enter-active, .fade-leave-active {
  transition: all 1s;
  max-height: 2030px;
}
.fade-enter-from,
.fade-leave-to
{
   opacity: 0;
   transition: all 0.3s;
  max-height: 0px;
}

</style>


<script>



import FacebookIcon from 'vue-material-design-icons/Facebook.vue';
import TwitterIcon from 'vue-material-design-icons/Twitter.vue';
import InstagramIcon from 'vue-material-design-icons/Instagram.vue';
import LinkedinIcon from 'vue-material-design-icons/Linkedin.vue';
import WhatsappIcon from 'vue-material-design-icons/Whatsapp.vue';
import VerifiedIcon from 'vue-material-design-icons/CheckDecagram.vue';
import EditIcon from 'vue-material-design-icons/SquareEditOutline.vue';
import VuePictureSwipe from 'vue-picture-swipe';
import axios from 'axios';
import { constants } from '@/constants';

import common from '@/common';
import { Preferences } from '@capacitor/preferences';
import { useToast } from 'vue-toastification';
import router from './../../../routes/index';

import SaveButton from '../UI/SaveButton.vue';

export default {
    name: 'ViewProfile',

    components:{
        FacebookIcon,
        TwitterIcon,
        InstagramIcon,
        LinkedinIcon,
        VerifiedIcon,
        WhatsappIcon,
        EditIcon,
        VuePictureSwipe,
        SaveButton
       
    },
    data : function(){
        return {
            toast: useToast(),
            profile_id: '',
            loaded : false,
            report_profile_flag: false,
            activecls:{
                info:false,
                family:false,
                education:false,
                work:false,
                hobbies:false,
                donations:false
            },
            profile: {},
            social: {}
        }
    },
    
    
    methods : {

        reportProfile : function(profile_id){
            let that = this;
            
            that.report_profile_flag = true;
            
            common.fetchToken(function(token){

                axios.post(constants.APIURL+'/report-profile', {
                    profile_id:profile_id
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

        fetchProfileOverview: function(){
            let that = this;
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-overview', {
                    profile_id: that.profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    that.profile = response.data.profile;
                    that.profile.profile_image = response.data.profile.profile_image+'&math='+Math.random();
                    that.profile.cover_image = response.data.profile.cover_image+'&math='+Math.random();
                    
                    that.social = response.data.social;
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
                })
            });
        },

        showInfoToast : function(thetype){
            this.toast.info('This person is a '+thetype);
        },

        resetActive: function(){
            this.activecls.info = false;
            this.activecls.family = false;
            this.activecls.education = false;
            this.activecls.work = false;
            this.activecls.hobbies = false;
            this.activecls.donations = false;
        },

        setActiveCls : function(pagetype, scroll){
            this.resetActive();
            if(scroll && window.screen.availWidth < 992){
                let scrolltospan = this.$refs.scrolltospan.offsetTop;
                window.scrollTo({ top: scrolltospan - 40, behavior: 'smooth' });
            }
            
            if(pagetype == 'profile'){
                this.activecls.info = true;
            }

            if(pagetype == 'family'){
                this.activecls.family = true;
            }

            if(pagetype == 'education'){
                this.activecls.education = true;
            }

            if(pagetype == 'work'){
                this.activecls.work = true;
            }

            if(pagetype == 'hobbies'){
                this.activecls.hobbies = true;
            }

            if(pagetype == 'donations'){
                this.activecls.donations = true;
            }

        },

        initialOperations: function(){
            let urlSegments = this.$route.path.split('/');
            let profile_id = urlSegments[(urlSegments.length-1)];
            let seg_num = 1;
            if(profile_id == ''){
                profile_id = urlSegments[(urlSegments.length-2)];
                seg_num = 2;
            }
            seg_num = (seg_num+1);
            let pagetype = urlSegments[(urlSegments.length-seg_num)];
            
            this.profile_id = profile_id;

            
            this.setActiveCls(pagetype, false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.fetchProfileOverview();
        }

    },
    
    watch:{
        $route (to, from){
            
            let urlSegments_to = to.fullPath.split('/');
            let urlSegments_from = from.fullPath.split('/');
            
            
            if(urlSegments_to[1] == 'profile'){

                let temp_id_from = urlSegments_from[(urlSegments_from.length-1)];
                let temp_id_to = urlSegments_to[(urlSegments_to.length-1)];
                
                if(/*typeof this.$route.query.src === 'undefined' || */temp_id_from != temp_id_to){
                    if(this.$route.query.src != 'btn'){
                        this.loaded = false;
                        this.initialOperations();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }    
                
            }
           
        }
    },
    created(){
        this.initialOperations();
    },
    mounted(){
        
    }

}
</script>