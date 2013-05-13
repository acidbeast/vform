(function($){


	/* version 1.0 */


	$.fn.vform = function(options){
	


		var version = "1.0";




		/* Settings */
		var options = $.extend({
			form: 'form',
			type: 'post',
			block: true,
			loader: '.loader',
			errorClass: 'error',
			errorInput: false,
			errorLabel: false,
			errorMessage: true,
			errorAlert: false,
			connector: 'data-field',
			message: 'span.error',
			messageLabel: 'label',
			alert: '.alert',
			alertLabel: 'label',
			submitCallback: undefined,
			errorCallback: undefined,
			successCallback: undefined
		}, options || {});






		/* Constants */

		var form = $(this);
		var loader = $(options.loader);
		var dataUrl = form.attr('action');
		var errors = 0;
		var errorsMessage = {};





		/* Functions */





		/* Show errors */
		var showFieldError = function(name, error){



			/* exit, if no input params */
			if(!name || !error){return;}


			var field;


			if($('input[name="' + name + '"]', form).length > 0){
				field = $('input[name="' + name + '"]', form);
			}
			else if($('textarea[name="' + name + '"]', form).length > 0){
				field = $('textarea[name="' + name + '"]', form);
			}
			else if($('select[name="' + name + '"]', form).length > 0){
				field = $('select[name="' + name + '"]', form);
			}
			else {
				return;
			}



			/* adds class to input tag */
			if(options.errorInput){
				field.addClass(options.errorClass);
			}




			/* Adds class to field's label */
			if(options.errorLabel){
				var label = $('label[for="'+ field.attr('id') +'"]');
				if(label.length > 0){
					label.addClass(options.errorClass);
				} else if(field.parent().get(0) && field.parent().get(0).tagName == 'LABEL'){
					field.parent().addClass(options.errorClass);
				}
			}



			/* Show error message for field */
			if(options.errorMessage){
				var message = $(options.message + '[' + options.connector + '="' + name + '"]');
				if(options.messages && options.messages[name]){
					$(options.messageLabel, message).empty().append(options.messages[name][error]);
					message.show();
				}
			}




		}




		/*  Check rules and highlight errors*/
		var checkRules = function(){
			for(key in options.rules){


				var type = $.type(options.rules[key]);
				

				/* If input is Object */
				if(type === 'object'){
					for(node in options.rules[key]){
						var name = key;
						var value = options.rules[key][node];
						checkRulesType(name, node, value);
					}
				}



				/* If input is array */
				if(type === 'array'){
					var name = key;
					for(node in options.rules[key]){
						value = options.rules[key][node];
						checkRulesType(name, value);
					}
				}


				/* Check value */
				else{
					checkRulesType(key, options.rules[key]);
				}

			}
			return errors;
		}







		/* Check rules type */
		var checkRulesType = function(name, key, value){


			switch(key){



				/* Function */
				case 'function': 
					if(value instanceof Function){
						var result = value(form,name);
						if(result == false){
							errors++;
							errorsMessage[name] = 'function';
							showFieldError(name, 'function');
						}
					}
					break;




				/* Empty Filed */
				case 'empty':
					var empty = checkFieldEmpty(name);
					if(empty == true){
						errors++;
						errorsMessage[name] = 'empty';
					}
					break;





				/* Email */
				case 'email':
					var email = checkFieldEmail(name);
					if(email == true){
						errors++;
						errorsMessage[name] = 'email';
					}
					break;



				/* Number */
				case 'number':
					var number = checkFieldNumber(name);
					if(number == true){
						errors++;
						errorsMessage[name] = 'number';
					}
					break;



			}



			/* Check object */
			if(key instanceof Function){
				var result = key(form,name);
				if(result == false){
					errors++;
					errorsMessage[name] = 'function';
					showFieldError(name, 'function');
				}
			}



		}







		/* Checks empty fields */
		var checkFieldEmpty = function(name){


			/* For input */
			if($('input[name="'+ name +'"]', form).length > 0){
				var value = $.trim($('input[name="'+ name +'"]', form).val())
				if(value.length == 0){
					showFieldError(name, 'empty');
					return true;
				}
			}


			/* For textarea */
			if($('textarea[name="'+ name +'"]', form).length > 0){
				var value = $.trim($('textarea[name="'+ name +'"]', form).val())
				if(value.length == 0){
					showFieldError(name, 'empty');
					return true;
				}
			}

			/* For select */
			if($('select[name="'+ name +'"]', form).length > 0){
				var value = $.trim($('select[name="'+ name +'"]', form).val());
				if(value.length == 0){
					showFieldError(name, 'empty');
					return true;
				}
			}


			return false;

		}





		/* Highlights fields with "email" rule  */		
		var checkFieldEmail = function(name){
 			



			/* For input */
			if($('input[name="'+ name +'"]', form).length > 0){
				var value = $('input[name="'+ name +'"]', form).val();
				reg = new RegExp("[0-9a-z_]+@[0-9a-z_^.]+\\.[a-z]{2,3}", 'i');
				if(!reg.test(value)){
					showFieldError(name, 'email');
					return true;
				}
				else {
					return false;
				}
			}



			/* For textarea */
			if($('textarea[name="'+ name +'"]', form).length > 0){
				var value = $('textarea[name="'+ name +'"]', form).val();
				reg = new RegExp("[0-9a-z_]+@[0-9a-z_^.]+\\.[a-z]{2,3}", 'i');
				if(!reg.test(value)){
					showFieldError(name, 'email');
					return true;
				}
				else {
					return false;
				}
			}

			/* For select */
			if($('select[name="'+ name +'"]', form).length > 0){
				var value = $('select[name="'+ name +'"]', form).val();
				reg = new RegExp("[0-9a-z_]+@[0-9a-z_^.]+\\.[a-z]{2,3}", 'i');
				if(!reg.test(value)){
					showFieldError(name, 'email');
					return true;
				}
				else {
					return false;
				}
			}



		}





		/* Highlights fields with "number" rule */
		var checkFieldNumber = function(name){
 			



			/* For input */
			if($('input[name="'+ name +'"]', form).length > 0){
				var value = $('input[name="'+ name +'"]', form).val();
				reg = new RegExp("[0-9]", 'i');
				if(!reg.test(value)){
					showFieldError(name, 'number');
					return true;
				}
				else {
					return false;
				}
			}



			/* For textarea */
			if($('textarea[name="'+ name +'"]', form).length > 0){
				var value = $('textarea[name="'+ name +'"]', form).val();
				reg = new RegExp("[0-9]", 'i');
				if(!reg.test(value)){
					showFieldError(name, 'number');
					return true;
				}
				else {
					return false;
				}
			}


			/* For select */
			if($('select[name="'+ name +'"]', form).length > 0){
				var value = $('select[name="'+ name +'"]', form).val();
				reg = new RegExp("[0-9]", 'i');
				if(!reg.test(value)){
					showFieldError(name, 'number');
					return true;
				}
				else {
					return false;
				}
			}



		}






		/* Show errors recieved from server */
		var showAllErrors = function(errors){
			for(key in errors){
				showFieldError(key, errors[key]);
			}
		}




		/* Hide all errors*/
		var hideAllErrors = function(){


			errors = 0;
			errorsMessage = {};



			/* Remove error class from input, textarea, select */
			if(options.errorInput){
				$('input', form).removeClass(options.errorClass);
				$('textarea', form).removeClass(options.errorClass);
				$('select', form).removeClass(options.errorClass);
			}


			/* Remove error class from labels */
			if(options.errorLabel){
				var label = $('label').removeClass(options.errorClass);
			}


			/* Remove error alert */
			if(options.errorMessage){
				$(options.message).hide();
			}



		}





		/* Hide error */
		var hideError = function(input){


			/* Remove error class */
			if(options.errorInput){
				input.removeClass(options.errorClass);
			}


			/* Remove error class for label */
			if(options.errorLabel){
				if(!input.attr('id')){
					return;
				}
				var label = $('label[for="'+ input.attr('id') +'"]');

				if(label.length > 0){
					label.removeClass(options.errorClass);
				} else if(input.parent().get(0).tagName == 'LABEL'){
					input.parent().removeClass(options.errorClass);
				}
			}


			/* Hide error message */
			if(options.errorMessage){
				var message = $(options.message + '[' + options.connector + '="' + input.attr('name') + '"]', form);
				message.fadeOut(50);
			}


		}




		/* Show alert */
		var showAlert = function(errors){
			var counter = 0;
			for(key in errors){
				if(options.alerts[key] && counter < 1){
					var alert = $(options.alert, form);
					var error = errors[key];
					$(options.alertLabel, alert).empty().append(options.alerts[key][error]);
					alert.show();
				}
				counter++;
			}
		}



		/* Hide alert  */
		var hideAlert = function(){
			$(options.alert, form).hide();
		}




		/* blocks form */
		var blockForm = function(){
			$('input[type="submit"]', form).attr('disabled','disabled');
			$('button', form).attr('disabled','disabled');
		}



		/* remove form block */
		var unblockForm = function(){
			$('input[type="submit"]', form).removeAttr('disabled');
			$('button', form).removeAttr('disabled');
		}





		/* Converts results of serializeArray() to object (for $.ajax) */
		var getFormDataObject = function(){
			

			var formData = form.serializeArray();
			var dataOut = {};
			

			for(key in formData){
				dataOut[formData[key].name] = formData[key].value;
			}


			return dataOut;


		}




		/* Coverts fields values  */
		var convertData = function(){
			

			if(!options.convert instanceof Object){ return;}
			

			var formData = getFormDataObject();


			for(convertKey in options.convert){
				if(options.convert[convertKey] instanceof Function){
					var result = options.convert[convertKey](formData[convertKey]);
					formData[convertKey] = result;
				}
			}
			
			return formData;


		}







		/* Own events */
		form.bind('hideErrors', function(){
			hideAllErrors();
		});





		/* Events */




		/* Form submit */
		form.off('submit');
		form.on('submit', function(e){
			

			e.preventDefault();



			/* Прячет ошибки и алерт */			
			hideAllErrors();
			hideAlert();



			/* Вызывает callback при сабмите */
			if(options.submitCallback instanceof Function){
				options.submitCallback();
			}



			/* Проверяет обязательные для заполнения поля */ 
			errors = checkRules();




			/* Вызывает callback и передает в него объект с ошибками */
			if(errors > 0 && options.errorCallback instanceof Function){
				options.errorCallback(errorsMessage);
			}



			if(errors == 0){



				/* Перменные */
				var formData,
					convertLength = 0;



				if(options.convert instanceof Object){
					convertLength = $.map(options.convert, function(n, i) { return i; }).length;
				}



				/*	Проверяет convert, если там есть правила для конвертации, то запускает функцию конвертации
					в противном случае просто сериализует форму и отправляет ее на сервер
				 */
				if(options.convert instanceof Object && convertLength > 0){
					formData = convertData();
				}
				else{
					formData = form.serialize();
				}




				$.ajax({
					type: options.type,
					url: dataUrl,
					dataType: 'json',
					data: formData,
					beforeSend: function(){
						

						/* Show loader */
						loader.fadeIn();


						/* Blocks form */
						if(options.block == true){
							blockForm();
						}


					},
					error: function(){
						loader.fadeOut();
						/* Calls error callback */
						if(options.errorCallback instanceof Function){
							options.errorCallback();
						}
					},
					success: function(data){


						/* Hide loader */
						loader.fadeOut();



						/* Remove form block */
						if(options.block == true){
							unblockForm();
						}



						if(data.error || data.status == 'error'){
							


							/* Show errors */
							showAllErrors(data.errors);



							/* Show alerts */
							if(options.alerts && options.errorAlert){
								showAlert(data.errors);
							}



							/* Call error callback */
							if(options.errorCallback instanceof Function){
								options.errorCallback(data);
							}



						}
						else{



							/* calls successCallback */
							if(options.successCallback instanceof Function){
								options.successCallback(data, form);
							}


						}


					}
				});


			}


		});







		/* Remove error from input on change  */
		$('input', form).on('keydown', function(){
			hideError($(this));
		});





		/* Remove error from textarea on change  */
		$('textarea', form).on('keydown', function(){
			hideError($(this));
		});		


 

		/* Remove error from select on change  */
		$('select', form).on('change', function(){
			hideError($(this));
		});

 


		return version;
 

 
	}




})(jQuery);