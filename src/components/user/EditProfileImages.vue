<template>
    <div>
        <div>
            <router-link :to="'/edit-profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back</router-link>
            <br>
            <br>
            <div v-if="!coverboxloaded" class="box loading" style="height:300px"></div>

            <div class="box p-4" v-if="coverboxloaded">
                <h5 class="pb-2">Modify profile image</h5>
                <img :src="profile_image" alt="" class="img img-fluid img-circle" v-if="!show_profile_cropper">
                <br>
                <cropper ref="cropper" v-if="show_profile_cropper" :src="raw_profile_image" class="cropper" :stencil-props="{ aspectRatio: 1/1 }" />
                <div class="mt-2" v-if="show_profile_cropper">
                    <SaveButton :loading="loadingCropProfile" buttonText="Save image" :full_width="true" :big_button="false" icon="SaveIcon" @clicked="saveProfileImage"></SaveButton>
                </div>
                <div class="mt-2">
                    <input type="file" ref="new_profile" class="display-none" @change="profileFileChange">
                    <SaveButton buttonText="Upload new image" :full_width="true" :big_button="false" icon="UploadIcon" @clicked="uploadNewProfileImage"></SaveButton>
                </div>
                <div class="mt-2" v-if="remove_profile">
                    <SaveButton :loading="loadingRemoveProfile" buttonText="Remove current image" :full_width="true" :big_button="false" icon="CloseIcon" @clicked="removeCurrentProfileImage"></SaveButton>
                </div>
            </div>
        </div>
       <div>

            <div v-if="!coverboxloaded" class="box loading" style="height:300px"></div>
            <br>
            <div class="box p-4" v-if="coverboxloaded">
                <h5 class="pb-2">Modify cover image</h5>
                <img :src="cover_image" alt="" class="img img-fluid" v-if="!show_cover_cropper">
                <br>
                <cropper ref="cropper" v-if="show_cover_cropper" :src="raw_cover_image" class="cropper" :stencil-props="{ aspectRatio: 16/5.3 }" />
                <div class="mt-2" v-if="show_cover_cropper">
                    <SaveButton :loading="loadingCropCover" buttonText="Save image" :full_width="true" :big_button="false" icon="SaveIcon" @clicked="saveCoverImage"></SaveButton>
                </div>
                <div class="mt-2">
                    <input type="file" ref="new_cover" class="display-none" @change="coverFileChange">
                    <SaveButton :loading="loading" buttonText="Upload new image" :full_width="true" :big_button="false" icon="UploadIcon" @clicked="uploadNewCoverImage"></SaveButton>
                </div>
                <div class="mt-2" v-if="remove_cover">
                    <SaveButton :loading="loadingRemoveCover" buttonText="Remove current image" :full_width="true" :big_button="false" icon="SaveIcon" @clicked="removeCurrentCoverImage"></SaveButton>
                </div>
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
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import BackIcon from 'vue-material-design-icons/ArrowLeft.vue';

