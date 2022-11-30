import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ConexionService } from '../services/conexion.service';
import { CreateDatosPage } from './create-datos/create-datos.page';
import { Datos } from './models/datos';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.page.html',
  styleUrls: ['./datos.page.scss'],
})
export class DatosPage implements OnInit {

  nombre:string = ""
  datos: Datos[]
  subscription: Subscription
  constructor(private activateRoute: ActivatedRoute,
              private conexion:ConexionService,
              private router: Router,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private toastController: ToastController) { }

  

  ngOnInit() {
    this.nombre = this.activateRoute.snapshot.paramMap.get('id')
    this.visualizaDatos()

    this.subscription = this.conexion.refresh$.subscribe(() => {
      this.visualizaDatos()
    })
  }

  visualizaDatos(){
    this.conexion.listaDatos().subscribe(
      data => {
        this.datos = data
      }, error =>{console.log(error)}
    )

  }

  interface(i){
    if(this.datos[i].datDeporte === "Futbol"){
      this.router.navigate(['../futbol'])
    }
  }

  doRefresh(event){
    this.datos = []
    this.conexion.listaDatos().subscribe(
      data => {
        this.datos = data
        event.target.complete()
      }, error =>{console.log(error)}
    )
  }

  create(){
    this.modalCtrl.create({component:CreateDatosPage})
    .then((modal) =>{
      modal.present();
      return modal.onDidDismiss()
    }
    ) 
  }

  updateDatos(datos:Datos){
    this.modalCtrl.create({component:CreateDatosPage, componentProps: {datos}})
    .then((modal) =>{
      modal.present();
      return modal.onDidDismiss()
    }
    ) 
  }

  removeDatos(datId:any){
    let remove={}
    remove["datId"] = datId
    this.alertCtrl.create({
      header: 'Eliminar!',
      message: '¿Está seguro que desea eliminar?',
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'OK',
          handler: () => {
            this.conexion.removeDatos(remove).subscribe(
              data=> {
                this.mensaje("El dato fué eliminado con éxito")
              })
          },
        },
      ],
    })
    .then((alertE1) =>alertE1.present())
  }

  async mensaje(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

}
