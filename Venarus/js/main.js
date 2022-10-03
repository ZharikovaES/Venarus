
function ready() {
  const menuBtnHeader = document.querySelector('.top-header__list-btn');
  const menuHeader = document.querySelector('.menu-header');
  const discountLink = document.querySelector('.discount__link');
  const discountContent = document.querySelector('.discount__content');
  const itemAdvantagesBtn = document.querySelector('.item-advantages__btn');
  const popUpAdvantages = document.querySelector('.advantages__pop-up');
  const gsImgSelector = ".about-production .swiper-slide a";
  const contentGalleryProduction = document.getElementById('about-production-gallery-videos');
  
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

  // discount

  // added discount-text
  if (discountContent && discountLink) {
    const span = document.createElement('span');
    span.innerText = (discountLink.dataset.text ?? '') + ' >>>';
      for (let i = 0; i < 10; i++) {
        discountContent.append(span.cloneNode(true));
      } 
  }

  // advantages

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
  });

  // about production

  //slider
  const swiperAboutProduction = new Swiper('.body-about-production__slider', {
    slidesPerView: 2,
    initialSlide: 1,
    grabCursor: true,
    speed: 500,
      centeredSlides: true,
      breakpoints: {
        320: {
          spaceBetween: 120,
          slidesPerView: 1,
        },
        600: {
          spaceBetween: 90,
          slidesPerView: 2,
        },
        1000: {
          spaceBetween: 120,
        }
      },
    navigation: {
      nextEl: '.body-about-production__slider .swiper-button-next',
      prevEl: '.body-about-production__slider .swiper-button-prev',
    },
  });

  // gallery for videos of slider
  const dynamicEl = [...document.querySelectorAll(gsImgSelector)].map(
                                                                      (el) => {
                                                                        return {
                                                                          src: el?.dataset?.src,
                                                                          thumb: el?.dataset?.src,
                                                                          poster: el?.dataset?.poster,
                                                                          subHtml: el?.dataset?.subHtml,
                                                                          lgSize: el?.dataset?.lgSize

                                                                        };
                                                                      }
                                                                    );

  if (contentGalleryProduction) {
    const popup = lightGallery(contentGalleryProduction, {
      plugins: [lgVideo],
      dynamic: true,
      dynamicEl
    });
    
    if (popup)
      [...document.querySelectorAll(".about-production .swiper-slide")].forEach((slide, idx) => {
        slide.addEventListener("click", () => {
          popup.openGallery(idx);
        });
      });  
  }
}

document.addEventListener("DOMContentLoaded", ready);