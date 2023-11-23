import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import {map} from 'rxjs/operators'




@Injectable({
    providedIn: "root"
})
export class ShowServices{
    keyword: string
    distance: number 
    category: string
    lat: string
    long: string
    linkid: string
    venueName: string
    errorData: boolean = false
    segmentType: string
    temp: any

    
    responseEvent = new Subject<any>()
    eventCardResponse = new Subject<any>()
    venueResponse = new Subject<any>()
    artistInfo = new Subject<any>()
    inFavourites = new Subject<any>()
    favouritesUpdated = new Subject<any>()
    public submitted: boolean = false
    public linkClicked: boolean = false
    public displayingTable: boolean = false
    artistResponse = []
 

    constructor(private http: HttpClient){}
    getEventsTable(){
        this.http.get(`https://homework8-381519.wl.r.appspot.com/${this.keyword}/${this.distance}/${this.category}/${this.lat}/${this.long}`)
        .subscribe(response=>{
            console.log(response)
            this.displayingTable = true
            this.linkClicked = false
            this.responseEvent.next(response)
        })
    }
    clickedLink(linkId: string){
        this.linkid = linkId
        this.linkClicked = true
        // this.submitted = false
        console.log(this.linkid)
        this.http.get(`https://homework8-381519.wl.r.appspot.com/${this.linkid}`).subscribe(response=>{
            this.temp = response
            this.segmentType = this.temp.response.classifications[0].segment.name
            this.eventCardResponse.next(response)
            
        })
    }
    // searchArtist(artistName: any){
    //         this.http.get(`https://homework8-381519.wl.r.appspot.com/artist/${artistName}`).subscribe(response=>{
    //             // console.log(response)
    //             console.log(response)
    //             this.artistInfo.next(response)
    //         })

    //     // this.artistInfo.next(this.artistResponse)
    //     // return this.artistResponse

    // }
    
    findVenueDetails(venue: string){
        this.http.get(`https://homework8-381519.wl.r.appspot.com/venue/${venue}`).subscribe(response=>{
            this.venueResponse.next(response)
        })
    }

    addtoFavourites(event: any){
        // const temp = JSON.parse(localStorage.getItem('favourites'))
        // if(temp){
        //     for (let i = 0; i < temp.length; i++) {
        //         this.favourites.push(localStorage[i])
                
        //     }
        // }
        // this.favourites.push(event)
        const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
        console.log(favourites)
        favourites.push(event)
        localStorage.setItem('favourites', JSON.stringify(favourites))
        console.log(JSON.parse(localStorage.getItem('favourites')))
        alert("Event added to favourites!")
        this.inFavourites.next(true)
    }

    deleteFromFavourites(eventid: string){
        // const temp1 = this.favourites.filter((favourite)=>{
        //     return favourite.id != eventid
        // })
        // this.favourites = temp1
        // localStorage.setItem('favourites', JSON.stringify(this.favourites))
        // const local = JSON.parse(localStorage.getItem('favourites'))
        const fav = JSON.parse(localStorage.getItem('favourites'))
        const temp = fav.filter((item)=>{
            return item.id != eventid
        })
        localStorage.setItem('favourites', JSON.stringify(temp))
        alert("Event Removed from Favourites!")
        // console.log("favourites after delete", this.favourites)
        console.log(JSON.parse(localStorage.getItem('favourites')))
        this.favouritesUpdated.next(temp)
        this.inFavourites.next(false)
    }
}