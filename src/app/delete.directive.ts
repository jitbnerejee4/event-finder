import { Directive, Renderer2, ElementRef } from '@angular/core';
import { ShowServices } from './show.services';

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(private renderer: Renderer2, private elementRef: ElementRef, private showService: ShowServices) { 
    this.renderer.listen(this.elementRef.nativeElement, 'click', (event)=>{
      console.log(event)
      showService.deleteFromFavourites(event.currentTarget.id)
    })
  }

}
