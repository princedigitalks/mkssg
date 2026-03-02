<template>
    <div>
       <div>
            <router-link :to="'/profile/'+profile_id" class="btn btn-primary btn-sm"><BackIcon />&nbsp;Back to profile</router-link>
            <br>
            <br>
            <div class="box profile-nav-links">
                <nav class="nav nav-pills">
                    <router-link class="nav-link" :to="'/edit-profile/images/'+profile_id">Edit Images</router-link>
                    <router-link class="nav-link" :to="'/edit-profile/info/'+profile_id">Edit Info</router-link>
                    <router-link class="nav-link" :to="'/edit-profile/education/'+profile_id">Edit Education</router-link>
                    <router-link class="nav-link" :to="'/edit-profile/work/'+profile_id">Edit Work</router-link>
                    <router-link class="nav-link" :to="'/edit-profile/hobbies/'+profile_id">Edit Hobbies</router-link>
                    <router-link class="nav-link" :to="'/edit-profile/socials/'+profile_id">Edit Social Links</router-link>
                </nav>
            </div>
       </div>
    </div>
</template>

<style scoped>
   
</style>

<script>


import BackIcon from 'vue-material-design-icons/ArrowLeft.vue';
export default {
    name: 'EditProfile',
    components:{
        BackIcon
    },
    data : function(){
        return {
                
                profile_id: ''
            }
    },
    methods : {

        

    },
    created(){
        
    },
    mounted(){

        let urlSegments = this.$route.path.split('/');
        let profile_id = urlSegments[(urlSegments.length-1)];
       
        
        this.profile_id = profile_id;


    }
}
</script>