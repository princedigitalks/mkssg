<template>
    <div>
        <div v-if="!loaded">
            <div class="box loading" style="height:200px"></div>
            <br />
            <div class="box loading" style="height:200px"></div>
            <br />
            <div class="box loading" style="height:200px"></div>
        </div>
        
        

        <div class="box p-4" v-if="loaded">
            <h5>{{ profile.first_name }} {{ profile.middle_name }} {{ profile.last_name }}</h5>
            <br>
            <input type="file" multiple ref="bio_images" @change="previewBioImages" class="display-none">
            <a href="javascript:;" class="btn btn-primary w-100" @click="launchImageSelector">Select Images</a>
            
            
            <div v-if="image_files_preview.length > 0">
                <br>
                <div class="row">
                    <div class="col-md-2 col-4" v-for="(i_preview, ifi) in image_files_preview" :key="ifi">
                        <img :src="i_preview" alt="" class="img img-fluid">
                        <a href="javascript:;" class="btn btn-sm btn-primary" style="display:block;margin-top:10px;" @click="removeImage(ifi)"><i class="fa fa-trash"></i>&nbsp;Delete</a>
                        <br>
                    </div>
                </div>
            </div>
            <div v-if="fetched_bio != null && fetched_bio.post_images.length > 0">
                <hr>
                <div class="row">
                    <div class="col-md-2 col-4 mt-2" v-for="(post_image,iz) in fetched_bio.post_images" :key="iz">
                        
                        <img :src="post_image.thumb" alt="" class="img-fluid img-rounded">
                        <a href="javascript:;" @click="removeBioImage(post_image.thumb, post_image.main, iz)" class="btn btn-primary btn-rounded btn-sm w-100 display-block mt-1">Delete</a>
                        
                    </div>
                </div>
            </div>
            <br>
            <br>
            <input type="file" ref="bio_file" @change="selectBioFile" class="display-none">
            <p v-if="typeof bio_file.name !== 'undefined'">Selected Bio file: {{ bio_file.name }}</p>
            <a href="javascript:;" class="btn btn-primary w-100" @click="launchBioFileSelector">Select Biodata File</a>
            <br>
            <br>
            <form action="javascript:;" method="POST">
                <div class="form-floating mb-3">
                    <textarea id="preferences" cols="30" rows="10" v-model="preferences" class="form-control rounded-3" style="min-height:120px"></textarea>
                    
                    <label for="preferences">Preferences</label>
                    
                </div>
                <div class="mt-2">
                    <SaveButton :loading="loading" buttonText="Save" :full_width="true" :big_button="true" icon="CheckIcon" @clicked="saveBio"></SaveButton>
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

import common from '@/common';
import { Preferences } from '@capacitor/preferences';
import { useToast } from 'vue-toastification';
import router from './../../../routes/index';
import VerifiedIcon from 'vue-material-design-icons/CheckDecagram.vue';
import SaveButton from '../UI/SaveButton.vue';

