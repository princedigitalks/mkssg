<template>
    <div>
        <div>
            
            
            
            
            
            
            <div class="box p-4">
                <form action="javascript:;" method="POST">
                    
                    <div class="form-floating mb-3">
                        <select id="gender" class="form-control" v-model="gender">
                            <option value="all">Show All</option>
                            <option value="male">Groom</option>
                            <option value="female">Bride</option>
                        </select>
                        <label for="gender">I'm looking for</label>
                        
                    </div>
                  



                    <div class="mt-2">
                        <SaveButton :loading="loading" buttonText="Search" :full_width="true" :big_button="true" icon="SearchIcon" @clicked="searchListing"></SaveButton>
                    </div>

                </form>
            </div>
        </div>

    </div>
</template>

<style scoped>
   .cropper {
	width: 100%;
    max-height:400px;
	background: #DDD;
}

</style>

<script>


import router from './../../../routes/index';
import SaveButton from '../UI/SaveButton.vue';
import { Buffer } from 'buffer';


export default {
    name: 'SearchMatrimonyListing',
    components:{
        SaveButton
    },
    data : function(){
        return {
                loading: false,
                loaded: false,
                gender: 'all'
            }
    },
    methods : {        

        searchListing : function(){
            let buffer = Buffer.from(JSON.stringify({gender: this.gender}));
            buffer = buffer.toString('base64');
            router.push({ path:'search-listings/'+buffer });
        }

    },
    created(){
        
    },
    mounted(){

        
    }
}
</script>