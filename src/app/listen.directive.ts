import {  Directive, Renderer2, ElementRef, HostListener } from '@angular/core';
import { ShowServices } from './show.services';

@Directive({
  selector: '[appListen]'
})
export class ListenDirective {


  constructor(private elementRef: ElementRef, private renderer: Renderer2, private show:ShowServices) { 
    this.renderer.listen(this.elementRef.nativeElement, 'click', (event)=>{
      console.log(event)
    show.clickedLink(event.currentTarget.className)
    })
  }

  

}
