import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Box } from '../../models/Box';
import { Item } from '../../models/Item';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.page.html',
  styleUrls: ['./add-item.page.scss'],
})
export class AddItemPage implements OnInit {

  boxes: Array<any> = [];
  itemName: string = '';
  boxName: string = '';
  itemDescription: string = '';
  boxOrItem: string;
  addItemToNewBox: string;
  BreakException = {};

  constructor(
    private toastCtrl: ToastController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.storage.get('boxes').then((savedBoxes) => {
        this.boxes = [];
        savedBoxes.forEach((box, index) => {
          this.boxes.push({
            name: box.name,
            type: 'radio',
            label: box.name,
            value: box.name,
            checked: index === 0 ? true : false,
          });
        });
    });
  }

  back() {
    this.router.navigate(['']);
  }

  async addItem() {
    if (this.boxes.length > 0) {
      const alert = await this.alertCtrl.create({
        header: 'Where is this ' + this.boxOrItem + ' ?',
        inputs: this.boxes,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
            }
          }, {
            text: 'Ok',
            handler: boxChosen => {
                const savedBoxes = this.storage.get('boxes');
                savedBoxes.then(boxes => {
                  boxes.forEach(box => {
                    if (box.name === boxChosen){
                      try{
                        box.items.forEach(item => {
                          switch (this.boxOrItem) {
                            case 'box':
                              if (item.name === this.boxName) {
                                this.showToast("Such box already is in the box!");
                                throw this.BreakException;
                              }
                              break;
                            case 'item':
                              if (item.name === this.itemName) {
                                this.showToast("Such item already is in the box!");
                                throw this.BreakException;
                              }
                              break;
                          }
                        });
                        switch (this.boxOrItem) {
                          case 'box':
                            this.addItemToNewBox === 'yes' ?
                              box.items.push(new Box(this.boxName, [new Item(this.itemName, this.itemDescription)])) :
                              box.items.push(new Box(this.boxName));
                            this.showToast(this.boxName + " added to " + boxChosen);
                            break;
                          case 'item':
                            box.items.push(new Item(this.itemName, this.itemDescription));
                            this.showToast(this.itemName + " added to " + boxChosen);
                            break;
                        }
                        this.storage.set('boxes', savedBoxes);
                      }
                      catch(e) {
                        if (e !== this.BreakException) throw e;
                      }
                    }
                  });
                });
            }
          }
        ]
      });
      await alert.present();
    }
    else {
      this.showToast("Nowhere to put it. Add BOX first!")
    }
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 2000
    }).then((toastData)=>{
      toastData.present();
    });
  }
}
