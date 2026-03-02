<template>
    <div>
        <div>
            <router-link :to="'/edit-profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back</router-link>
            &nbsp;
            <router-link :to="'/profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back to profile</router-link>
            <br>
            <br>
            <div v-if="!loaded">
                <div class="box loading" style="height:200px"></div>
                <br>
                <div class="box loading" style="height:200px"></div>
                <br>
                <div class="box loading" style="height:200px"></div>
            </div>
            
            
            
            <div class="box p-4" v-if="loaded">
                <form action="javascript:;" method="POST">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <input class="form-control rounded-3" id="area_name" v-model="info.area_name" type="text" placeholder="Enter area name">
                                <label for="area_name">Area name</label>
                                <div v-if="info.area_name == '' && info.submit" class="html-error">Area name is required.</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <input class="form-control rounded-3" id="relation" v-model="info.relation" type="text" placeholder="Enter relation">
                                <label for="relation">Relation</label>
                                <div v-if="info.relation == '' && info.submit" class="html-error">Relaton is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <select id="marriage_status" class="form-control" v-model="info.marriage_status">
                                    <option value="">Select</option>
                                    <option value="0">Unmarried</option>
                                    <option value="1">Married</option>
                                    <option value="2">Engaged</option>
                                    <option value="3">Divorced</option>
                                    <option value="4">Widow/Widower</option>
                                </select>
                                <label for="marriage_status">Marriage Status</label>
                                <div v-if="info.marriage_status == '' && info.submit" class="html-error">Marriage status is required.</div>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <input class="form-control rounded-3" id="mothers_native" v-model="info.mothers_native" type="text" placeholder="Enter mosal">
                                <label for="mothers_native">Mosal</label>
                                <div v-if="info.mothers_native == '' && info.submit" class="html-error">Mosal is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <select id="gender" :disabled="!info.gender_editable" class="form-control" v-model="info.gender">
                                    <option value="">Select</option>
                                    <option value="1">Male</option>
                                    <option value="0">Female</option>
                                </select>
                                <label for="gender">Gender</label>
                                <div v-if="info.gender == '' && info.submit" class="html-error">Gender is required.</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                
                                <VueDatePicker :disabled="!info.bithdate_editable" class="rounded-3" hide-input-icon input-class-name="dp-custom-input" format="dd-MM-yyyy" placeholder="Select Birth date" v-model="info.birth_date" :enable-time-picker="false" locale="en"></VueDatePicker>
                                
                                <div v-if="(info.birth_date == '' || info.birth_date == null) && info.submit" class="html-error">Birthdate is required.</div>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                
                                <input class="form-control rounded-3" id="education" v-model="info.education" type="text" placeholder="Enter education">
                                <label for="education">Education</label>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                <select id="blood_group" class="form-control" v-model="info.blood_group">
                                    <option value="">Select</option>
                                    <option value="O">O</option>
                                    <option value="A">A</option>
                                    <option value="B">B</option>
                                    <option value="AB">AB</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="RO Subtype">RO Subtype</option>
                                </select>
                                <label for="blood_group">Blood Group</label>
                            </div>
                        </div>
                        
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                
                                <input class="form-control rounded-3" id="profession" v-model="info.profession" type="text" placeholder="Enter profession">
                                <label for="profession">Profession</label>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                
                                <input class="form-control rounded-3" id="whatsapp_number" v-model="info.whatsapp_number" type="number" placeholder="Enter WhatsApp number">
                                <label for="whatsapp_number">WhatsApp number</label>
                                
                            </div>
                        </div>
                        
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                
                                <input class="form-control rounded-3" id="living_city" v-model="info.living_city" type="text" placeholder="Enter Living city">
                                <label for="living_city">Living city</label>
                                <div v-if="info.living_city == '' && info.submit" class="html-error">Living city is required.</div>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                
                                <input class="form-control rounded-3" id="website" v-model="info.website" type="text" placeholder="Enter website">
                                <label for="website">Website</label>
                                
                            </div>
                        </div>
                        
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                
                                <input class="form-control rounded-3" id="nickname" v-model="info.nickname" type="text" placeholder="Enter Nickname">
                                <label for="nickname">Nickname</label>
                                
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="form-floating mb-3">
                                
                                <input class="form-control rounded-3" id="vatan" v-model="info.vatan" type="text" placeholder="Enter vatan">
                                <label for="vatan">Vatan</label>
                                
                            </div>
                        </div>
                        
                    </div>

                    <div class="form-floating mb-3">
                        <textarea id="about_me" cols="30" rows="10" v-model="info.about_me" class="form-control rounded-3" style="min-height:120px"></textarea>
                        
                        <label for="about_me">About me</label>
                        
                    </div>

                    <div class="form-floating mb-3">
                        <textarea id="home_adress" cols="30" rows="10" v-model="info.home_address" class="form-control rounded-3" style="min-height:120px"></textarea>
                        
                        <label for="home_adress">Home Address</label>
                        <div v-if="info.home_address == '' && info.submit" class="html-error">Home address is required.</div>
                        
                    </div>

                    <div class="form-floating mb-3">
                        <textarea id="work_adress" cols="30" rows="10" v-model="info.work_address" class="form-control rounded-3" style="min-height:120px"></textarea>
                        
                        <label for="work_adress">Work Address</label>
                        
                    </div>

                    <div class="mt-2">
                        <SaveButton :loading="loading" buttonText="Save" :full_width="true" :big_button="true" icon="CheckIcon" @clicked="saveInfo"></SaveButton>
                    </div>

                </form>
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
import BackIcon from 'vue-material-design-icons/ArrowLeft.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    name: 'EditProfileInfo',
    components:{
        SaveButton,
        BackIcon,
        VueDatePicker
    },
    data : function(){
        return {
                loading: false,
                loaded: false,
                profile_id: '',
                birthdate_disabled: false,
                gender_disabled: false,
                toast: useToast(),
                info: {
                    profile_id: '',
                    submit: false,
                    area_name : '',
                    relation : '',
                    marriage_status : '',
                    gender: '',
                    birth_date: '',
                    blood_group: '',
                    profession: '',
                    whatsapp_number: '',
                    living_city: '',
                    website: '',
                    nickname: '',
                    about_me: '',
                    home_address: '',
                    work_address: '',
                    mothers_native: '',
                    bithdate_editable: false,
                    gender_editable: false
                }
            }
    },
    methods : {

        fetchProfileInfo : function(profile_id){

            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-info-to-edit', {
                    profile_id: profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    that.info = response.data;
                    
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

        saveInfo: function(){
            
            this.info.submit = true;
            if(this.info.area_name == '' || this.info.relation == '' || this.info.marriage_status == '' || this.info.mothers_native == '' || this.info.gender == '' || this.info.birth_date == '' || this.info.living_city == '' || this.info.home_address == ''){
                
                this.toast.error("Error: Please enter all required fields");
                
            }else{
                
                this.loading = true;

                let that = this;
                that.info.profile_id = that.profile_id;
                common.fetchToken(function(token){
                    axios.post(constants.APIURL+'/save-edited-profile', that.info,{
                        headers : {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(response => {
                       
                        that.loading = false;
                        that.fetchProfileInfo(that.profile_id);
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


            }

            
        }


    },
    created(){
        
    },
    mounted(){

        let urlSegments = this.$route.path.split('/');
        let profile_id = urlSegments[(urlSegments.length-1)];
        this.profile_id = profile_id;
        this.fetchProfileInfo(profile_id);
    }
}
</script>