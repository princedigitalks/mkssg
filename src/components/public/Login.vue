<template>
    <div>

        <div class="box padded-box">
            
            <h5>Login</h5>
            <br>
            <form action="javascript:;" method="POST" class="form-floating-space" id="loginForm">
                <div class="form-floating mb-3" v-if="login.phone && !otp_sent">
                    <input class="form-control rounded-3" v-model="phone" id="phone" type="number" placeholder="Enter phone number">
                    <label for="phone">Phone number</label>
                    <div v-if="!isPhone(phone) && submit" class="html-error">Phone is required and must be 10 digit number.</div>
                </div>
                <div class="form-floating mb-3" v-if="login.email && !otp_sent">
                    <input class="form-control rounded-3" v-model="email" id="email" type="email" placeholder="name@example.com">
                    <label for="email">Email address</label>
                    <div v-if="!isEmail(email) && submit" class="html-error">Email is required.</div>
                </div>
                <div class="form-floating mb-3" v-if="otp_sent">
                    <input class="form-control rounded-3" v-model="otp" id="otp" type="number" placeholder="Enter OTP" min="100000" max="999999" step="1">
                    <label for="otp">OTP</label>
                </div>
                <div class="btn-group btn-group-temp" role="group">
                    <button type="button" @click="selectLoginOption(1)" class="btn rounded-3 btn-primary btn-whatsapp"><WhatsAppIcon />&nbsp;Login with Whatsapp</button>
                </div>
                <div class="clearfix"></div>
                
                <br>
                <label><input type="checkbox" v-model="terms">&nbsp;I accept <router-link to="/terms-and-conditions" style="font-weight:bold;text-decoration:underline">terms &amp; conditions</router-link> and <router-link to="/privacy-policy" style="font-weight:bold;text-decoration:underline">privacy policy</router-link></label>
                <br>
                <br>
                <SaveButton v-if="!otp_sent" :loading="loading" :buttonText="btn_text" :full_width="true" :big_button="true" :icon="btn_icon" @clicked="btnClicked()"></SaveButton>
                <SaveButton v-if="otp_sent" :loading="re_loading" buttonText="Submit OTP" :full_width="true" :big_button="true" :icon="btn_icon" @clicked="submitOTP"></SaveButton>
                <div v-if="otp_sent" class="clearfix"></div>
                <br v-if="otp_sent">
                <SaveButton v-if="otp_sent" :loading="re_loading2" buttonText="Resend OTP" :full_width="true" :big_button="true" icon="RefreshIcon" @clicked="resendOTP"></SaveButton>
                <br>
                <br>
                
            </form>
        </div>
   <br>
    </div>
</template>

<style scoped>
    
</style>

