divMailClick();
$('#edit-tags').select2();
$('#loading').hide();
if(location.pathname == "/search/queue")
	$('#export-nav').css('display','none')
else
	$('#export-nav').css('display','block')

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

$('#btn-criteria').on('click',function() {
	$('#modalCriteria').modal('show');
})

// $('#modalMail').on('hide.bs.modal',function() {
// });

// $('.random-link').on('click',function() {
// 	window.location = '/search/queue?id='+$(this).attr('id')
// 	// $('.emails').html('');
// 	// $.post('/home',{
// 	// 	_csrf: $('#csrf').val(),
// 	// },function(data) {
// 	// 	search(data);
// 	// })
// })

// function search(data) {
// 	if(data.length > 0)  {
// 		let html = '<div class="table-responsive">';
// 		html += '<table class="table table-striped table-bordered table-borderd dataTable" id="table-emails">';
// 		html += '<thead><tr><th style="min-width: 180px;">From</th><th style="min-width: 180px; max-width:150px;">To</th><th style="min-width: 120px;">Date</th><th>Subject</th></tr></thead>';
// 		html += '<tbody>';
// 		data.forEach(function(item,index) {
// 			html += "<tr id="+ item.messageID +"><td>"+ item.From +"</td><td>"+ item.To +"</td><td>"+ formatDate(item.Date) +"</td><td>"+ item.Subject +"</td></tr>"
// 		})
// 		html +='</tbody></table></div>'
// 		$('.emails').html(html);

// 		$('#table-emails tbody tr').on('click',function () {
// 			if($(this).attr('id') != undefined) {
// 				mailBody($(this).attr('id'));
// 			}
// 		});
// 		$('#table-emails').DataTable({
// 			"aoColumns": [
// 			null,
// 			null,
// 			{"sType": "date"},  //  "sType": "date" TO SPECIFY SORTING IS APPLICABLE ON DATE
// 			null
// 			],
// 			"pageLength": '25'
// 		});
// 	} else {
// 		$('.emails').html('')
// 	}
// }

