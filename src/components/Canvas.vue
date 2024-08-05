<script lang='ts'>


  
import * as fabric from "fabric"
import circle from "../assets/circle.png"
import download from "../assets/download.png"
import image from "../assets/image.png"
import square from "../assets/square.png"
import text from "../assets/type.png"
import QrcodeVue from 'qrcode.vue'
import qricon from "../assets/qr-code.png"
import { toRaw } from "vue"



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
        top: this.centerPosition.y,
        left: this.centerPosition.x,
        cornerSize: toRaw(this.currDimensions).width  * 0.02 ,
        transparentCorners : false


      })
      canvas.add(circle)
      canvas.setActiveObject(circle)
    },
    addNewBox() {

      const rect = new fabric.Rect({
        top: this.centerPosition.y,
        left: this.centerPosition.x,
        width: 50,
        height: 50,
        fill: this.boxColor,
        borderColor: "#3845ff",
        cornerSize: toRaw(this.currDimensions).width  * 0.02 ,
        transparentCorners : false

      })
      canvas.add(rect)
      canvas.setActiveObject(rect)

    },
    removeSelection(){
        const selectedObjs = canvas.getActiveObjects();
        selectedObjs.forEach((selectedObj: any) => {

          canvas.remove(selectedObj);

          
        });

        canvas.requestRenderAll();


    },
    addText(){
        console.log(this.fontfamily);
        var text = new fabric.Textbox('PLACEHOLDER',
        { top: this.centerPosition.y,
          left: this.centerPosition.x,
          fill: this.textColor ,
          fontFamily:this.fontfamily,
          textAlign: 'center',
          cornerSize: toRaw(this.currDimensions).width  * 0.02 ,
          transparentCorners : false


        
        });

        canvas.add(text);
    },
    readImage(){
      const selectionCornerSize = toRaw(this.currDimensions).width  * 0.02;

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
              top: this.centerPosition.y,
              left: this.centerPosition.x,
              crossOrigin: "Anonymous",
              cornerSize: selectionCornerSize,
              transparentCorners : false


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
  
    const selectionCornerSize = toRaw(this.currDimensions).width  * 0.02 ;

    const QrCodeSrc = this.generateQrCode();
    var image = new Image();
    image.src = QrCodeSrc;
    image.onload = function() {
            var img = new fabric.Image(image);
            img.set({
              top: this.centerPosition.y,
              left: this.centerPosition.x,
              cornerSize: selectionCornerSize,
              cornerColor: "black",
              qrcode : "true",
              transparentCorners: false


            });
            
            console.log(img)
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
      //FETCHING TEMPLATE FROM BACKEND START
      const fetchedTemplate = await fetch("http://localhost:3000/json")
      const jsonTemplate = await fetchedTemplate.json()
      console.log(jsonTemplate);
      
      this.template = jsonTemplate
      this.currDimensions = jsonTemplate[0].dimensions;
      this.centerPosition = {
        x: jsonTemplate[0].dimensions.width / 2 , 
        y: jsonTemplate[0].dimensions.height / 2
      }

      console.log(this.centerPosition)


      console.log(this.currDimensions)
      console.log(this.template);
      if(boolCheck){
        this.template[0].dimensions = this.dims,
        console.log(this.template[0]);
      }
      //FETCHING TEMPLATE FROM BACKEND END

      //CHECKING IF EVENT OWNER OR ATTENDEE AND HANDLING PLACEHOLDER VALUES START
      if(this.qrValue !== "PLACEHOLDER"){
       console.log(this.template[0].objects)
       this.template[0].objects.forEach(obj => {
          if(obj.text === "PLACEHOLDER"){
                obj.text = this.qrValue
          }

          if(obj.qrcode === "true"){
                obj.src = this.generateQrCode()
          }
          obj.cornerSize = toRaw(this.currDimensions).width  * 0.02 
          obj.transparentCorners = false
        })
      };
      //CHECKING IF EVENT OWNER OR ATTENDEE AND HANDLING PLACEHOLDER VALUES START

       
      canvas.loadFromJSON(this.template[0]);
      
      canvas.setDimensions(this.template[0].dimensions,{backstoreOnly: true})

      
      // INIT START : initializing to prevent the need to select an object from the canvas in order for it to render (BUG TO FIX)

      var pugImg = new Image();
      pugImg.onload = (img) => {    
          var pug = new fabric.Image(pugImg, {      
      });
      canvas.add(pug);
      canvas.setActiveObject(pug);
      setTimeout(() => {
         this.removeSelection(); 

            }, 10);
      };
      pugImg.src = this.myImage;
      pugImg.crossOrigin = "Anonymous";

      // INIT END


      


      
    } catch (error) {

      //GENERATING BLANK CANVAS IF TEMPLATE NOT SET YET START

      console.error(error);
      canvas.setDimensions(this.dims);
      const json = canvas.toDatalessJSON(["clipPath","qrcode"]);
      json.id = "1"
      canvas.loadFromJSON(json);

      //GENERATING BLANK CANVAS IF TEMPLATE NOT SET YET END


    }

  },

 async saveTemplate(){
      // SAVING CURRENT TEMPLATE STATE TO BACKEND
      const vm = this
      const json = canvas.toDatalessJSON(["clipPath","qrcode"]);
      json.id = "1"
      json.dimensions = {
        height:canvas.getHeight(),
        width:canvas.getWidth()
      }
      const out = JSON.stringify(json, null, "\t");


      try {
        await fetch('http://localhost:3000/json/1', {
             method: 'PATCH',
             headers: {
            'Content-Type': 'application/json',
            },
             body: out,
        })
        .then(response => response.json())
        .then(()=>{alert("saved successfully")});

        
      } catch (error) {
        await fetch('http://localhost:3000/json/',{
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body:out,
        })
        .then(response => response.json())
        .then(()=>{alert("saved successfully")});
        
      }



      
      

  },

  changeFont(){
    const selectedFont =  this.$refs.font.value;
    this.fontfamily = selectedFont;
    const selectedObjs = canvas.getActiveObjects();
    console.log(selectedObjs);
    
    selectedObjs.forEach(selectedObj => {

      selectedObj.set("fontFamily", selectedFont)

    }); 

    canvas.requestRenderAll();




  },

  generateQrCode(){
    const QrcodeCanvas = document.getElementsByClassName("qrcodedom")[0];
    const QrCodeDataUrl =  QrcodeCanvas.toDataURL();
    return QrCodeDataUrl;
  },
  currdims(){
    console.log(toRaw(this.currDimensions) )
  }


  



    
  },
  props:{
    dims:{
      type:Object,
      default:
      {
        width:500 as number,
        height:500 as number
      }},
   
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
      template: null as any,
      fontfamily:"Times New Roman",
      currDimensions:null,
      centerPosition:null,

      


      
    }
  }
