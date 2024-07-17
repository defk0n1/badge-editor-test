<template>
        <Canvas :key="dimensions" ref="editor" :dims="this.dimensions" :qrValue="this.encodedUser" :dimsChanged="this.dimsChanged"></Canvas>
        <DimensionsPicker @DimensionsPicked = "changeDimensions"></DimensionsPicker>
        <h1>{{ this.dimensions.height }}</h1>
        <h1>{{ this.dimensions.width }}</h1>

</template>


<script>
import Canvas from './Canvas.vue';
import DimensionsPicker from './DimensionsPicker.vue';

export default {
    name: 'BadgeEditor',
    components: {
        Canvas,
        DimensionsPicker
    },
    props:{
        defdimensions:{
            type: Object
        },
        encodedUser: {
            type: String,
            default:"test qr value"
            
        }

       


    },
    data(){
        return ({
            dimensions:
        {
            width:500,
            height:500
        },
            dimsChanged:false,
       
    })
    },
    methods:{
        changeDimensions(newDimensions){
            this.dimensions = newDimensions;
            console.log(newDimensions);
            if (this.dimsChanged === false) {
                this.dimsChanged = true;
                
            }
            console.log(this.$refs.editor.dimsChanged);




        }
    },
    mounted(){
        console.log(this.$refs.editor.dims);
    }
}
</script>

<style>

</style>