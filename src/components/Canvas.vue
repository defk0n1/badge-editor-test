<script lang='ts'>

// @ts-nocheck


import { RouterLink, RouterView } from 'vue-router'
import * as fabric from "fabric"
import circle from "../assets/circle.png"
import download from "../assets/download.png"
import image from "../assets/image.png"
import square from "../assets/square.png"
import text from "../assets/type.png"
import QrcodeVue from 'qrcode.vue'
import qricon from "../assets/qr-code.png"
// import testjson from "../assets/test.json"



var canvas:any = null

export default {
  name: 'Canvas',
  components:{
    QrcodeVue,

  },
 
  methods: {
    toImage(){
      const ext = "png";
      const base64 = canvas.toDataURL({
        format: ext,
        enableRetinaScaling: false,
      });
      const link = document.createElement("a");
      link.href = base64;
      link.download = `badge.${ext}`;
      link.click();
    },
    async toJson() {
      const json = canvas.toDatalessJSON(["clipPath"]);
      const out = JSON.stringify(json, null, "\t");
      const blob = new Blob([out], {type: "text/plain"});
      const clipboardItemData = {[blob.type]: blob};

      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;
      a.download = "myWork.json";
      a.click();
      URL.revokeObjectURL(blobURL);
    },
    addCircle() {
      const circle = new fabric.Circle({
        radius: 40,
        fill: this.circleColor,
        top: 300,
        left: 300
      })
      canvas.add(circle)
      canvas.setActiveObject(circle)
    },
    addNewBox() {
      this.count = this.count + 10
      const rect = new fabric.Rect({
        top: 150,
        left: this.count,
        width: 50,
        height: 50,
        fill: this.boxColor,
        borderColor: "#3845ff",
        cornerSize: 15,
        cornerStyle: "circle"
      })
      canvas.add(rect)
      canvas.setActiveObject(rect)

    },
    removeSelection(){
        const selectedObjs = canvas.getActiveObjects();
        selectedObjs.forEach(selectedObj => {

          canvas.remove(selectedObj);

          
        });

        canvas.requestRenderAll();


    },
    addText(){
        console.log(this.fontfamily);
        var text = new fabric.Textbox('Hello world',
        { left: 100,
          top: 100,
          fill: this.textColor ,
          fontFamily:this.fontfamily
        
        });

        canvas.add(text);
    },
    readImage(){
      
      this.file = this.$refs.doc.files[0];
      console.log(this.file);
      const extension  = this.file.name.split(".")[1]
      const reader = new FileReader();
      
      
      reader.onload = async (res) => {
          var image = new Image();
          console.log(res.target.result)
          if(extension === "json"){
            const json = atob(res.target.result.substring(29));
            const result = JSON.parse(json);
            console.log(result);
            canvas.loadFromJSON(result);
            // canvas.loadFromJSON(result).then((objects)=>{canvas.add(objects)})
            canvas.requestRenderAll.bind(canvas)
            

            
          }
          else{
            image.src = res.target.result;
            image.onload = function() {
            var img = new fabric.Image(image);
            img.set({
              left: 100,
              top: 60,
              crossOrigin: "Anonymous"

            });
            // img.scaleToWidth(200);
            canvas.add(img);
          }
        }
          

        };
      reader.onerror = (err) => console.log(err);
      reader.readAsDataURL(this.file);



      

  },
  changeWidth(){
    this.width = this.$refs.width.value;
    console.log(this.width)
    canvas.setWidth(
      this.width
  );
  canvas.requestRenderAll()
  },
  changeHeight(){
    this.height=this.$refs.height.value;
    canvas.setHeight(
      this.height
  );
  canvas.requestRenderAll()

  },
  addQrCode(){
    const QrcodeCanvas = document.getElementsByClassName("qrcodedom")[0];
    const QrCodeDataUrl =  QrcodeCanvas.toDataURL();
    console.log(QrCodeDataUrl);
    var image = new Image();
    image.src = QrCodeDataUrl;
    image.onload = function() {
            var img = new fabric.Image(image);
            img.set({
              left: 100,
              top: 60,
              cornerSize: 20,
              cornerColor: "black",
              

            });
            // img.scaleToWidth(200);
            canvas.add(img);
            canvas.requestRenderAll();


          }
  image.crossOrigin = "Anonymous";      
          


    

   


    



    



  },
  async fetchTemplate(){
    const boolCheck = this.dimsChanged
    console.log(this.dimsChanged)

    try {
      this.template = await fetch("http://localhost:3000/json");
      console.log(this.template);

      const jsontemplate = await this.template.json();
      console.log(jsontemplate[0]);
      if(boolCheck){
        jsontemplate[0].dimensions = this.dims
        console.log(jsontemplate[0]);

      }
      canvas.loadFromJSON(jsontemplate[0]);
      
      canvas.setDimensions(jsontemplate[0].dimensions,{backstoreOnly: true})

      
      var pugImg = new Image();
      pugImg.onload = (img) => {    
          var pug = new fabric.Image(pugImg, {      
      });
      console.log(pug);

      canvas.add(pug);
      canvas.setActiveObject(pug);
    
      setTimeout(() => {
         this.removeSelection(); 

            }, 10);


  
      };
      pugImg.src = this.myImage;
      pugImg.crossOrigin = "Anonymous";


      


      
    } catch (error) {
      console.error(error);
    }

  },

 saveTemplate(){
      const json = canvas.toDatalessJSON(["clipPath"]);
      json.id = "1"
      json.dimensions = {
        height:canvas.getHeight(),
        width:canvas.getWidth()
      }
      const out = JSON.stringify(json, null, "\t");
      fetch('http://localhost:3000/json/1', {
             method: 'PATCH',
             headers: {
            'Content-Type': 'application/json',
            },
             body: out,
        })
        .then(response => response.json())
        .then(alert("saved successfully"));

      

  },

  changeFont(){
    this.fontfamily = this.$refs.font.value;



  }
  



    
  },
  props:{
    dims:{
        width:500,
        height:500
      },
   
    qrValue:{
      type: String,
      default: "null"
    },
    qrShow:{
      type: Boolean,
      default:false

    },
    dimsChanged:{
      type: Boolean,
      default:false
    }

  },
  data() {
    return {
      count: 250,
      myImage: "https://i.imgur.com/J0eEQOX.png",
      file: null,
      circleIcon:circle,
      squareIcon:square,
      downloadIcon:download,
      textIcon:text,
      imageIcon:image,
      boxColor:"#FF00FF",
      circleColor:"#FF00FF",
      textColor:"#FF00FF",
      template:null,
      fontfamily:"Times New Roman"

      


      
    }
  }
,

  mounted() {
    console.log(this.dims)
    console.log("mounted")

    canvas = new fabric.Canvas('canvas', {
      isDrawingMode: false,    
    });

  //   canvas.setDimensions({
  //     width:parseInt(this.dims.width),
  //     height:parseInt(this.dims.height),
  //   },
  // {
  //   backstoreOnly: true,
  // });
  // canvas.setDimensions({
  //     width:parseInt(this.dims.width),
  //     height:parseInt(this.dims.height),
  //   },
  // {
  //   backstoreOnly: true,
  // });
    var aspectRatio = parseInt(this.dims.height)/parseInt(this.dims.width)

  canvas.setDimensions({
      width:(window.innerHeight*0.9)/aspectRatio,
      height:window.innerHeight*0.9 ,

    },
  {
    cssOnly: true,
  });

  






    canvas.backgroundColor = "white";

  
 


  this.fetchTemplate();
  canvas.setDimensions({
      width:(window.innerHeight*0.9)/aspectRatio,
      height:window.innerHeight*0.9 ,

    },
  {
    cssOnly: true,
  });

  



canvas.requestRenderAll();

var fonts = ["Pacifico", "VT323", "Quicksand", "Inconsolata"];
fonts.unshift('Times New Roman');
var select = document.getElementById("font-family");
fonts.forEach(function(font) {
  var option = document.createElement('option');
  option.innerHTML = font;
  option.value = font;
  select.appendChild(option);
});






  

  }
}
    


