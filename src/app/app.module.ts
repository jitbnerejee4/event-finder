import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {FormsModule} from '@angular/forms'
import {HttpClientModule} from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs'; 
import { ListenDirective } from './listen.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {GoogleMapsModule} from '@angular/google-maps'



import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { EventsFormComponent } from './search/events-form/events-form.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { SavedEventTableComponent } from './favourites/saved-event-table/saved-event-table.component';
import { EventsTableComponent } from './search/events-table/events-table.component';
import { EventSearchDetailsComponent } from './search/event-search-details/event-search-details.component';
import { ErrorComponent } from './search/error/error.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteDirective } from './delete.directive';




const appRoutes: Routes =[
  {path: '', redirectTo: '/search', pathMatch: 'full' },
  {path: 'search', component: SearchComponent },
  {path: 'favourites', component: FavouritesComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchComponent,
    EventsFormComponent,
    FavouritesComponent,
    SavedEventTableComponent,
    EventsTableComponent,
    ListenDirective,
    EventSearchDetailsComponent,
    ErrorComponent,
    DeleteDirective



  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgbModule,
    NgbCarouselModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8
    }),
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
