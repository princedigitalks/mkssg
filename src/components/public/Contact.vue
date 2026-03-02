<template>
    <div>
        <div class="feature text-white rounded-4 env-icon text-center"><Envelope :size="30" /></div>
        <h1 class="contact-header">How can we help?</h1>
        <br>
        <div class="row">
            <div class="col-md-8">
                <div class="box">
                    <h5>Contact form</h5>
                    <form action="javascript:;" method="POST" class="form-floating-space" id="contactForm">
                                        
                        <div class="form-floating mb-3">
                            <input class="form-control rounded-3" id="full_name" v-model="contact.full_name" type="text" placeholder="Enter full name">
                            <label for="full_name">Full name</label>
                            <div v-if="contact.full_name == '' && contact.submit" class="html-error">Full name is required.</div>
                        </div>

                        <div class="form-floating mb-3">
                            <input class="form-control rounded-3" v-model="contact.reason" id="reason" type="text" placeholder="Enter reason">
                            <label for="reason">Reason</label>
                            <div v-if="contact.reason == '' && contact.submit" class="html-error">Reason is required.</div>
                        </div>

                        <div class="form-floating mb-3">
                            <input class="form-control rounded-3" v-model="contact.phone" id="phone" type="number" placeholder="Enter phone">
                            <label for="phone">Phone</label>
                            <div v-if="contact.phone == '' && contact.submit" class="html-error">Phone is required.</div>
                        </div>
                        
                        <div class="form-floating mb-3">
                            <input class="form-control rounded-3" v-model="contact.email" id="email" type="email" placeholder="name@example.com">
                            <label for="email">Email address</label>
                            <div v-if="!isEmail(contact.email) && contact.submit" class="html-error">Email is required.</div>
                        </div>
                        
                    
                        <div class="form-floating mb-3">
                            <textarea class="form-control rounded-3" v-model="contact.message" id="message" placeholder="Enter the message" style="height: 10rem"></textarea>
                            <label for="message">Message</label>
                            <div v-if="contact.message == '' && contact.submit" class="html-error">Message is required.</div>
                        </div>
                        
                        <vue-recaptcha ref="recaptcha" @verify="verifyCaptcha" sitekey="6LfPLgwUAAAAAJf32Uo_OAK0T2xXgOmGbMGjntkQ"></vue-recaptcha>
                        <div class="mt-2">
                            <SaveButton :loading="loading" buttonText="Send" :full_width="true" :big_button="true" @clicked="btnClicked"></SaveButton>
                        </div>
                        <br>
                    </form>
                </div>
            </div>
            <div class="col-md-4 phone-mt">
                <div class="box">
                    <h5>Address</h5>
                    <p>209, Ganpati Plaza Appartment, Katargam darwaja, Katargam road, Surat.</p>
                    <p>President: Shri Dineshbhai Vallabhbhai Gohel</p>
                    <p>Phone: 9925156138</p>
                </div>
                <br>
                
            </div>
        </div>
        
    </div>
</template>

<style scoped>
    .env-icon{
        background: var(--reddish);
        padding:10px 5px 10px 5px;
        max-width:55px;
    }
    .contact-header{
        margin-top:25px;
        font-weight: 500;
        color:var(--reddish);
    }
    .box{
        padding:25px;
        padding-bottom:10px;
    }
    .box h5{
        margin-bottom:20px;
        font-weight:600;
        color:var(--reddish);
    }
</style>

<script>
import axios from 'axios';
import { constants } from '@/constants';
import Envelope from 'vue-material-design-icons/Email.vue';
import SaveButton from './../UI/SaveButton.vue';
import { useToast } from "vue-toastification";
import { VueRecaptcha } from 'vue-recaptcha';
import { Preferences } from '@capacitor/preferences';
import common from '@/common';
import router from './../../../routes/index';

export default{
    name:'Contact',
    components:{
        Envelope,
        SaveButton,
        VueRecaptcha
    },
    data : function(){
        return {
            toast: useToast(),
            loading : false,
            contact: {
                full_name:'',
                reason:'',
                phone:'',
                email:'',
                message:'',
                captcha: null,
                submit: false
            }
            
        }
    },
    computed: {
        isValidEmail: function(){
            if(this.isEmail(this.contact.email)){
                return true;
            }else{
                return false;
            }
        }
    },
    watch: {
        
        
    },
    methods : {

        verifyCaptcha: function(vr){
           this.contact.captcha = vr;
        },
        
        resetForm: function(){
            this.loading = false;
            this.contact.full_name = '';
            this.contact.reason = '';
            this.contact.phone = '';
            this.contact.email = '';
            this.contact.message = '';
            this.contact.captcha = false;
            this.contact.submit = false;
            this.$refs.recaptcha.reset();
        },

        btnClicked : function(loading){
            
            if(this.contact.captcha == '' || this.contact.captcha == null){
                this.toast.error("Error: Please check the captcha checkbox.");
            }else{
                this.contact.submit = true;
                this.loading = true;
                if(this.contact.full_name != '' && this.contact.reason != '' && this.contact.phone != '' && this.isEmail(this.contact.email) && this.contact.message != ''){

                    let sendUrl = constants.APIURL+'/submit-contact-form';
                   
                    axios.post(sendUrl, this.contact).then(response => {
                        this.resetForm();
                        this.toast.success("Message sent successfully.");
                        /*show toast*/
                    }).catch(error => {
                        
                        if(error.response){
                            this.toast.error(error.response.data);
                            this.$refs.recaptcha.reset();
                        }else{
                            this.toast.error("Error: Please check your internet connection");
                        }
                        this.loading = false;
                    });

                }else{
                    this.loading = false;
                }
            }

        },
        isEmail: function(el){
            let filter = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (filter.test(el)) {
                return true;
            }else{
                return false;
            }
        }
    },
    created(){
        let pathname = this.$route.path.substr(1, this.$route.path.length - 1);
        common.checkAuth(function(bl){
            if(bl == true){
                if(pathname == 'contact'){
                    router.push('user-contact');
                }
            }
        });
                
    
    },
    mounted(){
        
        

       
    }
}

</script>