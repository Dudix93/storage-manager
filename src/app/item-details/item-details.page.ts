import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.page.html',
  styleUrls: ['./item-details.page.scss'],
})
export class ItemDetailsPage implements OnInit {

  constructor(
    private router: Router,
    private location: Location,
  ) { }

  item:any = null;

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.item = state.member ? JSON.parse(state.member) : null;      
    }
  }

  back() {
    this.location.back();
  }
}
