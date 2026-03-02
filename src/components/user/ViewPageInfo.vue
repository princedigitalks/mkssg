<template>
    <div>

        <div v-if="!loaded">
            <div class="box loading" style="height:150px"></div>
            <br>
            <div class="box loading" style="height:150px"></div>
            <br>
            <div class="box loading" style="height:250px"></div>
        </div>

        <div>
            <div class="profile-about-block" v-if="loaded">
                <div class="box p-4 pb-2">
                    <p><strong>About page</strong></p>
                    <p v-html="page.about_page"></p>
                </div>
                <br>
                
                <div class="box p-4 profile-infobox" ref="infobox1">
                    <p><strong>Page Info</strong></p>
                    <table class="table table-info">
                        <tr>
                            <td>Category</td>
                            <td>{{ page.category }}</td>
                        </tr>

                        <tr>
                            <td>Email</td>
                            <td>{{ page.email }}</td>
                        </tr>

                        <tr>
                            <td>Location</td>
                            <td>{{ page.location }}</td>
                        </tr>

                        <tr>
                            <td>Phone</td>
                            <td>{{ page.phone }}</td>
                        </tr>

                        <tr>
                            <td>WhatsApp</td>
                            <td>{{ page.whatsapp }}</td>
                        </tr>

                        <tr>
                            <td>Page created on</td>
                            <td>{{ page.madeon }}</td>
                        </tr>
                        
                        
                    </table>
                </div>
                
        </div>
        </div>
    </div>
 </template>
 <style scoped>
 
  
     .feed-block{
         padding:25px;
         margin-bottom:25px;
     }
     
    
 </style>
 <script>
     
     
     import axios from 'axios';
     import { constants } from '@/constants';
     import common from '@/common';
     import router from './../../../routes/index';
     import { Preferences } from '@capacitor/preferences';
     import { useToast } from "vue-toastification";
 
     
     export default{
        
         data : function(){
             return {
                toast:useToast(),
                loaded: false,
                page_slug: '',
                page: {}
                 
             }
         },
         components:{
             
         },
         computed: {
             
         },
         methods : {

            
             
             
            fetchPageInfo : function(page_slug){
                let that = this;
                common.fetchToken(function(token){

                    axios.post(constants.APIURL+'/fetch-page-info', {
                        page_slug: page_slug
                    }, {
                        headers:{
                            Authorization:`Bearer ${token}`
                        }
                    }).then(response => {
                        
                        
                        that.page =  response.data;
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
            /* use this if needed. */
           
        
        },
        unmounted () {
            
        },
        mounted(){

            let urlSegments = this.$route.path.split('/');

            let page_slug = urlSegments[(urlSegments.length-1)];
            this.page_slug = page_slug;

            this.fetchPageInfo(page_slug);
            
        },
        updated(){
            
            
        }
         
     }
 
 </script>