document.addEventListener('DOMContentLoaded', function (event) {
  ymaps.ready(init);

  function init() {
    var coord = [55.81242804203617, 37.631908033779695];
    var footerMap = new ymaps.Map('footer_map', {
      center: coord,
      zoom: 16,
    });
    var placemark = new ymaps.Placemark(coord, null, {
      iconImageHref: '../img/map_point.svg',
      iconImageSize: [60, 68],
      iconImageOffset: [-30, -68],
    })

    footerMap.geoObjects
      .add(placemark)
  }
});