export default {
    name: 'UploadBio',

    components:{
        VerifiedIcon,
        SaveButton
    },
    data : function(){
        return {
           
            toast: useToast(),
            profile_id: '',
            profile: {},
            image_files: [],
            image_files_preview: [],
            bio_file: {},
            preferences: '',
            loaded: false,
            loading: false,
            fetched_bio: null
        }
    },
    methods : {

        getMimeType : function(header) {
            switch (header) {
                case '89504e47':
                return 'image/png';
                case '47494638':
                return 'image/gif';
                case 'ffd8ffe0':
                case 'ffd8ffe1':
                case 'ffd8ffe2':
                return 'image/jpeg';
                case '25504446':
                return 'application/pdf';
                case 'd0cf11e0':
                return 'application/msword';
                case '504b0304':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                default:
                return 'unknown';
            }
        },

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

        removeBioImage : function(thumb_image, main_image, index){

            this.fetched_bio.post_images.splice(index, 1);

            let that = this;
            common.fetchToken(function(token){
                    
                    axios.post(constants.APIURL+'/remove-bio-post-image', {
                        thumb_image:thumb_image,
                        main_image:main_image,
                        profile_id: that.profile_id
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
                           
                        }else{
                           
                            that.toast.error("Error: Please check your internet connection");
                        }
                    });
                });

        },

        validateBioFile: function(file) {
           
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
            const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];

           
            const fileType = file.type;
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (!allowedTypes.includes(fileType) || !allowedExtensions.includes(fileExtension)) {
                return false;
            }
           
            const reader = new FileReader();
            reader.onload = (event) => {
                const arr = new Uint8Array(event.target.result).subarray(0, 4);
                let header = '';
                for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
                }
                const mime = this.getMimeType(header);
                
                if (!allowedTypes.includes(mime)) {
                return false;
                }
            };

            reader.readAsArrayBuffer(file);

            return true;
        },

        launchImageSelector : function(){
            this.$refs.bio_images.click();
        },

        launchBioFileSelector : function(){
            this.$refs.bio_file.click();
        },

        removeImage : function(index){
            this.image_files.splice(index, 1);
            this.image_files_preview.splice(index, 1);
        },

        previewBioImages : function(){
            this.image_files = [];
            this.image_files_preview = [];
            if(this.$refs.bio_images.files.length > 3){
                this.toast.error('Only 3 images are allowed to upload');
            }else{
                
                for(let z = 0 ; z < this.$refs.bio_images.files.length ; z++){
                    if(!this.validateImageFile(this.$refs.bio_images.files[z])){
                        this.toast.error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
                        /*this.image_files = [];*/
                        break;
                    }else{
                        this.image_files.push(this.$refs.bio_images.files[z]);

                        
                        let reader = new FileReader();

                        reader.onload = (event) => {
                            this.image_files_preview.push(event.target.result);
                        };

                        reader.readAsDataURL(this.$refs.bio_images.files[z]);

                    }
                }

            }

            

            
        },

        selectBioFile : function(){
            
            if(!this.validateBioFile(this.$refs.bio_file.files[0])){
                this.toast.error("Only documents and images are allowed to upload with extentions doc, docx, pdf, jpg, png and jpeg");
            }else{
                this.bio_file = this.$refs.bio_file.files[0];
            }

        },

        saveBio : function(){
            
            if(typeof this.bio_file.name === 'undefined' && this.fetched_bio == null){
                this.toast.error("Please select the bio data file.");
            }else{

                this.loading = true;

                
                
                let that = this;
                const formData = new FormData();
                    
                    formData.append('bio_file', that.bio_file);
                    
                    that.image_files.forEach(tfile => {
                        formData.append('image_files[]', tfile);
                    });
                    formData.append('profile_id', that.profile_id);
                    formData.append('preferences', that.preferences);

            
                common.fetchToken(function(token){
                    
                    axios.post(constants.APIURL+'/upload-user-bio', formData,{
                        headers : {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(response => {
                        
                        that.toast.success(response.data);
                        that.validateProfileToListBio(that.profile_id);
                        that.image_files = [];
                        that.image_files_preview = [];
                        that.bio_file = {};
                        
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

        validateProfileToListBio : function(profile_id){

            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-for-bio', {profile_id:profile_id, token:token},{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    that.profile = response.data.profile;
                    that.fetched_bio = response.data.bio;
                    that.loaded = true;
                    
                    if(that.fetched_bio != null){
                        that.preferences = that.fetched_bio.preferences_text;
                        for(let x = 0 ; x < that.fetched_bio.post_images.length ; x++){
                            that.fetched_bio.post_images[x].main = that.fetched_bio.post_images[x].main+'&ref='+Math.random();
                            that.fetched_bio.post_images[x].thumb = that.fetched_bio.post_images[x].thumb+'&ref='+Math.random();
                        }
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
    mounted(){
        let urlSegments = this.$route.path.split('/');
        let profile_id = urlSegments[(urlSegments.length-1)];
        
        if(profile_id == ''){
            profile_id = urlSegments[(urlSegments.length-2)];
            
        }
        this.profile_id = profile_id;
        
        this.validateProfileToListBio(profile_id);
       
    }

}
</script>