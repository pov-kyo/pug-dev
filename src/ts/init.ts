import '../scss/style.scss';
import { gsap } from 'gsap';

class SlideShow {
  sliders: NodeListOf<Element>;
  navigates: NodeListOf<Element>;
  progresses: NodeListOf<Element>;
  dot: NodeListOf<Element>;
  text: NodeListOf<Element>;
  current: number;
  itemLength: number;
  timerId: number;
  fadeAnime: gsap.core.Timeline[];
  progressAnime: gsap.core.Timeline[];
  textAnime: gsap.core.Timeline[];
  ready: boolean;
  constructor() {
    this.sliders = document.querySelectorAll<HTMLDivElement>('.js-slide');
    this.navigates = document.querySelectorAll<HTMLDivElement>('.js-navigate');
    this.progresses = document.querySelectorAll<HTMLDivElement>('.js-progress');
    this.dot = document.querySelectorAll<HTMLDivElement>('.js-dot');
    this.text = document.querySelectorAll<HTMLDivElement>('.js-text');
    this.current = 0;
    this.itemLength = this.sliders.length - 1;
    this.fadeAnime = [];
    this.progressAnime = [];
    this.textAnime = [];
    this.timerId = 0;
    this.ready = true;
    this.init();
  }
  init() {
    this.addEvent();
    this.createFadeAnime();
    this.createProgress();
    this.createTextAnime();
    this.setTimer();
    this.sliders.forEach((slide, i) => {
      if (i > 0) {
        gsap.set(slide, {
          opacity: 0,
        });
      }
    });
    this.fadeAnime[0].play();
    this.progressAnime[0].play();
    this.textAnime[0].play();
  }
  addEvent() {
    this.navigates.forEach((navigate, i) => {
      navigate.addEventListener('click', () => {
        this.moveSlide('navigate', i);
      });
    });
  }
  createFadeAnime() {
    for (let i = 0; i <= this.itemLength; i++) {
      const tl = gsap.timeline({ paused: true });
      tl.to(this.sliders[i], {
        scale: 1.1,
        duration: 8,
      });
      this.fadeAnime.push(tl);
    }
  }
  createProgress() {
    for (let i = 0; i <= this.itemLength; i++) {
      const tl = gsap.timeline({ paused: true });
      tl.set(this.dot[i], {
        opacity: 1,
      });
      tl.to(this.progresses[i], {
        strokeDashoffset: 0,
        duration: 8,
      });
      this.progressAnime.push(tl);
    }
  }
  createTextAnime() {
    for (let i = 0; i <= this.itemLength; i++) {
      const tl = gsap.timeline({ paused: true });
      tl.to(this.text[i], {
        display: 'block',
        opacity: 1,
        y: 0,
        duration: 1,
      });
      this.textAnime.push(tl);
    }
  }
  animationText(current: number) {
    for (let i = 0; i <= this.itemLength; i++) {
      if (i === current) {
        this.textAnime[current].restart();
      } else {
        this.textAnime[i].paused(true);
        gsap.set(this.text[i], {
          clearProps: 'all',
        });
      }
    }
  }
  animationProgress(current: number) {
    for (let i = 0; i <= this.itemLength; i++) {
      if (i === current) {
        this.progressAnime[current].restart();
      } else {
        this.progressAnime[i].paused(true);
        gsap.set(this.progresses[i], {
          clearProps: 'all',
        });
        gsap.set(this.dot[i], {
          clearProps: 'all',
        });
      }
    }
  }
  setTimer() {
    this.timerId = window.setInterval(this.moveSlide.bind(this, 'next'), 8000);
  }
  moveSlide(action: string, dir: number) {
    if (this.ready) {
      const before = this.current;
      this.ready = false;
      switch (action) {
        case 'next':
          if (this.current < this.itemLength) {
            this.current++;
          } else {
            this.current = 0;
          }
          break;
        case 'navigate':
          window.clearInterval(this.timerId);
          this.setTimer();
          if (this.current !== dir) {
            this.current = dir;
          } else {
            this.ready = true;
            return;
          }
          break;
      }
      this.moveAnimation(before, this.current);
    }
  }
  moveAnimation(before: number, after: number) {
    this.animationProgress(after);
    this.animationText(after);
    this.fadeAnime[after].restart();
    gsap.set(this.sliders[after], {
      opacity: 1,
      zIndex: 0,
    });
    gsap.set(this.sliders[before], {
      zIndex: 1,
    });
    gsap.to(this.sliders[before], {
      opacity: 0,
      duration: 1,
      onComplete: () => {
        this.ready = true;
      },
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SlideShow();
});
