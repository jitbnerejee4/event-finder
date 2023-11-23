import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ShowServices } from 'src/app/show.services';
import { Observable, Subject } from "rxjs";
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faAngleDown, faH } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import { faHeart as solidHeart} from '@fortawesome/free-solid-svg-icons';
import { response } from 'express';
import { take, switchMap } from 'rxjs/operators'
import { HttpClient } from "@angular/common/http";





@Component({
  selector: 'app-event-search-details',
  templateUrl: './event-search-details.component.html',
  styleUrls: ['./event-search-details.component.css'],
  encapsulation: ViewEncapsulation.None
  
})
export class EventSearchDetailsComponent implements OnInit{
  eventName: string
  eventDate: string
  eventTime: string
  eventArtists: string = ''
  eventVenue: string
  eventGenre: string = ''
  eventPrice: string = ''
  eventTicket: string = ''
  eventClass: string
  buyTicketUrl: string = ''
  seatUrl: string = ''
  artistArray = []
  artistImgUrl: string
  carouselLen:number
  isMusic: boolean = false
  venueName: string = ''
  openHourDetails: string = ''
  expandText: boolean = false
  openHourLength: number 
  venueAddress: string = ''
  venueGeneralRule: string = ''
  expandGeneralInfo: boolean = false
  generalRuleLength: number
  venueChildRule: string = ''
  expandChildInfo: boolean = false
  childRuleLength: number
  venuePhoneNumber: string
  showNavigationArrows: boolean = false
  showMap: boolean = false
  center: any
  zoom: any
  position: any
  eventId: string
  alreadyAdded: boolean = false
  inFavourites: boolean = false

  artistDetails = []


  constructor(private showservice: ShowServices, library: FaIconLibrary, private http: HttpClient){
    library.addIcons(faTwitter);
    library.addIcons(faSquareFacebook)
    library.addIcons(faSpotify)
    library.addIcons(faAngleDown)
    library.addIcons(regularHeart)
    library.addIcons(solidHeart)
  }

