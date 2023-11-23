import { Component, ViewChild, ElementRef, Renderer2, OnInit } from '@angular/core';
import { ShowServices } from 'src/app/show.services';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import { fromEventPattern } from 'rxjs';
import { debounceTime, tap, switchMap, distinctUntilChanged, filter, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.css']
})
export class EventsFormComponent implements OnInit{
  @ViewChild('keywordref') keywordref: ElementRef;
  @ViewChild('distanceref') distanceref: ElementRef;
  @ViewChild('categoryref') categoryref: ElementRef;
  @ViewChild('locationCheckBox') locationCheckBox: ElementRef;
  @ViewChild('locationref') locationref: ElementRef;
  @ViewChild('locationInput') locationInput: ElementRef;
  @ViewChild('locationDiv') locationDiv: ElementRef;
  public isChecked: boolean = false
  isLoading: boolean = false;
  long: string
  lat: string
  detailsForm: FormGroup;
  eventKeyword = new FormControl()
  keyword: string
  options: any;
  minLength: number = 1;
  constructor(private showservice: ShowServices, private renderer: Renderer2, private http: HttpClient){
  }
  ngOnInit(): void {

    this.eventKeyword.valueChanges
    .pipe(
      filter(res=>{
        return res !== null && res.length >= this.minLength
      }),
      distinctUntilChanged(),
      debounceTime(1000),
      tap(() => {
        this.options = [];
        this.isLoading = true;
      }),
      switchMap(value=>this.http.get(`https://homework8-381519.wl.r.appspot.com/suggest/${value}`)
        .pipe(
          finalize(()=>{
            this.isLoading = false;
          })
        )
      )
    )
    .subscribe((data:any)=>{
      if(data.response._embedded){
        if(data.response._embedded.attractions != undefined){
          for(let i = 0; i<data.response._embedded.attractions.length; i++){
            this.options.push(data.response._embedded.attractions[i].name)
          }
        }
        if(data.response._embedded.events != undefined){
          for(let i = 0; i<data.response._embedded.events.length; i++){
            this.options.push(data.response._embedded.events[i].name)
          }
        }
        if(data.response._embedded.products != undefined){
          for(let i = 0; i<data.response._embedded.products.length; i++){
            this.options.push(data.response._embedded.products[i].name)
          }
        }
        if(data.response._embedded.venues != undefined){
          for(let i = 0; i<data.response._embedded.venues.length; i++){
            this.options.push(data.response._embedded.venues[i].name)
          }
        }
      }
    })

    this.detailsForm = new FormGroup({
      'distance': new FormControl(10),
      'category': new FormControl('default'),
      'location': new FormControl(null),
      'autolocation': new FormControl(null)
    })
  }

  checkChecked(){
    this.isChecked = this.locationCheckBox.nativeElement.checked
    if(this.isChecked == true){
      this.detailsForm.get('location').setValue(null)
      // this.renderer.removeChild(this.locationDiv.nativeElement, this.locationInput.nativeElement)
      this.detailsForm.get('location').disable()
    }else{
      this.renderer.appendChild(this.locationDiv.nativeElement, this.locationInput.nativeElement)
      this.detailsForm.get('location').enable()
    }
  }
  
  

  onSubmit(){
    console.log(this.detailsForm.value)

    let loc: string
    if(!this.isChecked){
      const temploc = this.detailsForm.value.location
      console.log(temploc)
      this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${temploc}&key=`)
      .subscribe(responseData=>{
        if(responseData['status'] == "ZERO_RESULTS"){
          this.showservice.errorData = true;
          this.showservice.submitted = false;
          this.showservice.displayingTable = false
          console.log(responseData['status'], this.showservice.errorData)
        }else{
          this.showservice.lat= responseData['results'][0].geometry.location.lat.toString()
          this.showservice.long = responseData['results'][0].geometry.location.lng.toString()
          this.showservice.keyword = this.eventKeyword.value
          this.showservice.category = this.detailsForm.value.category
          if(this.detailsForm.value.distance == null){
            this.showservice.distance = 10
          }else{
            this.showservice.distance = this.detailsForm.value.distance
          }
          this.showservice.getEventsTable()
          this.showservice.submitted = true
          this.showservice.errorData = false
          
        }
      })
    }else{
      this.http.get('https://ipinfo.io/json?token=').subscribe(responseData=>{
        console.log(responseData['loc'])
        let tempLoc = responseData['loc'].split(",")
        this.showservice.lat = tempLoc[0]
        this.showservice.long = tempLoc[1]
        this.showservice.keyword = this.eventKeyword.value
        this.showservice.category = this.detailsForm.value.category
        if(this.detailsForm.value.distance == null){
          this.showservice.distance = 10
        }else{
          this.showservice.distance = this.detailsForm.value.distance
        }
        this.showservice.getEventsTable()
        this.showservice.submitted = true
        this.showservice.errorData = false
        this.showservice.displayingTable = false
      })

    }
  }

  clearFields(){
    this.keywordref.nativeElement.value = ''
    this.options = []
    this.distanceref.nativeElement.value = 10
    this.categoryref.nativeElement.value = 'default'
    this.locationref.nativeElement.value = null
    this.locationCheckBox.nativeElement.value = null
    // this.locationref.nativeElement.enable = true
    this.locationCheckBox.nativeElement.checked = false
    this.isChecked = false
    this.detailsForm.get('location').enable()
    this.showservice.submitted = false
    this.showservice.linkClicked = false

  }

}
