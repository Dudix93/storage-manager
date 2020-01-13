import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  items: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private storage: Storage
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.activatedRoute.queryParams.subscribe(boxId => {
      this.storage.get('boxes').then(boxes => {
        let boxItems = boxes[boxId.box_id].items;
        boxItems.forEach(item => {
          this.items.push({'type': item.hasOwnProperty('items') ? 'box' : 'item', 'name': item.name});
        });
      });
    });
  }

  back() {
    this.router.navigate(['']);
  }

}
