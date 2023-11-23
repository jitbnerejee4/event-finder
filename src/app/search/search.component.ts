import { Component, OnInit } from '@angular/core';
import { ShowServices } from '../show.services';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{

  public get showTable(){
    return this.show.submitted
  }
  public get getEventsCard(){
    // this.show.submitted = false
    return this.show.linkClicked
  }
  public get getError(){
    return this.show.errorData
  }

  constructor(private show: ShowServices){

  }
  ngOnInit(): void {

  }
}

