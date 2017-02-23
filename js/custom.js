$(document).ready(function(){
 
		$('*[data-animate]').addClass('hidee').each(function(){
      $(this).viewportChecker({
        classToAdd: 'showw animated ' + $(this).data('animate'),
        classToRemove: 'hidee',
        offset: '30%'
      });
    });
	
		$('a').smoothScroll({
		offset:10,
		speed:600,
  
  
    });
	
 
	});