// $('#email-date').daterangepicker({autoUpdateInput: false});
$('#email-people').select2({tags: true});
$('#email-sender').select2({tags: true});
$('#email-recipient').select2({tags: true});
$('#email-keywords').select2({tags: true});
$('#email-subject').select2({tags: true});
$('#email-body').select2({tags: true});
$('#email-file-name').select2({tags: true});
$('#email-tags').select2();
// $('#email-assigned').select2();
$('#email-direction').select2();
$('#email-filter-text-1').select2({tags: true});

// $('#edit-labels').select2({tags: true});
// $('#edit-assign').select2();
$('#edit-tags').select2();
$('#loading').hide();

// $('#modalDetails').on('hide.bs.modal',function() {
// });
$('#email-direction').on('change',function() {
	const values = $(this).val();
	if (values.length > 1) {
		const index = values.indexOf('all-direction');
		if (index > -1) {
			values.splice(index, 1);
			$(this).val(values);
		}
	} else if (values.length === 0) {
		$(this).val('all-direction');
	}
	$(this).trigger('change.select2');
})

$('#btn-save-email-data').on('click',function() {
	if ($('#mailId').val() != '') {
		$.confirm({
			type: 'blue',
			title: 'Confirm',
			content: 'Save email Data?',
			scrollToPreviousElement: false,
			buttons: {
				confirm: {
					btnClass: 'btn-info',
					action: function() {
						$.post('/mailbody/tags',{
							_csrf: $('#csrf').val(),
							notes: $('#edit-notes').val(),
							tags: JSON.stringify($('#edit-tags').val()),
							assignID:$('#edit-assign').val(),
							reviewed: $('#edit-review label.active input').val(),
							violation: $('#edit-violation label.active input').val(),
							messageID: $('#mailId').val()
						},function(data) {
						});
						$.post('/mailHistory',{
							_csrf: $('#csrf').val(),
							messageID: $('#mailId').val(),
							type: 'Reviewed Updated',

							notes: $('#edit-notes').val(),
							tags: JSON.stringify($('#edit-tags').val()),
							assignID:$('#edit-assign').val(),
							reviewed: $('#edit-review label.active input').val(),
							violation: $('#edit-violation label.active input').val()
						},function(data){
						});
					}
				},
				cancel: {
					btnClass: 'btn-red',
				}
			}
		});
	} else {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Select Email',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	}
})

window.onload = function() {
	$('#mail-search').css('display','none');
	$('#sender-recipient-group').css('display','none');
	$('#subject-body-filename-group').css('display','none');
}

function validate() {
	var start = $('#email-start-date').val()
	var end = $('#email-end-date').val()
	var validateFlag = 'true'

	if(new Date(start).getTime() > new Date(end).getTime()) {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Incorrect Start and End Date',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
		validateFlag = 'false';
	} else if($('#email-start-date').val() == '' &&  $('#email-end-date').val() != '') {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Select Correct Start Date',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
		validateFlag = 'false';
	} else if($('#email-start-date').val() != '' &&  $('#email-end-date').val() == '') {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Select Correct End Date',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
		validateFlag = 'false';
	}
	return validateFlag;
}

function tempValidate(arr) {
	var tempFlag = true
	arr.forEach(function(item) {
		if(((item.match(/"/g) || []).length)%2 === 0)
			tempFlag = true
		else 
			tempFlag = false
	})
	console.log(tempFlag)
	return tempFlag
}
function createObject() {
	let t = true
	var filterOption = $('.select-filter-option').map(function() {return this.value}).get();
	var filterText = [];
	$('.select-filter-text').map(function() {filterText.push( $('#'+this.id).val())}).get()
	var object = {};
	var expandPeople =  $('#btnExpandPeople').attr('data-flag'); //true then People If False then Sender-recipient
	var expandKeywords =  $('#btnExpandKeywords').attr('data-flag');
	var expandDateRange = $('#btn-expand-day-range').attr('data-flag') // true when date range is displayed

	object["expandPeople"] = expandPeople;
	object["expandKeywords"] = expandKeywords;
	object["expandDateRange"] = expandDateRange;
	if(expandPeople == "true") {
		if(!tempValidate($('#email-people').val()))
			t = false
		object["emailPeople"] =  $('#email-people').val();
	} else {
		if(!tempValidate($('#email-sender').val()))
			t = false
		if(!tempValidate($('#email-recipient').val()))
			t = false
		object["emailSender"] = $('#email-sender').val();
		object["emailRecipient"] = $('#email-recipient').val();
	}
	object["includeWholeWord"] = false;
	if(expandKeywords == "true") {
		if(!tempValidate($('#email-keywords').val()))
			t = false
		object["emailKeywords"] =  $('#email-keywords').val();
	} else {
		if(!tempValidate($('#email-subject').val()))
			t = false
		if(!tempValidate($('#email-body').val()))
			t = false
		if(!tempValidate($('#email-file-name').val()))
			t = false
		object["emailSubject"] = $('#email-subject').val();
		object["emailBody"] = $('#email-body').val();
		object["emailFileNamekey"] = $('#email-file-name').val();
	}

	if(expandDateRange == "true") {
		object["emailDate"] = $('#email-start-date').val().replace(/-/g, '/') +' - '+ $('#email-end-date').val().replace(/-/g, '/');
		object["start_date"] = $('#email-start-date').val()
		object["end_date"] = $('#email-end-date').val()
		object["dateInterval"] = $('#btn-expand-day-range').attr('data-interval')
	} else {
		object["emailDays"] = $('#email-day-range').val()
		object["dateInterval"] = null
		object["start_date"] = null
		object["end_date"] = null
	}

	object["emailTags"] = $('#email-tags').val();
	object["emailAssigned"] = $('#email-assigned').val();
	if($('#email-direction').val()[0] == 'all-direction')
		object["emailDirection"] = [];
	else
		object["emailDirection"] = $('#email-direction').val();
	object["emailMessageId"] = $('#email-message-id').val();
	object["filterOption"] = filterOption;
	object["filterText"] = filterText;
	object["randomResults"] = $('#random-results').val();
	object["randomResultType"] = $('option:selected', $('#random-results')).attr('data-type');
	object["policyName"] = $('#policy-name').val();

	object["reviewStatus"] = $('input[name="review-status"]:checked').val() == undefined ? '' : $('input[name="review-status"]:checked').val();
	object["violationStatus"] = $('input[name="violation-status"]:checked').val() == undefined ? '' : $('input[name="violation-status"]:checked').val();

	object["searchId"] = $('#searchId').val()

	return t === true ? JSON.stringify(object) : 'error'
}

$('#search-email').on('click',function() {
	var validateFlag = validate();
	if(validateFlag == 'true') {
		let object = createObject();
		if(object == 'error') {
			$('#loading').hide();
			$.alert({
				icon: 'fa fa-warning',
				title:'Warning',
				content:'Insert Correct Data',
				type: 'orange',
				buttons: {
					warning: {
						text: 'Close'
					}
				}
			});
			$('footer').removeClass('home-footer')
		} else {
			$('.no-of-results ').remove()
			$('#loading').show();
			$('#mail-search').css('display','block');
			$('#mail-fields').css('display','none');
			$.post('/search',{
				_csrf: $('#csrf').val(),
				object: object
			},function(data) {
				if(data.length > 0) {
					var resultPerPage = $("#results-per-page").val();
					search(data[0],resultPerPage,data[2]);
					$('#searchId').val(data[1])
					$('#searchId').attr('search-flag','searchHistory')
					$('#export-nav').css('display','block')
				} else {
					$('#loading').hide();
					$.alert({
						icon: 'fa fa-warning',
						title:'Warning',
						content:'No such Result Found',
						type: 'orange',
						buttons: {
							warning: {
								text: 'Close'
							}
						}
					});
					$('#export-nav').css('display','none')
					$('#mail-search').css('display','none');
					$('#mail-fields').css('display','block');
					$('footer').removeClass('home-footer')
				}
			})
		}
	}
})

function search(data,resultPerPage,tempObj) {
	removeMailBody();
	console.log(tempObj)
	var html = "";
	data.forEach(function(item,index) {
		let tempSender = (item.From).split('<')[0] == '' ? (item.From).split('>')[0].replace('<','') : (item.From).split('<')[0]
		let tempRecipient = (item.To).split('<')[0] == '' ? (item.To).split('>')[0].replace('<','') : (item.To).split('<')[0]
		let emailDirection = item.emailDirection == null ? '': item.emailDirection
		html += '<div class="border form-group row">'
		html += '<div class="col-sm-1 pt-4"><input class="exportSelect" type="checkbox" data-id="'+ item.messageID +'"></div>'
		html += '<div class="col-sm-10 temp-mail-list">'
		html += '<div class="mail row mt-2 pb-1 pt-1" id="'+ item.messageID +'">'
		html += '<div class="col-sm-12">'
		html += '<span>'+ tempSender +'</span>'
		html += '</div>'
		html += '<div class="col-sm-12">'
		html += '<span>'+ tempRecipient +'</span>'
		html += '</div>'
		html += '<div class="col-sm-7" style="font-size: 13px;">'
		html += '<span>'+ formatDate(item.Date) +'</span>'
		html += '</div>'
		html += '<div class="col-sm-5" style="padding: 0;">'
		html += '<span class="cmp-direction">'+emailDirection+'</span>'
		html += '</div>'
		html += '</div>'
		html += '</div>'
		html += '</div>'
	});


	let htmlBefore = '<div class="row text-center pb-1 no-of-results">'
	htmlBefore += '<div class="col-sm-1"></div>'
	htmlBefore += '<nav aria-label="Page navigation example pl-3">'
	htmlBefore += '<ul class="pagination">'
	htmlBefore += '<li class="page-item disabled"><a id="search-previous-page" class="page-link" href="javascript:void(0);" data-type="exclude" data-previous="false" onclick="searchPreviousPage(this)">Previous</a></li>'
	htmlBefore += '<li class="page-item"><a id="search-current-page" class="page-link" href="javascript:void(0);" data-type="exclude" data-page="1">'+tempObj.noOfResult+'</a></li>'
	htmlBefore += '<li class="page-item '+ tempObj.isNextDisable + '">'
	htmlBefore += '<a id="search-next-page" class="page-link" href="javascript:void(0);" data-type="exclude" data-next="'+ tempObj.isNextPage +'" onclick="searchNextPage(this)">Next</a>'
	htmlBefore += '</li></ul></nav></div>'

	// var htmlBefore = "<div class='no-of-results text-center'># Results "+numberWithCommas(data.length)+"</div>"
	$('.mail-list').before(htmlBefore)
	$('.mail-list').html(html);
	$('#loading').hide();
	divMailClick();
	// $('.mail-list div.mail').on('click',function() {
		// $('#loading').show();
		// $('#edit-assign').attr('disabled',false);
		// $('#edit-tags').attr('disabled',false);
		// $('#edit-notes').attr('disabled',false);

		// $('#review-yes').parent().removeClass('active')
		// $('#review-no').parent().addClass('active')
		// $('#violation-yes').parent().removeClass('active')
		// $('#violation-no').parent().addClass('active')
		// $('#edit-assign').val('');
		// $('#edit-tags').val(null).trigger("change");
		// $('#edit-notes').val('');
		// $('.review-user').html('');
		// $('.violation-user').html('');
		// $('.mail').css('background-color','white');
		// $(this).css('background-color','#989898')
		// if($(this).attr('id') != undefined) {
			// mailBody($(this).attr('id'));
		// }
	// });	
}

function divMailClick() {
	$('.mail-list div.mail').on('click',function() {
		$('#loading').show();
		// $('#edit-labels').attr('disabled',false);
		$('#edit-assign').attr('disabled',false);
		$('#edit-tags').attr('disabled',false);
		$('#edit-notes').attr('disabled',false);

		// $('#edit-review').val('No').trigger("change");
		$('#review-yes').parent().removeClass('active')
		$('#review-no').parent().addClass('active')
		$('#violation-yes').parent().removeClass('active')
		$('#violation-no').parent().addClass('active')
		// $('#edit-violation').val('No').trigger("change");
		$('#edit-assign').val('');
		$('#edit-tags').val(null).trigger("change");
		$('#edit-notes').val('');

		$('.review-user').html('');
		$('.violation-user').html('');

		$('.mail').css('background-color','white');
		$(this).css('background-color','#989898')
		if($(this).attr('id') != undefined) {
			mailBody($(this).attr('id'));
		}
	});
}

function searchNextPage(element) {
	let type = $('#searchId').attr('search-flag');
	let currentPage = $('#search-current-page').attr('data-page')

	if($('#search-next-page').attr('data-next') == 'true' && $('#search-next-page').parent().hasClass('disabled') == false) {
		let url = '/search/nextPage?type='+type+'&perform=next&page='+currentPage+'&id='+$('#searchId').val()
		funCreateView(url,Number(currentPage)+ 1)
	}
}


function searchPreviousPage(element) {
	let type = $('#searchId').attr('search-flag');
	let currentPage = $('#search-current-page').attr('data-page')

	if($('#search-previous-page').attr('data-previous') == 'true' && $('#search-previous-page').parent().hasClass('disabled') == false) {
		let url = '/search/nextPage?type='+type+'&perform=previous&page='+currentPage+'&id='+$('#searchId').val()
		funCreateView(url,Number(currentPage)- 1)
	}
}

function funCreateView(url,changePageTo) {
	$('#loading').show();
	$.get(url,function(data){
		let mailData = data[0]
		let nextPageFlag = data[1]
		let previousPageFlag = data[2]
		let pageLimit = data[3]
		console.log(data)
		if(mailData.length > 0) {
			$('#search-current-page').attr('data-page',Number(changePageTo))
			$('#search-current-page').text(pageLimit)
			if(nextPageFlag == false) {
				$('#search-next-page').attr('data-next','false')
				$('#search-next-page').parent().addClass('disabled')
			} else {
				$('#search-next-page').attr('data-next','true')
				$('#search-next-page').parent().removeClass('disabled')
			}
			if(previousPageFlag == false) {
				$('#search-previous-page').attr('data-previous','false')
				$('#search-previous-page').parent().addClass('disabled')
			} else {
				$('#search-previous-page').attr('data-previous','true')
				$('#search-previous-page').parent().removeClass('disabled')
			}
		}

		let html = ''
		mailData.forEach(function(item,index) {
			html += '<div class="border form-group row">'
			html += '<div class="col-sm-1 pt-4"><input class="exportSelect" type="checkbox" data-id="'+ item.messageID +'"></div>'
			html += '<div class="col-sm-10 temp-mail-list">'
			html += '<div class="mail row mt-2 pb-1 pt-1" id="'+ item.messageID +'">'
			html += '<div class="col-sm-12">'
			html += '<span>'+ (item.From).split('<')[0] == '' ? (item.From).split('>')[0].replace('<','') : (item.From).split('<')[0] +'</span>'
			html += '</div>'
			html += '<div class="col-sm-12">'
			html += '<span>'+ (item.To).split('<')[0] == '' ? (item.To).split('>')[0].replace('<','') : (item.To).split('<')[0] +'</span>'
			html += '</div>'
			html += '<div class="col-sm-7">'
			html += '<span class="cmp-dateTime" style="font-size: 13px;">'+ formatDate(item.Date) +'</span>'
			html += '</div>'
			html += '<div class="col-sm-5" style="padding: 0;">'
			html += '<span class="cmp-direction">'+ item.emailDirection == null ? '': item.emailDirection +'</span>'
			html += '</div>'
			html += '</div>'
			html += '</div>'
			html += '</div>'
		})
		$('.mail-list').html(html)
		divMailClick();
		removeMailBody();

		// $('#edit-assign').attr('disabled',true);
		// $('#edit-tags').attr('disabled',true);
		// $('#edit-notes').attr('disabled',true);
		
		// $('#review-yes').parent().removeClass('active')
		// $('#review-no').parent().addClass('active')
		// $('#violation-yes').parent().removeClass('active')
		// $('#violation-no').parent().addClass('active')
		
		// $('#edit-assign').val('');
		// $('#edit-tags').val(null).trigger("change");
		// $('#edit-notes').val('');
		// $('.review-user').html('');
		// $('.violation-user').html('');

		// $('.policy-rule').css('display','none')
		// $('.cmp-policy-rule').html('')
		// $('#mailId').val('');
		// $('#mailSubject').text('');
		// $('#modal-from').text('');
		// $('#modal-to').text('');
		// $('#modal-subject').text('');
		// $('#modal-date').text('');
		// $('#mailBody').html('');
		// $('#lbl-attachments').css('display','none');
		// $('#attachments').html('');
		// $('.mail-body').addClass('display-none')
		// $('.review-user').html('')
		// $('.violation-user').html('')

		$('#loading').hide();
	})
}

function mailBody(id) {
	$.post('/mailbody',{
		id: id,
		_csrf: $('#csrf').val()
	},function(data) {
		let mailData = data[0];
		let attachments = data[1];
		let tags = data[2];
		let review_violation = data[3];
		let keywordHit = data[5];
		var expandPeople =  $('#btnExpandPeople').attr('data-flag');
		var expandKeywords =  $('#btnExpandKeywords').attr('data-flag');
		let obj = {}
		if(expandPeople == "true") {
			obj = {};
			let t = $('#email-people').val()
			t.forEach(function(item){
				obj = {keyword: item,hit_type:'sender'}
				keywordHit.push(obj)
			})
		} else {
			let t = $('#email-sender').val()
			t.forEach(function(item){
				obj = {keyword: item,hit_type:'sender'}
				keywordHit.push(obj)
			})
			let tt = $('#email-recipient').val()
			tt.forEach(function(item){
				obj = {keyword: item,hit_type:'recipient'}
				keywordHit.push(obj)
			})
		}
		if(expandKeywords == "true") {
			let t = $('#email-keywords').val()
			t.forEach(function(item){
				obj = {keyword: item,hit_type:'subject'}
				keywordHit.push(obj)
				obj = {keyword: item,hit_type:'body'}
				keywordHit.push(obj)
			})
		} else {
			let t = $('#email-subject').val()
			t.forEach(function(item){
				obj = {keyword: item,hit_type:'subject'}
				keywordHit.push(obj)
			})
			let tt = $('#email-body').val()
			tt.forEach(function(item){
				obj = {keyword: item,hit_type:'body'}
				keywordHit.push(obj)
			})
		}
		if(data[4].length == 0){
			$('.policy-rule').css('display','none')
		} else {
			$('.policy-rule').css('display','block')
		}
		$('.cmp-policy-rule').html(data[4])
		$('#mailId').val(mailData[0].messageID);
		$('#mailSubject').text(mailData[0].Subject);
		$('#modal-from').text(mailData[0].From);
		$('#modal-to').text(mailData[0].To);
		$('#modal-subject').text(mailData[0].Subject);
		$('#modal-date').text(formatDate(mailData[0].Date));
		$('#mailBody').html('');
		let htmlbody = mailData[0].htmlbody;
		if(htmlbody == '')
			htmlbody = '<pre>'+mailData[0].body+'</pre>'

		var iframe = document.createElement('iframe');
		document.getElementById("mailBody").appendChild(iframe);
		iframe.setAttribute("style","height:100%;width:100%;");
		iframe.setAttribute("id","myIframe");
		iframe.contentWindow.document.open();
		iframe.contentWindow.document.write(htmlbody);
		iframe.contentWindow.document.close();

		// $('#mailBody').html(htmlbody);
		// $('#modalMail ').modal('show');
		let html = "<div class='form-group row'>";
		if(attachments.length > 0) {
			$('#lbl-attachments').css('display','inline-block');
			attachments.forEach(function(item,index) {
				let fileName = item.name.split('__');
				// html += "<a id='"+item.id+"' href='#' style='padding-right: 50px;'>"+fileName+"</a>"
				if(attachments.length > 1) {
					html += "<div class = 'col-sm-6'>"
				} else {
					html += "<div class = 'col-sm-12'>"
				}
				html += '<a class="sign-out-btn-class" onclick="return getAttachment('+item.id+')" style="padding-right: 50px; cursor: pointer; color:#187dce">'+ fileName[fileName.length-1] +'</a>'
				// html += '<a href="#" onclick="return getAttachment('+item.id+')" style="padding-right: 50px;">'+ fileName +'</a>'
				html +="</div>"
			})
		}
		html += "</div>"
		$('#attachments').html(html);
		if(review_violation.length >0) {
			$('#edit-review label').removeClass('active')
			$('#edit-violation label').removeClass('active')
			if(review_violation[0].reviewed) {
				$('#review-yes').parent().addClass('active')
				var userName = $('#edit-assign option[value="'+review_violation[0].review_user+'"]').text()
				$('.review-user').html('<span>'+userName+'</span>');
			} else {
				$('#review-no').parent().addClass('active')
			} if(review_violation[0].violation) {
				$('#violation-yes').parent().addClass('active')
				var userName = $('#edit-assign option[value="'+review_violation[0].review_user+'"]').text()
				$('.violation-user').html('<span>'+userName+'</span>');
			} else {
				$('#violation-no').parent().addClass('active')
			}
			// $('#edit-review').val(tags[0].reviewed).trigger("change");
			// $('#edit-violation').val(tags[0].violation).trigger("change");

			$('#edit-notes').val(review_violation[0].notes);
			$('#edit-assign').val(review_violation[0].assignID);
		}
		var temp = [];
		tags.forEach(function(item,index){
			temp.push(item.tags)
		})
		$('#edit-tags').val(temp).trigger('change');
		$('.mail-body').removeClass('display-none') //	.cmb-display
		$.post('/mailHistory',{
			_csrf: $('#csrf').val(),
			messageID: $('#mailId').val(),
			type: 'Viewed',
			notes: '',
			tags: '[]',
			assignID: '',
			reviewed: '',
			violation: ''
		},function(data){
			$('iframe').height( $('iframe').contents().outerHeight() + 50);
			highlight(keywordHit)
			$('#loading').hide();
		})
	})
}

function highlight(keywordHit) {
	var replaceWith = '';
	var searchWord = '';
	var htmlSender = $('#modal-from').html();
	var htmlRecipient = $('#modal-to').html();
	var htmlSubject = $('#modal-subject').html();
	var htmlBody = $('#myIframe').contents().find('body').html();
	keywordHit.forEach(function(item,index) {
		searchWord = item.keyword;
		replaceWith = "<span style='background:#f6f68e;font-weight:700'>"+ searchWord +"</span>"
		if(item.hit_type == 'sender') {
			htmlSender = htmlSender.replace( new RegExp(searchWord, "ig"),replaceWith)
		} else if(item.hit_type == 'recipient') {
			htmlRecipient = htmlRecipient.replace( new RegExp(searchWord, "ig"),replaceWith)
		} else if(item.hit_type == 'subject') {
			htmlSubject = htmlSubject.replace( new RegExp(searchWord, "ig"),replaceWith)
		} else if(item.hit_type == 'body') {
			htmlBody = htmlBody.replace( new RegExp(searchWord, "ig"),replaceWith)
		}
	})
	$('#modal-from').html(htmlSender)
	$('#modal-to').html(htmlRecipient)
	$('#modal-subject').html(htmlSubject)
	$('#myIframe').contents().find('body').html(htmlBody);
}

$('#btnExpandPeople').on('click',function() {
	$('#btnExpandPeople').attr('data-flag',false)
	$('#btnCollapsePeople').attr('data-flag',true)
	$('#sender-recipient-group').css('display','block');
	$('#people-group').css('display','none');
	$('.expand-people').css('display','none');
	$('.collapse-people').css('display','block');
});

$('#btnCollapsePeople').on('click',function() {
	$('#btnExpandPeople').attr('data-flag',true)
	$('#btnCollapsePeople').attr('data-flag',false)
	$('#sender-recipient-group').css('display','none');
	$('#people-group').css('display','block');
	$('.expand-people').css('display','block');
	$('.collapse-people').css('display','none');
});

$('#btnExpandKeywords').on('click',function() {
	// let tempHtml = '<label>Whole word only</label><input type="checkbox" class="form-check-input ml-2" style="margin-top: 11px;" id="include-whole-word">'
	// $('.div-expanded-checkbox').html(tempHtml)
	// $('.div-collapsed-checkbox').html('')
	$('#btnExpandKeywords').attr('data-flag',false)
	$('#btnCollapseKeywords').attr('data-flag',true)
	$('#subject-body-filename-group').css('display','block');
	$('#keywords-group').css('display','none');
	$('.expand-keywords').css('display','none');
	$('.collapse-keywords').css('display','block');
});

$('#btnCollapseKeywords').on('click',function() {
	// let tempHtml = '<label>Whole word only</label><input type="checkbox" class="form-check-input ml-2" style="margin-top: 11px;" id="include-whole-word">'
	// $('.div-expanded-checkbox').html('')
	// $('.div-collapsed-checkbox').html(tempHtml)
	$('#btnExpandKeywords').attr('data-flag',true)
	$('#btnCollapseKeywords').attr('data-flag',false)
	$('#subject-body-filename-group').css('display','none');
	$('#keywords-group').css('display','block');
	$('.expand-keywords').css('display','block');
	$('.collapse-keywords').css('display','none');
});

function addFilter(element) {
	if($(element).hasClass('fa-plus')) {
		var rowNo = Number($(element).parent().attr('row-no')) + 1;
		var html ='<div class = "row" row-no = '+ rowNo +'>';
		html+= '<div class="col-sm-9 col-lg-4 form-col">'
		html+= '<select id="email-filter-option-'+ rowNo +'" class="form-control select-filter-option" row-no="filter1">'
		html+= '<option value="sender">Sender</option>'
		html+= '<option value="recipient">Recipient</option>'
		html+= '<option value="subject">Subject</option>'
		html+= '<option value="body">Body</option>'
		html+= '</select>'
		html+= '</div>'
		html+= '<div class="col-sm-9 col-lg-5 form-col">'
		html+= '<select id="email-filter-text-'+ rowNo +'" class="form-control select-filter-text" multiple="multiple" row-no="filter1" ></select>'
		html+= '</div>'
		html+= '<i style="color: #375383;cursor:pointer; padding-top: 8px;" class="fa fa-plus add-contribution-annual" onclick="addFilter(this);"></i></div>';

		$(html).insertAfter($(element).parent());
		$('#email-filter-text-'+rowNo).select2({tags: true});
		$(element).removeClass('fa-plus').addClass('fa-minus')
		// $(element).css('display','none')
	} else {
		$(element).parent().remove()
	}
}

$('#save-email-search').on('click',function() {
	var validateFlag = validate();
	if(validateFlag = 'true') {
		$('#modalSaveCriteria').modal('show');
	}
});

$('#btn-save-email-criteria').on('click',function() {
	if ($('#save-name').val() != '') {
		saveCriteria()
	} else {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Insert Search Result Name',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	}
})

$('#modalSaveCriteria').on('hide.bs.modal',function() {
	$('#save-name').val('');
});

function saveCriteria() {
	let object = createObject();
	if(object == 'error') {
		$('#loading').hide();
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Insert Correct Data',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
		$('footer').removeClass('home-footer')
	} else {
		$('.no-of-results ').remove()
		$('#loading').show();
		$('#mail-search').css('display','block');
		$('#mail-fields').css('display','none');
		$.post('/search/criteria',{
			_csrf: $('#csrf').val(),
			object: object,
			searchName: $('#save-name').val()
		},function(data) {
			let name = $('#save-name').val();
			$('#modalSaveCriteria').modal('hide');
			if(data == 'Exist') {
				$('#loading').hide();
				$('#export-nav').css('display','none')
				$('#mail-search').css('display','none');
				$('#mail-fields').css('display','block');
				$('footer').removeClass('home-footer')
				$.alert({
					icon: 'fa fa-warning',
					title:'Warning',
					content:'Result Name already Exist',
					type: 'orange',
					buttons: {
						warning: {
							text: 'Close'
						}
					}
				});
			} else if(data.length == 0) {
				$('#loading').hide();
				$('#export-nav').css('display','none')
				$('#mail-search').css('display','none');
				$('#mail-fields').css('display','block');
				$('footer').removeClass('home-footer')
				$.alert({
					icon: 'fa fa-warning',
					title:'Warning',
					content:'No such Result Found',
					type: 'orange',
					buttons: {
						warning: {
							text: 'Close'
						}
					}
				});
			} else {
				// removeMailBody()
				var resultPerPage = $("#results-per-page").val();
				search(data[0],resultPerPage,data[2]);
				$('#searchId').val(data[1])
				$('#searchId').attr('search-flag','savedSearch')
				$('#export-nav').css('display','block')
			}
		})
	}
}

$('#btn-audit-history').on('click',function() {
	if ($('#mailId').val() != '') {
		$.get('/mailHistory?id=' + $('#mailId').val(),{
			_csrf: $('#csrf').val()
		},function(data) {
			$('.audit-history').html('');
			let html = '<div class="table-responsive">';
			html += '<table class="table table-striped table-bordered table-borderd dataTable" id="table-emails">';
			html += '<thead><tr><th>Reviewed Date</th><th>Reviewer</th><th>Review Type</th><th>User Assigned</th><th>Notes</th><th>Reviewed ?</th><th>Violation ?</th><th>Tags</th></tr></thead>';
			html += '<tbody>';
			data.forEach(function(item,index) {
				html += "<tr id="+ item.mail_ID +"><td>"+ formatDate(item.time) +"</td><td>"+ item.reviewer +"</td><td>"+ item.type +"</td>";
				html += "<td>"+ ((item.history_assigned == null) ? ' ' : item.history_assigned) +"</td><td>"+ ((item.history_notes == null) ? ' ' : item.history_notes) +"</td>";
				html += "<td>"+ ((item.history_reviewed == null) ? ' ' : item.history_reviewed) +"</td><td>"+ ((item.history_violated == null) ? ' ' : item.history_violated) +"</td>"
				html += "<td>"+ ((item.history_tags == null) ? ' ' : item.history_tags.replace(/##/gi,', ')) +"</td></tr>"
			})
			html +='</tbody></table></div>'
			$('.audit-history').html(html);
			$('#modalMailHistory').modal('show')
		})
	} else {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Select Email',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	}
})

$('.refine-link').on('click',function() {
	if($('#searchId').attr('search-flag') != '') {
		$('#export-nav').css('display','none')
		$('#mail-search').css('display','none');
		$('#mail-fields').css('display','block');
		$('footer').removeClass('home-footer')

		// $('#cmb-search').css('display','none')
		// $('#cmb-refine').css('display','block')
	}
})

function removeMailBody() {
	$('#mailId').val('');
	$('#mailSubject').text('');
	$('#modal-from').text('');
	$('#modal-to').text('');
	$('#modal-subject').text('');
	$('#modal-date').text('');
	$('#mailBody').html('');
	$('#lbl-attachments').css('display','none');
	$('#attachments').html('');
	$('.review-user').html('')
	$('.violation-user').html('')

	$('#edit-assign').attr('disabled',true);
	$('#edit-tags').attr('disabled',true);
	$('#edit-notes').attr('disabled',true);

	$('#edit-review label').removeClass('active')
	$('#edit-violation label').removeClass('active')
	$('#review-no').parent().addClass('active')
	$('#violation-no').parent().addClass('active')

	$('#edit-assign').val('');
	$('#edit-tags').val(null).trigger("change");
	$('#edit-notes').val('');
	$('.policy-rule').css('display','none')
	$('.cmp-policy-rule').html('')

	$('.cmb-display').addClass('display-none')
}

$('#refine-email').on('click',function() {
	let flag = $('#searchId').attr('search-flag')
	var validateFlag = validate();
	if(validateFlag == 'true') {
		if(flag == 'searchHistory') {
			let object = createObject();
			if(object == 'error') {
				$('#loading').hide();
				$.alert({
					icon: 'fa fa-warning',
					title:'Warning',
					content:'Insert Correct Data',
					type: 'orange',
					buttons: {
						warning: {
							text: 'Close'
						}
					}
				});
				$('footer').removeClass('home-footer')
			} else {
				$('.no-of-results ').remove()
				$('#loading').show();
				$('#mail-search').css('display','block');
				$('#mail-fields').css('display','none');
				$.post('/search',{
					_csrf: $('#csrf').val(),
					object: object 
				},function(data) {
					if(data.length > 0) {
					// removeMailBody()
					var resultPerPage = $("#results-per-page").val();
					search(data[0],resultPerPage,data[2]);
					$('#searchId').val(data[1])
					$('#searchId').attr('search-flag','searchHistory')
					$('#export-nav').css('display','block')
				} else {
					$('#loading').hide();
					$.alert({
						icon: 'fa fa-warning',
						title:'Warning',
						content:'No such Result Found',
						type: 'orange',
						buttons: {
							warning: {
								text: 'Close'
							}
						}
					});
					$('#export-nav').css('display','none')
					$('#mail-search').css('display','none');
					$('#mail-fields').css('display','block');
					$('footer').removeClass('home-footer')
				}
			})
			}
		}  else if(flag == 'savedSearch') {
			saveCriteria()
		}
	}
})

$('#btn-save-exports').on('click',function() {
	if($('#mail-search:visible').length == 0) {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Select Emails to Export.',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	} else {
		let exportName = $('#export-name').val();
		let emailList = []
		$('.exportSelect:checkbox:checked').each(function() {
			emailList.push($(this).attr('data-id'))
		})
		$.confirm({
			type: 'blue',
			title: 'Confirm',
			content: 'Save Export List?',
			scrollToPreviousElement: false,
			buttons: {
				confirm: {
					btnClass: 'btn-info',
					action: function() {
						$('#modalExport').modal('hide')
						if(emailList.length < 1) {
							$.alert({
								icon: 'fa fa-warning',
								title:'Warning',
								content:'Select Emails to Export.',
								type: 'orange',
								buttons: {
									warning: {
										text: 'Close'
									}
								}
							});
						} else if( exportName == '') {
							$.alert({
								icon: 'fa fa-warning',
								title:'Warning',
								content:'Insert Export Name.',
								type: 'orange',
								buttons: {
									warning: {
										text: 'Close'
									}
								}
							});
						} else {
							$.post('/exportMail',{
								_csrf: $('#csrf').val(),
								emailList: emailList.join('##'),
								exportName: exportName,
								exportType: 'selected'
							},function(data) {
							})
						}
					}
				},
				cancel: {
					btnClass: 'btn-red',
				}
			}
		});
	}
})

$('#modalExport').on('hide.bs.modal',function() {
	$('#export-name').val('');
});
$('#modalExportAll').on('hide.bs.modal',function() {
	$('#export-name-all').val('');
});

$('#btn-save-all-exports').on('click',function() {
	if($('#mail-search:visible').length == 0) {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Select Emails to Export.',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	} else {
		let exportName = $('#export-name-all').val();
		let emailList = []
		$('.exportSelect:checkbox').each(function() {
			emailList.push($(this).attr('data-id'))
		})
		$.confirm({
			type: 'blue',
			title: 'Confirm',
			content: 'Save Export List?',
			scrollToPreviousElement: false,
			buttons: {
				confirm: {
					btnClass: 'btn-info',
					action: function() {
						$('#modalExportAll').modal('hide')
						if(emailList.length < 1) {
							$.alert({
								icon: 'fa fa-warning',
								title:'Warning',
								content:'Select Emails to Export.',
								type: 'orange',
								buttons: {
									warning: {
										text: 'Close'
									}
								}
							});
						} else if( exportName == '') {
							$.alert({
								icon: 'fa fa-warning',
								title:'Warning',
								content:'Insert Export Name.',
								type: 'orange',
								buttons: {
									warning: {
										text: 'Close'
									}
								}
							});
						} else {
							$.post('/exportMail',{
								_csrf: $('#csrf').val(),
								emailList: emailList.join('##'),
								exportName: exportName,
								exportType: 'all'
							},function(data) {
							})
						}
					}
				},
				cancel: {
					btnClass: 'btn-red',
				}
			}
		});
	}
})

let flag1 = $('input[name="review-status"]').prop('checked')
$('input[name="review-status"]').on('click',function(){
	if($(this).val() == flag1){
		$(this).prop('checked',false)
		flag1 = false
	} else {
		flag1 = $(this).val()
	}
})

let flag2 = $('input[name="violation-status"]').prop('checked')
$('input[name="violation-status"]').on('click',function(){
	if($(this).val() == flag2){
		$(this).prop('checked',false)
		flag2 = false;
	} else {
		flag2 = $(this).val()
	}
})

function convertToDate(str) {
	if(str != null) {
		var date = new Date(str);
		return date.getFullYear() + '-' + appendLeadingZeroes(date.getMonth() + 1) + '-' + appendLeadingZeroes(date.getDate())+'T'+appendLeadingZeroes(date.getHours())+':'+appendLeadingZeroes(date.getMinutes())
	}
}
function appendLeadingZeroes(n){
	if(n <= 9) {
		return "0" + n;
	}
	return n;
}
$('#btnYesterday').on('click',function() {
	const yesterday = new Date()
	yesterday.setDate(yesterday.getDate() - 1)
	let to = new Date(yesterday).setHours(23,59,59)
	let from = new Date(yesterday).setHours(0,0,1)
	$('#email-start-date').val(convertToDate(from))
	$('#email-end-date').val(convertToDate(to))
	$('#btn-expand-day-range').attr('data-interval','1')

	$('.expand-link').removeClass('cmb-active-link')
	$(this).addClass('cmb-active-link')
})
$('#btnPreviousWeek').on('click',function() {
	var d = new Date();
	var to = d.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000);
	var from = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
	$('#email-start-date').val(convertToDate(new Date(from).setHours(0,0,1)))
	$('#email-end-date').val(convertToDate(new Date(to).setHours(23,59,59)))
	$('#btn-expand-day-range').attr('data-interval','7')

	$('.expand-link').removeClass('cmb-active-link')
	$(this).addClass('cmb-active-link')
})
$('#btnPreviousMonth').on('click',function() {
	var d = new Date();
	var to = d.setDate(0)
	var from = d.setDate(1)
	$('#email-start-date').val(convertToDate(new Date(from).setHours(0,0,1)))
	$('#email-end-date').val(convertToDate(new Date(to).setHours(23,59,59)))
	$('#btn-expand-day-range').attr('data-interval','30')

	$('.expand-link').removeClass('cmb-active-link')
	$(this).addClass('cmb-active-link')
})

$('#btnOneDay').on('click',function() {
	$('#email-day-range').val('1')

	$('.collapse-link').removeClass('cmb-active-link')
	$(this).addClass('cmb-active-link')
})
$('#btnSevenDay').on('click',function() {
	$('#email-day-range').val('7')

	$('.collapse-link').removeClass('cmb-active-link')
	$(this).addClass('cmb-active-link')
})
$('#btnThirtyDay').on('click',function() {
	$('#email-day-range').val('30')

	$('.collapse-link').removeClass('cmb-active-link')
	$(this).addClass('cmb-active-link')
})

$('#btn-expand-day-range').on('click',function() {
	$('.date-range-group').css('display','none')
	$('#btn-expand-day-range').attr('data-flag',false)
	$('.day-range-group').css('display','block')
	$('#btn-expand-date-range').attr('data-flag',true)
})
$('#btn-expand-date-range').on('click',function() {
	$('.date-range-group').css('display','block')
	$('#btn-expand-day-range').attr('data-flag',true)
	$('.day-range-group').css('display','none')
	$('#btn-expand-date-range').attr('data-flag',false)
})

$('#email-start-date').on('change',function() {
	$('#btn-expand-day-range').attr('data-interval','')
	$('.cmb-active-link').removeClass('cmb-active-link').addClass('expand-link')
})
$('#email-end-date').on('change',function() {
	$('#btn-expand-day-range').attr('data-interval','')
	$('.cmb-active-link').removeClass('cmb-active-link').addClass('expand-link')
})
$('#email-day-range').on('change',function() {
	$('.cmb-active-link').removeClass('cmb-active-link').addClass('collapse-link')
})


function decodeHtmlEntity (str) {
	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec);
	});
};
if(JSON.parse(decodeHtmlEntity(historyData)).length > 0) {
	var str = decodeHtmlEntity(historyData)
	console.log(str)
	var searchData = JSON.parse(str)
	console.log(searchData)

	let splitPeople = []
	let splitSender =[];
	let splitRecipient =[];
	let splitKeywords = [];
	let splitSubject =[];
	let splitBody =[];
	let splitDirection = [];
	let splitFileNamekey =[];
	let splitTags =[];

	if(searchData[0].people != null)
		splitPeople = searchData[0].people.split('##')
	for(var i = 0;i<splitPeople.length;i++) {
		var newOption = new Option(splitPeople[i], splitPeople[i], true, true);
		$('#email-people').append(newOption);
	}
	$('#email-people').trigger('change')

	if(searchData[0].sender != null)
		splitSender = searchData[0].sender.split('##')
	for(var i = 0;i<splitSender.length;i++) {
		var newOption = new Option(splitSender[i], splitSender[i], true, true);
		$('#email-sender').append(newOption);
	}
	$('#email-sender').trigger('change')


	if(searchData[0].recipient != null)
		splitRecipient = searchData[0].recipient.split('##')
	for(var i = 0;i<splitRecipient.length;i++) {
		var newOption = new Option(splitRecipient[i], splitRecipient[i], true, true);
		$('#email-recipient').append(newOption);
	}
	$('#email-recipient').trigger('change')


	if(searchData[0].keywords != null)
		splitKeywords = searchData[0].keywords.split('##')
	for(var i = 0;i<splitKeywords.length;i++) {
		var newOption = new Option(splitKeywords[i], splitKeywords[i], true, true);
		$('#email-keywords').append(newOption);
	}
	$('#email-keywords').trigger('change')


	if(searchData[0].subject != null)
		splitSubject = searchData[0].subject.split('##')
	for(var i = 0;i<splitSubject.length;i++) {
		var newOption = new Option(splitSubject[i], splitSubject[i], true, true);
		$('#email-subject').append(newOption);
	}
	$('#email-subject').trigger('change')


	if(searchData[0].body != null)
		splitBody = searchData[0].body.split('##')
	for(var i = 0;i<splitBody.length;i++) {
		var newOption = new Option(splitBody[i], splitBody[i], true, true);
		$('#email-body').append(newOption);
	}
	$('#email-body').trigger('change')


	if(searchData[0].filename != null)
		splitFileNamekey = searchData[0].filename.split('##')
	for(var i = 0;i<splitFileNamekey.length;i++) {
		var newOption = new Option(splitFileNamekey[i], splitFileNamekey[i], true, true);
		$('#email-file-name').append(newOption);
	}
	$('#email-file-name').trigger('change')


	if(searchData[0].tags != null){
		splitTags = searchData[0].tags.split(',')
		$('#email-tags').val(splitTags).trigger('change')
	}


	if(searchData[0].assigned != null)
		$('#email-assigned').val(searchData[0].assigned)


	if(searchData[0].direction != null) {
		splitDirection = searchData[0].direction.split('##')
		$('#email-direction').val(splitDirection).trigger('change')
	}


	if(searchData[0].messageId != null)
		$('#email-message-id').val(searchData[0].messageId)


	if(searchData[0].review_selected == 'No') {
		$('input[name="review-status"]').val(['No']).attr('checked',true)
		flag1 = 'No'
	}
	else if(searchData[0].review_selected == 'Yes') {
		$('input[name="review-status"]').val(['Yes']).attr('checked',true)
		flag1 = 'Yes'
	}


	if(searchData[0].violation_selected == 'No') {
		$('input[name="violation-status"]').val(['No']).attr('checked',true)
		flag2 = 'No'
	}
	else if(searchData[0].violation_selected == 'Yes') {
		$('input[name="violation-status"]').val(['Yes']).attr('checked',true)
		flag2 = 'Yes'
	}

	// if(searchData[0].includeWholeWord)
	// 	$('#include-whole-word').prop('checked','true')


	let splitFilterOption = [];
	let splitFilterText = JSON.parse(searchData[0].filterText.replace(/'/g, '"'));
	console.log(splitFilterText)
	if(searchData[0].filterOption != null) {
		splitFilterOption = searchData[0].filterOption.split('##')
	}
	let cmbRowNo = $('.filter-group .row').attr("row-no")
	for(var i = 0;i<splitFilterOption.length;i++) {
		$('#email-filter-option-'+(i+1)).val(splitFilterOption[i])
		for(var j = 0;j<splitFilterText[i].length;j++){
			var newOption = new Option(splitFilterText[i][j], splitFilterText[i][j], true, true);
			$('#email-filter-text-'+(i+1)).append(newOption)
		}
		if(i != splitFilterOption.length -1) {
			$('div[row-no="'+(i+1)+'"] .add-contribution-annual').click()
		}
	}

	if(searchData[0].policy_rule != null)
		$('#policy-name').val(searchData[0].policy_rule);

	if(searchData[0].random_result != null)
		$('#random-results').val(searchData[0].random_result);

	if(searchData[0].is_date_range != null && searchData[0].is_date_range == 1){
		if(searchData[0].date_range == 1){
			$('#btnYesterday').click()
		} else if(searchData[0].date_range == 7) {
			$('#btnPreviousWeek').click()
		} else if(searchData[0].date_range == 30) {
			$('#btnPreviousMonth').click()
		}
	} else if(searchData[0].is_day_range != null && searchData[0].is_day_range == 1){
		$('#btn-expand-day-range').click()
		if(searchData[0].day_range == 1){
			$('#btnOneDay').click()
		} else if(searchData[0].day_range == 7) {
			$('#btnSevenDay').click()
		} else if(searchData[0].day_range == 30) {
			$('#btnThirtyDay').click()
		} else if(searchData[0].day_range != null) {
			$('#email-day-range').val(searchData[0].day_range)
		}
	} else if(searchData[0].start_date != '' && searchData[0].start_date != null && searchData[0].end_date != '' && searchData[0].end_date != null) {
		let start = searchData[0].start_date
		let end = searchData[0].end_date
		console.log(start)
		$('#email-start-date').val(start)
		$('#email-end-date').val(end)
	}
}
function hasNumber(myString) {
	return /\d/.test(myString);
}

$('.cmp-policy-rule').on('click',function() {
	$.get('/policyHitActivity?id=' + $('#mailId').val(),{
		_csrf: $('#csrf').val()
	},function(data) {
		if(data.length >0) {
			let temp = []
			let cell = []
			data.forEach(function(item,index){
				cell = []
				cell.push(item.policyName,item.hit_type,item.keyword)
				temp.push(cell)
			})
			let html = '<table class="table table-striped" style="border: 1px solid #111" id="table-policyHit"></table>'
			$('.div-policy-hit').html(html)
			$('#table-policyHit').dataTable({
				data: temp,
				columns:[
				{ title: 'Policy Rule' },
				{ title: 'Field' },
				{ title: 'Keyword' }
				],
				"bLengthChange": false,
				"bFilter": false,
				"targets": 'no-sort',
				"bSort": false,
				"pageLength": 25
			})
			$('#table-policyHit_wrapper').css('display','block');
			$('#modalPolicyHit').modal('show')
		}
	})
})