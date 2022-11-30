import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  myNombre: string = ""

  constructor(private toastController: ToastController, 
              private router: Router) {}

  enviar(){
    if(this.myNombre.length > 0){
      console.log("Nombre:"+this.myNombre)
      this.router.navigate(['../datos',this.myNombre])
    }else{
      this.mensaje("Debe digitar el nombre")
    }
   
  }

  async mensaje(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
