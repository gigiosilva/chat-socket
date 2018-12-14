import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  path: String;

  constructor(private router: Router) {}

  ngOnInit() {}

  goToPath() {
    this.router.navigate([`/${this.path}`]);
  }

}
