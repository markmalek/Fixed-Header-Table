$(document).ready(function() {
    $('.myTable').fixedHeaderTable({ width: '600', height: '350', footer: true, altClass: 'odd' });
    
	$('a.makeTable').bind('click', function() {
		

		$('.myTable').fixedHeaderTable('destroy');
		
		$('.myTable th, .myTable td')
			.css('border', $('#border').val() + 'px solid ' + $('#color').val());
			
		$('.myTable').fixedHeaderTable({ width: $('#width').val(), height: $('#height').val(), footer: true });
	});
});