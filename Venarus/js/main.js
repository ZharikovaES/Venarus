function ready() {
  const menuBtnHeader = document.querySelector('.top-header__list-btn');
  const menuHeader = document.querySelector('.menu-header');
  const discountLink = document.querySelector('.discount__link');
  const discountContent = document.querySelector('.discount__content');
  const itemAdvantagesBtn = document.querySelector('.item-advantages__btn');
  const popUpAdvantages = document.querySelector('.advantages__pop-up');
  
  // dynamic adaptive
  
  new DynamicAdapt("max").init();
  
  // header
  
  // slider of header
  const swiperHeader = new Swiper('.slider-header.swiper', {
      loop: true,
      effect: "creative",
      grabCursor: true,
      speed: 500,
      creativeEffect: {
            prev: {
              opacity: 0,
              translate: [0, 0, -400],
            },
            next: {
              translate: ["100%", 0, 0],
            },
          },
        centeredSlides: true,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },    
      navigation: {
        nextEl: '.slider-header .swiper-button-next',
        prevEl: '.slider-header .swiper-button-prev',
      },
  });
  
  // eventListener (click) for button of menu
  if (menuBtnHeader && menuHeader) {
    menuBtnHeader.addEventListener('click', e => {
      menuBtnHeader.style.pointerEvents = "none";
      if (document.body.style.overflow) document.body.style.overflow = null;
      else document.body.style.overflow = "hidden";
  
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
  
      if (menuHeader.style.left) menuHeader.style.left = null;
      else menuHeader.style.left = 0;
  
      if (menuBtnHeader.getAttribute('aria-expanded'))
        menuBtnHeader.setAttribute('aria-expanded', false);
      else menuBtnHeader.setAttribute('aria-expanded', true);
      
      menuBtnHeader.style.pointerEvents = null;
    });
  }

  // added discount-text
  if (discountContent && discountLink) {
    const span = document.createElement('span');
    span.innerText = (discountLink.dataset.text ?? '') + ' >>>';
      for (let i = 0; i < 10; i++) {
        discountContent.append(span.cloneNode(true));
      } 
  }

  // pop-up of advantages
  if (itemAdvantagesBtn) {
    itemAdvantagesBtn.addEventListener('click', e => {
      e.stopPropagation();
      menuBtnHeader.style.pointerEvents = "none";

      if (itemAdvantagesBtn.getAttribute('aria-expanded'))
        itemAdvantagesBtn.setAttribute('aria-expanded', false);
      else itemAdvantagesBtn.setAttribute('aria-expanded', true);

      popUpAdvantages.classList.toggle('visible');

      menuBtnHeader.style.pointerEvents = null;
    })
  }

  document.body.addEventListener('click', e => {
    
    // closing pop-up
    if (popUpAdvantages.classList.contains('visible')) {
      if (itemAdvantagesBtn.getAttribute('aria-expanded'))
        itemAdvantagesBtn.setAttribute('aria-expanded', false);
      else itemAdvantagesBtn.setAttribute('aria-expanded', true);

      popUpAdvantages.classList.remove('visible');
    }
  });
  popUpAdvantages.addEventListener('click', e => {
    e.stopPropagation();
  })
}

document.addEventListener("DOMContentLoaded", ready);