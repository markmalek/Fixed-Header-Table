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
* Version : 1.2.2
* Released: May 9th, 2011
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
            create:            	 null // callback after plugin completes
            
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
                        
                        $.isFunction(settings.create) && settings.create.call(this);
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
                    $temp,
                    tfootHeight = 0;
                    
                settings.scrollbarOffset = helpers._getScrollbarWidth();
				settings.themeClassName = settings.themeClass;
				
				if ( settings.width.search('%') > -1 ) {
					var widthMinusScrollbar = $self.parent().width() - settings.scrollbarOffset;
				} else {
					var widthMinusScrollbar = settings.width - settings.scrollbarOffset;				
				}
				
                $self.css({
	                    width: widthMinusScrollbar
	                });
	                

                if ( !$self.closest('.fht-table-wrapper').length ) {
                    $self.addClass('fht-table');
                    $self.wrap('<div class="fht-table-wrapper"></div>');
                }

                $wrapper = $self.closest('.fht-table-wrapper');
                
                $wrapper.css({
	                    width: settings.width,
	                    height: settings.height
	                })
	                .addClass(settings.themeClassName);

                if ( !$self.hasClass('fht-table-init') ) {
                    
                    $self.wrap('<div class="fht-tbody"></div>');
                        
                }
				$divBody = $self.closest('.fht-tbody');
				
                var tableProps = helpers._getTableProps($self);
                
                helpers._setupClone( $divBody, tableProps.tbody );

                if ( !$self.hasClass('fht-table-init') ) {    
                    $divHead = $('<div class="fht-thead"><table class="fht-table"></table></div>').prependTo($wrapper);
                    
                    $thead.clone().appendTo($divHead.find('table'));
                } else {
                	$divHead = $wrapper.find('div.fht-thead');
                }

                helpers._setupClone( $divHead, tableProps.thead );
                
                $self.css({
                    'margin-top': -$thead.outerHeight(true) - tableProps.border
                });
                
                /*
                 * Check for footer
                 * Setup footer if present
                 */
                if ( settings.footer == true ) {

                	helpers._setupTableFooter( $self, self, tableProps );
                	
                	if ( !$tfoot.length ) {
                		$tfoot = $wrapper.find('div.fht-tfoot table');
                	}
                	
                	tfootHeight = $tfoot.outerHeight(true);
                }

                var tbodyHeight = $wrapper.height() - $thead.outerHeight(true) - tfootHeight - tableProps.border;
                
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
                
                helpers._bindScroll( $divBody );
                
                return self;
            },
            
            /*
             * Resize the table
             * Incomplete - not implemented yet
             */
            resize: function( options ) {
            	var $self = $(this),
            		self  = this;
            	
            	return self;
            },
            
            /*
             * Show a hidden fixedHeaderTable table
             */
            show: function( arg1, arg2, arg3 ) {
                var $self		= $(this),
                    self  		= this,
                    $wrapper 	= $self.closest('.fht-table-wrapper');

				// User provided show duration without a specific effect
                if ( typeof(arg1) !== 'undefined' && typeof(arg1) === 'number' ) {
                	
                	$wrapper.show(arg1, function() {
                		$.isFunction(arg3) && arg3.call(this);
                	});
                	
                	return self;
                     
                } else if ( typeof(arg1) !== 'undefined' && typeof(arg1) === 'string'
                	&& typeof(arg2) !== 'undefined' && typeof(arg2) === 'number' ) {
				
					// User provided show duration with an effect
					
                	$wrapper.show(arg1, arg2, function() {
                		$.isFunction(arg3) && arg3.call(this);
                	});
                	
                	return self;
                	
                }
                	
            	$self.closest('.fht-table-wrapper')
                 .show();
                 $.isFunction(arg3) && arg3.call(this);
                
                return self;
            },
            
            /*
             * Hide a fixedHeaderTable table
             */
            hide: function( arg1, arg2, arg3 ) {
                var $self 		= $(this),
                    self		= this,
                    $wrapper 	= $self.closest('.fht-table-wrapper');
                    
                // User provided show duration without a specific effect
                if ( typeof(arg1) !== 'undefined' && typeof(arg1) === 'number' ) {
                	$wrapper.hide(arg1, function() {
                		$.isFunction(arg3) && arg3.call(this);
                	});
                     
                     return self;
                } else if ( typeof(arg1) !== 'undefined' && typeof(arg1) === 'string'
                	&& typeof(arg2) !== 'undefined' && typeof(arg2) === 'number' ) {

                	$wrapper.hide(arg1, arg2, function() {
                		$.isFunction(arg3) && arg3.call(this);
                	});
                	
                	return self;
                }
                    
                $self.closest('.fht-table-wrapper')
                     .hide();
                     
                $.isFunction(arg3) && arg3.call(this);
                     
                
                     
                return self;
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
                
                return self;
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
             * return void
             * bind scroll event
             */
            _bindScroll: function( $obj ) {
            	var $self = $obj,
            		$thead = $self.siblings('.fht-thead'),
            		$tfoot = $self.siblings('.fht-tfoot');
            	
            	$self.bind('scroll', function() {
            		$thead.find('table')
            			.css({
            				'margin-left': -this.scrollLeft
            			});
            		
            		if ( settings.cloneHeadToFoot ) {
            			$tfoot.find('table')
	            			.css({
	            				'margin-left': -this.scrollLeft
	            			});
            		}
            	});
            },
            
            /*
             * return void
             */
            _setupTableFooter: function ( $obj, obj, tableProps ) {
            	
            	var $self 		= $obj,
            		self  		= obj,
            		$wrapper 	= $self.closest('.fht-table-wrapper'),
            		$tfoot		= $self.find('tfoot'),
            		$divFoot	= $wrapper.find('div.fht-tfoot');
            		
            	if ( !$divFoot.length ) {
            		$divFoot = $('<div class="fht-tfoot"><table class="fht-table"></table></div>').appendTo($wrapper);
            	}

            	switch (true) {
            		case !$tfoot.length && settings.cloneHeadToFoot == true && settings.footer == true:
            			
            			var $divHead = $wrapper.find('div.fht-thead');
            			
            			$divFoot.empty();
            			$divHead.find('table')
            				.clone()
            				.appendTo($divFoot);
            				
            			break;
            		case $tfoot.length && settings.cloneHeadToFoot == false && settings.footer == true:
            			
            			$divFoot.find('table')
            				.append($tfoot)
	                    	.css({
	                    		'margin-top': -tableProps.border
	                    	});
            				
            			helpers._setupClone( $divFoot, tableProps.tfoot );
            			
            			break;
            	}
            	
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
                    tfoot: {},
                    border: 0
                };
				
				tableProp.border = ( $obj.find('th:first-child').outerWidth() - $obj.find('th:first-child').innerWidth() ) / 2;
				
                $obj.find('thead tr:first-child th').each(function(index) {
                    tableProp.thead[index] = $(this).width() + tableProp.border;
                });
                
                $obj.find('tfoot tr:first-child td').each(function(index) {
                	tableProp.tfoot[index] = $(this).width() + tableProp.border;
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
                
                $self.find(selector).each(function(index) {
                    $cell = ( $(this).find('div.fht-cell').length ) ? $(this).find('div.fht-cell') : $('<div class="fht-cell"></div>').appendTo($(this));
					
                    $cell.css({
                        'width': parseInt(cellArray[index])
                    });
                    
                    /*
                     * Fixed Header and Footer should extend the full width
                     * to align with the scrollbar of the body 
                     */
                    if ( !$(this).closest('.fht-tbody').length && $(this).is(':last-child') ) {
                    	var padding = ( ( $(this).innerWidth() - $(this).width() ) / 2 ) + settings.scrollbarOffset;
                    	$(this).css({
                    		'padding-right': padding + 'px'
                    	});
                    }
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
						scrollbarWidth = $textarea1.width() - $textarea2.width() + 2; // + 2 for border offset
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