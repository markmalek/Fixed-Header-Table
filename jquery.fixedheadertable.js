// jQuery Plugin FixedHeaderTable
// A pluging for adding fixed headers to HTML tables
// version 1.2, April 30th, 2011
// by Mark Malek

(function($) {

    // here it goes!
    $.fn.fixedHeaderTable = function(method) {

        // plugin's default options
        var defaults = {
            
            autoShow:            true,
            loader:              false,
            hasFooter:           false,
            colBorder:           true,
            cloneHeaderToFooter: false,
            autoResize:          false,
            onComplete:          null
            
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
                    }
                });
                
            },

            // a public method. for demonstration purposes only - remove it!
            setup: function() {
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

                if ( !$self.closest('.fht-table-wrapper').length ) {
                    $self.addClass('fht-table');
                    $self.wrap('<div class="fht-table-wrapper"></div>');
                }
                
                $wrapper = $self.closest('.fht-table-wrapper');
                
                $wrapper.css({
                    width: $self.outerWidth(true),
                    height: settings.tableHeight
                });
                
                if ( !$self.hasClass('fht-table-init') ) {
                    
                    $self.wrap('<div class="fht-tbody"></div>');
                    
                    var tbodyHeight = $wrapper.height() - $thead.outerHeight(true) - $tfoot.outerHeight(true);
                    $divBody = $self.closest('.fht-tbody');
                    $divBody.css({
                        'height': tbodyHeight
                    });

                    var tableProps = helpers._getTableProps($self);
                    
                    $divHead = $('<div class="fht-head"><table class="fht-table"></table></div>').prependTo($wrapper);
                    
                    $thead.clone().appendTo($divHead.find('table'));
                    
                    $divHead.find('thead th').each(function(index) {
                        $temp = $('<div class="fht-th"></div>').appendTo($(this));
                        
                        $temp.css({
                            'width': tableProps.thead[index]
                        });
                    });
                    
                    $self.css({
                        'margin-top': -$thead.outerHeight(true)
                    });
                    
                    if ( settings.hasFooter && $self.find('tfoot').length ) {
                        $divFoot = $('<div class="tfoot"><table class="fht-table"></table></div>').appendTo($wrapper);
                        
                        $tfoot.appendTo($divFoot.find('table'));
                        
                        $divFoot.find('tfoot td').each(function(index) {
                            $temp = $('<div class="fht-td"></div>').appendTo($(this));
                            
                            $temp.css({
                                'width': tableProps.thead[index]
                            });
                        });
                    }
                    
                    if ( !settings.autoShow ) {
                        $wrapper.hide();
                    }
                }
                
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
                     .removeClass('fht-table');
                
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

            // a private method. for demonstration purposes only - remove it!
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
                    tbody: {}
                };
                    
                $obj.find('thead th').each(function(index) {
                    tableProp.thead[index] = $(this).width();
                });
                
                $obj.find('tbody tr:first-child td').each(function(index) {
                    tableProp.tbody[index] = $(this).width();
                });
                
                return tableProp;
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