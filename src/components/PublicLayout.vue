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
                              <router-link to="/" :class="{active:pagename == 'home'}" class="nav-link"><HomeIcon :size="24" />&nbsp;&nbsp;Home</router-link>
                           </li>
                           <li class="nav-item">
                              <router-link to="/login" :class="{active:pagename == 'login'}" class="nav-link"><LoginIcon :size="24" />&nbsp;&nbsp;Login</router-link>
                           </li>
                           <li class="nav-item">
                              <router-link to="/contact" :class="{active:pagename == 'contact'}" class="nav-link"><MsgIcon :size="24" />&nbsp;&nbsp;Contact</router-link>
                           </li>
                           <li class="nav-item">
                              <router-link to="/bright-stars" :class="{active:pagename == 'bright-stars'}" class="nav-link"><StarIcon />&nbsp;&nbsp;Bright Stars</router-link>
                           </li>
                           <li class="nav-item">
                              <router-link to="/version" :class="{active:pagename == 'version'}" class="nav-link"><CogIcon />&nbsp;&nbsp;Version</router-link>
                           </li>
                         
                           <!--<li class="nav-item dropdown">
                              <a class="nav-link dropdown-toggle" @click="dropdowns.pages = !dropdowns.pages"  href="javascript:;">
                                <HomeIcon /> Pages
                              </a>
                              <transition name="fade" key="45768">
                                 <ul class="px-2 py-1 mb-2" v-if="dropdowns.pages" key="aaaaa">
                                    <li><a class="dropdown-item rounded-3 px-2 py-1 my-1" href="contact.html">Contact</a></li>
                                    <li><a class="dropdown-item rounded-3 px-2 py-1 my-1" href="faq.html">FAQ</a></li>
                                    <li><a class="dropdown-item rounded-3 px-2 py-1 my-1" href="404.html">404 Error</a></li>
                                    <li><a class="dropdown-item rounded-3 px-2 py-1 my-1" href="edit-profile.html">Edit Profile</a></li>
                                 </ul>
                           </transition>
                           </li>
                           <li class="nav-item">
                              <a href="tags.html" class="nav-link"><span class="material-icons me-3">local_fire_department</span> <span>Trending</span></a>
                           </li>-->
                        </ul>
                     </div>
                     <!--<a href="#" class="btn btn-primary w-100 text-decoration-none rounded-4 py-3 fw-bold text-uppercase m-0" data-bs-toggle="modal" data-bs-target="#signModal">Sign In +</a>-->
                  </div>
               </aside>
               
               <main class="col-lg-9 col-md-12">
                  <div class="phone-pt"></div>
                  <div class="show-pc mt-4"></div>
                     <router-view></router-view>
                  
                  
                  <div class="text-center mt-4">
                     <!--<div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                     </div>-->
                  </div>
                  <p class="text-center"><router-link to="/terms-and-conditions">Terms &amp; conditions</router-link> - <router-link to="/privacy-policy">Privacy Policy</router-link></p>
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

import HomeIcon from 'vue-material-design-icons/Home.vue';
import HeartIcon from 'vue-material-design-icons/Heart.vue';
import MenuIcon from 'vue-material-design-icons/Menu.vue';
import LoginIcon from 'vue-material-design-icons/Login.vue';
import MsgIcon from 'vue-material-design-icons/Email.vue';
import StarIcon from 'vue-material-design-icons/Star.vue';
import CogIcon from 'vue-material-design-icons/Cog.vue';


import Home from './public/Home.vue';

export default {

   name: 'PublicLayout',
   components: {
      HomeIcon,
      HeartIcon,
      MenuIcon,
      LoginIcon,
      MsgIcon,
      StarIcon,
      CogIcon,
      Home
   },
   data : function(){
      return {
         dropdowns:{
            pages : false
         },
         pagename : 'home'
        
      }
   },
   methods:{
      setPath: function(){
         let pathname = this.$route.path.substr(1, this.$route.path.length - 1);
         
         if(pathname == ''){
            this.pagename = 'home';
         }else{
            this.pagename = pathname;
         }
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


   }

}


</script>
