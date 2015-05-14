(function($){



	$.fn.vform = function(options){
	

		var version = "1.6";


		/* Настройки */
		var options = $.extend({
			form: 'form',
			type: 'post',
			dataType: 'json',
			contentType: 'application/json; charset=utf-8;',
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
			alertCallback: undefined,
			successCallback: undefined,
			forceCallback: undefined
		}, options || {});




		/* Перменные */



		var form = $(this);
		var loader = $(options.loader);
		var dataUrl;
		var errors = 0;
		var errorsMessage = {};



		if(options.url){
			dataUrl = options.url;
		}
		else {
			dataUrl = form.attr('action');
		}





		/* Функции */





		/* Показывает ошибку */
		var showFieldError = function(name, error){



			/* Останавливается если не переданы параметры */
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



			/* Добавляет класс тегу input */
			if(options.errorInput){
				field.addClass(options.errorClass);
			}




			/* Добавляет класс к лейблу поля */		
			if(options.errorLabel){
				var label = $('label[for="'+ field.attr('id') +'"]');
				if(label.length > 0){
					label.addClass(options.errorClass);
				} else if(field.parent().get(0) && field.parent().get(0).tagName == 'LABEL'){
					field.parent().addClass(options.errorClass);
				}
			}



			/* Показывает сообщение об ошибке для поля */
			if(options.errorMessage){
				var message = $(options.message + '[' + options.connector + '="' + name + '"]');
				if(options.messages && options.messages[name]){
					$(options.messageLabel, message).empty().append(options.messages[name][error]);
					message.show();
				}
			}




		}




		/* Проверка правил и подсветка ошибок */
		var checkRules = function(){
			for(key in options.rules){
				

				var type = $.type(options.rules[key]);
				

				/* Если переден объект */
				if(type === 'object'){
					for(node in options.rules[key]){
						var name = key;
						var value = options.rules[key][node];
						checkRulesType(name, node, value);
					}
				}



				/* Если переден массив */
				if(type === 'array'){
					var name = key;
					for(node in options.rules[key]){
						value = options.rules[key][node];
						checkRulesType(name, value);
					}
				}


				/* Проверяет переданное значение */
				else{
					checkRulesType(key, options.rules[key]);
				}

			}
			return errors;
		}






		var checkRulesType = function(name, key, value){

			switch(key){



				/* Функция */
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




				/* Пустрое поле */
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



				case 'number':
					var number = checkFieldNumber(name);
					if(number == true){
						errors++;
						errorsMessage[name] = 'number';
					}
					break;



			}



			/* Отдельная проверка переданного объекта*/
			if(key instanceof Function){
				var result = key(form,name);
				if(result == false){
					errors++;
					errorsMessage[name] = 'function';
					showFieldError(name, 'function');
				}
			}



		}







		/* Проверяет пустые поля */
		var checkFieldEmpty = function(name){

			/* Для input */
			if($('input[name="'+ name +'"]', form).length > 0){
				var value = $('input[name="'+ name +'"]', form).val();
				if(value.length == 0){
					showFieldError(name, 'empty');
					return true;
				}
			}


			/* Для textarea */
			if($('textarea[name="'+ name +'"]', form).length > 0){
				var value = $('textarea[name="'+ name +'"]', form).val();
				if(value.length == 0){
					showFieldError(name, 'empty');
					return true;
				}
			}

			/* Для select */
			if($('select[name="'+ name +'"]', form).length > 0){
				var value = $('select[name="'+ name +'"]', form).val();
				if(value.length == 0){
					showFieldError(name, 'empty');
					return true;
				}
			}


			return false;

		}





		/* Подсвечивает поля у которых указан тип проверки email */		
		var checkFieldEmail = function(name){



			/* Для input */
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



			/* Для textarea */
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

			/* Для select */
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





		/* Подсвечивает поля у которых указан тип проверки number */
		var checkFieldNumber = function(name){




			/* Для input */
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



			/* Для textarea */
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


			/* Для select */
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






		/* Выводит ошибки которые приходят с сервера */
		var showAllErrors = function(errors){
			for(key in errors){
				showFieldError(key, errors[key]);
			}
		}




		/* Прячет ошибки */
		var hideAllErrors = function(){


			errors = 0;
			errorsMessage = {};



			/* Убирает класс ошибки у тегов полей (input) */
			if(options.errorInput){
				$('input', form).removeClass(options.errorClass);
				$('textarea', form).removeClass(options.errorClass);
				$('select', form).removeClass(options.errorClass);
			}


			/* Убирает класс ошибки у лейблов */
			if(options.errorLabel){
				var label = $('label').removeClass(options.errorClass);
			}


			/* Прячет сообщение об ошибках */
			if(options.errorMessage){
				$(options.message).hide();
			}



		}





		/* Прячет ошибки */
		var hideError = function(input){


			/* Убирает класс error */
			if(options.errorInput){
				input.removeClass(options.errorClass);
			}


			/* Убирает класс error у лейбла для поля */
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


			/* Прячем сообщение с ошибкой */
			if(options.errorMessage){
				var message = $(options.message + '[' + options.connector + '="' + input.attr('name') + '"]', form);
				message.fadeOut(50);
			}


		}




		/* Показывает алерт */
		var showAlert = function(errors){
			var counter = 0;
			for(key in errors){
				if(options.alerts[key] && counter < 1){
					var alert = $(options.alert);
					var error = errors[key];
					$(options.alertLabel, alert).empty().append(options.alerts[key][error]);
					alert.show();
					if(options.alertCallback instanceof Function){
						options.alertCallback(errors);
					}
				}
				counter++;
			}
		}



		/* Скрывает  */
		var hideAlert = function(){
			$(options.alert, form).hide();
		}




		/* Блокирует форму */
		var blockForm = function(){
			$('input[type="submit"]', form).attr('disabled','disabled');
			$('button', form).attr('disabled','disabled');
		}



		/* Снимает блокировку формы */
		var unblockForm = function(){
			$('input[type="submit"]', form).removeAttr('disabled');
			$('button', form).removeAttr('disabled');
		}





		/* Конвертирует результаты serializeArray() в формат подходящий для передачи в $.ajax */
		var getFormDataObject = function(){
			

			var formData = form.serializeArray();
			var dataOut = {};
			

			for(key in formData){
				dataOut[formData[key].name] = formData[key].value;
			}


			return dataOut;


		}




		/* Конвертирует значения полей */
		var convertData = function(){
			

			if(!options.convertData instanceof Object){ return;}
			

			var formData = getFormDataObject();


			for(convertKey in options.convertData){
				if(options.convertData[convertKey] instanceof Function){
					var result = options.convertData[convertKey](formData[convertKey]);
					formData[convertKey] = result;
				}
			}
			
			return formData;


		}






		/* Удаляет лишние данные при сабрите формы */
		var deleteData = function(formData){
			for(key in options.deleteData){
				delete formData[options.deleteData[key]];
			}
			return formData;
		}






		/* Собственные события */
		form.bind('hideErrors', function(){
			hideAllErrors();
		});




		/* События */




		/* Сабмит формы */
		form.off('submit');
		form.on('submit', function(e){

			e.preventDefault();



			/* Прячет ошибки и алерт */			
			hideAllErrors();
			hideAlert();



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

				if(options.convertData instanceof Object){
					convertLength = $.map(options.convertData, function(n, i) { return i; }).length;
				}



				/*	Проверяет convert, если там есть правила для конвертации, то запускает функцию конвертации
					в противном случае просто сериализует форму и отправляет ее на сервер
				 */
				if(options.convertData instanceof Object && convertLength > 0){
					formData = convertData();
				}
				else{
					formData = getFormDataObject();
				}




				/* Добавляет дополнительные данные из mixinData поверх данных формы */
				if(options.mixinData instanceof Function){
					mixinData = options.mixinData();
					formData = $.extend(formData, mixinData || {});
				}
				else if(options.mixinData instanceof Object){
					formData = $.extend(formData, options.mixinData || {});
				}



				/* Удаляет лишние данные */
				if(options.deleteData instanceof Object){
					formData = deleteData(formData);
				}




				/* Делает JSON из данных */
				if(options.stringifyData == true){
					if(JSON.stringify instanceof Function){
						formData = JSON.stringify(formData);
					}
				}



				/* Вызывает callback при сабмите */
				if(options.submitCallback instanceof Function){
					options.submitCallback(form, formData);
				}




				$.ajax({
					type: options.type,
					url: dataUrl,
					dataType: options.dataType,
					contentType: options.contentType,
					data: formData,
					beforeSend: function(){

						/* Показывает индикатор загрузки */
						loader.fadeIn();


						/* Ставит блокировку на форму */
						if(options.block == true){
							blockForm();
						}
					},
					error: function(data){
						loader.fadeOut();
						/* Вызывает сallback ошибки валидации формы */
						if(options.errorCallback instanceof Function){
							options.errorCallback(data);
						}
					},
					success: function(data){


						/* Прячет индикатор загрузки */
						loader.fadeOut();



						/* Снимает блокировку с формы */
						if(options.block == true){
							unblockForm();
						}



						if(data.error || data.status == 'error'){


							/* Показывает ошибку */
							showAllErrors(data.errors);



							/* Показывает алерты */
							if(options.alerts && options.errorAlert){
								showAlert(data.errors);
							}



							/* Вызывает сallback ошибки валидации формы */
							if(options.errorCallback instanceof Function){
								options.errorCallback(data);
							}



						}
						else{



							/* Вызывает сallback успешной валидации формы */
							if(options.successCallback instanceof Function){
								options.successCallback(data, form);
							}


						}



						/* Вызывает force сallback */
						if(options.forceCallback instanceof Function){
							options.forceCallback(data, form);
						}


					}
				});


			}


		});







		/* Убрать ошибку с инпута при изменении */
		$('input', form).on('keydown', function(){
			hideError($(this));
		});





		/* Убрать ошибку с текстового поля при изменении */
		$('textarea', form).on('keydown', function(){
			hideError($(this));
		});		


 

		/* Убрать ошибку с селекта при изменении */
		$('select', form).on('change', function(){
			hideError($(this));
		});

 
		return version;
 
	}




})(jQuery);