<template>
    <div>
      <div>
         <div class="container">
            
            <div class="row">
              <aside class="col-md-3">
                  <div class="topbar">
                     <a href="javascript:;" ref="menulauncher" id="mobile-menu-launcher"><menu-icon :size="36" /></a>
                  </div>
                  
                  <div class="ps-0 m-none fix-sidebar" id="fix-sidebar">
                     <div class="sidebar-nav mb-3">
                        <div class="mt-3">
                           <router-link to="/" class="text-decoration-none">
                            <img src="./../assets/images/logo.png" class="img-fluid logo center-image" alt="brand-logo">
                           </router-link>
                        </div>
                        <ul class="navbar-nav justify-content-end flex-grow-1 mt-4">
                           <li class="nav-item">
                              <router-link to="/feed" :class="{active:pagename == 'feed'}" class="nav-link"><FeedIcon :size="24" />&nbsp;&nbsp;Feed</router-link>
                           </li>
                           <li class="nav-item">
                              <router-link to="/search" :class="{active:pagename == 'search'}" class="nav-link"><SearchIcon :size="24" />&nbsp;&nbsp;Search</router-link>
                           </li>
                           <li class="nav-item">
                              <router-link to="/profiles" :class="{active:pagename == 'profiles'}" class="nav-link"><ProfilesIcon :size="24" />&nbsp;&nbsp;Profiles</router-link>
                           </li>
                           
                           <li class="nav-item dropdown">
                              <a class="nav-link dropdown-toggle" :class="{active:(pagename == 'matrimony-listings' || pagename == 'search-listings' || pagename == 'submit-bio')}" @click="dropdowns.pages = !dropdowns.pages"  href="javascript:;">
                                <MatrimonyIcon /> Matrimony
                              </a>
                              <transition name="fade" key="45768">
                                 <ul class="px-2 py-1 mb-2 dropdown-list" v-if="dropdowns.pages" key="sample_key">
                                    <li><router-link class="dropdown-item rounded-3 px-2 py-1 my-1" to="/matrimony-listings"><FeedIcon />&nbsp;My Listings</router-link></li>
                                    <li><router-link class="dropdown-item rounded-3 px-2 py-1 my-1" to="/search-listings"><SearchIcon />&nbsp;View Listings</router-link></li>
                                    <li><router-link class="dropdown-item rounded-3 px-2 py-1 my-1" to="/submit-bio"><SubmitIcon />&nbsp;Submit Bio</router-link></li>
                                 </ul>
                           </transition>
                           </li>
                           <!--<li class="nav-item">
                              <router-link to="/payments" :class="{active:pagename == 'payments'}" class="nav-link"><PaymentsIcon :size="24" />&nbsp;&nbsp;Payments</router-link>
                           </li>-->
                           
                           
                           <li class="nav-item">
                              <router-link to="/user-contact" :class="{active:pagename == 'contact'}" class="nav-link"><MsgIcon :size="24" />&nbsp;&nbsp;Contact</router-link>
                           </li>
                           <li class="nav-item">
                              <router-link to="/user-bright-stars" :class="{active:pagename == 'bright-stars'}" class="nav-link"><StarIcon />&nbsp;&nbsp;Bright Stars</router-link>
                           </li>
                           <li class="nav-item">
                              <router-link to="/app-version" :class="{active:pagename == 'version'}" class="nav-link"><CogIcon />&nbsp;&nbsp;Version</router-link>
                           </li>
                           
                           <li class="nav-item" v-for="(userpage, i) in userpages" :key="i">
                              <router-link v-if="typeof userpage.page !== 'undefined'" :to="{ path:'/page/'+userpage.page.slug }" class="nav-link"><PageIcon />&nbsp;&nbsp;{{ userpage.page.page_name }}</router-link>
                           </li>
                           
                        </ul>
                     </div>
                     
                  </div>
               </aside>
               
               <main class="col-lg-9 col-md-12">
                  <div class="phone-pt"></div>
                  <div class="show-pc mt-4"></div>
                  
                     
                     <router-view v-slot="{ Component }" :key="reloadsearch">
                        <keep-alive include="SearchResults,SearchMatrimonyListingResults" ref="SearchResults">
                           <component :is="Component" />
                        </keep-alive>
                     </router-view>
                  <div class="text-center mt-4">
                     <!--<div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                     </div>-->
                  </div>
                  <p class="text-center"><router-link to="/terms-and-conditions-lg">Terms &amp; conditions</router-link> - <router-link to="/privacy-policy-lg">Privacy Policy</router-link></p>
                  <p class="me-3 text-center">&copy; 2023 MKSSG Surat. All rights reserved<br />Made with <heart-icon /> by <a target="_blank" href="https://shopnoecommerce.com">SHOPNO ECOMMERCE PVT LTD</a></p>
               </main>
               
               <!--<aside class="col-md-3">
                  <div class="right-fix-sidebar">
                     <div class="side-trend lg-none">
                        
                        123
                     </div>
                  </div>
               </aside>-->
            </div>
         </div>
      </div>
     
      
     
      
   
    </div>
