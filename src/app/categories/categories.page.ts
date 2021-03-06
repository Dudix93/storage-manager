import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Box } from '../../models/Box';
import { ItemsPage } from '../items/items.page';
import { Router, NavigationExtras } from '@angular/router';
import { empty } from 'rxjs';

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
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get('boxes').then((savedBoxes) => {
      savedBoxes != null ?
        this.boxes = savedBoxes : 
        this.storage.set('boxes', this.boxes);
    });
  }

  addItem() {
    this.router.navigate(['add-item']);
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

  async editTheBox(passedBox) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Box',
      inputs: [
        {
          name: 'newBoxName',
          type: 'text',
          value: passedBox.name
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
            let newName = data['newBoxName'];
            if (newName) {
              this.storage.get('boxes').then((boxes: Array<Box>) => {
                boxes.forEach((box: Box, index) => {
                  if (box.name === passedBox.name) {
                    box.name = newName;
                    this.storage.set('boxes', boxes);
                    this.boxes = boxes;
                    return false;
                  }
                });
              });
              this.showToast("Box name changed.");
            } 
            else {
              this.showToast("Box name can't be empty!.");
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteTheBox(passedBox) {
    if (passedBox.items.length === 0) {
      const alert = await this.alertCtrl.create({
        header: 'Would you like to delete this box?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, 
          {
            text: 'Ok',
            handler: () => {
              this.storage.get('boxes').then((boxes: Array<Box>) => {
                boxes.forEach((box: Box, index) => {
                  if (box.name === passedBox.name) {
                    boxes.splice(index, 1);
                    this.storage.set('boxes', boxes);
                    this.boxes = boxes;
                    this.showToast("Box "+passedBox.name+" deleted.");
                    return false;
                  }
                });
              });
            }
          }
        ]
      });
      await alert.present();
    }
    else this.showToast("Box"+passedBox.name+" can't be deleted."); 
  }

  showTheBox(box: Box) {
    if (box.items.length === 0) {
      this.showToast('This box is empty.');
    }
    else {
      this.router.navigate(['items'], {
        state: {
          member: JSON.stringify(box),
          type: 'reader'
          }
      });
    }
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
