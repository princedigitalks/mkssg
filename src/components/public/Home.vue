<template>
    <div>
        <div class="mb-4">
            <router-link to="/" class="text-decoration-none">
            <img src="./../../assets/images/logo.png" class="img-fluid logo-phone center-image" alt="brand-logo">
            </router-link>
        </div>
        <div class="box title-holders-box boxed-padding">
            <h5 class="center-text box-title">Title Holders</h5>
                
                <div class="row" v-if="title_holders.length == 0" style="padding:25px">
                    <div class="col-md-4">
                        <div class="person-box">
                            <div class="person-image">
                                <div class="loading" style="height:150px;width:150px;border-radius: 250px;display: block;margin:0 auto"></div>
                            </div>
                            <br>
                            <div class="person-info center-text">
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="person-box">
                            <div class="person-image">
                                <div class="loading" style="height:150px;width:150px;border-radius: 250px;display: block;margin:0 auto"></div>
                            </div>
                            <br>
                            <div class="person-info center-text">
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="person-box">
                            <div class="person-image">
                                <div class="loading" style="height:150px;width:150px;border-radius: 250px;display: block;margin:0 auto"></div>
                            </div>
                            <br>
                            <div class="person-info center-text">
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                            </div>
                        </div>
                    </div>
                </div>

                <carousel autoplayHoverPause="true" :autoplay="2000" v-bind="settings" :wrap-around="true" :breakpoints="breakpoints">
                    <slide v-for="slide in title_holders" :key="slide">
                        <div class="carousel__item">
                        <div class="person-box">
                            <div class="person-image">
                                <img :src="slide.image" alt="" class="img img-fluid img-circle center-image">
                            </div>
                            <br>
                            <div class="person-info center-text">
                                <p style="font-size:14px">{{ slide.name }}
                                <br />  {{ slide.post }}
                                <br /> {{ slide.phone }}</p>
                            </div>
                        </div>
                        </div>
                        
                    </slide>
                    <template #addons>
                        <Pagination />
                        <Navigation />
                    </template>
                </carousel>
            
            </div>

            <br>
            
            <div class="box title-holders-box cam-holders-box boxed-padding">
            <h5 class="center-text box-title">Committee Members</h5>
            <div class="row" v-if="committe_members.length == 0" style="padding:25px">
                    <div class="col-md-4">
                        <div class="person-box">
                            <div class="person-image">
                                <div class="loading" style="height:150px;width:150px;border-radius: 250px;display: block;margin:0 auto"></div>
                            </div>
                            <br>
                            <div class="person-info center-text">
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="person-box">
                            <div class="person-image">
                                <div class="loading" style="height:150px;width:150px;border-radius: 250px;display: block;margin:0 auto"></div>
                            </div>
                            <br>
                            <div class="person-info center-text">
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="person-box">
                            <div class="person-image">
                                <div class="loading" style="height:150px;width:150px;border-radius: 250px;display: block;margin:0 auto"></div>
                            </div>
                            <br>
                            <div class="person-info center-text">
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                                <p class="loading"><br></p>
                            </div>
                        </div>
                    </div>
                </div>
                <carousel :autoplay="2000" v-bind="settings" :wrap-around="true" :breakpoints="breakpoints">
                    <slide v-for="slide_c in committe_members" :key="slide_c">
                        <div class="carousel__item">
                        <div class="person-box">
                            <div class="person-image">
                                <img :src="slide_c.image" alt="" class="img img-fluid img-circle center-image">
                            </div>
                            <br>
                            <div class="person-info center-text">
                                <p style="font-size:14px"> {{ slide_c.name }}
                                
                                <br /> {{ slide_c.phone }}</p>
                            </div>
                        </div>
                        </div>
                        
                    </slide>
                    <template #addons>
                        <Pagination />
                        <Navigation />
                    </template>
                </carousel>
            
            </div>
            <br>
                     <div class="row">
                        <div class="col-md-6">
                           <div class="box title-holders-box boxed-padding-plus hfx-550">
                              <h5 class="center-text box-title">A Message For Members</h5>
                              <p class="center-text">Hello everyone, <br>
                              We, Shri Machchhukathiya sai-suthar gyati trust surat, warmly welcome you to a new digital system.<br><br>We aim to be more connected and make members lives more accessible with this new system.<br />This system is currently available only for Surat city.
                              </p>
                           </div>
                        </div>
                        <div class="col-md-6 phone-mt">
                           <div class="box title-holders-box boxed-padding-plus hfx-550">
                              <h5 class="center-text box-title">Download Android App</h5>

                            
                              <br>
                              <br>
                              <a target="_blank" href="https://play.google.com/store/apps/details?id=com.digitalsitara.mkssg"><img src="./../../../public/images/google_play.png" class="img img-fluid" alt=""></a>

                              
                           </div>
                        </div>
                     </div>
    </div>
</template>

<script>

import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import axios from 'axios';
import { useToast } from "vue-toastification";
import { constants } from './../../constants';
import { Preferences } from '@capacitor/preferences';
import '@/common';
import common from '@/common';
import router from './../../../routes/index';

export default{
    name:'Home',
    components:{
        Carousel,
        Slide,
        Pagination,
        Navigation
    },
    data : function(){
        return {
            toast: useToast(),
            title_holders : [],
            committe_members : [],

            settings: {
                itemsToShow: 1,
                snapAlign: 'center'
            },
            breakpoints: {
                
                1: {
                    itemsToShow: 1,
                    snapAlign: 'center',
                },
                700: {
                    itemsToShow: 1,
                    snapAlign: 'center',
                },
                
                1024: {
                    itemsToShow: 3,
                    snapAlign: 'center',
                }
            }
        }
    },
    created(){
        
        common.checkAuth(function(bl){
            if(bl == true){
                router.push('feed');
            }
        });
        
    },
    mounted(){
       
        axios.get(constants.APIURL+'/fetch-home-sliders').then((response) => {
            this.title_holders = response.data.sliders.title_holders;
            this.committe_members = response.data.sliders.committee_members;
        }).catch(error => {
            if(error.response){
                this.toast.error(error.response.data);
            }else{
                this.toast.error("Error: Please check your internet connection");
            }
            this.loading = false;
        });
    }
}

</script>