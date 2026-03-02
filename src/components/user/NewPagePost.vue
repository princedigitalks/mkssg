<template>
    <div>
        <div class="box p-4">
            <h5>Create a new post</h5>
            <br>
            <form action="javascript:;" method="POST" class="form-floating-space" id="searchForm">                
                <div class="form-floating mb-3">
                    <input class="form-control rounded-3" id="post_title" type="text" v-model="page_post.post_title" placeholder="Enter title">
                    <label for="post_title">Post title</label>
                    <div v-if="page_post.post_title == '' && page_post.submit" class="html-error">Living city is required.</div>
                </div>

                <div class="form-floating mb-3">
                    <textarea id="post_text" cols="30" rows="10" class="form-control" v-model="page_post.post_text" style="min-height:150px"></textarea>
                    <label for="post_text">Post text</label>
                    <div v-if="page_post.post_text == '' && page_post.submit" class="html-error">Living city is required.</div>
                </div>

                
                <input type="file" ref="post_images" multiple class="display-none" @change="previewNewPostImages">
                <a href="javascript:;" class="btn btn-primary btn-sm w-100 display-block" @click="launchPostImagesSelector">SELECT IMAGES</a>
                
                <div v-if="page_post.post_images_preview.length > 0">
                        
                    <br>
                    <div class="row">
                        <div class="col-md-2 col-4" v-for="(i_preview, ifi) in page_post.post_images_preview" :key="ifi">
                           
                            <img :src="i_preview" alt="" class="img img-fluid">
                            <a href="javascript:;" class="btn btn-sm btn-primary" style="display:block;margin-top:10px;" @click="removeImage(ifi)"><i class="fa fa-trash"></i>&nbsp;Delete</a>
                            <br>
                        </div>
                    </div>
                </div>
                <br>
                
                <div class="mb-3">
                    <label><input type="checkbox" v-model="page_post.app_notification">&nbsp;Notify the followers about this post via app notification</label>
                    <br>
                    <br>
                    <label><input type="checkbox" v-model="page_post.email_notification">&nbsp;Notify the followers about this post via email</label>
                </div>

                <div class="mt-4">
                    <SaveButton :loading="loading" buttonText="Publish" :full_width="true" :big_button="true" icon="RocketIcon" @clicked="publishPagePost"></SaveButton>
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

export default {
    name: 'NewPagePost',
    components:{
        SaveButton
    },
    data : function(){
        return {
                toast : useToast(),
                page_slug: '',
                loading: false,
                page_post: {
                    submit: false,
                    post_title: '',
                    post_text: '',
                    post_images:[],
                    post_images_preview:[],
                    app_notification: true,
                    app_notification_str: 'yay',
                    email_notification: false,
                    email_notification_str: 'nope'
                }
            }
    },

    watch: {

        'page_post.email_notification' : function(fromval, toval){
            
            if(fromval == true){
                this.page_post.email_notification_str = 'yay';
            }else{
                this.page_post.email_notification_str = 'nope';
            }
        },

        'page_post.app_notification' : function(fromval, toval){
            
            if(fromval == true){
                this.page_post.app_notification_str = 'yay';
            }else{
                this.page_post.app_notification_str = 'nope';
            }

            
        }

    },

    methods : {

        validatePostImageFile: function(file) {
           
            const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
            
            if (!allowedExtensions.exec(file.name)) {
                return false;
            }
            
            if (!allowedMimeTypes.includes(file.type)) {   
                return false;
            }
            return true;
        },

        removeImage : function(index){
            this.page_post.post_images.splice(index, 1);
            this.page_post.post_images_preview.splice(index, 1);
        },

        launchPostImagesSelector : function(){

            this.$refs.post_images.click();

        },

        previewNewPostImages : function(){

            let validated_good_images = true;

            this.page_post.post_images = [];
            this.page_post.post_images_preview = [];

            if(this.$refs.post_images.files.length > 10){

                this.toast.error('Only 10 image files are allowed to upload at once.');
                validated_good_images = false;

            }else{

                for(let z = 0 ; z < this.$refs.post_images.files.length ; z++){
                
                    if(!this.validatePostImageFile(this.$refs.post_images.files[z])){
                        validated_good_images = false;
                        this.toast.error('Only image files allowed with extentions of JPG, PNG and GIF.');
                        break;
                    }else{
                        
                        let reader = new FileReader();

                        reader.onload = (event) => {
                            this.page_post.post_images_preview.push(event.target.result);
                        };

                        reader.readAsDataURL(this.$refs.post_images.files[z]);

                        
                        

                    }

                }

                if(validated_good_images){
                    this.page_post.post_images = this.$refs.post_images.files;
                }else{
                    this.page_post.post_images = [];
                    this.page_post.post_images_preview = [];
                }

               
            }

        },

        publishPagePost : function(){

            this.page_post.submit = true;

            if(this.page_post.post_title.trim() != '' && this.page_post.post_text.trim() != ''){

                this.loading = true;

                let that = this;
                const formData = new FormData();
                
                /*console.log(that.page_post.post_images);
                that.page_post.post_images.forEach(tfile => {
                    formData.append('post_images[]', tfile);
                });*/
                for(let x = 0 ; x < that.page_post.post_images.length ; x++){
                    formData.append('post_images[]', that.page_post.post_images[x]);
                }
                
                formData.append('post_title', that.page_post.post_title);
                formData.append('post_text', that.page_post.post_text);
                formData.append('app_notification', that.page_post.app_notification);
                formData.append('email_notification', that.page_post.email_notification);
                formData.append('email_notification_str', that.page_post.email_notification_str);
                formData.append('app_notification_str', that.page_post.app_notification_str);
                formData.append('page_slug', that.page_slug);

                
                common.fetchToken(function(token){
                    
                    axios.post(constants.APIURL+'/publish-page-post', formData,{
                        headers : {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(response => {
                        
                        /*that.toast.success(response.data);
                        that.validateProfileToListBio(that.profile_id);
                        that.image_files = [];
                        that.image_files_preview = [];
                        that.bio_file = {};
                        */
                        that.loading = false;
                        that.page_post.submit = false;
                        that.page_post.post_images = [];
                        that.page_post.post_images_preview = [];
                        that.page_post.post_text = '';
                        that.page_post.post_title = '';
                        that.page_post.email_notification = false;
                        that.page_post.email_notification_str = 'nope';
                        that.page_post.app_notification = true;
                        that.page_post.app_notification_str = 'yay';
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

            }else{
                this.toast.error("Please enter post title and post text to publish a post");
            }

            
            
        }

       

    },
    mounted(){

        let urlSegments = this.$route.path.split('/');
        let page_slug = urlSegments[(urlSegments.length-1)];
        this.page_slug = page_slug;
        

    }
}
</script>