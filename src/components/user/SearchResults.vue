<template>
    <div>
        <div v-if="profiles.length == 0 && per_flag == true">
            <div v-for="(n,ii) in 15" :key="ii" class="userlist loadinglist box">
                <div class="single-user-list">
                    <div class="row">
                        <div class="col-md-2 col-3">
                            <div class="single-user-profile-picture">
                                <div class="loading" style="height:125px"></div>
                                
                            </div>
                        </div>
                        <div class="col-md-6 col-6">
                            <div class="single-user-content">
                                <p class="loading" style="height:55px">
                                    
                                </p>
                                <p class="loading" style="height:55px">
                                    
                                </p>
                            </div>
                        </div>
                        <div class="col-md-4 col-3">
                            <div class="single-user-actions">
                                <div class="single-user-content">
                                <p class="loading" style="height:55px">
                                
                                </p>
                                <p class="loading" style="height:55px">
                                    
                                </p>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="userlist box" v-if="profiles.length == 0 && per_flag == false">
            <h5>No results found.</h5>
        </div>
        <show-users :profiles="profiles"></show-users>
        
    </div>
</template>

<style scoped>
  
    .userlist.loadinglist{
        padding:20px 20px 5px 20px;
        margin-bottom: 25px;
    }
    .userlist{
        padding:20px;
        margin-bottom: 25px;
    }
</style>

<script>


import axios from 'axios';
import { constants } from '@/constants';

import common from '@/common';
import { Preferences } from '@capacitor/preferences';
import { useToast } from 'vue-toastification';
import router from './../../../routes/index';
import { Buffer } from "buffer";
import SaveButton from '../UI/SaveButton.vue';
import VerifiedIcon from 'vue-material-design-icons/CheckDecagram.vue';

import ShowUsers from './ShowUsers.vue';


export default {
    name: 'SearchResults',
    components:{
        SaveButton,
        VerifiedIcon,
        ShowUsers
    },
    data : function(){
        return {
            toast: useToast(),
            profiles : [],
            offset: 0,
            jsonSearch : {},
            flag: true,
            per_flag: true,
            last_route: '',
        }
    },
    watch: {
        '$route': function (to, from) {

            let urlSegments = to.path.split('/');
            
            if(urlSegments[1] == 'search-results' || urlSegments[1] == 'search'){

                if(this.last_route == ''){
                
                    this.last_route = urlSegments[2];
                }else{

                    if(this.last_route != urlSegments[2]){
                        
                        this.emitter.emit('reload_search', true);
                       
                        
                    }
                        
                    

                }

            }

            

            
        }
    },
    methods : {

        viewProfile: function(id){
            router.push({path:'/profile/'+id});
        },

        
        loadMore: function(el){
            
            let that = this;
            window.onscroll = () => {
               
                if((document.documentElement.scrollTop + window.innerHeight) >= (document.documentElement.offsetHeight-100) && that.flag == true && that.per_flag == true){
                    that.flag = false;
                    that.fetchSearchResults(that.jsonSearch, that.offset);
                }
                
            }
        },

        fetchSearchResults : function(data, offset){
            let that = this;
            common.fetchToken(function(token){
                data.offset = that.offset;
                axios.post(constants.APIURL+'/search-profiles', data,{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    for(let z = 0 ; z < response.data.length ; z++){
                        that.profiles.push(response.data[z]);
                    }
                    that.offset += 15;
                    
                    that.flag = true;
                       
                    if(response.data.length == 0){

                        that.per_flag = false;
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
                })
            });
        }


    },
    beforeCreate(){
        document.body.scrollTop = 0;
    },
    mounted(){
        document.body.scrollTop = 0;
        let urlSegments = this.$route.path.split('/');
        let last_segment = urlSegments[(urlSegments.length-1)];
        
        try{
            
            let buffer = Buffer.from(last_segment, 'base64');
            buffer = buffer.toString('utf-8');
            
            let parsedJSON = JSON.parse(buffer);
            if (typeof parsedJSON === 'object' && parsedJSON !== null){
                if ('name' in parsedJSON && 'area_name' in parsedJSON && 'marriage_status' in parsedJSON && 'education' in parsedJSON && 'profession' in parsedJSON && 'form_number' in parsedJSON && 'blood_group' in parsedJSON  && 'phone' in parsedJSON && 'last_name' in parsedJSON){
                    this.jsonSearch = parsedJSON;
                    this.fetchSearchResults(parsedJSON, this.offset);
                }else{
                    this.toast.error('Unexpected error');
                    router.push('/search');
                }
            }else{
                this.toast.error('Unexpected error');
                router.push('/search');
            }

        }catch(error){
            this.toast.error('Unexpected error');
            router.push('/search');
        }
        
        this.loadMore();
        
    },
    /*mounted(){
        
        
        //document.body.scrollTop = 0;
        let that = this;
        window.addEventListener('popstate', function(){
            let urlSegments = that.$route.path.split('/');
            
            if(urlSegments[1] == 'search-results'){
                //
            }
            
        });
        

    },*/
    activated(){
        this.per_flag = true;
        /*let that = this;
        window.addEventListener('popstate', function(){
            let urlSegments = that.$route.path.split('/');
            
            if(urlSegments[1] == 'search-results'){
                console.log('yaya');
            }
            
        });*/
    },
    deactivated(){
        this.per_flag = false;
    },
    unmounted () {
        
    },
}
</script>