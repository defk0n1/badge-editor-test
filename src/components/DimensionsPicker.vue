<script lang='ts'>
import { defineComponent } from 'vue'

const aSeriesSizes = {
    "A0": { width: 9930, height: 14040 },
    "A1": { width: 7020, height: 9930 },
    "A2": { width: 4950, height: 7020 },
    "A3": { width: 3510, height: 4950 },
    "A4": { width: 2490, height: 3510 },
    "A5": { width: 1740, height: 2490 },
    "A6": { width: 1230, height: 1740 },
    "A7": { width: 870, height: 1230 },
    "A8": { width: 600, height: 870 },
    "A9": { width: 450, height: 600 },
    "A10": { width: 300, height: 450 }
}



export default defineComponent({
    name:'DimensionsPicker',
    methods:{
        changeDimensions(){
        // var newWidth = this.$refs.width.value;
        // var newHeight = this.$refs.height.value;
        // var dimensions = {
        //     width: newWidth,
        //     height: newHeight

        // }
        // this.$emit('DimensionsPicked', dimensions)
        this.pickedSize = this.$refs.printingSize.value
        var size = this.pickedSize
        console.log(aSeriesSizes[size]);
        var dimensions = aSeriesSizes[size];

        this.$emit('DimensionsPicked', dimensions);




        }
        

    },
    emits:[
      'DimensionsPicked'
    ],
    data(){
        return{
        pickedSize:{
            type: String,
            default : "A4"

        },
        
        }
    
    }

   }

)


</script>





<template>
    <div class="picker-wrapper">
        <label for="height">Set Height </label>
        <input type="number" ref="height" id="height">
        <label for="height">Set Width </label>
        <input type="number" ref="width" id="width">
        <button @click="changeDimensions">Change</button>
    </div>
    <div class="aseriessizes">
        <label for="paper-size">Choose printing size (for 300 PPI):</label>
    <select @change="changeDimensions" id="paper-size" name="paper-size" ref="printingSize">
        <option value="A0">A0 (9930 x 14040 pixels)</option>
        <option value="A1">A1 (7020 x 9930 pixels)</option>
        <option value="A2">A2 (4950 x 7020 pixels)</option>
        <option value="A3">A3 (3510 x 4950 pixels)</option>
        <option value="A4">A4 (2490 x 3510 pixels)</option>
        <option value="A5">A5 (1740 x 2490 pixels)</option>
        <option value="A6">A6 (1230 x 1740 pixels)</option>
        <option value="A7">A7 (870 x 1230 pixels)</option>
        <option value="A8">A8 (600 x 870 pixels)</option>
        <option value="A9">A9 (450 x 600 pixels)</option>
        <option value="A10">A10 (300 x 450 pixels)</option>
    </select></div>
</template>

<style scoped>
.picker-wrapper{
    width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  background-color: #ffffff;
  margin-bottom: 3vh;
}
.aseriessizes{
    width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  background-color: #ffffff;
  margin-bottom: 6vh;
}

</style>
