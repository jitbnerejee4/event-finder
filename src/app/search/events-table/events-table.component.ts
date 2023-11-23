import { Component, OnInit } from '@angular/core';
import { ShowServices } from 'src/app/show.services';
import { Observable, Subject } from "rxjs";

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.css']
})
export class EventsTableComponent implements OnInit {
key: string
dataArray = []
receivedData: boolean = false
hideTable: boolean = false
constructor(private show: ShowServices){
    
}
ngOnInit(): void {
  this.show.responseEvent.subscribe(receivedResponse=>{
    console.log(receivedResponse.response)
    if(receivedResponse.response.page.totalPages == 0){
      this.show.errorData = true
      this.show.submitted = false
      this.show.displayingTable = false
    }else{
      this.show.errorData = false
      if(this.show.displayingTable == true){
        this.dataArray = []
      }
      for (let i = 0; i < receivedResponse.response._embedded.events.length; i++) {
        this.dataArray.push(receivedResponse.response._embedded.events[i])
        // console.log(this.dataArray[i].name)
      }
      this.dataArray.sort((date1, date2)=>{
        return <any>new Date(date1.dates.start.localDate) - <any>new Date(date2.dates.start.localDate)
      })
      console.log(this.dataArray)
      this.printData()
    }
  })
}

printData(){
  for (let i = 0; i < this.dataArray.length; i++) {
    console.log(this.dataArray[i])
    
  }
  this.receivedData = true
}
public get getTableStatus(){
  return this.show.linkClicked
}
}
