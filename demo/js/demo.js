$(document).ready(function() {
	$('#buildTable').bind('click', function(e) {
		e.preventDefault();
		
		$('#tablePlaceholder').empty()
			.buildTable();
	});
	
	$('#runPlugin').bind('click', function(e) {
		e.preventDefault();
		
		$('#tablePlaceholder table').fixedHeaderTable({ height: '400', altClass: 'odd', themeClass: 'fancyDarkTable' });
	});
});

$.fn.extend({
	buildTable: function() {
		var defaults = {
			width: '100%',
			height: 400,
			rows: 100,
			columns: 5,
			borderWidth: 1,
			borderColor: '#000000',
			padding: 5
		};
		
		var $self 		= $(this),
			self  		= this,
			rows  		= $('#rows').val(),
			columns 	= $('#columns').val(),
			borderWidth = $('#borderWidth').val(),
			borderColor = $('#borderColor').val(),
			padding 	= $('#padding').val(),
			$thead,
			$tbody,
			$currentRow,
			$styles,
			options		= {};
		
		if ( padding != '' ) {
			options.padding = padding;
		}
		
		options = $.extend({}, defaults, options);
			
		$self.append('<table><thead></thead><tbody></tbody></table>');
		
		$thead = $self.find('thead');
		$thead.append('<tr></tr>');
		for ( var column = 1; column <= columns; column++ ) {
			$thead.find('tr')
				.append('<th>Column '+column+'</th>');
		}
		
		$tbody = $self.find('tbody');
		for ( var row = 1; row <= rows; row++ ) {
			$currentRow = $('<tr></tr>').appendTo($tbody);
			
			for ( var column = 1; column <= columns; column++ ) {
				$currentRow.append('<td>Column '+column+'</td>');
			}
		}
		
/*
		var paddingStyle = "padding: " + options.padding + "px !important;";
		
		$styles = $('<style></style>').appendTo('.styles');
		
		$styles.html('th, td { '+paddingStyle+' }');
*/
	}
});