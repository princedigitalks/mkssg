<template>
    <button :disabled="showLoading" @click="emitClicked" :class="{'py-3':b_button, 'w-100':f_width, 'small_btn_padding': !b_button, 'small_btn_font_size':textsize}" class="btn btn-primary rounded-3 text-decoration-none fw-bold text-uppercase m-0" id="submitButton" type="submit"><div v-if="showLoading" class="spinner-border" role="status"></div><component v-if="icon != '' && !showLoading" :is="icon" />&nbsp;<span v-if="!showLoading">{{ theText }}</span></button>
</template>
<style scoped>
    .small_btn_padding{
        padding:5px 10px 5px 10px;
    }
    .small_btn_font_size{
        font-size: 14px;
    }
</style>
<script>
    /*import HomeIcon from 'vue-material-design-icons/Home.vue';*/
    import RocketIcon from 'vue-material-design-icons/Rocket.vue';
    import RefreshIcon from 'vue-material-design-icons/Refresh.vue';
    import SearchIcon from  'vue-material-design-icons/Magnify.vue'
    import UploadIcon from 'vue-material-design-icons/Upload.vue';
    import CloseIcon from 'vue-material-design-icons/Close.vue';
    import SaveIcon from 'vue-material-design-icons/ContentSave.vue';
    import CheckIcon from 'vue-material-design-icons/Check.vue';
   
    export default{
        props: ['loading', 'buttonText', 'full_width', 'big_button', 'icon', 'textsize'],
        data : function(){
            return {
                showLoading: false,
                theText: '',
                f_width: false,
                b_button: false
            }
        },
        components:{
            /*HomeIcon*/
            RocketIcon,
            RefreshIcon,
            SearchIcon,
            UploadIcon,
            CloseIcon,
            SaveIcon,
            CheckIcon
        },
        computed: {
            
        },
        methods : {
            emitClicked: function(){
                this.showLoading = true;
                this.$emit('clicked', this.showLoading);
            },
            setters : function(){
                this.showLoading = this.loading;
                this.theText = this.buttonText;
                this.f_width = this.full_width;
                this.b_button = this.big_button;
            }
        },
        mounted(){
            this.setters();
            
        },
        updated(){
            this.setters();
            
        }
    }

</script>