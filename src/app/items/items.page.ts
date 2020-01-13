import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { isNumber } from 'util';
import { empty } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

  box: any = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    private storage: Storage
  ) { }

  ngOnInit() {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.box = state.member ? JSON.parse(state.member) : null;      
    }
  }

  showTheBox(box: any) {
    if (box['items'].length === 0) {
      this.showToast('This box is empty.');
    }
    else {
      this.box = box;
    }
  }

  showTheItem(item: any) {
    this.router.navigate(['item-details'], {
      state: {
        member: JSON.stringify(item),
        type: 'reader'
      }
    });
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message: msg,
      duration: 1000
    }).then((toastData)=>{
      toastData.present();
    });
  }

  back() {
    this.router.navigate(['']);
  }

}
