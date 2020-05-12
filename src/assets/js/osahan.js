/*
Template Name: RichBlok - Job Portal & Social Network HTML Template
Author: Askbootstrap
Author URI: https://themeforest.net/user/askbootstrap
Version: 1.0
*/

(function($) {
  "use strict"; // Start of use strict
  
  $(document).ready(function () {
    $('.btn-group-fab').on('click', '.btn', function() {
     
      $('.btn-group-fab').toggleClass('active');
    });
// Tooltip
$('[data-toggle="tooltip"]').tooltip();

// Osahan Slider
$('.osahan-slider').slick({
  centerMode: true,
  centerPadding: '30px',
  slidesToShow: 2,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
});
  });
})(jQuery); // End of use strict
