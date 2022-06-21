function footerMapInit() {
  ymaps.ready(function () {
    var coord = [55.81242804203617, 37.631908033779695];
    var footerMap = new ymaps.Map('footer_map', {
      center: coord,
      zoom: 16,
      controls: ["fullscreenControl"],
    });
    var placemark = new ymaps.Placemark(footerMap.getCenter(), {
      balloonContentHeader: $('.apr-logo').attr('alt'),
      balloonContentBody : $('.apr-address').html(),
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'img/map_point.svg',
      iconImageSize: [60, 68],
      iconImageOffset: [-30, -68],
    })

    footerMap.geoObjects.add(placemark);
    footerMap.controls.add('zoomControl', {
      size: "small",
    });
    footerMap.behaviors.disable('scrollZoom');
    footerMap.behaviors.disable('drag');
  });
}

function burgerInit() {
  $('.js-burger-open').click(function () {
    $('.apr-burger').addClass('open');
    $('body').css( 'overflow', 'hidden');
  });
  $('.js-burger-close').click(function () {
    $('.apr-burger').removeClass('open');
    $('body').css( 'overflow', 'visible');
  });
}

function swiperInit() {
  var swiper = new Swiper('.apr-swiper', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
}

document.addEventListener('DOMContentLoaded', function (event) {
  footerMapInit();
  burgerInit();
  swiperInit();
});
