<template>
    <div>
        <div class="row" v-if="!loaded">
            <div v-for="(tmp, i) in 12" :key="i" class="col-md-4">
               
               <div class="box star-block">
                    <div class="loading" style="height:150px;width:150px;border-radius: 250px;display: block;margin:0 auto"></div>
                    <br>
                    <p class="loading"><br></p>
                    <p class="loading"><br></p>
                    <p class="loading"><br></p>
               </div>
               <br>
           </div>
        </div>
        <div v-if="loaded && stars.length == 0">
            <div class="box p-4 pb-3">
                <h5>No student information has been added.</h5>
            </div>
        </div>
        <div class="row">
            
            <div v-for="star in stars" :key="star.id" class="col-md-4">
               
                <div class="box star-block">
                    <img :src="star.image" class="star-image img img-circle img-fluid center-image" alt="">
                    <p class="center-text">{{ star.full_name }}
                    <br>
                    {{ star.standard }} Std - {{ star.percentage }}</p>  
                    <p class="center-text">{{ star.gift }}</p>  
                    <p class="center-text">{{ star.school_name }}</p>  
                </div>
                <br>
            </div>
        </div>
        
    </div>
</template>

<style scoped>
   
    .star-block{
        padding:0px;
        margin:0px;
        padding:30px 30px 20px 30px;

    }
    .star-block .star-image{
        margin-bottom:18px;
    }
</style>

<script>
    
    import { useToast } from "vue-toastification";
    import { constants } from './../../constants';
    import axios from 'axios';
    import common from '@/common';
    import router from './../../../routes/index';

    export default{
        name:'Stars',
        components:{

        },
        data : function(){
            return {
                toast: useToast(),
                stars: [],
                loaded : false
            }
        },
        methods : {

        },
        mounted(){
            axios.get(constants.APIURL+'/fetch-bright-stars').then((response) => {
                this.stars = response.data;
                this.loaded = true;
            }).catch(error => {
                if(error.response){
                    this.toast.error(error.response.data);
                }else{
                    this.toast.error("Error: Please check your internet connection");
                }
                
            });
        },
        created(){
            let pathname = this.$route.path.substr(1, this.$route.path.length - 1);
            common.checkAuth(function(bl){
                if(bl == true){
                    if(pathname == 'bright-stars'){
                        router.push('user-bright-stars');
                    }
                }
            });
        }
    }
</script>