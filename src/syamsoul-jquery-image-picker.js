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
    
    jQuery.fn.SdImagePicker = $.fn.SdImagePicker = function(opts){
        let input_jel = $(this);
        
        let opts_new = (function(){
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
                    }
                }
    
                reader.readAsDataURL(input.files[0]);
            }
        }
        
        
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
        }
    
        if(typeof opts_new == "object"){
            init();
        }
    }
    
    return $.fn.SdImagePicker;
}));