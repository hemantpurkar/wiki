// pagination functionality
var limit = 5;
var paginate = function(pager, callback) {
	var start = 0;
	pager.limit = limit;
	var cssClass;	
		
	totalPages = parseInt(Math.ceil(pager.count / limit));
	if (pager.requested_page) {
		currPage = pager.requested_page;

		if (currPage > 0 && currPage <= totalPages) {
			start = (currPage - 1) * limit;
			end = start + limit;
		} else {
			start = 0;
			end = limit;
		}
	} else {
		// if page isn't set, show first set of results
		start = 0;
		end = limit;
	}

	// display pagination
	page = parseInt(pager.requested_page);
	pager.currPage = start;
	if (page <= 0)
		page = 1;

	// previous
	if (page >= 2) {
		prev = page - 1;
		pager.pager_view += " <a href="+ pager.pager_url + prev + "> Prev </a>";
	}

	pmin = (page > 2) ? (page - 2) : 1;
	pmax = (page < (totalPages - 2)) ? (page + 2) : totalPages;
	
	for (i = pmin; i <= pmax; i++) {
		if (i == page) {		
			pager.pager_view += " <a href='' class='page active'>" + i + "</a>";
		} else {
			cssClass = 'page';
			pager.pager_view += " <a href="+ pager.pager_url + i + " class='page'>" + i + "</a>";
		}
	}

	if (page < (totalPages - 2)) {
		pager.pager_view += " <a href="+ pager.pager_url + totalPages + " class='page'>" + totalPages + "</a>";
	}
	// next
	if (page < totalPages) {		
		page = page + 1;
		pager.pager_view += " <a href=" + pager.pager_url + page + "> Next </a>";
	}
	callback(null, pager, start);
}

exports.paginate = paginate;
