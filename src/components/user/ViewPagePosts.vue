<template>
    <div>
     
         <div v-if="slides.length == 0">
             <div class="feed-block box" v-for="(slide_a,za) in 6" :key="za">
                 <div class="page-details">
                     <div class="loading" style="height:50px;width:50px;border-radius: 250px;float:left;margin:0 auto"></div>&nbsp;&nbsp;<p class="loading" style="width:150px;margin-left:70px;margin-top:-22px"><br /><br /></p>
                     <div class="clearfix"></div>
                     
                 </div>
                 <br>
                 <div class="post-text">
                     <p class="loading">
                         <br>
                         <br>
                     </p>
                     <p class="loading">
                         <br>
                         <br>
                     </p>
                     <p class="loading">
                         <br>
                         <br>
                     </p>
                 </div>
                 <div class="post-images">
                     <p class="loading">
                         <br>
                         <br>
                         <br>
                         <br>
                         <br>
                         <br>
                     </p>
                 </div>
             </div>
         </div>
 
         
             <div class="feed-block box" v-for="(slide,z) in slides" :key="z">
                 <div class="page-details">
                     <router-link :to="{ path:'/page/'+slide.slug }"><img :src="slide.profile_image" class="img-circle">&nbsp;
                     <strong>{{ slide.page_name }}</strong></router-link>
                 </div>
                 <br>
                 <div class="post-text">
                    
                     <p><strong>{{ slide.post_title }} - Posted on: {{ slide.created_at }}</strong> <a v-if="page_admin_flag" href="javascript:;" class="btn btn-primary btn-sm" @click="deletePagePost(slide.page_id, slide.post_id, z)">Delete</a></p>
                     <p v-html="slide.post_text"></p>
                 </div>
                 <div class="post-images">
                     
                         <div class="row">
                             <div class="">
                                <vue-picture-swipe ref="swiperef_pp" :items="slide.post_images"></vue-picture-swipe>
                             
                     </div>
                         </div>
                         
                         
                 </div>
                 <SaveButton :loading="slide.report_post_flag" buttonText="Report" :full_width="true" :big_button="false" @clicked="reportPost(z)"></SaveButton>
         </div>
         
    </div>
 </template>
 <style scoped>
 
    
 
     .feed-block{
         padding:25px;
         margin-bottom:25px;
     }
     
    
 </style>
 <script>
     
     
    import axios from 'axios';
    import { constants } from '@/constants';
    import common from '@/common';
    import router from './../../../routes/index';
    import { Preferences } from '@capacitor/preferences';
    import { useToast } from "vue-toastification";
 
    import SaveButton from '../UI/SaveButton.vue';
   

    import VuePictureSwipe from 'vue-picture-swipe';
 
     
    export default{
    
        data : function(){
            return {
                toast:useToast(),
                slides: [],
                shown_results: 0,
                page_admin_flag:false,
                flag:true,
                per_flag:true,
                page_slug: '',
                settings: {
                    itemsToShow: 4,
            
                },
                breakpoints: {
                    
                    1: {
                        itemsToShow: 2,
                    
                    },
                    700: {
                        itemsToShow: 4,
                    
                    },
                    
                    1024: {
                        itemsToShow: 6,
                    
                    }
                }
            }
        },
        components:{
            
            VuePictureSwipe,
            SaveButton
        },
        computed: {
            
        },
        methods : {

        reportPost : function(ind){
                let that = this;
                let selectedItem = this.slides[ind];
                selectedItem.report_post_flag = true;
                
                common.fetchToken(function(token){

                    axios.post(constants.APIURL+'/report-page-post', {
                        post_id:selectedItem.post_id
                    }, {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }).then(response => {
                       
                        selectedItem.report_post_flag = false;
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
                            selectedItem.report_post_flag = false;
                        }else{
                            selectedItem.report_post_flag = false;
                            that.toast.error("Error: Please check your internet connection");
                        }

                    });

                });
            },

        deletePagePost : function(page_id, post_id, index){
            
            this.slides.splice(index, 1);

            let that = this;
            common.fetchToken(function(token){

                axios.post(constants.APIURL+'/remove-page-post', {
                    page_id:page_id,
                    post_id: post_id
                }, {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }).then(response => {
                    
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
                    
                    }else{
                        that.toast.error("Error: Please check your internet connection");
                    }

                });

            });
        },

        

        loadMore: function(el){
            let that = this;
            window.onscroll = () => {
                
                if((document.documentElement.scrollTop + window.innerHeight) >= (document.documentElement.offsetHeight-100) && that.flag == true && that.per_flag == true){
                    that.flag = false;
                    that.fetchFeed(that.shown_results);
                }

                
                
                
            }
        },
            
            
        fetchFeed : function(offset){
            let that = this;
            common.fetchToken(function(token){

                axios.post(constants.APIURL+'/fetch-page-feed', {
                    offset:offset,
                    page_slug: that.page_slug
                }, {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }).then(response => {
                    
                    that.page_admin_flag = response.data.page_admin_flag;
                    for(let z = 0 ; z < response.data.posts.length ; z++){
                        that.slides.push(response.data.posts[z]);
                    }
                    that.shown_results += 10;
                    that.flag = true;
                
                    if(response.data.posts.length == 0){
                        that.per_flag = false;
                    }
                    
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
        /* use this if needed. */
        this.per_flag = true;
    
    },
    unmounted () {
        this.per_flag = false;
    },
    mounted(){

    let urlSegments = this.$route.path.split('/');

    let page_slug = urlSegments[(urlSegments.length-1)];
    this.page_slug = page_slug;

    this.fetchFeed(0);
    this.loadMore();
        
    },
    updated(){
        
        
    }
        
    }
 
 </script>