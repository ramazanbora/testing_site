function convertJsonToHtmlTable(countryCode, tableCode, tableType,moduleType="country",module="RI") {
	//Get the headers from JSON data
	var dataTableFiltered = {};
	var table = document.getElementById(tableCode);
	if (tableType == 'region_group' && moduleType=="country") {
		dataTableFiltered = $.grep(region_group_merged, function(n, i) {
			return n.CODE_WB === countryCode;
		});
		
		if (dataTableFiltered.length == 0) {
			table.innerHTML = 'no table found for country '+ countryCode;
			return;
		}
		
	} else if (tableType == 'region_group' && moduleType =="region") {
		dataTableFiltered = $.grep(region_country_list, function(n, i) {
			return n.REGION_CODE === countryCode;
		});
		
		if (dataTableFiltered.length == 0) {
			table.innerHTML = 'no table found for region '+ countryCode;
			return;
		}
		
	} else if (tableType == 'participation') {
		dataTableFiltered = $.grep(region_country_details, function(n, i) {
			return n.CODE_WB == countryCode && n.D_BENCHC == '1';
		});

		if (dataTableFiltered.length == 0) {
			table.innerHTML = 'Note: Country did not participate in any of the International Comparisons Programs.';
			return;
		}
		
		dataTableFiltered = dataTableFiltered.map(({CODE_WB, COUNTRY,YEAR}) => ({CODE_WB, COUNTRY,YEAR}));
		
	} else if (tableType == 'currency') {
		dataTableFiltered = $.grep(currency_iso, function(n, i) {
			return n.CODE_WB === countryCode;
		});

		if (dataTableFiltered.length == 0) {
			table.innerHTML = 'no participation';
			return;
		}
	} else if (tableType == 'place_notes' && moduleType=="country") {
		dataTableFiltered = $.grep(place_notes, function(n, i) {
			return n.CODE_WB === countryCode;
		});

		if (dataTableFiltered.length == 0) {
			table.innerHTML = 'No table found.';
			return;
		}
	} else if (tableType == 'place_notes' && moduleType=="region") {
		dataTableFiltered = $.grep(place_notes, function(n, i) {
			return n.REGION_CODE === countryCode;
		});

		if (dataTableFiltered.length == 0) {
			table.innerHTML = 'No table found.';
			return;
		}
	}



	var headers = Object.keys(dataTableFiltered[0]);

	var headerRowHTML = '<tr>';
	for (var i = 0; i < headers.length; i++) {
		headerRowHTML += '<th>' + headers[i] + '</th>';
	}
	headerRowHTML += '</tr>';

	var allRecordsHTML = '';
	for (var i = 0; i < dataTableFiltered.length; i++) {

		allRecordsHTML += '<tr>';
		for (var j = 0; j < headers.length; j++) {
			var header = headers[j];
			allRecordsHTML += '<td>' + dataTableFiltered[i][header] + '</td>';
		}
		allRecordsHTML += '</tr>';

	}

	//Append the table header and all records
	table.innerHTML = '<table>' + headerRowHTML + allRecordsHTML + '</table>';
	
	if (tableType == 'region_group') {
		table.innerHTML = '<table>' + headerRowHTML + allRecordsHTML + '</table>'+'*Classification is based on the year 2019.';
	} else {
		table.innerHTML = '<table>' + headerRowHTML + allRecordsHTML + '</table>';
	}
	
}


function createPopChart(countryCode,chartCode,moduleType="country",module="RI"){
	var dataTableFiltered = {};
	
	if (moduleType == "country"){
		dataTableFiltered = $.grep(region_country_details, function(n, i) {
			return n.CODE_WB === countryCode;
		});
	} else if (moduleType == "region"){
		dataTableFiltered = $.grep(region_country_details, function(n, i) {
			return n.REGION_CODE === countryCode;
		});
	}
	
	
	
	var YEAR = dataTableFiltered.map(employee => employee.YEAR);
	var POPULATION = dataTableFiltered.map(employee => employee.POPULATION);
	POPULATION = POPULATION.map(POPULATION => {return POPULATION/1000000});
	createPopChartBuild(chartCode,YEAR,POPULATION);
}



function createPopChartBuild(chartName,xValues,yValues){

new Chart(chartName, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,1.0)",
      borderColor: "rgba(0,0,255,0.1)",
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    scales: {
  		yAxes: [{
  		      scaleLabel: {
  		        display: true,
  		        labelString: 'Population in Millions'
  		      }
      }]
    }
  }
});
}




function createGiniChart(countryCode,chartCode){
	var dataTableFiltered = {};
	dataTableFiltered = $.grep(gini, function(n, i) {
		return n.CODE_WB === countryCode;
	});
	
	var YEAR = dataTableFiltered.map(employee => employee.YEAR);
	var GINI = dataTableFiltered.map(employee => employee.GINI);
	//var xyValues = dataTableFiltered.map(employee => employee.GINI);
	var xyValues = dataTableFiltered.map(({YEAR, GINI}) => ({YEAR, GINI}));
	xyValues = xyValues.map(({YEAR, GINI}) => ({x: YEAR, y: GINI}));
	//createChart(chartCode,YEAR,GINI);
	createGiniChartBuild(chartCode,xyValues);
}



function createGiniChartBuild(chartName,xyValues){

new Chart(chartName, {
  type: "scatter",
    data: {
      datasets: [{
        pointRadius: 4,
		showLine: true,
		fill: false,
        pointBackgroundColor: "rgba(0,0,255,1)",
        data: xyValues
      }]
    },
  options: {
    legend: {display: false},
    scales: {
      // yAxes: [{ticks: {min: 0, max:400},}],
    }
  }
});
}



function createXRChart(countryCode,chartCode){
	var dataTableFiltered = {};
	dataTableFiltered = $.grep(region_country_details, function(n, i) {
		return n.CODE_WB === countryCode;
	});
	
	var YEAR = dataTableFiltered.map(employee => employee.YEAR);
	var XR = dataTableFiltered.map(employee => employee.XR);
	createXRChartBuild(chartCode,YEAR,XR);
	console.log(YEAR)
}




function createXRChartBuild(chartName,xValues,yValues){

new Chart(chartName, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,1.0)",
      borderColor: "rgba(0,0,255,0.1)",
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    scales: {
  		
    }
  }
});
}