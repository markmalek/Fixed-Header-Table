(function($) {

	$(document).ready(function() {
		$('#tableBlock').getCommits();
	});
	
	$.fn.extend({
		buildTable: function( options ) {
			var $self 		= $(this),
  				self  		= this,
  				hasFooter	= true,
  				hasClone	= true,
  				aMessages 	= options.data,
  				$tbody = $self.find('tbody'),
  				$currentRow,
  				commitDate,
  				authoredDate,
  				aCommitMessage,
  				commitMessage;
				
			for ( var message in aMessages ) {
				commitDate = getDateToString(aMessages[message].commit.committer.date);
				authoredDate = getDateToString(aMessages[message].commit.author.date);
				aCommitMessage = aMessages[message].commit.message.split(/\n/);
				commitMessage = "";
				
				for ( var theMessage in aCommitMessage ) {
					if ( aCommitMessage[theMessage] != "" ) {
						commitMessage += "<p>";
						commitMessage += aCommitMessage[theMessage];
						commitMessage += "</p>";
					}
				}

				$currentRow = $('<tr></tr>').appendTo($tbody)
					.append('<td>' + aMessages[message].commit.author.name + '</td>')
					.append('<td class="textAlignCenter">' + commitDate + '</td>')
					.append('<td>' + commitMessage + '</td>')
					.append('<td class="link"><a class="button" href="http://github.com' + aMessages[message].commit.url + '">View Details</a></td>');
			}

			$('#demo').fixedHeaderTable({ height: '600', altClass: 'odd', footer: true, themeClass: 'table' });
			
			return self;
		},

		getCommits: function() {
			var $self     = $(this),
				  self	    = this,
				  url		    = 'https://api.github.com/repos/markmalek/Fixed-Header-Table/commits?callback=?',
				  aMessages	= new Array();

			if ( $.isEmptyObject($self.data()) ) {
				$.getJSON(url, function(data) {
					$self.data(data.data);
					$self.buildTable({ data: data.data });
				});
			} else {
				$self.buildTable({ data: $self.data() });
			}
			return self;
		}
	});
	
	function getDateToString( theDate ) {
		var aDate = theDate.split(/[-T:]/),
		    self = new Date(aDate[0], aDate[1], aDate[2], aDate[3], aDate[4], aDate[5], 0),
			day = self.getDate(),
			month = getMonthToString(self.getMonth()),
			year = self.getFullYear(),
			hours = self.getHours(),
			minutes = self.getMinutes();

		return month + ' ' + day + ', ' + year + '<br /> at ' + getTimeToString(hours, minutes); 
	}
	
	function getTimeToString( hours, minutes ) {
		var period = 'AM';
		
		if ( hours >= 12 ) {
			period = 'PM';
		}
		
		if ( hours > 12 ) {
			hours = hours - 12;
		} else if ( hours < 10 && hours > 0 ) {
			hours = '0' + hours;
		} else {
			hours = 12;
		}
		
		if ( minutes < 10 ) {
			minutes = '0' + minutes;
		}
		
		return hours + ':' + minutes + ' ' + period;
	}
	
	function getMonthToString( month ) {
		switch ( month ) {
			case 1:
				return 'January';
			case 2:
				return 'February';
			case 3:
				return 'March';
			case 4:
				return 'April';
			case 5:
				return 'May';
			case 6:
				return 'June';
			case 7:
				return 'July';
			case 8:
				return 'August';
			case 9:
				return 'September';
			case 10:
				return 'October';
			case 11:
				return 'November';
			case 12:
				return 'December';
		}
	}
	
})(jQuery);