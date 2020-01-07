import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Box } from '../../models/Box';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  boxes: Array<any> = [];

  constructor(
    private toastCtrl: ToastController,
    private storage: Storage,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.storage.get('boxes').then((savedBoxes) => {
      savedBoxes != null ?
        this.boxes = savedBoxes : 
        this.storage.set('boxes', this.boxes);
    });
  }

  async addBox() {
      const alert = await this.alertCtrl.create({
        header: 'New Box',
        inputs: [
          {
            name: 'newBoxName',
            type: 'text',
            placeholder: 'New Box Name'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Ok',
            handler: data => {
                  this.storage.get('boxes').then((box) => {
                    box.push(new Box(data['newBoxName']));
                    this.storage.set('boxes', box);
                    this.boxes = box;
                  });
                  this.showToast(data['newBoxName'].concat(' added!'));
            }
          }
        ]
      });
      await alert.present();
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 1000
    }).then((toastData)=>{
      toastData.present();
    });
  }
}
