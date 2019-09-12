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
		
		let readURL = function(input, execOnPreLoad=function(){}, execOnLoad=function(){}) {            
			if (input.files && input.files[0]) {
				
				if(typeof execOnPreLoad == "function") execOnPreLoad(input.files[0]);
				
				var reader = new FileReader();
				reader.onload = function(e) {
					if(typeof execOnLoad == "function") execOnLoad(e.target.result);
				}
	
				reader.readAsDataURL(input.files[0]);
			}
		}
		
		let onSelected = function(input_obj){
			var event = $.Event("fileLoaded");
			event.file = input_obj;
			input_jel.trigger(event);
			
			input_jel.data('sd-image-picker-data-file', input_obj);
		}
		
		let setImage = function(jel, data_string){
			let tagName = jel.prop('tagName');
			if(tagName == 'IMG'){
				jel.attr('src', data_string);
			}else if(tagName == 'DIV'){
				jel.css('background-image', `url('${data_string}')`);
			}
		}
		
		let setOnClick = function(jel){
			let the_zone = getDropAndClickZoneJel(jel);
			
			the_zone.on('click', function(){
				input_jel.trigger('click');
			});
		}
		
		let setOnDrop = function(jel){
			let the_zone = getDropAndClickZoneJel(jel);
			
			the_zone[0].ondragover = function (e) { 
				jel.addClass('sd-image-picker-ondragging');
				
				return false; 
			};
			
			the_zone[0].ondragleave = function (e) { 
				jel.removeClass('sd-image-picker-ondragging');
			};
			
			the_zone[0].ondrop = function (e) {
				this.className = 'hidden';
				e.preventDefault();
				
				jel.removeClass('sd-image-picker-ondragging');
				
				//var file = e.dataTransfer.files[0];
				
				readURL(e.dataTransfer, function(input_obj){
					onSelected(input_obj);
				}, function(data_string){
					//document.getElementById('image_droped').className='visible'
					
					for(let e_iprev_name of opts_new['image_preview_els_name']){
						let e_jel = $(e_iprev_name);
						setImage(e_jel, data_string);
						e_jel.removeClass('sd-image-picker-preview-none').addClass('sd-image-picker-preview-show');
					}
				});
			};
		}
		
		let getDropAndClickZoneJel = function(jel){
			let the_zone_jel = jel.find('.sd-image-picker-select-zone');
			if(the_zone_jel.length == 0){
				the_zone_jel = $('<div></div>').addClass('sd-image-picker-select-zone').css({
					position:'absolute',
					top:0, bottom:0, left:0, right:0,
					'z-index':50,
				});
				jel.prepend(the_zone_jel);
			}
			
			return the_zone_jel;
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
						
						if(!Array.isArray(opts['ondrop_input_els_name']) && typeof opts['ondrop_input_els_name'] != "string") opts_new['ondrop_input_els_name'] = [];
						else if(typeof opts['ondrop_input_els_name'] == "string") opts_new['ondrop_input_els_name'] = [opts['ondrop_input_els_name']];
						else opts_new['ondrop_input_els_name'] = opts['ondrop_input_els_name'];
					}else{
						console.log("There's something wrong with your SdImagePicker configuration");
						return false;
					}
					
					return opts_new;
				})();
				
				let init = function(){
					if(opts_new['is_input_hidden']) input_jel.hide();
					
					input_jel.on('change', function() {
						readURL(this, function(input_obj){
							onSelected(input_obj);
						}, function(data_string){
							for(let e_iprev_name of opts_new['image_preview_els_name']){
								let e_jel = $(e_iprev_name);
								setImage(e_jel, data_string);
								e_jel.removeClass('sd-image-picker-preview-none').addClass('sd-image-picker-preview-show');
							}
						});
					});
					
					for(let e_odrop_input_name of opts_new['ondrop_input_els_name']){
						setOnDrop($(e_odrop_input_name));
					}	
					
					for(let e_oclick_input_name of opts_new['onclick_input_els_name']){
						let e_jel = $(e_oclick_input_name);
						e_jel.on('click', function(){
							input_jel.trigger('click');
						});
					}
					
					for(let e_iprev_name of opts_new['image_preview_els_name']){
						let e_jel = $(e_iprev_name);
						e_jel.addClass('sd-image-picker-preview-none');
						
						if(e_jel.data('ondrop') == true){
							setOnDrop(e_jel);
						}
						
						if(e_jel.data('onclick') == true){
							setOnClick(e_jel);
						}
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
					input_jel.removeData('sd-image-picker-data-file');
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