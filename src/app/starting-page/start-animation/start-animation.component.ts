import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgClass } from '@angular/common';
import { AnimationStateService } from '../../services/animation-state.service';
@Component({
  selector: 'app-start-animation',
  standalone: true,
  imports: [NgClass],
  templateUrl: './start-animation.component.html',
  styleUrl: './start-animation.component.scss'
})
export class StartAnimationComponent {
isAnimatedOnce: boolean = false;
 
  constructor( private renderer: Renderer2,
    private animationStateService: AnimationStateService) {}
    ngOnInit() {
      console.log(this.animationStateService.isAnimatedOnce)
      if (!this.animationStateService.isAnimatedOnce) {
        this.setBodyOverflowHidden(true);
        this.startAnimation();
        this.animationStateService.isAnimatedOnce = true; // Update the service state
      }
      else{
        this.applyFinalAnimationStates();
      }
    }
  startAnimation() {
    setTimeout(() => this.animateStage1(), 1000);
    setTimeout(() => this.animateStage2(), 2500); 
   setTimeout(() => this.animateStage3(), 3500); 
  setTimeout(() => this.animateStage4(), 4500); 
  }

  animateStage1() {
    const imgContainer = document.querySelector('.img-container');
    if (imgContainer) {
      this.renderer.addClass(imgContainer, 'left');
    }
  }

  animateStage2() {
    const textContainerP = document.querySelector('.text-container p');
    if (textContainerP) {
      this.renderer.addClass(textContainerP, 'right');
    }
  }

  animateStage3() {
    const logoContainer = document.querySelector('.logo-container');
    const imgContainer = document.querySelector('.img-container');
    const textContainer = document.querySelector('.text-container');
    const textContainerP = document.querySelector('.text-container p');
    const background = document.querySelector('.background');
    if (logoContainer) {
      this.renderer.addClass(logoContainer, 'moveOnTop');
    }
    if (imgContainer) {
      this.renderer.addClass(imgContainer, 'width');
    }
    if (textContainer) {
      this.renderer.addClass(textContainer, 'text-container-width');
    }
    if (textContainerP) {
      this.renderer.addClass(textContainerP, 'fontSize');
    }
    if (background) {
      this.renderer.addClass(background, 'opacity');
    }
  }

  animateStage4() {
    this.setBodyOverflowHidden(false);
    this.animationStateService.isAnimatedOnce = true;
    const background = document.querySelector('.background');
    if (background) {
      this.renderer.addClass(background, 'd-none');
    }
  }

  setBodyOverflowHidden(hidden: boolean) {
    if (hidden) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  applyFinalAnimationStates() {
    const elementsWithClasses = [
      { selector: '.img-container', className: 'left' },
      { selector: '.text-container p', className: 'right' },
      { selector: '.logo-container', className: 'moveOnTop' },
      { selector: '.img-container', className: 'width' },
      { selector: '.text-container', className: 'text-container-width' },
      { selector: '.text-container p', className: 'fontSize' },
      { selector: '.background', className: 'opacity' },
      { selector: '.background', className: 'd-none' }
    ];

    // Disable transitions
    const body = document.body;
    this.renderer.setStyle(body, 'transition', 'none');

    elementsWithClasses.forEach(item => {
      const element = document.querySelector(item.selector);
      if (element) {
        this.renderer.addClass(element, item.className);
      }
    });

    // Force reflow
    body.offsetHeight;

    // Re-enable transitions
    this.renderer.removeStyle(body, 'transition');
  }
}
