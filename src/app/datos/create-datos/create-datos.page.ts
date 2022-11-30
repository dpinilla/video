import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ConexionService } from 'src/app/services/conexion.service';
import { Datos } from '../models/datos';

@Component({
  selector: 'app-create-datos',
  templateUrl: './create-datos.page.html',
  styleUrls: ['./create-datos.page.scss'],
})
export class CreateDatosPage implements OnInit {
  @Input() datos: Partial<Datos>
  isUpdate:boolean = false;
  constructor(private loadingCtrl: LoadingController,
              private conexion: ConexionService,
              private toast: ToastController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
    this.updateDatos()
  }

  form = new FormGroup({
    datId: new FormControl('',[]),
    datNombre: new FormControl('',[
      Validators.required,
      Validators.minLength(2)
    ]),
    datApellido: new FormControl('',[
      Validators.required,
      Validators.minLength(2)
    ]),
    datEdad: new FormControl('',[
      Validators.required,
      Validators.minLength(2)
    ]),
    datDeporte: new FormControl('',[
      Validators.required,
      Validators.minLength(2)
    ]),
    datImagen: new FormControl('',[
      Validators.required,
      Validators.minLength(2)
    ]),
  })

  async onSubmit(){
    const dat = this.form.value
    if(this.isUpdate){
      let id = this.datos.datId
      this.datos = dat
      this.datos.datId = id
      const loading = await this.loadingCtrl.create({
        message: 'Actualizando Datos...'
      })
      await loading.present()

      this.conexion.updateDatos(this.datos).subscribe(data=>{
        this.presentToast('El Dato fue modificado con éxito','Dato Modificado.');
        /* this.presentAlert() */
        loading.dismiss();
        this.closeModal();
      }, error =>{
        this.error('Error','Ocurrió un error al modificar el dato.');
        
      })
    }
    else{
      this.datos = dat
      this.datos.datId = 0
      const loading = await this.loadingCtrl.create({
        message: 'Creando Datos...'
      })
      await loading.present()
      this.conexion.createDatos(this.datos).subscribe(data => {
        this.presentToast("El Dato fue guardado con éxito","Dato guardado")
        loading.dismiss()
        this.closeModal()
      }, error =>{
        this.error('Error', 'Ocurrió un error al crear Dato')
      })
      
    }
  }

  async error(encabezado:string, mensaje:string){
    const toast = await this.toast.create({
      header: encabezado,
      message: mensaje,
      duration: 2000
    })
    toast.present()
  }

  closeModal(){
    this.modalCtrl.dismiss(null, 'closed')
  }

  async presentToast(encabezado:string, mensaje: string) {
    const toast = await this.toast.create({
      header: encabezado,
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  updateDatos(){
    if(this.datos){ //Si recibió información
      this.isUpdate = true;
      this.form.patchValue({
        datNombre: this.datos.datNombre,
        datApellido: this.datos.datApellido,
        datEdad: this.datos.datEdad.toString(),
        datDeporte: this.datos.datDeporte,
        datImagen: this.datos.datImagen
      })
    }
  }

}
