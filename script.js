'use strict';


const modal = document.querySelector('.modal');
const modalSignIn = document.querySelector('.modal-signIn');
const overlay = document.querySelector('.overlay');
const btnSignInModal = document.querySelector('.btn--sign-in');
const btnCloseModalSignIn = document.querySelector('.btn--close-modal-signIn');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


///////////////////////////////////////
// Sign in
const openModalSignIn = function (e) {
  e.preventDefault();
  modalSignIn.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModalSignIn = function () {
  modalSignIn.classList.add('hidden');
  overlay.classList.add('hidden');
};
  
btnSignInModal.addEventListener('click', openModalSignIn);
btnCloseModalSignIn.addEventListener('click', closeModalSignIn);
overlay.addEventListener('click', closeModalSignIn);
  
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modalSignIn.classList.contains('hidden')) {
      closeModalSignIn() 
    }
  });

///////////////////////////////////////
// Modal window

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };
  
const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };
  
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
  
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
  
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal() 
    }
  });
  
  ////////////////////////////////////////

  ///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function(e){
  const s1Coords = section1.getBoundingClientRect();
  section1.scrollIntoView({behavior:"smooth"})
})


///////////////////////////////////////
// Page navigation 
//1.Add event listeneer to common parent element
//2.Determine what element originated the element

document.querySelector('.nav__links').addEventListener('click',function(e) {
  console.log(e.target);
  e.preventDefault();
  //Matching strategy
  if(e.target.classList.contains('nav__link')) {
    const id= e.target.getAttribute('href');
    console.log(id);
    // document.querySelector(id).scrollIntoView({behavior:'smooth'})
  }
})


////Tabbed Component

tabsContainer.addEventListener('click', function(e) {
   e.preventDefault();
   const clicked = e.target.closest('.operations__tab');

   //Guard clause - daca nu exista niciun click, nu se intapla nimic 
   if(!clicked) return;

   // Active tab
   tabs.forEach(el => el.classList.remove('operations__tab--active'));
   clicked.classList.add('operations__tab--active');
   
   //Activate content area
   tabsContent.forEach(el => el.classList.remove('operations__content--active'));
   document.querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active')
}) 


//////////////////
///Menu fade animation - navigation

const handleHover = function(e) {
  e.preventDefault();

  if(e.target.classList.contains('nav__link')){
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el=> {
      if(el !== link) el.style.opacity =this;
    })
    logo.style.opacity =this;

  }
}

nav.addEventListener('mouseover',handleHover.bind(0.5))

nav.addEventListener('mouseout',handleHover.bind(1))

///////////////////
//Sticky navigation
//Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//Am aflat inaltimea navigatiei pt template string
const stickyNav = function(entries,observer) {
   entries.forEach(entry =>{
        
     if(!entry.isIntersecting)  { ////Cand isIntersecting este fals, se va aplica fct
        nav.classList.add('sticky') 
     } else {
        nav.classList.remove('sticky') 
     }
   })
}
const headObs = new IntersectionObserver(stickyNav, { 
  root:null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
 })

headObs.observe(header)

//////////////
//Reveal sections
const revealSection = function(entries,observer){
    const [entry] =entries;

    if(!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden')
    observer.unobserve(entry.target)
   
}
const allSection =document.querySelectorAll('.section')

const sectionObserver = new IntersectionObserver(revealSection, {
  root:null,
  threshold:0.15,
});

allSection.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})


///////////////
//Lazy loading images

const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
    const [entry] = entries;
    if(!entry.isIntersecting) return;

    ///Replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function(){
      entry.target.classList.remove('lazy-img')
    })

    observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
  root:null,
  threshold:0,
  rootMargin:'200px',
});

imgTarget.forEach(img => imgObserver.observe(img))


/////////////
///Building a slider component 
/// Carusel
//////////////////Variables
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

let currentSlide = 0;
let maxSlide = slides.length;

/////////////////Functions
const goToslide = function(slide) {
  slides.forEach(
    (s,i) => (
   s.style.transform = `translateX(${100 * (i-slide)}%)`
) );
}
const nextSlide =function(){
  if(currentSlide === maxSlide-1) {
    currentSlide = 0;
  } else {
     currentSlide++;
  } 
  goToslide(currentSlide);
  activateDot(currentSlide);
}
const prevSlide = function(){
  if(currentSlide === 0) {
    currentSlide = maxSlide-1;
  } else {
     currentSlide--;
  } 
  goToslide(currentSlide);
  activateDot(currentSlide);
}
const dotContainer = document.querySelector('.dots');
const createDots = function() {
    slides.forEach( function(_,i) {
        dotContainer.insertAdjacentHTML('beforeend',
        `<button class='dots__dot' data-slide='${i}' >.</button>`)
    })
}
// Cand apasam pe sageata, inclusiv clasa punctelor va fi schimbata
//( de la activ la pasiv )
const activateDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => 
    dot.classList.remove('dots__dot--active'))

  document.querySelector(`.dots__dot[data-slide='${slide}']`).classList.add('dots__dot--active')
}
/////////////////Initials
    goToslide(currentSlide);
    createDots();
    activateDot(currentSlide);
////////////////// Events Listeners
btnRight.addEventListener('click',nextSlide);
btnLeft.addEventListener('click',prevSlide);
btnRight.addEventListener('keydown', function(e){
  if(e.key === 'ArrowRight')  nextSlide();
})
btnRight.addEventListener('keydown', function(e){
  if(e.key === 'ArrowLeft') prevSlide();
  //e.key === 'ArrowLeft' && prevSlide()
})
dotContainer.addEventListener('click', function(e) {
   if(e.target.classList.contains('dots__dot')) {
      const {slide} = e.target.dataset;
      goToslide(slide);
      activateDot(slide)
   };
})

//////////////Lifecycle

document.addEventListener('DOMContentLoaded', function(e){
  console.log(`HTML parsed and DOM tree build`);
}) ;

window.addEventListener('load', function(e){
  console.log('Page fully loaded',e);
})



