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
            <div class="profile-head page-head">
                <div class="profile-cover-image">
                   

                    <vue-picture-swipe ref="swiperef_pci" :items="[{
                        src: page.cover_image,
                        thumbnail: page.cover_image,
                        w:1200,
                        h:900
                    }]"></vue-picture-swipe>
                    
                    <div class="profile-picture5">
                    
                    <vue-picture-swipe ref="swiperef_ppi" :items="[{
                        src: page.profile_image,
                        thumbnail: page.profile_image_thumb,
                        w:1200,
                        h:900
                    }]"></vue-picture-swipe>
                    </div>
                    
                    
                    
                    
                <div class="clearfix"></div>
                <button @click="emailFollow" class="btn btn-primary email_follow_btn btn-sm m-4" style="float:left">
                        <span v-if="page.follower == false">Follow </span>
                        <span v-if="page.follower == true">Unfollow </span>
                            <EmailIcon />
                    </button>
                
                    <button v-if="page.page_admin" @click="createNewPost" class="new_post_btn btn btn-primary btn-sm m-4" style="float:right">
                        <PlusIcon />&nbsp;Post
                    </button>
                </div>
                <br>
                
                
                <div class="clearfix"></div>
             
                <p class="text-center profile-name" style="margin-top:-25px">{{ page.page_name }} <span v-if="page.page_nickname != ''">&nbsp;({{ page.page_nickname }})</span></p>
                
                <div class="profile-social-links-wrapper">
                    <ul class="profile-social-links">
                        <li v-if="page.facebook != ''"><a :href="page.facebook" target="_blank"><FacebookIcon :size="28" fillColor="#3b5998" /></a></li>
                        <li v-if="page.twitter != ''"><a :href="page.twitter" target="_blank"><TwitterIcon :size="28" fillColor="#1DA1F2" /></a></li>
                        <li v-if="page.instagram != ''"><a :href="page.instagram" target="_blank"><InstagramIcon :size="28" fillColor="#d62976" /></a></li>
                           
                        
                        
                    </ul>
                    <div class="clearfix"></div>
                    
                </div>
                <br>
                <span v-if="page.website != ''" class="text-center display-block pb-4">
                    <a :href="page.website" target="_blank">{{ page.website }}</a>
                </span>
                
            </div>
            <SaveButton :loading="report_profile_flag" buttonText="Report" :full_width="true" :big_button="false" @clicked="reportPage(page.id)" style="margin-top:15px;display:block"></SaveButton>
        </div>
        <span v-if="loaded" ref="scrolltospan" class="show-phone"></span>
        <br v-if="loaded">
        
        <div v-if="loaded" class="box profile-nav-links">
            <nav class="nav nav-pills nav-justified">
                <router-link class="nav-link" @click="setActiveCls('posts', true)" :class="{'active':activecls.posts}" :to="'/page/'+page_slug+'?src=btn'">Posts</router-link>
                <router-link class="nav-link" @click="setActiveCls('info', true)" :class="{'active':activecls.info}" :to="'/page/info/'+page_slug+'?src=btn'">Info</router-link>
                
            </nav>
           
        
        </div>
        <br>
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
import EditIcon from 'vue-material-design-icons/SquareEditOutline.vue';
import EmailIcon from 'vue-material-design-icons/Email.vue';
import PlusIcon from 'vue-material-design-icons/Plus.vue';

import axios from 'axios';
import { constants } from '@/constants';

import common from '@/common';
import { Preferences } from '@capacitor/preferences';
import { useToast } from 'vue-toastification';
import router from './../../../routes/index';
import VuePictureSwipe from 'vue-picture-swipe';
import SaveButton from '../UI/SaveButton.vue';

export default {
    name: 'ViewPage',

    components:{
        FacebookIcon,
        TwitterIcon,
        InstagramIcon,
        LinkedinIcon,
        WhatsappIcon,
        EditIcon,
        EmailIcon,
        PlusIcon,
        VuePictureSwipe,
        SaveButton
       
    },
    data : function(){
        return {
            report_profile_flag: false,
            toast: useToast(),
            page_slug: '',
            loaded : false,
            activecls:{
                info:false,
                posts: false
            },
            email_follow: false,
            page: {}
        }
    },
    
    
    methods : {

        reportPage : function(page_id){
            let that = this;
            
            that.report_profile_flag = true;
            
            common.fetchToken(function(token){

                axios.post(constants.APIURL+'/report-page', {
                    page_id:page_id
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

        createNewPost : function(){
            router.push({
                path: '/page/new-post/'+this.page_slug
            });
        },

        emailFollow: function(){
            this.page.follower = !this.page.follower;

            let that = this;
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/follow-page', {
                    page_slug: that.page_slug,
                    follow:that.page.follower
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                   
                    
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
                        that.loaded = true;
                    }else{
                        that.loaded = true;
                        that.toast.error("Error: Please check your internet connection");
                    }
                })
            });
        },

        fetchPageOverview: function(){
            let that = this;
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-page-overview', {
                    page_slug: that.page_slug
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    
                    that.page = response.data;

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
                        that.loaded = true;
                    }else{
                        that.loaded = true;
                        that.toast.error("Error: Please check your internet connection");
                    }
                })
            });
        },

        showInfoToast : function(thetype){
            this.toast.info('This person is a '+thetype);
        },

        resetActive: function(){
            this.activecls.posts = false;
            this.activecls.info = false;
        },

        setActiveCls : function(pagetype, scroll){
           
            this.activecls.info = false;
            this.activecls.posts = false;
            
            if(pagetype == 'info'){
                this.activecls.info = true;
            }

            if(pagetype == 'posts'){
                this.activecls.posts = true;
            }

            

        },

        initialOperations: function(){
            
            let urlSegments = this.$route.path.split('/');
            let page_slug = urlSegments[(urlSegments.length-1)];
            
            this.page_slug = page_slug;

            
            /*this.setActiveCls(pagetype, false);*/
            window.scrollTo({ top: 0 });
            this.fetchPageOverview();
        }

    },
    
    watch:{
        $route (to, from){
            
            let urlSegments_to = to.fullPath.split('/');
            let urlSegments_from = from.fullPath.split('/');
            
            if(urlSegments_to[1] == 'page'){

                let temp_id_from = urlSegments_from[(urlSegments_from.length-1)];
                let temp_id_to = urlSegments_to[(urlSegments_to.length-1)];

                if(temp_id_from != temp_id_to){
                    if(this.$route.query.src != 'btn'){
                        this.loaded = false;
                        this.initialOperations();
                        window.scrollTo({ top: 0 });
                    }
                } 
                this.activecls.info = false;
                this.activecls.posts = false;
                if(urlSegments_to[2] == 'info'){
                    this.activecls.info = true;
                }else{
                    this.activecls.posts = true;
                }                
            }
            
           
           
        }
    },
    created(){
        this.initialOperations();
    },
    mounted(){

        let urlSegments_to = this.$route.path.split('/');

        if(urlSegments_to[1] == 'page'){
            
            if(urlSegments_to[2] == 'info'){
                this.activecls.info = true;
            }else{
                this.activecls.posts = true;
            }

        }

    }

}
</script>