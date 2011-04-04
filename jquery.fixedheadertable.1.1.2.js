/*!
* jquery.fixedHeaderTable. The jQuery fixedHeaderTable plugin
*
* Copyright (c) 2010 Mark Malek
* http://fixedheadertable.mmalek.com
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
* 
* http://docs.jquery.com/Plugins/Authoring
* jQuery authoring guidelines
*
* Launch  : October 2009
* Version : 1.1.2 beta
* Released: TBA
*
* 
* all CSS sizing (width,height) is done in pixels (px)
*/
(function($)
{
	$.fn.fixedHeaderTable = function(options) {
		var defaults = {
			loader: false,
			footer: false,
			colBorder: true,
			cloneHeaderToFooter: false,
			autoResize: false,
			onComplete: null
		};
		
		var options = $.extend(defaults, options); // get the defaults or any user set options
		
		return this.each(function() {
			var obj = $(this); // the jQuery object the user calls fixedHeaderTable on
			var origWidth = obj.width();

			buildTable(obj,options);
			
			/*
			 * When the browser is resized set a javascript timeout (setTimeout()) on the build table function.
			 * If the browser is continuously being resized, reset the timeout. If the browser hasn't been resized
			 * for 200ms then exectue buildTable.
			*/
			if(options.autoResize == true) {
				// if true resize the table when the browser resizes
				$(window).resize( function() {
					if (table.resizeTable) {
						// if a timeOut is active cancel it because the browser is still being resized
						clearTimeout(table.resizeTable);
					}
				
					// setTimeout is used for resizing because some browsers will call resize() while the browser is still being resized which causes performance issues.
					// if the browser hasn't been resized for 200ms then resize the table
					table.resizeTable = setTimeout(function() {
					
						buildTable(obj,options);
						
					}, 200);
				});
				options.origWidth = obj.width();
			}
		});
	};
	
	var table = function() {
		this.resizeTable; // stores the value of the resize javascript timeout (setTimeout)
	}
	
	function buildTable(obj,options) {
		var objClass = obj.attr('class');	
		var hasTable = obj.find("table").size() > 0; // returns true if there is a table
		var hasTHead = obj.find("thead").size() > 0; // returns true if there is a thead
		var hasTBody = obj.find("tbody").size() > 0; // returns true if there is a tbody
			
		if(hasTable && hasTHead && hasTBody) {
			var parentDivWidth = obj.innerWidth(); // get the width of the parent DIV
			var parentDivHeight = obj.innerHeight(); // get the height of the parent DIV
			var tableBodyWidth = parentDivWidth; // width of the div surrounding the tbody (overflow:auto)
			var footerHeight = 0;

			jQuery('.fht_table_body tr div.icon-row a').show();
			obj.find('div.fht_fixed_header').remove();
	
			if (obj.find('div.fht_table_body').size() == 0) {
			    obj.wrapInner('<div class="fht_table_body"></div>');
			}

			var table = obj.find('div.fht_table_body table');
			var tableWidth = parentDivWidth;
			
			if (options.footer && !options.cloneHeaderToFooter) {
			    var footerId = options.footerId;
			    var footerHeight = obj.find('#'+footerId).outerHeight(); // store the footer height.  Used later to determine the allowed height for scrolling the table
				// if footer is true and its not a cloned footer
				if (!options.footerId) {
						// notify the developer they wanted a footer and didn't provide content
						$('body').css('background', '#f00');
						alert('Footer ID required');
				}
				else {
					var footerId = options.footerId;
					$('#'+footerId).appendTo(obj); // move the user created footer inside the table parent div.
				}
			}
			
			obj.find('div.fht_table_body table thead tr:first th').each(function() {
			    $(this).removeAttr('width');
			});
			
			var headerHeight = table.find('thead').outerHeight();
			if (options.footer && options.cloneHeaderToFooter) {
				footerHeight = headerHeight;
			}
			var tableBodyHeight = parentDivHeight - headerHeight - footerHeight;
			
			obj.find('div.fht_table_body').css({'width':parentDivWidth + 'px', 'height':tableBodyHeight + 'px'});
			table.css('width','100%');

            if ((table.outerHeight() - headerHeight) >= tableBodyHeight) {
                if ($.browser.msie == true) {
                	// if IE subtract 20px to compensate for the scrollbar
                	tableWidth = tableWidth - 20; // default width of scrollbar for IE
                }
                else if (jQuery.browser.safari == true) {
                	// if Safari subtract 16px to compensate for the scrollbar
                	tableWidth = tableWidth - 15; // default width of scrollbar for Safari
                }
                else {
                	// if everything else subtract 19px to compensate for the scrollbar (FireFox, Chrome, Opera etc)
                	tableWidth = tableWidth - 20; // default width of scrollbar for everyone else
                }

                obj.find('.fht_table_body').css('overflow','auto');
            }
            else if (table.outerWidth() <= tableBodyWidth) {
                obj.find('.fht_table_body').css('overflow','hidden');
            }

            table.css('width',tableWidth+'px');

            if (obj.find('div.fht_fixed_header').size() == 0) {
                obj.prepend('<div class="fht_fixed_header"><table width="'+obj.find('div.fht_table_body table').width()+'px"></table></div>');
            }
            obj.find('div.fht_fixed_header').css({'width':parentDivWidth + 'px', 'height':table.find('thead').outerHeight() + 'px'});
            
            var i = 0;
            obj.find('div.fht_table_body table thead tr:first th').each(function() {
                var width = ($.browser.msie == 'true') ? $(this).width() : $(this).width() + 1;
                $(this).attr('width',width+'px');
                if($(this).find('.empty-cell').size() == 0) {
                	$(this).wrapInner('<div class="empty-cell" style="width:' + width + 'px;"></div>');
                }
                
                if ($(this).is(':first-child')) {
                    $(this).addClass('first-cell');
                }
                
                if ($(this).is(':last-child')) {
                    $(this).addClass('last-cell');
                }
            });

            if (table.outerHeight() < tableBodyHeight) {
                var lastRowHeight = tableBodyHeight - table.outerHeight();
                
                if (lastRowHeight > 40) {
                    lastRowHeight = 40;
                }
                lastRowHeight = 40;
                if (table.find('tbody').children('tr.last-row').size() == 0) {
                    table.find('tbody').append('<tr class="last-row"></tr>');
                    table.find('tbody tr:first td').each(function() {
                        table.find('tbody tr.last-row').append('<td class="empty-cell"><div style="height:'+lastRowHeight+'px"></div></td>');
                    });
                }
                else {
                    table.find('tbody').children('tr.last-row').children('td.empty-cell').children('div').each(function() {
                        $(this).css('height',lastRowHeight+'px');
                    });
                }
            }
            else {
                table.find('tbody').children('tr.last-row').remove();
            }
            
            var tableHeader = obj.find('div.fht_table_body table thead');
            tableHeader.clone().appendTo('div.fht_fixed_header table');
            obj.find('div.fht_table_body table').css({'margin-top':-(tableHeader.height())+'px'});
            
            if (options.footer && options.cloneHeaderToFooter) {
            	// put cloned header here
            	obj.find('div.fht_fixed_header').clone().appendTo(obj);
            }
            
            if(options.loader) {
            	// if true hide the loader
            	$('.'+options.loaderClass).fadeOut('medium');
            }
            
            $.isFunction(options.onComplete) && options.onComplete.call(this);
            
            obj.find('.fht_table_body').scroll(function() {
            	// if a horizontal scrollbar is present
            	obj.find('.fht_fixed_header table').css('margin-left',(-this.scrollLeft)+'px'); // scroll the fixed header equal to the table body's scroll offset
            	if (options.footer && options.cloneHeaderToFooter) {
            		// if a cloned footer is visible it needs to be scrolled too
            		obj.find('.fht_fixed_footer_border').css('margin-left',(-this.scrollLeft)+'px'); // scroll the fixed footer equal to the table body's scroll offset
            	}
            });
		}
		else {
			// you did something wrong.
			$('body').css('background', '#f00');
			alert('Invalid HTML. A table, thead, and tbody are required');
			// For the future: build a dialog window that indicates an error in implementation with the specific error
		}
	}	
})(jQuery);