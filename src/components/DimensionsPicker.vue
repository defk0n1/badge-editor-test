<script>
export default {
    name:'DimensionsPicker',
    methods:{
        changeDimensions(){
        var newWidth = this.$refs.width.value;
        var newHeight = this.$refs.height.value;
        var dimensions = {
            width: newWidth,
            height: newHeight

        }
        this.$emit('DimensionsPicked', dimensions)
        }
        

    },
    emits:[
      'DimensionsPicked'
    ]
   }




</script>





<template>
    <div class="picker-wrapper">
        <label for="height">Set Height </label>
        <input type="number" ref="height" id="height">
        <label for="height">Set Width </label>
        <input type="number" ref="width" id="width">
        <button @click="changeDimensions">Change</button>
    </div>
    
</template>

<style scoped>
.picker-wrapper{
    width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  background-color: #ffffff;
  margin-bottom: 6vh;
}

</style>
