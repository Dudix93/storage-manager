import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common'
import { Storage } from '@ionic/storage';
import { Box } from 'src/models/Box';
import { Item } from 'src/models/Item';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
    private storage: Storage,
  ) { }

  item: Item = null;
  edit: Boolean = false;
  oldItem: Item = null;

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.item = state.member ? JSON.parse(state.member) : null;      
      this.oldItem = state.member ? JSON.parse(state.member) : null;      
    }
  }

  back() {
    this.edit = false;
    this.location.back();
  }

  editTheItem() {
    this.edit = this.edit === false ? true : false;
  }

  saveEdit() {
    this.storage.get('boxes').then((boxes: Array<any>) => {
      boxes.forEach((box: Box, index) => {
        let items: Array<any> = box.items;
        items.forEach((item: any, itemIndex) => {
          if (item.name === this.oldItem.name && item.description === this.oldItem.description) {
            items[itemIndex] = this.item;
            boxes[index].items = items;
            this.storage.set('boxes', boxes);
            this.edit = false;
            return false;
          }
          if (item.hasOwnProperty('items')) {
            item.items.forEach((subItem: any, subItemIndex) => {
              if (subItem.name === this.oldItem.name && subItem.description === this.oldItem.description) {
                item.items[subItemIndex] = this.item;
                items[itemIndex].items = item.items;
                boxes[index].items = items;
                this.storage.set('boxes', boxes);
                this.edit = false;
                return false;
              }
            });
          }
          
        });
      });
    });
  }
}
