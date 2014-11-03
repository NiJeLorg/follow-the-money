/**
 * navbar.js: toggles navigation to active for all menus
 * Author: NiJeL
 */

$( document ).ready(function() {
	// for navbars, set active if clicked
	$('.nav li').removeClass('active');
	// for trunk url select map, for all others select class
	if (location.pathname.split("/")[2] == '') {
		$('#navMapTab').addClass('active');
	} else if (location.pathname.split("/")[2] == 'media') {
		// maker sure only the media heading is active, not the dropdown menu for the media forms
		$('ul.nav a[href^="/cashcity/' + location.pathname.split("/")[2] + '"]').parent().addClass('active');
		$('ul.nav a[href^="/cashcity/media/form/"]').parent().removeClass('active');				
	} else {
		$('ul.nav a[href^="/cashcity/' + location.pathname.split("/")[2] + '"]').parent().addClass('active');		
	}
});

