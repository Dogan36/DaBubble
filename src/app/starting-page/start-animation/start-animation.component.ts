import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { AnimationStateService } from '../../services/animation-state.service';

@Component({
  selector: 'app-start-animation',
  standalone: true,
  imports: [NgClass],
  templateUrl: './start-animation.component.html',
  styleUrl: './start-animation.component.scss'
})

export class StartAnimationComponent implements OnInit {
  isAnimatedOnce: boolean = false;

  constructor(private renderer: Renderer2, private animationStateService: AnimationStateService) { }

  ngOnInit() {
    if (this.animationStateService.animatedOnce) {
      console.log(this.animationStateService.animatedOnce)
      this.setFinalState();
    }
    else {
      console.log(this.animationStateService.animatedOnce)
      this.setBodyOverflowHidden(true);
      this.startAnimation();
      this.animationStateService.animatedOnce=true
    }
  }

  startAnimation() {
    console.log('startAnimation called')
    setTimeout(() => this.animateStage1(), 1000);
    setTimeout(() => this.animateStage2(), 3000);
    setTimeout(() => this.animateStage3(), 5000);
    setTimeout(() => this.animateStage4(), 6000);
  }

  animateStage1() {
    console.log('stage1called')
    if (typeof document !== 'undefined') {
      const imgContainer = document.querySelector('.img-container');
      if (imgContainer) {
        this.renderer.addClass(imgContainer, 'left');
      }
    }
  }

  animateStage2() {
    console.log('stage2called')
    if (typeof document !== 'undefined') {
      const textContainerP = document.querySelector('.text-container p');
      if (textContainerP) {
        this.renderer.addClass(textContainerP, 'right');
      }
    }
  }

  animateStage3() {
    console.log('stage3called')
    if (typeof document !== 'undefined') {
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
  }

  animateStage4() {
    console.log('stage4called')
    this.setBodyOverflowHidden(false);

    if (typeof document !== 'undefined') {
      const background = document.querySelector('.background');
      if (background) {
        this.renderer.addClass(background, 'd-none');
      }
    }
  }

  setBodyOverflowHidden(hidden: boolean) {
    if (typeof document !== 'undefined') {
      if (hidden) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
      } else {
        this.renderer.removeStyle(document.body, 'overflow');
      }
    }
  }

  setFinalState() {
    const logoContainer = document.querySelector('.logo-container');
    const background = document.querySelector('.background');
    const finalLogo = document.querySelector('.finalLogo');
    this.renderer.addClass(background, 'd-none');
    this.renderer.addClass(logoContainer, 'd-none');
    this.renderer.removeClass(finalLogo, 'd-none');
  }

  

 
}
