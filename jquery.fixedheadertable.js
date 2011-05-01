/*!
* jquery.fixedHeaderTable. The jQuery fixedHeaderTable plugin
*
* Copyright (c) 2011 Mark Malek
* http://fixedheadertable.com
*
* Licensed under MIT
* http://www.opensource.org/licenses/mit-license.php
* 
* http://docs.jquery.com/Plugins/Authoring
* jQuery authoring guidelines
*
* Launch  : October 2009
* Version : 1.2
* Released: May 2nd, 2011
*
* 
* all CSS sizing (width,height) is done in pixels (px)
*/

(function($) {

    $.fn.fixedHeaderTable = function( method ) {

        // plugin's default options
        var defaults = {
            
            width:	'100%',
            height: '100%',
            borderCollapse: true,
            themeClass: 'fht-default',
            
            autoShow:            true, // hide table after its created
            loader:              false,
            footer:              false, // show footer
			cloneHeadToFoot:	 false, // clone head and use as footer
            cloneHeaderToFooter: false, // deprecated option
            autoResize:          false, // resize table if its parent wrapper changes size
            complete:            null // callback after plugin completes
            
        }

        var settings = {}

        // public methods
        var methods = {

            init : function(options) {

                settings = $.extend({}, defaults, options);

                // iterate through all the DOM elements we are attaching the plugin to
                return this.each(function() {

                    var $self = $(this), // reference the jQuery version of the current DOM element
                        self = this; // reference to the actual DOM element
                    
                    if ( helpers._isTable($self) ) {
                        methods.setup.apply(this, Array.prototype.slice.call(arguments, 1));
                        
                        $.isFunction(options.complete) && options.complete.call(this);
                    } else {
                    	$.error('Invalid table mark-up');
                    }

                });
                
            },
			
			/*
			 * Setup table structure for fixed headers and optional footer
			 */
            setup: function( options ) {
                var $self  = $(this),
                    self   = this,
                    $thead = $self.find('thead'),
                    $tfoot = $self.find('tfoot'),
                    $tbody = $self.find('tbody'),
                    $wrapper,
                    $divHead,
                    $divFoot,
                    $divBody,
                    $fixedHeadRow,
                    $temp;
                    
                settings.scrollbarOffset = helpers._getScrollbarWidth();
				settings.themeClassName = settings.themeClass;

                $self.css({
                    width: settings.width - settings.scrollbarOffset
                });

                if ( !$self.closest('.fht-table-wrapper').length ) {
                    $self.addClass('fht-table');
                    $self.wrap('<div class="fht-table-wrapper"></div>');
                }

                $wrapper = $self.closest('.fht-table-wrapper');
                
                $wrapper.css({
                    width: settings.width,
                    height: settings.height
                });

                if ( !$self.hasClass('fht-table-init') ) {
                    
                    $self.wrap('<div class="fht-tbody"></div>');
                        
                }
				$divBody = $self.closest('.fht-tbody');
				
                var tableProps = helpers._getTableProps($self);
                
                helpers._setupClone( $divBody, tableProps.tbody );

                if ( !$self.hasClass('fht-table-init') ) {    
                    $divHead = $('<div class="fht-head"><table class="fht-table"></table></div>').prependTo($wrapper);
                    
                    $thead.clone().appendTo($divHead.find('table'));
                } else {
                	$divHead = $wrapper.find('div.fht-head');
                }
                
                $divHead.find('table')
                	.addClass(settings.themeClassName);
                    
                helpers._setupClone( $divHead, tableProps.thead );
                
                $self.css({
                    'margin-top': -$thead.outerHeight(true) - tableProps.border
                });
                
                /*
                 * Check for footer
                 * Setup footer if present
                 */
                if ( settings.footer ) {
                	
                	if ( !$self.hasClass('fht-table-init') ) {
                    	$divFoot = $('<div class="tfoot"><table class="fht-table"></table></div>').appendTo($wrapper);
                    } else {
                    	$divFoot = $wrapper.find('div.tfoot');
                    }
                    
                	$divFoot.find('table')
                		.addClass(settings.themeClassName);
                	
                	if ( settings.cloneHeadToFoot || settings.cloneHeaderToFooter ) {
                		$thead.find('tr').clone().appendTo($divFoot.find('table tfoot'));
                		
                		helpers._setupClone( $divFoot, tableProps.thead );
                	} else if ( !$self.find('tfoot').length && ( !settings.cloneHeadToFoot || !settings.cloneHeaderToFooter ) ) {
                		$.error( 'Invalid markup: tfoot does not exist in table!');
                		
                		return self;
                	} else {
                        
                        $tfoot.appendTo($divFoot.find('table'));
                        $divFoot.find('table')
                        	.css({
                        		'margin-top': -tableProps.border
                        	});
                        
                        helpers._setupClone( $divFoot, tableProps.thead );
                        
                    }
                }
                
                var tbodyHeight = $wrapper.height() - $thead.outerHeight(true) - $tfoot.outerHeight(true) - tableProps.border;
                $divBody.css({
	                    'height': tbodyHeight
	                });
                
                if ( !settings.autoShow ) {
                    $wrapper.hide();
                }
                
                $self.addClass('fht-table-init');
                
                if ( typeof(settings.altClass) !== 'undefined' ) {
                	$self.find('tbody tr:odd')
                		.addClass(settings.altClass);
                }
                
                return self;
            },
            
            /*
             * Show a hidden fixedHeaderTable table
             */
            show: function() {
                var $self = $(this),
                    self  = this;
                    
                $self.closest('.fht-table-wrapper')
                     .show();
                     
                return this; 
            },
            
            /*
             * Hide a fixedHeaderTable table
             */
            hide: function() {
                var $self = $(this),
                    self  = this;
                    
                $self.closest('.fht-table-wrapper')
                    .hide();
                
                return this;
            },
            
            /*
             * Destory fixedHeaderTable and return table to original state
             */
            destroy: function() {
                var $self    = $(this),
                    self     = this,
                    $wrapper = $self.closest('.fht-table-wrapper');
                    
                $self.insertBefore($wrapper)
                     .removeAttr('style')
                     .append($wrapper.find('tfoot'))
                     .removeClass('fht-table fht-table-init')
                     .find('.fht-cell')
                     .remove();
                
                $wrapper.remove();
                
                return this;
            }


        }

        // private methods
        var helpers = {

			/*
			 * return boolean
			 * True if a thead and tbody exist.
			 */
            _isTable: function( $obj ) {
                var $self = $obj,
                    hasTable = $self.is('table'),
                    hasThead = $self.find('thead').length > 0,
                    hasTbody = $self.find('tbody').length > 0;

                if ( hasTable && hasThead && hasTbody ) {
                    return true;
                }
                
                return false;

            },
            
            /*
             * return object
             * Widths of each thead cell and tbody cell for the first rows.
             * Used in fixing widths for the fixed header and optional footer.
             */
            _getTableProps: function( $obj ) {
                var tableProp = {
                    thead: {},
                    tbody: {},
                    border: 0
                };
				
				tableProp.border = ( $obj.find('th:first-child').outerWidth() - $obj.find('th:first-child').innerWidth() ) / 2;
				
                $obj.find('thead th').each(function(index) {
                	
                    tableProp.thead[index] = $(this).width() + tableProp.border;
                });
                
                $obj.find('tbody tr:first-child td').each(function(index) {
                    tableProp.tbody[index] = $(this).width() + tableProp.border;
                });

                return tableProp;
            },
            
            /*
             * return void
             * Fix widths of each cell in the first row of obj.
             */
            _setupClone: function( $obj, cellArray ) {
                var $self    = $obj,
                    selector = ( $self.find('thead').length ) ?
                        'thead th' : 
                        ( $self.find('tfoot').length ) ?
                            'tfoot td' :
                            'tbody td',
                    $cell;
				
				if ( !$self.hasClass('fht-tbody') ) {
	                $self.css({
	                	'margin-right': settings.scrollbarOffset
	                });
                }
                $self.find(selector).each(function(index) {
                    $cell = ( $(this).find('div.fht-cell').length ) ? $(this).find('div.fht-cell') : $('<div class="fht-cell"></div>').appendTo($(this));

                    $cell.css({
                        'width': parseInt(cellArray[index])
                    });
                });
            },
            
            /*
             * return int
             * get the width of the browsers scroll bar
             */
            _getScrollbarWidth: function() {
            	var scrollbarWidth = 0;
            	
            	if ( !scrollbarWidth ) {
					if ( $.browser.msie ) {
						var $textarea1 = $('<textarea cols="10" rows="2"></textarea>')
								.css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body'),
							$textarea2 = $('<textarea cols="10" rows="2" style="overflow: hidden;"></textarea>')
								.css({ position: 'absolute', top: -1000, left: -1000 }).appendTo('body');
						scrollbarWidth = $textarea1.width() - $textarea2.width();
						$textarea1.add($textarea2).remove();
					} else {
						var $div = $('<div />')
							.css({ width: 100, height: 100, overflow: 'auto', position: 'absolute', top: -1000, left: -1000 })
							.prependTo('body').append('<div />').find('div')
								.css({ width: '100%', height: 200 });
						scrollbarWidth = 100 - $div.width();
						$div.parent().remove();
					}
				}
				
				return scrollbarWidth;
            }

        }

        // if a method as the given argument exists
        if ( methods[method] ) {

            // call the respective method
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        // if an object is given as method OR nothing is given as argument
        } else if ( typeof method === 'object' || !method ) {

            // call the initialization method
            return methods.init.apply(this, arguments);

        // otherwise
        } else {

            // trigger an error
            $.error( 'Method "' +  method + '" does not exist in fixedHeaderTable plugin!');

        }

    }

})(jQuery);