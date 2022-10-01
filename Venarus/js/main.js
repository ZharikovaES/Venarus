const menuBtnHeader = document.querySelector('.top-header__list-btn');
const menuHeader = document.querySelector('.menu-header');

// dynamic adaptive

new DynamicAdapt("max").init();

// header

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
      // autoplay: {
      //   delay: 3500,
      //   disableOnInteraction: false,
      // },    
    // Navigation arrows
    navigation: {
      nextEl: '.slider-header .swiper-button-next',
      prevEl: '.slider-header .swiper-button-prev',
    },
});
console.log(menuBtnHeader, menuHeader);
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