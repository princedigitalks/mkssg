<template>
    <div>
        <div v-if="!loaded">
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

        <div v-if="loaded && matris.length == 0">
            <h5>No listings found.</h5>
        </div>
        
            
        <div v-if="loaded">
            <div class="userlist box" v-for="(matri, pi) in matris" :key="pi">
                <div class="single-user-list">
                    <div class="row">
                        <div class="col-md-2 col-3">
                            <div class="single-user-profile-picture">
                                <img :src="matri.profile.profile_image" class="img img-fluid img-circle">
                            </div>
                        </div>
                        <div class="col-md-6 col-6">
                            <div class="single-user-content">
                                <router-link :to="'/profile/'+matri.profile.id" ><span class="username"><strong>{{ matri.profile.first_name }} {{ matri.profile.middle_name }} {{ matri.profile.last_name }}</strong></span></router-link>
                                    
                                    <a href="javascript:;"><VerifiedIcon @click="showInfoToast('core contributor')" v-if="matri.profile.checkmark_available != 0 && matri.profile.checkmark_type == 1" fillColor="#0091c1"></VerifiedIcon>
                                    <VerifiedIcon @click="showInfoToast('temporary contributor')" v-if="matri.profile.checkmark_available != 0 && matri.profile.checkmark_type == 2" fillColor="#8d8d8d"></VerifiedIcon>
                                    <VerifiedIcon @click="showInfoToast('volunteer')" v-if="matri.profile.checkmark_available != 0 && matri.profile.checkmark_type == 3" fillColor="#b6c100"></VerifiedIcon></a>
                                
                                
                            
                                <span><strong></strong>
                                <br>
                                Lives in {{ matri.profile.area_name }}<br>
                                Relation: {{ matri.profile.relation }}
                                </span>
                            </div>
                        </div>
                        <div class="col-md-4 col-3">
                            <div class="single-user-actions">
                                <SaveButton :textsize="true" :loading="matri.profile.loading" buttonText="View" :full_width="true" :big_button="false" @click="viewMatrimonyListing(matri.id)"></SaveButton>
                                <div class="clearfix"></div>
                                
                                <a :href="matri.bio_file" class="btn btn-sm btn-primary w-100 mt-3"><DownloadIcon /></a>
                                <div class="clearfix"></div>
                                
                            </div>
                        </div>
                    </div>
                    
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


import router from './../../../routes/index';
import SaveButton from '../UI/SaveButton.vue';
import { Buffer } from 'buffer';

import axios from 'axios';
import { constants } from '@/constants';

import common from '@/common';
import { Preferences } from '@capacitor/preferences';

import { useToast } from 'vue-toastification';

import DownloadIcon from 'vue-material-design-icons/Download.vue';
import VerifiedIcon from 'vue-material-design-icons/CheckDecagram.vue';



export default {
    name: 'SearchMatrimonyListingResults',
    components:{
        SaveButton,
        VerifiedIcon,
        DownloadIcon
    },
    data : function(){
        return {
                toast: useToast(),
                offset: 0,
                flag: true,
                loading: false,
                loaded: false,
                gender: 'all',
                per_flag: true,
                matris: [],
                last_route: ''
            }
    },
    watch: {
        '$route': function (to, from) {

            let urlSegments = to.path.split('/');
            
            if(urlSegments[1] == 'search-listings'){

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
        
        showInfoToast : function(thetype){
            this.toast.info('This person is a '+thetype);
        },
        
        viewMatrimonyListing : function(matri_id){
            router.push({path: '/matrimony-listings/view/'+matri_id});
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
                axios.post(constants.APIURL+'/search-matrimony-listing', data,{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                }).then(response => {
                    
                    for(let z = 0 ; z < response.data.length ; z++){
                        that.matris.push(response.data[z]);
                    }
                    that.offset += 10;
                    that.loaded = true;
                    
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
    created(){
        document.body.scrollTop = 0;
        let urlSegments = this.$route.path.split('/');
        let last_segment = urlSegments[(urlSegments.length-1)];
        
        try{
            
            let buffer = Buffer.from(last_segment, 'base64');
            buffer = buffer.toString('utf-8');
            
            let parsedJSON = JSON.parse(buffer);
            if (typeof parsedJSON === 'object' && parsedJSON !== null){
                if ('gender' in parsedJSON){
                    this.jsonSearch = parsedJSON;
                    this.fetchSearchResults(parsedJSON, this.offset);
                }else{
                    this.toast.error('Unexpected error');
                    router.push('/search-listings');
                }
            }else{
                this.toast.error('Unexpected error');
                router.push('/search-listings');
            }

        }catch(error){
            this.toast.error('Unexpected error');
            router.push('/search-listings');
        }
        
        this.loadMore();
    },
    mounted(){
        document.body.scrollTop = 0;
        
    },
    unmounted () {
        this.per_flag = false;
    },
}
</script>