</script>

<template>
    <div class="canvas-wrapper">
    <canvas id="canvas" style="width: 50vw; height: 70vh"></canvas>
    <div class="buttons-wrapper"><div> <img @click="addNewBox" src="../assets/square.png"><VaColorInput v-model="boxColor" style="width: 10vw;"  /></div>
    <div> <img @click="addCircle" src="../assets/circle.png"><VaColorInput v-model="circleColor" style="width: 10vw;"/>
    </div>
    <div> <img  @click="addText" src="../assets/type.png"> <VaColorInput v-model="textColor" style="width: 10vw;" /> <select id="font-family" ref="font" @change="changeFont"></select></div>
    <div> <img @click="toJson" src="../assets/download.png"><img src="../assets/json-file.png">  </div>
    <div><img @click="toImage" src="../assets/download.png"> <img src="../assets/image.png"></div>
    <div><img  @click="removeSelection" src="../assets/x-circle.png"></div>
    <div><img  @click="addQrCode" src="../assets/qr-code.png"></div>



    <label class="custom-file-upload">
      <input type="file" ref="doc" @change="readImage" />
      <img src="../assets/upload.png"/>
      <img src="../assets/image.png">
    </label>
    <div><img  @click="saveTemplate" src="../assets/save.png"></div>

    


    </div> 
  </div>
    <div class="qr-wrapper">
      <qrcode-vue :value="this.qrValue" :size="800" level="H" render-as="canvas" class="qrcodedom"/>
    </div>



</template>

<style scoped>

.canvas-wrapper{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  height: 100vh;
}

.buttons-wrapper{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  height: 60vh;
  /* width: fit-content; */


}


.buttons-wrapper div{
  /* width: fit-content; */
  display: flex;
  flex-direction: row;

}



.buttons-wrapper div:hover{
  cursor: pointer;

 
}input[type="file"] {
    display: none;
}
.custom-file-upload {
    
    cursor: pointer;
}

.qr-wrapper{
  visibility: hidden;
  position:absolute;
  top:0;
  right:0;
  }






</style>
