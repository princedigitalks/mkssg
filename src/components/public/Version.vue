<template>
    <div>

        <div class="box">
            <br>
            <br>
            <br>
            <h3 class="center-text">Version: 1.0</h3>
            <br>
            <h3 class="center-text">Build: 22nd May 2023</h3>
            <br>
            <br>
            <p class="center-text">Developed &amp; Managed by<br>
            <a v-if="!logged_in" href="https://parthparmar.dev" target="_blank" style="font-weight:600;text-decoration:underline">Parth Parmar</a>
            <router-link v-if="logged_in" to="./profile/1478" style="font-weight:600;text-decoration:underline">Parth Parmar</router-link>
            </p>
            <a href="https://shopnoecommerce.com" target="_blank"><img class="center-image" src="./../../../public/images/crafted-in-india.png" alt="SHOPNO ECOMMERCE PVT LTD"></a>
            <br>
            <br>
            <br>
        </div>
   <br>
    </div>
</template>

<style scoped>
    
</style>

<script>
    
    /*temp*/
    import common from '@/common';
    import router from './../../../routes/index';
    export default{
        name:'Version',
        components:{

        },
        data : function(){
            return {
                logged_in: false
            }
        },
        methods : {

        },
        mounted(){
            
        },
        created(){
            let pathname = this.$route.path.substr(1, this.$route.path.length - 1);
            let that = this;
            common.checkAuth(function(bl){
                if(bl == true){
                    that.logged_in = true;
                    if(pathname == 'version'){
                        router.push('app-version');
                    }
                }
            });
        }
    }
</script>
