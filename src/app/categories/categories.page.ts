import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Box } from '../../models/Box';
import { ItemsPage } from '../items/items.page';
import { Router, NavigationExtras } from '@angular/router';

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
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    console.log('update boxes');
    
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

  showTheBox(box: Box) {
    if (box.items.length === 0) {
      this.showToast("This box is empty!");
    }
    else {
      let items = box.items;
      items.forEach(item => {
        if (item.hasOwnProperty('name')) {
          items[items.indexOf(item)] = item.name;
        }
      });
      let navigationExtras: NavigationExtras = {
        queryParams: {
            'box_items': box.items
        }
    };
      this.router.navigate(['items'], navigationExtras);
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
