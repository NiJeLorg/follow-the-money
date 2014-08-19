/**
 * navbar.js: toggles navigation to active for all menus
 * Author: NiJeL
 */

$( document ).ready(function() {
	// for navbars, set active if clicked
	$('.nav li').removeClass('active');
    var url = window.location;
    $('ul.nav a[href="'+ url +'"]').parent().addClass('active');
    $('ul.nav a').filter(function() {
         return this.href == url;
    }).parent().addClass('active');

});

