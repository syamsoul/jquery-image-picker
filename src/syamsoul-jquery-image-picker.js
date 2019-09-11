(function( factory ) {
	"use strict";

	if ( typeof exports === 'object' ) {
		// CommonJS
		if ( ! $ || ! jQuery) {
			$ = require('jquery');
		}
        
		module.exports = jQuery.fn.SdImagePicker = $.fn.SdImagePicker = factory($);
	}
	else {
		// Browser
        jQuery.fn.SdImagePicker = $.fn.SdImagePicker = factory(jQuery);
	}
}
(function($) {
	"use strict";
	
	let CORE = function(){
		let input_jel, opts_new;
		
		let readURL = function(input) {            
			if (input.files && input.files[0]) {
				var reader = new FileReader();
	
				reader.onload = function(e) {
					for(let e_iprev_name of opts_new['image_preview_els_name']){
						let e_jel = $(e_iprev_name);
						let tagName = e_jel.prop('tagName');
						if(tagName == 'IMG'){
							e_jel.attr('src', e.target.result);
						}else if(tagName == 'DIV'){
							e_jel.css('background-image', `url('${e.target.result}')`);
						}
						e_jel.removeClass('sd-image-picker-preview-none').addClass('sd-image-picker-preview-show');
					}
				}
	
				reader.readAsDataURL(input.files[0]);
			}
		}
		
		
		this.methods = {
			init : function(opts) {
				input_jel = $(this);
				
				opts_new = (function(){
					let opts_new = {};
					
					if(typeof opts == "object"){
						if(!Array.isArray(opts['image_preview_els_name']) && typeof opts['image_preview_els_name'] != "string") opts_new['image_preview_els_name'] = [];
						else if(typeof opts['image_preview_els_name'] == "string") opts_new['image_preview_els_name'] = [opts['image_preview_els_name']];
						else opts_new['image_preview_els_name'] = opts['image_preview_els_name'];
						
						if(typeof opts['is_input_hidden'] != "boolean") opts_new['is_input_hidden'] = false;
						else opts_new['is_input_hidden'] = opts['is_input_hidden'];
						
						if(!Array.isArray(opts['onclick_input_els_name']) && typeof opts['onclick_input_els_name'] != "string") opts_new['onclick_input_els_name'] = [];
						else if(typeof opts['onclick_input_els_name'] == "string") opts_new['onclick_input_els_name'] = [opts['onclick_input_els_name']];
						else opts_new['onclick_input_els_name'] = opts['onclick_input_els_name'];
					}else{
						console.log("There's something wrong with your SdImagePicker configuration");
						return false;
					}
					
					return opts_new;
				})();
				
				let init = function(){
					input_jel.on('change', function() {
						readURL(this);
					});
					
					if(opts_new['is_input_hidden']) input_jel.hide();
					
					for(let e_oclick_input_name of opts_new['onclick_input_els_name']){
						let e_jel = $(e_oclick_input_name);
						e_jel.on('click', function(){
							input_jel.trigger('click');
						});
					}
					
					for(let e_iprev_name of opts_new['image_preview_els_name']){
						$(e_iprev_name).addClass('sd-image-picker-preview-none');
					}
				}
							
				if(typeof opts_new == "object"){
					init();
				}
			},
			clear : function() { 
				for(let e_iprev_name of opts_new['image_preview_els_name']){
					let e_jel = $(e_iprev_name);
					e_jel.css('background-image', '')
						.removeClass('sd-image-picker-preview-show')
						.addClass('sd-image-picker-preview-none');
					input_jel.val('');
				}
			}
		};
	};

    jQuery.fn.SdImagePicker = $.fn.SdImagePicker = function(methodOrOptions) {
		let settings = $(this).data("settings");
		 
		if(settings == undefined){
			settings = {methods:{}};
			$(this).data("settings", settings);
		}
		
		let methods = settings.methods;
		
		if ( methods[methodOrOptions] ) {
			return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
			settings = new CORE();
			$(this).data("settings", settings);
			
			// Default to "init"
			return settings.methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.SdImagePicker' );
		}    
	};
    
    return $.fn.SdImagePicker;
}));