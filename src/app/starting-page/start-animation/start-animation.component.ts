import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-start-animation',
  standalone: true,
  imports: [NgClass],
  templateUrl: './start-animation.component.html',
  styleUrl: './start-animation.component.scss'
})
export class StartAnimationComponent {

  isAnimatedStage1: boolean = false;
  isAnimatedStage2: boolean = false;
  isAnimatedStage3: boolean = false;
  isAnimatedStage4: boolean = false;

  ngOnInit(){
    this.startAnimation()
  }
  startAnimation() {
   
    setTimeout(() => this.animateStage1(), 2000);
    setTimeout(() => this.animateStage2(), 4000); // Start stage 2 after stage 1
    setTimeout(() => this.animateStage3(), 6000); // Start stage 3 after stage 2
    setTimeout(() => this.animateStage4(), 7000); // Start stage 4 after stage 3
  }

  animateStage1(){
    this.isAnimatedStage1=true;
  }

  animateStage2(){
    this.isAnimatedStage2=true;
  }
  animateStage3(){
    this.isAnimatedStage3=true;
  }

  animateStage4(){
    console.log('4')
    this.isAnimatedStage4=true;
  }
}