<script>
    
    import SaveButton from './../UI/SaveButton.vue';
    import WhatsAppIcon from 'vue-material-design-icons/Whatsapp.vue';
    import EmailIcon from 'vue-material-design-icons/Email.vue';
    import PhoneIcon from 'vue-material-design-icons/Message.vue';
    import axios from 'axios';
    import { constants } from '@/constants';
    import { useToast } from "vue-toastification";
    import { Preferences } from '@capacitor/preferences';
    import common from '@/common';
    import { Capacitor } from '@capacitor/core';
    import router from './../../../routes/index';

    export default{
        name:'Login',
        components:{
            SaveButton,
            WhatsAppIcon,
            EmailIcon,
            PhoneIcon
        },
        data : function(){
            return {
                terms: true,
                toast:useToast(),
                email:'',
                phone:'',
                otp: '',
                submit: false,
                loading: false,
                re_loading: false,
                re_loading2: false,
                otp_sent: false,
                btn_text: 'Send OTP',
                btn_icon:'RocketIcon',
                login:{
                    phone: true,
                    email: false
                },
                resend_seconds:0
            }
        },
        methods : {
            isEmail: function(el){
                let filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                if (filter.test(el)) {
                    return true;
                }else{
                    return false;
                }
            },
            isPhone : function(ph){
                if(ph.toString().length == 10){
                    return true;
                }
                return false;
            },
            resetLoginOptions: function(){
                this.login.phone = false;
                this.login.email = false;
                this.submit = false;
                this.otp_sent = false;
                this.email = '';
                this.phone = '';
                this.otp = '';
            },
            selectLoginOption : function(option){
                this.resetLoginOptions();
                
                if(option == 1){
                    this.login.phone = true;
                }else if(option == 2){
                    this.login.email = true;
                }
                

            },
            btnClicked : function(resend = false){

                if(this.terms == false){
                    this.toast.error("Please accept terms & conditions and privacy policy");
                }else{

                    this.submit = true;
                    this.loading = true;
                    if(resend){
                        this.re_loading2 = true;
                    }

                    let phone_validated = false;
                    let email_validated = false;

                    if(this.login.phone == true){
                        if(this.isPhone(this.phone)){
                            phone_validated = true;
                        }
                    }else if(this.login.email == true){
                        if(this.isEmail(this.email)){
                            email_validated = true;
                        }
                    }
                    
                    if((this.login.phone == true && phone_validated == true) || (this.login.email == true && email_validated == true)){
                      
                      let formData = new FormData();
                        formData.append('wpno', this.phone);
                        formData.append('terms', this.terms);
                      
                        axios.post(constants.APIURL + '/whatsapp-send-otp', formData).then(response => {
                            this.toast.success(response.data);
                            this.loading = false;
                            if(resend){
                                this.re_loading2 = false;
                            }
                            this.otp_sent = true;
                        }).catch(error => {
                            
                            if(error.response){
                                
                                if(error.response.status != 400){
                                    this.toast.error("Unknown error occured");
                                }else{
                                    this.toast.error(error.response.data);
                                }
                                
                            }else{
                                this.toast.error("Error: Please check your internet connection");
                            }
                            this.loading = false;
                            if(resend){
                                this.re_loading2 = false;
                            }
                            
                        });
                        
                    }else{
                        
                        this.loading = false;
                        if(resend){
                            this.re_loading2 = false;
                        }
                    }

                }
                
                

                

            },

            submitOTP : function(){

                if(this.terms == false){
                    this.toast.error("Please accept terms & conditions and privacy policy");
                }else{

                    let phone_validated = false;
                    let email_validated = false;

                    if(this.login.phone == true){
                        if(this.isPhone(this.phone)){
                            phone_validated = true;
                        }
                    }else if(this.login.email == true){
                        if(this.isEmail(this.email)){
                            email_validated = true;
                        }
                    }

                    if(this.otp != '' && ((this.login.phone == true && phone_validated == true) || (this.login.email == true && email_validated == true))){

                        this.re_loading = true;

                        
                        let platform = Capacitor.getPlatform();

                        
                        let that = this;
                        common.fetchAndroidToken(function(android_token){

                            axios.post(constants.APIURL+'/auth-otp', {
                                otp:that.otp,
                                email : that.email,
                                phone: that.phone,
                                phone_validated: phone_validated,
                                email_validated: email_validated,
                                platform:platform,
                                android_token:android_token,
                                terms:that.terms

                            }).then(response => {

                                that.re_loading = false;
                                that.setToken(response.data);
                                router.push('feed');
                                
                            }).catch(error => {
                                
                                that.re_loading = false;
                                if(error.response){
                                    
                                    if(error.response.status != 400){
                                        that.toast.error("Unknown error occured");
                                    }else{
                                        that.toast.error(error.response.data);
                                    }
                                    
                                }else{
                                    that.toast.error("Error: Please check your internet connection");
                                }
                                
                                
                            });

                        });

                        
                    }

                }

                
            },

            resendOTP : function(){
                this.btnClicked(true);
            },

            setToken : (token) => {
                Preferences.set({
                    key: 'token',
                    value: token,
                });
            },
            
        },
        mounted(){

           
           

        },
        created(){
            common.checkAuth(function(bl){
                if(bl == true){
                    router.push('feed');
                }
            });
        }
    }
</script>
