<template>
    <div>
        
        <div class="box p-4">
            <router-link to='make-payment' class="btn btn-primary w-100">Make Payment</router-link>
        </div>
        <br>
        <div class="box p-4">
            <div class="table-responsive table-info">
                <table class="table table-info">
                    <tr>
                        <td>#</td>
                        <td>Amount</td>
                        <td>Reason</td>
                        <td>Date</td>
                    </tr>
                    <tr v-for="(d, di) in donations" :key="di">
                        <td>{{ d.receipt_number }}</td>
                        <td>{{ d.amount }}</td>
                        <td><p style="max-width:150px;word-wrap:break-word;background:transparent">{{ d.details }}</p></td>
                        <td>{{ d.paid_on }}</td>
                    </tr>
                </table>
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
    name: 'Payments',

    components:{
       
       
    },
    data : function(){
        return {
            toast: useToast(),
            loaded : false,
            donations: []
        }
    },
    
    
    methods : {

        fetchDonations : function(){
            let that = this;
            common.fetchToken(function(token){
                    
                    axios.get(constants.APIURL+'/fetch-user-donation',{
                        headers : {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(response => {
                        console.log(response.data);
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
                            that.loading = false;
                        }else{
                            that.loading = false;
                            that.toast.error("Error: Please check your internet connection");
                        }
                    });
                });
        }

    },
    
   
    created(){
        
    },
    mounted(){
        this.fetchDonations();
    }

}
</script>