var App = App || {};

App.Pager = function(
	_,
	promise,
	api) {

	var totalPages;
	var pageNumber;
	var searchParams;
	var url;

	function init(args) {
		url = args.url;

		setSearchParams(args.searchParams);
		if (typeof(args.page) !== 'undefined') {
			setPage(args.page);
		} else {
			setPage(1);
		}
	}

	function getPage() {
		return pageNumber;
	}

	function prevPage() {
		if (pageNumber > 1) {
			setPage(pageNumber - 1);
		}
	}

	function nextPage() {
		if (pageNumber < totalPages) {
			setPage(pageNumber + 1);
		}
	}

	function setPage(newPageNumber) {
		pageNumber = parseInt(newPageNumber);
		if (!pageNumber || isNaN(pageNumber)) {
			throw new Error('Trying to set page to a non-number (' + newPageNumber + ')');
		}
	}

	function getSearchParams() {
		return searchParams;
	}

	function setSearchParams(newSearchParams) {
		setPage(1);
		searchParams = newSearchParams;
	}

	function retrieve() {
		return promise.make(function(resolve, reject) {
			promise.wait(
				api.get(url, _.extend({}, searchParams, {page: pageNumber})))
					.then(function(response) {
						var pageSize = response.json.pageSize;
						var totalRecords = response.json.totalRecords;
						totalPages = Math.ceil(totalRecords / pageSize);

						resolve({
							entities: response.json.data,
							totalRecords: totalRecords});

					}).fail(function(response) {
						reject(response);
					});
		});
	}

	function getVisiblePages() {
		var pages = [1, totalPages || 1];
		var pagesAroundCurrent = 2;
		for (var i = -pagesAroundCurrent; i <= pagesAroundCurrent; i ++) {
			if (pageNumber + i >= 1 && pageNumber + i <= totalPages) {
				pages.push(pageNumber + i);
			}
		}
		if (pageNumber - pagesAroundCurrent - 1 === 2) {
			pages.push(2);
		}
		if (pageNumber + pagesAroundCurrent + 1 === totalPages - 1) {
			pages.push(totalPages - 1);
		}

		return pages.sort(function(a, b) { return a - b; }).filter(function(item, pos) {
			return !pos || item !== pages[pos - 1];
		});
	}

	return {
		init: init,
		getPage: getPage,
		prevPage: prevPage,
		nextPage: nextPage,
		setPage: setPage,
		getSearchParams: getSearchParams,
		setSearchParams: setSearchParams,
		retrieve: retrieve,
		getVisiblePages: getVisiblePages,
	};

};

App.DI.register('pager', ['_', 'promise', 'api'], App.Pager);
