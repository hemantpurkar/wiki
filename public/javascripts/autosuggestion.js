$(function() {
	var availableTags;
	$.ajax({
	    url: "/users/getAllUsers",
	    minLength: 1,
	    delay: 300,
	    data: '',
	    dataType: "json",
	    async : false,
	    success: function (availableTags) {
	    	$(".searchList")
	    	// don't navigate away from the field on tab when selecting an item
	    	.autosize().bind(
	    			"keydown",
	    			function(event) {
	    				if (event.keyCode === $.ui.keyCode.TAB
	    						&& $(this).data("ui-autocomplete").menu.active) {
	    					event.preventDefault();
	    				}
	    	})
	    	.autocomplete({
	    				type : "POST",
	    				minLength : 0,
	    				source : function(request, response) {	    					
	    					// delegate back to autocomplete, but extract the last term
	    					response($.ui.autocomplete.filter(availableTags,
	    							extractLast(request.term)));
	    				},
	    				select : function(event, ui) {
	    					var terms = split(this.value);
	    					// remove the current input
	    					terms.pop();
	    					// add the selected item
	    					terms.push(ui.item.value);
	    					// add placeholder to get the comma-and-space at the end
	    					terms.push("");
	    					this.value = terms.join(", ");
	    					return false;
	    				}
	    	});
	    }
	});
	
	
	function split(val) {
		return val.split(/,\s*/);
	}
	function extractLast(term) {
		return split(term).pop();
	}
});