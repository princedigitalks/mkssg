<template>
    <div>
       <div>
            <router-link :to="'/edit-profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back</router-link>
            &nbsp;
            <router-link :to="'/profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back to profile</router-link>
            <br>
            
            <br>
            <p>Note: Education, from year and degree fields are required to save entries.</p>
            <div v-if="!loaded">
                <div class="box loading" style="min-height:170px"></div>
                <br>
                <div class="box loading" style="min-height:170px"></div>
                <br>
                <div class="box loading" style="min-height:170px"></div>
                <br>
                <div class="box loading" style="min-height:170px"></div>
                <br>
                <div class="box loading" style="min-height:170px"></div>
            </div>
            <form action="javascript:;" method="POST" v-if="loaded">
                <div class="box p-4 pb-2 mt-4" v-for="(edu, ei) in education" :key="ei"> 
                    <a href="javascript:;" class="btn btn-primary" @click="removeEducation(ei)"><TrashIcon /></a>
                    <div class="clearfix"></div>
                    <br>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <input class="form-control rounded-3" id="education" v-model="edu.education" type="text" placeholder="Enter area name">
                                <label for="education">Education</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <input class="form-control rounded-3" id="degree" v-model="edu.degree" type="text" placeholder="Enter area name">
                                <label for="degree">Degree</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <input class="form-control rounded-3" id="from_year" v-model="edu.from_year" type="number" placeholder="Enter area name">
                                <label for="from_year">From year</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <input class="form-control rounded-3" id="to_year" v-model="edu.to_year" @keyup="eraseCheck(edu.to_year, ei)" type="number" placeholder="Enter area name">
                                <label for="to_year">To year</label>
                            </div>
                            
                            &nbsp;<label><input type="checkbox" v-model="edu.current" @click="eraseToYear(edu.current, ei)">&nbsp;Current</label>
                            
                        </div>
                    </div>
                    <br>
                    <div class="form-floating mb-3">
                        <textarea v-model="edu.description" class="form-control" id="description" cols="30" rows="10" style="min-height:120px"></textarea>
                        <label for="description">Description</label>
                    </div>
                    <br>
                    
                </div>
               
                <div class="mt-4">
                    <SaveButton :loading="false" buttonText="Add New" :full_width="true" :big_button="true" @clicked="addNewEducation"></SaveButton>
                </div>
                
                <div class="mt-4">
                    <SaveButton :loading="loading" buttonText="Save" :full_width="true" :big_button="true" icon="CheckIcon" @clicked="saveEducation"></SaveButton>
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
import BackIcon from 'vue-material-design-icons/ArrowLeft.vue';
import TrashIcon from 'vue-material-design-icons/TrashCan.vue';

export default {
    name: 'EditProfileEducation',
    components:{
        BackIcon,
        TrashIcon,
        SaveButton
    },
    data : function(){
        return {
                loaded : false,
                toast:useToast(),
                loading: false,
                education:[],
                profile_id: ''
            }
    },
   
    methods : {

        eraseToYear : function(checkval, index){
            if(!checkval){
                this.education[index].to_year = '';
            }
        },

        eraseCheck: function(toval, index){
            
            if(toval > 100){
                this.education[index].current = false;
            }else if(toval < 100 || toval < 9){
                this.education[index].current = true;
            }
        },

        addNewEducation : function(){
            this.education.push({
                education : '',
                from_year : '',
                to_year : '',
                description : '',
                degree : ''
            });
        },

        removeEducation : function(index){
            this.education.splice(index, 1);
        },

        saveEducation : function(){

            let that = this;
            this.loading = true;
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/save-profile-education-after-edit/'+that.profile_id, { ed: that.education },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {

                    that.toast.success(response.data);
                   
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
                            that.loading = false;

                        }
                    
                    }else{
                        that.toast.error("Error: Please check your internet connection");
                        that.loading = false;
                    }
                });
            });

        },

        fetchEducation: function(profile_id){
            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-education-to-edit', {
                    profile_id: profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {

                    for(let z = 0 ; z < response.data.length ; z++){
                        that.education.push(response.data[z]);
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
    mounted(){

        let urlSegments = this.$route.path.split('/');
        let profile_id = urlSegments[(urlSegments.length-1)];
       
        
        this.profile_id = profile_id;

        this.fetchEducation(profile_id);


    }
}
</script>