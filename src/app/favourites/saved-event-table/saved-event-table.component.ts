import { Component, OnInit } from '@angular/core';
import { ShowServices } from 'src/app/show.services';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-saved-event-table',
  templateUrl: './saved-event-table.component.html',
  styleUrls: ['./saved-event-table.component.css']
})
export class SavedEventTableComponent implements OnInit{
  favouritesArray = []
  constructor(private showServive: ShowServices, private library: FaIconLibrary){
    library.addIcons(faTrashCan);
  }

  ngOnInit(): void {
    this.favouritesArray = JSON.parse(localStorage.getItem('favourites'))
    console.log(this.favouritesArray)
    this.showServive.favouritesUpdated.subscribe((favourites)=>{
      console.log("HEREEEEEEEE")
      this.favouritesArray = favourites
    })
  }
}
