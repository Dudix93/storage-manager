import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  items: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.activatedRoute.queryParams.subscribe(passedBoxItems => {
      this.items = passedBoxItems.box_items;
    });
  }

  back() {
    this.router.navigate(['tabs']);
  }

}
