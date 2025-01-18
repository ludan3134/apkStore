package ap

import "math"

func SlicePage(currentPageIndex, pageLimit, totalRecords int) (sliceStart, sliceEnd int) {
	if currentPageIndex < 0 {
		currentPageIndex = 1
	}

	if pageLimit < 0 {
		pageLimit = 20
	}

	if pageLimit > totalRecords {
		return 0, totalRecords
	}

	// 总页数
	totalPages := int(math.Ceil(float64(totalRecords) / float64(pageLimit)))
	if currentPageIndex > totalPages {
		return 0, 0
	}
	sliceStart = (currentPageIndex - 1) * pageLimit
	sliceEnd = sliceStart + pageLimit

	if sliceEnd > totalRecords {
		sliceEnd = totalRecords
	}
	return sliceStart, sliceEnd
}
