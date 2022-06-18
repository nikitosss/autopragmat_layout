document.addEventListener("DOMContentLoaded", function(event) {
  ymaps.ready(init);

  function init() {
    var myMap = new ymaps.Map("footer_map", {
        center: [55.751979, 37.617499],
        zoom: 15
      }),

      // Создаем метку с помощью вспомогательного класса.
      myPlacemark1 = new ymaps.Placemark([55.751979, 37.617499], {
        // Свойства.
        // Содержимое хинта.
        hintContent: 'Надпись, которая всплаывет при наведении на метку'
      }, {
        // Опции
        // Своё изображение иконки метки.
        iconImageHref: 'https://static.tildacdn.com/tild3061-3235-4537-b066-616662373363/Group_783.svg',
        // Размеры метки.
        iconImageSize: [130, 130],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-65, -110]
      })


    // Добавляем все метки на карту.
    myMap.geoObjects
      .add(myPlacemark1)
  }
});