  ngOnInit(): void {
    this.eventId = this.showservice.linkid
    const tempStorage = JSON.parse(localStorage.getItem('favourites'))
    if(tempStorage){
      for (let i = 0; i < tempStorage.length; i++) {
        if(this.eventId == tempStorage[i].id){
          this.inFavourites = true
          break
        }
      }
    }
    this.showservice.inFavourites.subscribe(response=>{
      this.inFavourites = response
    })
    this.showservice.eventCardResponse
    .pipe(take(1))
    .subscribe(response=>{
      console.log(response.response)
      this.eventName = response.response.name
      if(response.response.dates.start.localDate && response.response.dates.start.localDate != "Undefined"){
        this.eventDate = response.response.dates.start.localDate
      }
      if(response.response.dates.start.localTime && response.response.dates.start.localTime != "Undefined"){
        this.eventTime = response.response.dates.start.localTime
      }

      if(response.response._embedded.attractions){
        for (let i = 0; i < response.response._embedded.attractions.length; i++) {
          this.eventArtists+=response.response._embedded.attractions[i].name
          this.eventArtists+= " "
          this.eventArtists+= '|'
          this.eventArtists+= " "
        }
        this.eventArtists = this.eventArtists.slice(0,-2) + ''
      }
      if(response.response._embedded.venues[0].name && response.response._embedded.venues[0].name != "Undefined"){
        this.eventVenue = response.response._embedded.venues[0].name
      }
      if(response.response.classifications){
        if(response.response.classifications[0].segment && response.response.classifications[0].segment.name != "Undefined"){
          if(response.response.classifications[0].segment.name == 'Music'){
            this.isMusic = true
          }else{
            this.isMusic = false
          }
          this.eventGenre+= response.response.classifications[0].segment.name
          this.eventGenre+= " "
          this.eventGenre+= '| '
        }
        if(response.response.classifications[0].genre && response.response.classifications[0].genre.name != "Undefined"){
          this.eventGenre+= response.response.classifications[0].genre.name
          this.eventGenre+= " "
          this.eventGenre+= '| '
        }
        if(response.response.classifications[0].subGenre && response.response.classifications[0].subGenre.name != "Undefined"){
          this.eventGenre+= response.response.classifications[0].subGenre.name
          this.eventGenre+= " "
          this.eventGenre+= '| '
        }
        if(response.response.classifications[0].type && response.response.classifications[0].type.name != "Undefined"){
          this.eventGenre+= response.response.classifications[0].type.name
          this.eventGenre+= " "
          this.eventGenre+= '| '
        }
        if(response.response.classifications[0].subType && response.response.classifications[0].subType.name != "Undefined"){
          this.eventGenre+= response.response.classifications[0].subType.name
          this.eventGenre+= " "
          this.eventGenre+= '| '
        }
        this.eventGenre = this.eventGenre.slice(0,-2) +''
      }
      if(response.response.priceRanges != undefined){
        if(response.response.priceRanges[0].min != undefined && response.response.priceRanges[0].min != 'Undefined'){
          this.eventPrice+= response.response.priceRanges[0].min + '-'
          if(response.response.priceRanges[0].max == undefined || response.response.priceRanges[0].max == "Undefined"){
            this.eventPrice+=response.priceRanges[0].min
          }
        }
        if(response.response.priceRanges[0].max != undefined && response.response.priceRanges[0].max != 'Undefined'){
          this.eventPrice+= response.response.priceRanges[0].max
          if(response.response.priceRanges[0].min == undefined || response.response.priceRanges[0].min == "Undefined"){
            this.eventPrice+=response.response.priceRanges[0].max 
          }
        }
      }
      if(response.response.dates.status != undefined){
        if(response.response.dates.status.code != undefined && response.response.dates.status.code != "Undefined"){
          this.eventClass = response.response.dates.status.code
          if(response.response.dates.status.code == "onsale"){
            this.eventTicket = "On Sale"
          }
          else if(response.response.dates.status.code == "offsale"){
            this.eventTicket = "Off Sale"
          }
          else if(response.response.dates.status.code == "rescheduled"){
            this.eventTicket = "Rescheduled"
          }
          else if(response.response.dates.status.code == "cancelled"){
            this.eventTicket = "Cancelled"
          }
          else if(response.response.dates.status.code == "postponed"){
            this.eventTicket = "Postponed"
          }
        }
      }
      if(response.response.url != undefined && response.response.url != 'Undefined'){
        this.buyTicketUrl = response.response.url
      }
      if(response.response.seatmap != undefined){
        if(response.response.seatmap != 'Undefined'){
          this.seatUrl = response.response.seatmap.staticUrl
        }
      }
      if(this.isMusic == true){
        if(response.response._embedded.attractions != undefined){
          this.artistArray = []
          for (let i = 0; i < response.response._embedded.attractions.length; i++) {
            this.artistArray.push(response.response._embedded.attractions[i].name)
          }
          this.getArtistName()
        }else{
          this.isMusic = false
        }
      }
      let tempVenueName = response.response._embedded.venues[0].name
      this.getVenueDetails(tempVenueName)
    })
  }
  getArtistName(){
    console.log(this.artistArray)
    if(this.artistArray.length > 1){
      this.showNavigationArrows = true
    }else{
      this.showNavigationArrows = false
    }
    for (let i = 0; i < this.artistArray.length; i++) {
      this.http.get(`https://homework8-381519.wl.r.appspot.com/artist/${this.artistArray[i]}`).subscribe((response)=>{
        let temp = response['response']
        // console.log(temp.body.artists.items[0])
        this.http.get(`https://homework8-381519.wl.r.appspot.com/artist/album/${temp.body.artists.items[0].id}`).subscribe((response2)=>{
          // console.log(response2['response'].body)
          const artistAlbumImage = []
          let temp2 = response2['response']
          for (let i = 0; i < temp2.body.items.length; i++) {
            artistAlbumImage.push(temp2.body.items[i].images[0].url)
          }
          const artistInfo ={
            artistName:  temp.body.artists.items[0].name,
            artistImageUrl: temp.body.artists.items[0].images[0].url,
            artistPopularity: Number(temp.body.artists.items[0].popularity),
            artistFollower: (temp.body.artists.items[0].followers.total).toLocaleString("en-US"),
            artistSpotify: temp.body.artists.items[0].external_urls.spotify,
            artistAlbums: artistAlbumImage
          }
          this.artistDetails.push(artistInfo)
          console.log(this.artistDetails)
        })
      })
    }
  }

