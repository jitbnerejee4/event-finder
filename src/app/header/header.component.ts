import { Component, OnInit } from '@angular/core';
import { ShowServices } from '../show.services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  constructor(private showService: ShowServices){
    
  }

  ngOnInit(): void {
    
  }

  hideInfo(){
    this.showService.submitted = false
    this.showService.linkClicked = false
    this.showService.errorData = false
  }
}
