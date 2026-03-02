<template>
    <div>
        <div v-if="!loaded">   
            <br>
            <div class="box loading" style="height:50px">
            
            </div>

            <br>
            <div class="box loading" style="height:50px">
            
            </div>
            <br>
            <div class="box loading" style="height:50px">
            
            </div>
            <br>
            <div class="box loading" style="height:50px">
            
            </div>
            
            
        </div>
        <br>
        <div class="box p-4 pb-2">
            <div class="table-responsive table-info" v-if="donations.length > 0 && loaded">
                <table class="table">
                    <tr>
                        <td>Receipt #</td>
                        <td>Amount</td>
                        <td>Detail</td>
                        <td>Payer</td>
                        <td>Date</td>
                    </tr>
                    <tr v-for="(don, di) in donations" :key="di">
                        <td>{{ don.receipt_number }}</td>
                        <td>{{ don.amount }}</td>
                        <td>{{ don.details }}</td>
                        <td>{{ don.payer }}</td>
                        <td>{{ don.paid_date }}</td>
                    </tr>
                    
                </table>
            </div>
            <div v-if="donations.length == 0 && loaded" class="pb-2">
                <h5>No results found.</h5>
            </div>
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


export default {
    name: 'ProfileDonations',
    components:{
        
    },
    data : function(){
        return {
                donations: [],
                toast: useToast(),
                profile_id: '',
                loaded: false
            }
    },
    methods : {

        fetchProfileDonations: function(){
            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-donations', {
                    profile_id:that.profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                   
                    that.donations = response.data;
                    
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
        
        if(profile_id == ''){
            profile_id = urlSegments[(urlSegments.length-2)];
            
        }
        this.profile_id = profile_id;
        
        this.fetchProfileDonations(this.profile_id);


    }
}
</script>