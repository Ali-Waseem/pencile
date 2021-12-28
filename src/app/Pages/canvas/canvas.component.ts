import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { fabric } from 'fabric';
import * as lodash from 'lodash';
import { Canvas } from 'src/app/Model/canvas';
import { Share } from '../../Model/shared-canvas';
import { GlobalService } from '../../services/global.service';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {

  mousePressed: boolean = false
  currentMode
  canvas
  svg : any
    mode = {
    pan :'pan',
    draw : 'draw'
  }
  shareCanvasList:Share
  selectedID: any;
  constructor(
    public global : GlobalService,
    private route : Router,
    private authService : SocialAuthService,
  ) { }

  ngOnInit(): void {
    this.selectedID =this.global.userData.id
    let data = localStorage.getItem("userData")
    if(data == null){
      this.route.navigateByUrl('login')
    }

    this.canvas= new fabric.Canvas("canvas" , {
      width:800,
      height:400,
      selection:false,
    })
    this.canvas.renderAll();
    this.getLastCanvas();
    this.getSharedCanvas();

    this.canvas.on('mouse:up' , () => {
      console.log("-----------MOUSE UP---------")
      this.mousePressed = false
      this.canvas.setCursor('default')
      this.saveCanvas()
    })

    this.canvas.on('mouse:down' , () => {
      console.log("-----------MOUSE DOWN---------")
      this.mousePressed = true
      if(this.mode.pan == this.currentMode){
        this.canvas.setCursor('grab')
        this.canvas.renderAll()
      }
    })


    this.canvas.on('mouse:move' , (obj) => {
      if(this.mousePressed && this.mode.pan == this.currentMode){
        const delta = new fabric.Point(obj.e.movementX , obj.e.movementY )
        this.canvas.relativePan(delta)
        this.canvas.setCursor('grab')
        this.canvas.renderAll()
      }
      else if(this.mousePressed && this.mode.draw == this.currentMode){
        this.canvas.isDrawingMode = true
        this.canvas.renderAll()
      }
    })
  }


  clear(){
    this.canvas.clear()
    this.svg = this.canvas.toSVG();
    this.saveCanvas()
  }


  saveCanvas(){
    this.svg = this.canvas.toSVG();
    let body : Canvas ={
      id: this.global.userData.id,
      email:this.global.userData.email,
      data: this.svg
    }
    this.global.saveData(body , (callback)=>{
      console.log(callback)
    })
  }


  changeColor(e) {
    this.canvas.freeDrawingBrush.color = e.target.value
  }

  toggleMode(mode){
    if(mode === this.mode.draw){
      if(this.currentMode === this.mode.draw){
        this.currentMode = ''
        this.canvas.isDrawingMode = false
        this.canvas.renderAll()
      }
      else{
        this.currentMode = this.mode.draw
        this.canvas.renderAll()
      }
    }
  }

  shareCanvas(){
    this.svg = this.canvas.toSVG();
    let body: Share = {
      userId:this.global.userData.id,
      userName: this.global.userData.name,
      data: this.svg
    }
    this.global.shareCanvas(body , result => {
      console.log("Successfully shared")
    })
  }

  addImg(e){
    let img = e.target.files[0]
    let i
    var reader  = new FileReader();
    reader.readAsDataURL(img)
    reader.onload = (e) => {
      i = reader.result;
      fabric.Image.fromURL(i , res => {
        this.canvas.add(res)
      })
    }
  }

  getLastCanvas(){
    if(this.global.userData != null) {
    this.global.getData(result => {
      if(result && result.success){
        new fabric.loadSVGFromString(result.success.data, o =>{
          this.canvas.add(...o)
        })
      }
      else {
        return
      }
    })
  }
  }

  logout(){
    this.authService.signOut();
    this.global.userData  = {
      email:'',
      id:'',
      name:''
    }
    localStorage.clear()
    this.route.navigateByUrl('login')
  }


  getSharedCanvas(){
    this.global.getSharedList(res => {
      console.log("getSharedCanvas",res.success)
      this.shareCanvasList = lodash.values(res.success)
    })
  }

  getSelectedCanvas(id){
    debugger
    this.selectedID =id
    if(id == this.global.userData.id){
      this.canvas.clear()
      this.getLastCanvas()
    }
    else {
      this.global.getSelectedCanvas(id , result => {
        if(result && result.success){
          this.canvas.clear()
          new fabric.loadSVGFromString(result.success.data, o =>{
            this.canvas.add(...o)
          })
        }
        else {
          return
        }
        console.log(result)
      })
    }
  }

}