,

  mounted() {
    console.log(this.dims)
    console.log("mounted")

    canvas = new fabric.Canvas('canvas', {
      isDrawingMode: false,    
    });

//     fabric.Object.prototype.set({
//     borderColor: "white",
//     borderScaleFactor: 6,
//   cornerSize : 1200
// })




// Control handle properties
// ----------------------------------------




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

var fonts = ["Pacifico", "VT323", "Quicksand", "Inconsolata","Source Sans Pro"];
fonts.unshift('Times New Roman');
var select:HTMLElement|null = document.getElementById("font-family");

fonts.forEach(function(font) {
  var option = document.createElement('option');
  option.innerHTML = font;
  option.value = font;
  if(select){  
    select.appendChild(option);
  }
});


// canvas.on('mouse:wheel', function(opt) {
//   var delta = opt.e.deltaY;
//   var zoom = canvas.getZoom();
//   zoom *= 0.999 ** delta;
//   if (zoom > 20) zoom = 20;
//   if (zoom < 0.01) zoom = 0.01;
//   canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
//   opt.e.preventDefault();
//   opt.e.stopPropagation();
// });







  

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
    <!-- <div> <img @click="toJson" src="../assets/download.png"><img src="../assets/json-file.png">  </div> -->
    <div><img @click="toImage" src="../assets/download.png"> <img src="../assets/image.png"></div>
    <div><img  @click="removeSelection" src="../assets/x-circle.png"></div>
    <div><img  @click="addQrCode" src="../assets/qr-code.png"></div>
    <div><button @click="currdims">dims</button></div>



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