</template>

<style scoped>

/** demo1 **/


.fade-enter-active,
.fade-leave-active {
   
  transition: all 1s;
  max-height: 2030px;
}
.fade-enter-from,
.fade-leave-to
{
   opacity: 0;
   transition: all 0.3s;
  max-height: 0px;
}

</style>

<script>

import FeedIcon from 'vue-material-design-icons/ViewList.vue';
import HeartIcon from 'vue-material-design-icons/Heart.vue';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import SearchIcon from 'vue-material-design-icons/SelectSearch.vue';
import MsgIcon from 'vue-material-design-icons/Email.vue';
import StarIcon from 'vue-material-design-icons/Star.vue';
import CogIcon from 'vue-material-design-icons/Cog.vue';
import ProfilesIcon from 'vue-material-design-icons/FaceManProfile.vue';
import MatrimonyIcon from 'vue-material-design-icons/Connection.vue';
import PaymentsIcon from 'vue-material-design-icons/CashMultiple.vue';
import SubmitIcon from 'vue-material-design-icons/SendCheckOutline.vue';
import PageIcon from 'vue-material-design-icons/File.vue';


import Home from './public/Home.vue';
import { constants } from '@/constants';
import common from '@/common';
import router from './../../routes/index';
import { Preferences } from '@capacitor/preferences';
import { useToast } from "vue-toastification";

import axios from 'axios';

export default {

   name: 'UserLayout',
   components: {
        FeedIcon,
        HeartIcon,
        MenuIcon,
        SearchIcon,
        MsgIcon,
        StarIcon,
        CogIcon,
        ProfilesIcon,
        MatrimonyIcon,
        PaymentsIcon,
        SubmitIcon,
        PageIcon,
        Home
   },
   data : function(){
      return {
         dropdowns:{
            pages : false
         },
         toast: useToast(),
         pagename : 'feed',
         userpages: {},
         reloadsearch : 1
        
      }
   },
   methods:{
      setPath: function(){

            let pathname = this.$route.path.substr(1, this.$route.path.length - 1);
            
            if(pathname == ''){
                this.pagename = 'feed';
            }else{
                this.pagename = pathname;
            }     
      },

      fetchPages: function(){
        let that = this;
        common.fetchToken(function(token){
            
            axios.get(constants.APIURL+'/fetch-pages', { headers: { Authorization: `Bearer ${token}`} } ).then(response => {

                that.userpages = response.data;
                
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
   watch:{
      pagename: function(){
         
         let sidebar = document.getElementById('fix-sidebar');
         if(sidebar.classList.contains('slide-sidebar')){
            sidebar.classList.remove('slide-sidebar');
         }
      }
   },
   updated(){
      
      this.setPath();
   },
   mounted(){
      let that = this;
      this.emitter.on('reload_search', (e) => {
         window.scrollTo({
            top:0
         });
         that.reloadsearch++;
         
      });
      
      let launcher = document.getElementById('mobile-menu-launcher');
      let sidebar = document.getElementById('fix-sidebar');

      launcher.onclick = function(e){
         if(!sidebar.classList.contains('slide-sidebar')){
            sidebar.classList.add('slide-sidebar');
         }
      }

      document.onclick = function(e){
         if(e.target.closest('#fix-sidebar') == null && e.target.closest('#mobile-menu-launcher') == null){
            if(sidebar.classList.contains('slide-sidebar')){
               sidebar.classList.remove('slide-sidebar');
              
            }
         }
      }

      
      this.setPath();
      this.fetchPages();


   }

}


</script>
