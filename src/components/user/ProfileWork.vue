<template>
    <div>
        <div v-if="!loaded">   
            <br>
            <div class="box loading" style="height:200px">
            
            </div>
            <br>
            <div class="box loading" style="height:200px">
                
            </div>
            <br>
            <div class="box loading" style="height:200px">
                
            </div>
            
        </div>

        <div v-if="loaded">
            <div v-for="(wo, edi) in works" :key="edi">
                <br>
                <div class="box p-4 pb-2">
                    <p>Company name: {{ wo.company_name }} ({{ wo.city }})
                        <br>
                From: {{ wo.from_year }}
                To: {{ wo.to_year }}
                <br>
                Position: {{ wo.position }}
                    </p>
                    <p><strong>Description</strong> <br />
                        <span v-html="wo.description"></span>
                    </p>
                </div>
            </div>
        </div>

       
        <br>

        <div class="box" v-if="loaded && works.length == 0">
            <div class="p-4 pb-3 mt-4">
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
/*import SaveButton from '../UI/SaveButton.vue';*/


export default {
    name: 'ProfileWork',
    components:{
        
    },
    data : function(){
        return {
                works: [],
                toast: useToast(),
                profile_id: '',
                loaded: false
            }
    },
    methods : {

        fetchProfileWork: function(){
            let that = this;
            
            common.fetchToken(function(token){
                axios.post(constants.APIURL+'/fetch-profile-work', {
                    profile_id:that.profile_id
                },{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                   
                    that.works = response.data;
                    
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
        
        this.fetchProfileWork(this.profile_id);


    }
}
</script>