  getVenueDetails(tempVenueName: string){
    this.showservice.findVenueDetails(tempVenueName)
    this.showservice.venueResponse
    .pipe(take(1))
    .subscribe((response)=>{
      console.log("venue response", response.response)
      if(response.response._embedded){
        if(response.response._embedded.venues){
          if(response.response._embedded.venues[0].name != undefined && response.response._embedded.venues[0].name != 'Undefined'){
            this.venueName = response.response._embedded.venues[0].name
          }
          if(response.response._embedded.venues[0].boxOfficeInfo != undefined && response.response._embedded.venues[0].boxOfficeInfo != 'Undefined'){
            if(response.response._embedded.venues[0].boxOfficeInfo.openHoursDetail != undefined && response.response._embedded.venues[0].boxOfficeInfo.openHoursDetail != 'Undefined'){
              this.openHourDetails = response.response._embedded.venues[0].boxOfficeInfo.openHoursDetail
              let tempLength = response.response._embedded.venues[0].boxOfficeInfo.openHoursDetail
              this.openHourLength =tempLength.length
            }
          }
    
          
          let addressFlag = false
          if(response.response._embedded.venues[0].address != undefined && response.response._embedded.venues[0].address != 'Undefined'){
            if(response.response._embedded.venues[0].address.line1 != undefined && response.response._embedded.venues[0].address.line1 != 'Undefined' && addressFlag == false){
              this.venueAddress+=response.response._embedded.venues[0].address.line1
              this.venueAddress+= ''
              this.venueAddress+=', '
            }else{
              addressFlag = true
            }
          }
          if(response.response._embedded.venues[0].city != undefined && response.response._embedded.venues[0].city != 'Undefined'){
            if(response.response._embedded.venues[0].city.name != undefined && response.response._embedded.venues[0].city.name != 'Undefined' && addressFlag == false){
              this.venueAddress+=response.response._embedded.venues[0].city.name
              this.venueAddress+= ''
              this.venueAddress+=', '
            }else{
              addressFlag = true
            }
          }
          if(response.response._embedded.venues[0].state != undefined && response.response._embedded.venues[0].state != 'Undefined'){
            if(response.response._embedded.venues[0].state.name != undefined && response.response._embedded.venues[0].state.name != 'Undefined' && addressFlag == false){
              this.venueAddress+=response.response._embedded.venues[0].state.name
    
            }else{
              addressFlag = true
            }
          }
    
    
          if(response.response._embedded.venues[0].generalInfo != undefined && response.response._embedded.venues[0].generalInfo != 'Undefined'){
            if(response.response._embedded.venues[0].generalInfo.generalRule != undefined && response.response._embedded.venues[0].generalInfo.generalRule != 'Undefined'){
              this.venueGeneralRule = response.response._embedded.venues[0].generalInfo.generalRule
              let tempGeneralRule = response.response._embedded.venues[0].generalInfo.generalRule
              this.generalRuleLength = tempGeneralRule.length
            }
          }
          if(response.response._embedded.venues[0].generalInfo != undefined && response.response._embedded.venues[0].generalInfo != 'Undefined'){
            if(response.response._embedded.venues[0].generalInfo.childRule != undefined && response.response._embedded.venues[0].generalInfo.childRule != 'Undefined'){
              this.venueChildRule = response.response._embedded.venues[0].generalInfo.childRule
              let tempChildRule = response.response._embedded.venues[0].generalInfo.childRule
              this.childRuleLength = tempChildRule.length
            }
          }
    
    
          if(response.response._embedded.venues[0].boxOfficeInfo != undefined && response.response._embedded.venues[0].boxOfficeInfo != 'Undefined'){
            if(response.response._embedded.venues[0].boxOfficeInfo.phoneNumberDetail != undefined && response.response._embedded.venues[0].boxOfficeInfo.phoneNumberDetail != 'Undefined'){
              this.venuePhoneNumber = response.response._embedded.venues[0].boxOfficeInfo.phoneNumberDetail
            }
          }
        }
      }
      
    })
  }

  showGoogleMap(){
    if(this.venueAddress){
      const venue_address = this.venueName + ', ' + this.venueAddress
      console.log(venue_address)
      this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${venue_address}&key=`)
      .subscribe(response=>{
        console.log(response)
        const venue_latitude = response['results'][0].geometry.location.lat
        const venue_longitude = response['results'][0].geometry.location.lng

        this.center ={ lat: venue_latitude, lng: venue_longitude}
        this.zoom = 14
        this.position = { lat: venue_latitude, lng: venue_longitude }
      })
    }
    
  }
  changeState(){
    this.showservice.linkClicked = false
  }

  addtoFavourites(){
    // this.inFavourites = false
    // for (let i = 0; i < this.showservice.favourites.length; i++) {
    //   if(this.showservice.favourites[i].id == this.eventId){
    //     this.inFavourites = true
    //     break
    //   }
    // }
      const favourite = {
        id: this.eventId,
        date: this.eventDate,
        event: this.eventName,
        category: this.eventGenre,
        venue: this.eventVenue
      }
      this.showservice.addtoFavourites(favourite)
  }

  deleteFromFavourites(){
    const id = this.eventId
    this.showservice.deleteFromFavourites(id)
  }


}
