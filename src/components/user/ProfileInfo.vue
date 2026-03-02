<template>
    <div>
        
        <br>

        <div v-if="!loaded">
            <div class="box loading" style="height:200px;"></div>
            <br>
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

        <div class="profile-about-block" v-if="loaded">
            <div class="box p-4 pb-2">
                <p><strong>About me</strong></p>
                <p v-html="profile.about_me"></p>
            </div>
            <br>
            <div class="row">
                <div class="col-md-6">
                    <div class="box p-4 profile-infobox" ref="infobox1">
                        <p><strong>Personal Info</strong></p>
                        <table class="table table-info">
                            <tr>
                                <td>Form number</td>
                                <td>{{ profile.form_number }}</td>
                            </tr>
                            <tr>
                                <td>First name</td>
                                <td>{{ profile.first_name }}</td>
                            </tr>
                            <tr>
                                <td>Father's/Husband's name</td>
                                <td>{{ profile.middle_name }}</td>
                            </tr>
                            <tr>
                                <td>Lastname/Surname</td>
                                <td>{{ profile.last_name }}</td>
                            </tr>
                            <tr>
                                <td>Relation</td>
                                <td>{{ profile.relation }}</td>
                            </tr>
                            <tr>
                                <td>Marriage status</td>
                                <td>{{ profile.marriage_status }}</td>
                            </tr>
                            <tr>
                                <td>Education</td>
                                <td>{{ profile.education }}</td>
                            </tr>
                            <tr>
                                <td>Blood group</td>
                                <td>{{ profile.blood_group }}</td>
                            </tr>
                            <tr>
                                <td>Age</td>
                                <td><span v-html="profile.age"></span><br />{{ profile.birth_date }}</td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td>{{ profile.gender }}</td>
                            </tr>
                            <tr>
                                <td>Mosal</td>
                                <td>{{ profile.mothers_native }}</td>
                            </tr>
                            <tr>
                                <td>Profession</td>
                                <td>{{ profile.profession }}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <br class="show-phone">
                    <div class="box p-4 profile-infobox" ref="infobox2">
                        <p><strong>Contact Info</strong></p>
                        <table class="table table-info">
                            <tr>
                                <td>Area name</td>
                                <td>{{ profile.area_name }}</td>
                            </tr>
                            <tr>
                                <td>Phone</td>
                                <td>{{ profile.phone }}</td>
                            </tr>
                            <tr>
                                <td>WhatsApp</td>
                                <td>{{ profile.whatsapp_number }}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{{ profile.email }}</td>
                            </tr>
                            <tr>
                                <td>Living city</td>
                                <td>{{ profile.living_city }}</td>
                            </tr>
                            <tr>
                                <td>Website</td>
                                <td>{{ profile.website }}</td>
                            </tr>
                            <tr>
                                <td>Vatan</td>
                                <td>{{ profile.vatan }}</td>
                            </tr>
                            <tr colspan="2">
                                <td>Home address</td>
                                <td v-html="profile.home_address"></td>
                            </tr>
                            <tr colspan="2">
                                <td>Work address</td>
                                <td v-html="profile.work_address"></td>
                            </tr>
                            
                        </table>
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

export default {
    name: 'ViewProfile',

    components:{
        
       
    },
    data : function(){
        return {
            toast: useToast(),
            profile_id: '',
            profile: {},
            loaded: false
        }
    },
    methods : {

        fetchProfileInfo : function(){
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
                }).finally(function(r){
                    that.setHeights();
                });
            });
        },
        

        setHeights : function(){


            let infobox1 = this.$refs.infobox1;        
            let infobox1Height = infobox1.offsetHeight;
    
            let infobox2 = this.$refs.infobox2;
            let infobox2Height = infobox2.offsetHeight;

            if(infobox1Height > infobox2Height){    
                infobox2.style.height = infobox1Height+'px';
            }else if(infobox1Height < infobox2Height){
                infobox1.style.height = infobox2Height+'px';
            }

        }

    },
    mounted(){
        let urlSegments = this.$route.path.split('/');
        let profile_id = urlSegments[(urlSegments.length-1)];
        
        if(profile_id == ''){
            profile_id = urlSegments[(urlSegments.length-2)];
            
        }
        this.profile_id = profile_id;
        
        this.fetchProfileInfo();
       
    }

}
</script>