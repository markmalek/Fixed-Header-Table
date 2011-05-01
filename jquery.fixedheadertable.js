// jQuery Plugin FixedHeaderTable
// A pluging for adding fixed headers to HTML tables
// version 1.2, April 30th, 2011
// by Mark Malek

(function($) {

    // here it goes!
    $.fn.fixedHeaderTable = function(method) {

        // plugin's default options
        var defaults = {
            
            width:	'100%',
            height: '100%',
            borderCollapse: true,
            
            autoShow:            true,
            loader:              false,
            footer:              false,
			cloneHeadToFoot:	 false,
            cloneHeaderToFooter: false, // deprecated option
            autoResize:          false,
            complete:            null
            
        }

        // this will hold the merged default and user-provided properties
        // you will have to access the plugin's properties through this object!
        // settings.propertyName
        var settings = {}

        // public methods
        // to keep the $.fn namespace uncluttered, collect all of the plugin's methods in an object literal and call
        // them by passing the string name of the method to the plugin
        //
        // public methods can be called as
        // $(selector).pluginName('methodName', arg1, arg2, ... argn)
        // where "pluginName" is the name of your plugin and "methodName" is the name of a function available in
        // the "methods" object below; arg1 ... argn are arguments to be passed to the method
        //
        // or, from within the plugin itself, as
        // methods.methodName(arg1, arg2, ... argn)
        // where "methodName" is the name of a function available in the "methods" object below
        var methods = {

            // this the constructor method that gets called when the object is created
            init : function(options) {

                // the plugin's final properties are the merged default and user-provided properties (if any)
                // this has the advantage of not polluting the defaults, making the same instace re-usable with
                // new options; thanks to Steven Black for suggesting this
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
				settings.themeClassName = $self.attr('class');
				
                $self.css({
                    width: settings.width - settings.scrollbarOffset,
                    height: settings.height
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

                var tableProps = helpers._getTableProps($self);
                
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
                $divBody = $self.closest('.fht-tbody');
                $divBody.css({
	                    'height': tbodyHeight
	                });
                
                if ( !settings.autoShow ) {
                    $wrapper.hide();
                }
                
                $self.addClass('fht-table-init');
                
                return self;
            },
            
            show: function() {
                var $self = $(this),
                    self  = this;
                    
                $self.closest('.fht-table-wrapper')
                     .show();
                     
                return this; 
            },
            
            hide: function() {
                var $self = $(this),
                    self  = this;
                    
                $self.closest('.fht-table-wrapper')
                    .hide();
                
                return this;
            },
            
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
        // these methods can be called only from within the plugin
        //
        // private methods can be called as
        // helpers.methodName(arg1, arg2, ... argn)
        // where "methodName" is the name of a function available in the "helpers" object below; arg1 ... argn are
        // arguments to be passed to the method
        var helpers = {

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
            
            _setupClone: function( $head, cellArray ) {
                var $self    = $head,
                    selector = ( $self.find('thead').length ) ?
                        'thead th' : 
                        ( $self.find('tfoot').length ) ?
                            'tfoot td' :
                            'tbody td',
                    $cell;

                $self.css({
                	'margin-right': settings.scrollbarOffset
                });
                $self.find(selector).each(function(index) {
                    $cell = ( $(this).find('div.fht-cell').length ) ? $(this).find('div.fht-cell') : $('<div class="fht-cell"></div>').appendTo($(this));

                    $cell.css({
                        'width': cellArray[index]
                    });
                });
            },
            
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
        if (methods[method]) {

            // call the respective method
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

        // if an object is given as method OR nothing is given as argument
        } else if (typeof method === 'object' || !method) {

            // call the initialization method
            return methods.init.apply(this, arguments);

        // otherwise
        } else {

            // trigger an error
            $.error( 'Method "' +  method + '" does not exist in fixedHeaderTable plugin!');

        }

    }

})(jQuery);