<template>
   <div>
    
        <div v-if="!loaded">
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
        <div v-if="loaded && slides.length == 0">
            <h5>You are not following any pages.</h5>
        </div>

            
            <div class="feed-block box" v-for="(slide,z) in slides" :key="z">
                <div class="page-details">
                    <router-link :to="{ path:'/page/'+slide.slug }"><img :src="slide.profile_image" class="img-circle">&nbsp;
                    <strong>{{ slide.page_name }}</strong></router-link>
                </div>
                <br>
                <div class="post-text">
                    <p><strong>{{ slide.post_title }} - Posted on: {{ slide.created_at }}</strong></p>
                    <p v-html="slide.post_text"></p>
                </div>
                <div class="post-images">
                    
                        <div class="row">
                            <div class="">
                                <vue-picture-swipe :ref="'swiperef'" :items="slide.post_images"></vue-picture-swipe>
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
    import VuePictureSwipe from 'vue-picture-swipe';


    import SaveButton from '../UI/SaveButton.vue';

    export default{
       
        data : function(){
            return {
                loaded : false,
                toast:useToast(),
                slides: [],
                shown_results: 0,
                flag:true,
                lflag : false,
                per_flag:true,
                
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

                    axios.post(constants.APIURL+'/fetch-feed', {
                        offset:offset
                    }, {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }).then(response => {
                       
                        
                        for(let z = 0 ; z < response.data.length ; z++){
                            that.slides.push(response.data[z]);
                        }
                        that.shown_results += 10;
                        that.flag = true;
                       
                        if(response.data.length == 0){
                            that.per_flag = false;
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
        unmounted () {
            this.per_flag = false;
        },
        mounted(){
            window.scrollTo({
                top:0
            });
            this.fetchFeed(0);
            this.loadMore();
            
        },
        updated(){
            
            
        }
        
    }

</script>