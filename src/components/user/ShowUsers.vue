<template>
    <span>
        <div class="userlist box" v-for="(profile, pi) in profiles" :key="pi">
            <div class="single-user-list">
                <div class="row">
                    <div class="col-md-2 col-3">
                        <div class="single-user-profile-picture">
                            <img :src="profile.profile_image" class="img img-fluid img-circle">
                        </div>
                    </div>
                    <div class="col-md-6 col-6">
                        <div class="single-user-content">
                            <router-link :to="'/profile/'+profile.id" ><span class="username"><strong>{{ profile.first_name }} {{ profile.middle_name }} {{ profile.last_name }}</strong></span></router-link>
                                
                                <a href="javascript:;"><VerifiedIcon @click="showInfoToast('core contributor')" v-if="profile.checkmark_available != 0 && profile.checkmark_type == 1" fillColor="#0091c1"></VerifiedIcon>
                                <VerifiedIcon @click="showInfoToast('temporary contributor')" v-if="profile.checkmark_available != 0 && profile.checkmark_type == 2" fillColor="#8d8d8d"></VerifiedIcon>
                                <VerifiedIcon @click="showInfoToast('volunteer')" v-if="profile.checkmark_available != 0 && profile.checkmark_type == 3" fillColor="#b6c100"></VerifiedIcon></a>
                            
                            
                         
                            <span><strong></strong>
                            <br>
                            Lives in {{ profile.area_name }}<br>
                            Relation: {{ profile.relation }}
                            </span>
                        </div>
                    </div>
                    <div class="col-md-4 col-3">
                        <div class="single-user-actions">
                            <SaveButton :textsize="true" :loading="false" buttonText="View" :full_width="true" :big_button="false" @clicked="viewProfile(profile.id)"></SaveButton>
                            <div class="clearfix"></div>
                            
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </span>
</template>

<script>
import router from './../../../routes/index';
import { useToast } from 'vue-toastification';
import VerifiedIcon from 'vue-material-design-icons/CheckDecagram.vue';
import SaveButton from '../UI/SaveButton.vue';
import store from '@/store';

export default {
    name:'ShowUsers',
    props: ['profiles'],
    components:{
        VerifiedIcon,
        SaveButton
    },
    data : function(){
        return {
            toast: useToast()
        }
    },
    
    methods: {
        viewProfile : function(id){
            router.push({path:'/profile/'+id});
        },
        showInfoToast : function(thetype){
            this.toast.info('This person is a '+thetype);
        }

    }
}
</script>