function mailBody(id) {
	$.post('/mailbody',{
		id: id,
		_csrf: $('#csrf').val()
	},function(data) {
		let mailData = data[0];
		let attachments = data[1];
		let tags = data[2];
		let review_violation = data[3];
		let keywordHit = data[5]
		tempKeywordHit.forEach(function(item){
			keywordHit.push(item)
		})
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
		$('.mail-body').removeClass('display-none')
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

$('#table-historyList tbody tr').on('click',function () {
	if($(this).attr('id') != undefined) {
		window.location.href = "/search/history?id=" + $(this).attr('id');
	}
});

function funSavedSearch(element) {
	let savedId = $(element).parent().attr('id')
	var validateFlag = validate('#start-'+savedId,'#end-'+ savedId)
	if(savedId != undefined && validateFlag) {
		let start = $('#start-'+ savedId).val() == '' ? '' : new Date($('#start-'+ savedId).val()).getTime()
		let end = $('#end-'+ savedId).val() == '' ? '' : new Date($('#end-'+ savedId).val()).getTime()
		window.location.href = "/search/saved?id=" + savedId +'&start='+ start +'&end='+end
	}
}

// $('#table-savedSearchList tbody tr td:nth-child(4)').on('click',function () {
// 	console.log('1')
// 	let savedId = $(this).parent().attr('id')
// 	var validateFlag = validate('#start-'+savedId,'#end-'+ savedId)
// 	if(savedId != undefined && validateFlag) {
// 		let start = $('#start-'+ savedId).val() == '' ? '' : new Date($('#start-'+ savedId).val()).getTime()
// 		let end = $('#end-'+ savedId).val() == '' ? '' : new Date($('#end-'+ savedId).val()).getTime()
// 		window.location.href = "/search/saved?id=" + savedId +'&start='+ start +'&end='+end
// 		// let type = $(this).attr('data-type')
// 		// let interval = $(this).attr('data-interval')
// 		// $(function() {
// 		// 	let html = '<form action="/search/saved" method="post">'
// 		// 	html += '<input type="hidden" name="savedId" value="'+ savedId +'"></input>'
// 		// 	html += '<input type="hidden" name="type" value="'+ type +'"></input>'
// 		// 	html += '<input type="hidden" name="interval" value="'+ interval +'"></input>'
// 		// 	html += '<input type="hidden" name="start-date" value="'+ $('#start-'+ savedId).val()+'"></input>'
// 		// 	html += '<input type="hidden" name="end-date" value="'+$('#end-'+ savedId).val()+'"></input>'
// 		// 	html += '<input type="hidden" id="csrf" name="_csrf" value="'+$('#csrf').val()+'">'
// 		// 	html += '</form>'
// 		// 	console.log(html)
// 		// 	$(html).appendTo('body').submit().remove();
// 		// });
// 		// $.get("/search/saved?id=" + $(this).attr('id'),{
// 		// 	_csrf: $('#csrf').val(),
// 		// 	type: $(this).attr('data-type'),
// 		// 	interval: $(this).attr('data-interval')
// 		// },function(date){})
// 		// $().redirect("/search/saved?id=" + $(this).attr('id'),{})
// 	}
// });

// $('#table-history-search tbody tr').on('click',function () {
// 	if($(this).attr('id') != undefined) {
// 		mailBody($(this).attr('id'));
// 	}
// });

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
	$('.policy-rule').css('display','none')
	$('.cmp-policy-rule').html('')

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

	$('.cmb-display').addClass('display-none')
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
	location.href = '/refine?id='+ $('#searchId').val() + '&type='+ $('#searchId').attr('search-flag')
})

function changeAll(a)
{
	$(".nav-link-head").removeClass("active");
	$("#"+a).addClass("active");
	if(a=="queues-search")
	{
		$(".div-saved-search").hide()
		$(".div-queues-search").show()
	}
	if(a=="saved-search")
	{
		$(".div-queues-search").hide()
		$(".div-saved-search").show()
	}
}

$('#table-historyList tbody tr td:nth-child(1)').each(function(i,e){
	var datetime = $(this).html();
	$(this).html(formatDate(Number(datetime)))
})

// $('#table-savedSearchList tbody tr td:nth-child(3)').each(function(i,e){
// 	var datetime = $(this).html();
// 	$(this).html(formatDate(Number(datetime)))
// })

$('.cmp-dateTime').each(function(i,e){
	var datetime = $(this).html();
	$(this).html(formatDate(Number(datetime)))
})

$('#btn-save-exports').on('click',function() {
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
})

$('#modalExport').on('hide.bs.modal',function() {
	$('#export-name').val('');
});
$('#modalExportAll').on('hide.bs.modal',function() {
	$('#export-name-all').val('');
});

$('#btn-save-all-exports').on('click',function() {
	let exportName = $('#export-name-all').val();
	let emailList = []
	$('.exportSelect:checkbox').each(function() {
		// $(this).prop('checked',true)
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
})

$('#save-zip-password').on('click',function() {
	$.confirm({
		type: 'blue',
		title: 'Confirm',
		content: 'Save zip Password ?',
		scrollToPreviousElement: false,
		buttons: {
			confirm: {
				btnClass: 'btn-info',
				action: function() {
					$.post('/profile',{
						_csrf: $('#csrf').val(),
						zipPassword: $('#zip-password').val()
					},function(data) {
					})
				}
			},
			cancel: {
				btnClass: 'btn-red',
			}
		}
	});
})

$('#table-exportMailList tbody tr td:nth-child(2)').each(function(i,e){
	var datetime = $(this).html();
	$(this).html(formatDate(Number(datetime)))
})

function zipDelete(exportId) {
	$.post('/exportMail/deleteList',{
		_csrf: $('#csrf').val(),
		zipId: exportId
	},function(data){
		$('#table-exportMailList tr#'+exportId).remove();
	})
}

// $('#btn-zip-download').on('click',function() {
// 	let exportId= $(this).attr('zip-idd');
// 	$.get('/exportMail/list',{
// 		_csrf: $('#csrf').val(),
// 		id: exportId
// 	},function(data){
// 	})
// })

$('#create-external-user').on('click',function() {
	$('#modalExternalUser').modal('show')
})
$('#btn-save-external-user').on('click',function() {
	$.confirm({
		type: 'blue',
		title: 'Confirm',
		content: 'Create User ?',
		scrollToPreviousElement: false,
		buttons: {
			confirm: {
				btnClass: 'btn-info',
				action: function() {
					createExternalUser()
				}
			},
			cancel: {
				btnClass: 'btn-red',
			}
		}
	});	
})

function createExternalUser() {
	var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
	if($('#external-first-name').val() == '') {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Insert First Name',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	} else if($('#external-last-name').val() == '') {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Insert Last Name',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	} else if($('#external-email').val() == '') {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Insert Email',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	} else if(!testEmail.test($('#external-email').val())) {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Invalid Email Address',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	} else {
		$('#modalExternalUser').modal('hide')
		$.post('/admin',{
			_csrf: $('#csrf').val(),
			firstName: $('#external-first-name').val(),
			lastName: $('#external-last-name').val(),
			email: $('#external-email').val()
		},function(data) {
		})
	}
}

$('#table-reviewQueueList tbody tr td:nth-child(1)').on('click',function () {
	if($(this).parent().attr('id') != undefined) {
		window.location.href = "/search/queue?id=" + $(this).parent().attr('id');
	}
});

$('#table-reviewQueueList tbody tr td:nth-child(2)').on('click',function () {
	if($(this).parent().attr('id') != undefined) {
		$.get('/queue',{
			_csrf: $('#csrf').val(),
			queueId: $(this).parent().attr('id')
		},function(data) {
			$('#queue-idd').val(data.queue_ID)
			$('#queue-name').val(data.queue_name)
			$('#queue-reviewer').val(data.queue_reviewer)
			if(data.queue_type == 'review') {
				$('#queue-type-review').click();
				$('#queue-frequency').val(data.queue_frequency)
				$('#queue-size').val(data.queue_size)
				$('#allow-escalation-yes').click()
				if(data.allowEscalation == 'true'){
					$('#escalation-queue').val(data.queue_escalation)
				} else {
					$('#allow-escalation-no').click()
				}
			} else {
				$('#queue-type-escalation').click()
			}

			$('#modalQueue').modal('show');
		})
	}
});


$('#email-export-search').on('click',function() {
	var start = $('#export-start-date').val()
	var end = $('#export-end-date').val()
	if(new Date(start).getTime() > new Date(end).getTime()){
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
	} else if($('#export-start-date').val() == '' || $('#export-end-date').val() == '') {
		$.alert({
			icon: 'fa fa-warning',
			title:'Warning',
			content:'Insert Correct Date',
			type: 'orange',
			buttons: {
				warning: {
					text: 'Close'
				}
			}
		});
	} else {
		$('#modalListExport').modal('show')
	}
})

$('#modalListExport').on('hide.bs.modal',function() {
	$('#export-list-name').val('');
});


function createExport() {
	let exportName = $('#export-list-name').val();
	$.confirm({
		type: 'blue',
		title: 'Confirm',
		content: 'Save Export List?',
		scrollToPreviousElement: false,
		buttons: {
			confirm: {
				btnClass: 'btn-info',
				action: function() {
					$('#modalListExport').modal('hide')
					if( exportName == '') {
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
						$.post('/exportMail/list',{
							_csrf: $('#csrf').val(),
							betweenDate: $('#export-start-date').val().replace(/-/g, '/') +' - '+ $('#export-end-date').val().replace(/-/g, '/'),
							exportName: exportName
						},function(data) {
							location.href=location.href;
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

$('#table-externalUsers tbody tr td:nth-child(4)').on('click',function () {
	if($(this).parent().attr('id') != undefined) {
		let externalUser = $(this).parent().attr('id') 
		$.post('/admin/delete',{
			_csrf: $('#csrf').val(),
			externalUser: externalUser
		},function(data){
			$('#table-externalUsers tr#'+externalUser).remove();
		})
	}
});

// $('#table-savedSearchList tbody tr td:nth-child(4)').on('click',function (e) {
// 	e.stopPropagation();
// 	if($(this).parent().attr('id') != undefined) {
// 		let id = $(this).parent().attr('id') 
// 		$.post('/search/saved/delete',{
// 			_csrf: $('#csrf').val(),
// 			id: id
// 		},function(data){
// 			$('#table-savedSearchList tr#'+id).remove();
// 		})
// 	}
// });

function deleteSearch(e) { 
	$.post('/search/saved/delete',{
		_csrf: $('#csrf').val(),
		id: $(e.target).parent().parent().attr('id')
	},function(data){
		$(e.target).parent().parent().remove()
	})
}
document.addEventListener('click', (e) => {
	if (e.target.classList.contains('delete-search')) {
		$.confirm({
			type: 'blue',
			title: 'Confirmation',
			content: 'Do you Want to Delete Saved Search ?',
			scrollToPreviousElement: false,
			buttons: {
				confirm: {
					btnClass: 'btn-info',
					action: function() {
						deleteSearch(e);
					}
				},
				cancel: {
					btnClass: 'btn-red',
				}
			}
		});
		e.stopPropagation();
	}
}, true);

document.addEventListener('click', (e) => {
	if (e.target.classList.contains('saved-search-date')) {
		e.stopPropagation();
	}
}, true);

function decodeHtmlEntity (str) {
	return str.replace(/&#(\d+);/g, function(match, dec) {
		return String.fromCharCode(dec);
	});
};

if(typeof savedSearchList !== 'undefined') {
	let str = decodeHtmlEntity(savedSearchList)
	let obj1 = JSON.parse(str)
	console.log(str)
	console.log(obj1)
	obj1.forEach(function(item){
		if(item.is_day_range != null && item.is_day_range == 1){
			if(item.day_range != null && item.day_range != 0) {
				emailDays = Number(item.day_range);
				let date = new Date();
				let startDate = new Date(date.setDate(new Date().getDate() - emailDays)).setHours(0,0,1)
				let endDate = new Date(new Date().setDate(new Date().getDate() - 1)).setHours(23,59,59)
				$('#start-'+item.searchID).val(convertToDate(startDate))
				$('#end-'+item.searchID).val(convertToDate(endDate))
				$('#start-'+item.searchID).parent().parent().attr('data-type','dayRange')
				$('#start-'+item.searchID).parent().parent().attr('data-interval',emailDays)
			}
		} else if(item.is_date_range != null && item.is_date_range == 1) {
			if(item.date_range != null && item.date_range == 1) {
				const yesterday = new Date()
				yesterday.setDate(yesterday.getDate() - 1)
				let endDate = new Date(yesterday).setHours(23,59,59)
				let startDate = new Date(yesterday).setHours(0,0,1)
				$('#start-'+item.searchID).val(convertToDate(startDate))
				$('#end-'+item.searchID).val(convertToDate(endDate))
				$('#start-'+item.searchID).parent().parent().attr('data-type','dateRange')
				$('#start-'+item.searchID).parent().parent().attr('data-interval',item.date_range)
			} else if(item.date_range != null && item.date_range == 7) {
				let date = new Date();
				let endDate = new Date(date.setTime(date.getTime() - (date.getDay() ? date.getDay() : 7) * 24 * 60 * 60 * 1000)).setHours(23,59,59)
				let startDate = new Date(date.setTime(date.getTime() - 6 * 24 * 60 * 60 * 1000)).setHours(0,0,1)
				$('#start-'+item.searchID).val(convertToDate(startDate))
				$('#end-'+item.searchID).val(convertToDate(endDate))
				$('#start-'+item.searchID).parent().parent().attr('data-type','dateRange')
				$('#start-'+item.searchID).parent().parent().attr('data-interval',item.date_range)
			} else if(item.date_range != null && item.date_range == 30) {
				let date = new Date();
				let endDate = new Date(date.setDate(0)).setHours(23,59,59)
				let startDate = new Date(date.setDate(1)).setHours(0,0,1)
				$('#start-'+item.searchID).val(convertToDate(startDate))
				$('#end-'+item.searchID).val(convertToDate(endDate))
				$('#start-'+item.searchID).parent().parent().attr('data-type','dateRange')
				$('#start-'+item.searchID).parent().parent().attr('data-interval',item.date_range)
			}
		} else if(item.start_date != null && item.start_date != '' && item.end_date != null && item.end_date != '') {
			let startDate = new Date(item.start_date)
			let endDate = new Date(item.end_date)
			$('#start-'+item.searchID).val(convertToDate(startDate))
			$('#end-'+item.searchID).val(convertToDate(endDate))
		}
		console.log(item.start_date)
	})
}

function hasNumber(myString) {
	return /\d/.test(myString);
}

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

$('.saved-search-date').on('change',function(){
	$(this).parent().parent().attr('data-type','')
	$(this).parent().parent().attr('data-interval','')
})

function validate(startDate,endDate) {
	var start = $(startDate).val()
	var end = $(endDate).val()
	var validateFlag = false

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
		validateFlag = false;
	} else if(start == '' &&  end != '') {
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
		validateFlag = false;
	} else if(start != '' &&  end == '') {
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
		validateFlag = false;
	} else {
		validateFlag = true;
	}
	return validateFlag;
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

		$('#loading').hide();
	})
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
var tempKeywordHit = []
if(typeof tempList !== 'undefined') {
	let str1 = decodeHtmlEntity(tempList)
	tempKeywordHit = JSON.parse(str1)
}