export default {
    name: 'EditProfileImages',
    components:{
        SaveButton,
        Cropper,
        BackIcon
    },
    data : function(){
        return {

                coverboxloaded: false,
                show_profile_cropper: false,
                raw_profile_image: '',
                loadingCropProfile: false,
                loadingRemoveProfile: false,

                loading : false,
                loadingRemoveCover: false,
                loadingCropCover: false,
                profile_id: '',
                donations: [],
                toast: useToast(),
                loaded: false,
                profile_image : '',
                profile_image_thumb : '',
                cover_image : '',
                remove_cover : true,
                remove_profile : true,
                raw_cover_image: '',
                submit_cover_image: '',
                submit_profile_image: '',
                cover_image_static: '',
                show_cover_cropper: false
            }
    },
    methods : {

        validateImageFile: function(file) {
           
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


        coverFileChange: function(e){

            const file = e.target.files[0];
            this.submit_cover_image = '';
            
            if(!this.validateImageFile(file)){
                this.toast.error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
            }
            if (file && this.validateImageFile(file)) {
                const reader = new FileReader();
                reader.onload = (event) => {
                this.raw_cover_image = event.target.result;
                this.show_cover_cropper = true;
                };
                reader.readAsDataURL(file);
            }

        },

        profileFileChange : function(e){
            const file = e.target.files[0];
            this.submit_profile_image = '';
            
            if(!this.validateImageFile(file)){
                this.toast.error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
            }
            if (file && this.validateImageFile(file)) {
                const reader = new FileReader();
                reader.onload = (event) => {
                this.raw_profile_image = event.target.result;
                this.show_profile_cropper = true;
                };
                reader.readAsDataURL(file);
            }
        },

        saveProfileImage : function(){

            this.loadingCropProfile = true;

            setTimeout(() => {
                let croppedprofileimage = this.$refs.cropper.getResult();
                this.submit_profile_image = croppedprofileimage.canvas.toDataURL('image/png');
                

                let that = this;

                common.fetchToken(function(token){
                    axios.post(constants.APIURL+'/save-profile-image', {
                        profile_id:that.profile_id,
                        submit_profile_image:that.submit_profile_image
                    },{
                        headers : {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(response => {
                        
                    /*that.cover_image = that.cover_image+'&refresh='+Math.random();
                    that.loadingRemoveCover = false;
                    that.remove_cover = false;*/
                    that.show_profile_cropper = false;
                    that.loadingCropProfile = false;
                    that.fetchProfileImages(that.profile_id);
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
                                that.loadingRemoveProfile = false;
                                that.show_profile_cropper = false;
                                that.loadingCropProfile = false;

                            }
                        
                        }else{
                            that.toast.error("Error: Please check your internet connection");
                            that.loadingRemoveProfile = false;
                            that.show_profile_cropper = false;
                            that.loadingCropProfile = false;
                        }
                    });
                });
            }, 100);

            

        },

        saveCoverImage: function(){

            this.loadingCropCover = true;

            setTimeout(() => {
                
                let croppedcoverimage = this.$refs.cropper.getResult();
                this.submit_cover_image = croppedcoverimage.canvas.toDataURL('image/png');
                

                let that = this;

                common.fetchToken(function(token){
                    axios.post(constants.APIURL+'/save-cover-image', {
                        profile_id:that.profile_id,
                        submit_cover_image:that.submit_cover_image
                    },{
                        headers : {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(response => {
                        
                        
                        that.show_cover_cropper = false;
                        that.loadingCropCover = false;
                        that.cover_image = that.cover_image_static+'&refresh='+Math.random();
                        that.toast.success(response.data);
                        that.fetchProfileImages(that.profile_id);
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
                                that.loadingRemoveCover = false;
                                that.show_cover_cropper = false;
                                that.loadingCropCover = false;
                            }
                        
                        }else{
                            that.toast.error("Error: Please check your internet connection");
                            that.loadingRemoveCover = false;

                            that.show_cover_cropper = false;
                            that.loadingCropCover = false;

                        }
                    });
                });

            }, 100);

            

        },

        uploadNewCoverImage : function(){
            this.$refs.new_cover.click();
        },

        uploadNewProfileImage : function(){
            this.$refs.new_profile.click();
        },

        removeCurrentProfileImage: function(){

            this.loadingRemoveProfile = true;
            let that = this;

            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/remove-profile-image', {
                    profile_id:that.profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                   
                   that.profile_image = that.profile_image+'&refresh='+Math.random();
                   that.loadingRemoveProfile = false;
                   that.remove_profile = false;
                   that.fetchProfileImages(that.profile_id);
                    
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
                            that.loadingRemoveCover = false;

                        }
                    
                    }else{
                        that.toast.error("Error: Please check your internet connection");
                        that.loadingRemoveCover = false;
                    }
                });
            });

        },

        removeCurrentCoverImage : function(){

            this.loadingRemoveCover = true;
            let that = this;

            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/remove-cover-image', {
                    profile_id:that.profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                   
                   that.cover_image = that.cover_image+'&refresh='+Math.random();
                   that.loadingRemoveCover = false;
                   that.remove_cover = false;
                   that.fetchProfileImages(that.profile_id);
                    
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
                            that.loadingRemoveCover = false;

                        }
                    
                    }else{
                        that.toast.error("Error: Please check your internet connection");
                        that.loadingRemoveCover = false;
                    }
                });
            });


        },

        fetchProfileImages: function(pid){
            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-images', {
                    profile_id:pid
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    

                    that.profile_image_static = response.data.profile_image+'&math='+Math.random();
                    that.profile_image = response.data.profile_image+'&math='+Math.random();
                    that.profile_image_thumb = response.data.profile_image_thumb+'&math='+Math.random();
                    that.cover_image_static = response.data.cover_image+'&math='+Math.random();
                    that.cover_image = response.data.cover_image+'&math='+Math.random();
                    
                    that.remove_cover = response.data.remove_cover;
                    that.remove_profile = response.data.remove_profile;
                    
                    that.loaded = true;
                    that.coverboxloaded = true;
                    
                    
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

        this.fetchProfileImages(this.profile_id);

    }
}
</script>