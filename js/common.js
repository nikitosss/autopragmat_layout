function footerMapInit() {
  ymaps.ready(function () {
    var coord = [55.81242804203617, 37.631908033779695];
    var footerMap = new ymaps.Map('footer_map', {
      center: coord,
      zoom: 16,
      controls: [],
    });
    var placemark = new ymaps.Placemark(footerMap.getCenter(), {
      balloonContentHeader: 'Автопрагмат',
      balloonContentBody : 'Москва. Проезд Ольминского, <br />дом 3а, строение 3, офис 403',
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'img/map_point.svg',
      iconImageSize: [60, 68],
      iconImageOffset: [-30, -68],
    })

    footerMap.geoObjects.add(placemark);
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

document.addEventListener('DOMContentLoaded', function (event) {
  footerMapInit();
  burgerInit();
});
