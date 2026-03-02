<template>
    <div>
        <div class="searchform box">
            <h5>Search</h5>
            <br>
                <form action="javascript:;" method="POST" class="form-floating-space" id="searchForm">                
                    <div class="form-floating mb-3">
                        <input class="form-control rounded-3" id="search_name" v-model="search.name" type="text" placeholder="Enter name">
                        <label for="search_name">First Name OR Middle Name</label>
                    </div>

                    <div class="form-floating mb-3">
                        <input class="form-control rounded-3" id="phone" v-model="search.phone" type="number" placeholder="Enter phone">
                        <label for="phone">Phone</label>
                    </div>

                    <div class="form-floating mb-3">
                        <select id="area_name" class="form-control rounded-3" v-model="search.area_name">
                            <option value="">Select</option>
                            <option v-for="(area_name_c, li) in areas" :key="li" :value="area_name_c.area">{{ area_name_c.area }}</option>
                        </select>
                        
                        <label for="last_name">Area name</label>
                    </div>

                    <div class="form-floating mb-3">
                        <select id="last_name" class="form-control rounded-3" v-model="search.last_name">
                            <option value="">Select</option>
                            <option v-for="(last_name_c, li) in last_names" :key="li" :value="last_name_c.last_name">{{ last_name_c.last_name }}</option>
                        </select>
                        
                        <label for="last_name">Surname</label>
                    </div>

                    <div class="form-floating mb-3">
                        <select id="marriage_status" class="form-control rounded-3" v-model="search.marriage_status">
                            <option value="">Select</option>
                            <option v-for="(marriage_status_c, li) in marriage_status_multi" :key="li" :value="marriage_status_c">{{ li }}</option>
                        </select>
                        
                        <label for="marriage_status">Marriage status</label>
                    </div>

                    <div class="form-floating mb-3">
                        <select id="education" class="form-control rounded-3" v-model="search.education">
                            <option value="">Select</option>
                            <option v-for="(education_c, li) in education_multi" :key="li" :value="education_c.education">{{ education_c.education }}</option>
                        </select>
                        
                        <label for="education">Education</label>
                    </div>

                    <div class="form-floating mb-3">
                        <select id="education" class="form-control rounded-3" v-model="search.profession">
                            <option value="">Select</option>
                            <option v-for="(profession_c, li) in profession_multi" :key="li" :value="profession_c.profession">{{ profession_c.profession }}</option>
                        </select>
                        
                        <label for="education">Profession</label>
                    </div>

                    <div class="form-floating mb-3">
                        <select id="form_number" class="form-control rounded-3" v-model="search.form_number">
                            <option value="">Select</option>
                            <option v-for="(form_number_c, li) in form_numbers" :key="li" :value="form_number_c.form_number">{{ form_number_c.form_number }}</option>
                        </select>
                        
                        <label for="form_number">Form number</label>
                    </div>

                    <div class="form-floating mb-3">
                        <select id="blood_group" class="form-control rounded-3" v-model="search.blood_group">
                            <option value="">Select</option>
                            <option v-for="(blood_group_c, li) in blood_groups" :key="li" :value="blood_group_c">{{ blood_group_c }}</option>
                        </select>
                        
                        <label for="blood_group">Blood group</label>
                    </div>
                    <div>
                        <label><input type="checkbox" v-model="search.grouped">&nbsp;Show grouped by form number</label>
                    </div>
                    <div class="mt-4">
                        <SaveButton :loading="loading" buttonText="Search" :full_width="true" :big_button="true" icon="SearchIcon" @clicked="btnClicked"></SaveButton>
                    </div>
                </form>
        </div>
    </div>
</template>

<style scoped>
    .searchform{
        padding:25px;
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
import { Buffer } from "buffer";

export default {
    name: 'search',
    components:{
        SaveButton
    },
    data : function(){
        return {
                toast : useToast(),
                areas : [],
                blood_groups : [],
                education_multi : [],
                marriage_status_multi : [],
                form_numbers : [],
                last_names : [],
                profession_multi : [],
                loading: false,
                search : {
                    name: '',
                    area_name: '',
                    marriage_status: '',
                    education: '',
                    profession: '',
                    form_number: '',
                    blood_group: '',
                    phone: '',
                    last_name: '',
                    grouped: false,
                    submit: false
                }
            }
    },
    methods : {

        fetchInitialData: function(){

            let that = this;
            common.fetchToken(function(token){
                axios.get(constants.APIURL+'/fetch-search-initials', {
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    that.areas = response.data.areas;
                    that.blood_groups = response.data.blood_groups;
                    that.education_multi = response.data.education;
                    that.form_numbers = response.data.form_numbers;
                    that.last_names = response.data.last_names;
                    that.profession_multi = response.data.profession;
                    that.marriage_status_multi = response.data.marriage_status;

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

        btnClicked : function(){

            if(this.search.name.trim() == '' && this.search.phone.toString().trim() == '' && this.search.area_name == '' && this.search.last_name == '' && this.search.marriage_status.toString() == '' && this.search.education == '' && this.search.profession == '' && this.search.form_number == '' && this.search.blood_group == ''){
                this.toast.error('Please select or fill at least one field to search');
            }else{
                this.loading = true;
                let that = this;
                let buffer = Buffer.from(JSON.stringify(this.search), 'utf-8');
                let search_json = buffer.toString('base64');
                router.push('/search-results/'+search_json);
                /*common.fetchToken(function(token){
                    
                    axios.post(constants.APIURL+'/search-profiles', that.search,{
                        headers : {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(response => {
                        console.log(response);
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
                        
                        }else{
                            that.toast.error("Error: Please check your internet connection");
                        }
                        that.loading = false;
                    })
                });*/

            }

        }

    },
    mounted(){

        this.fetchInitialData();


    }
}
</script>