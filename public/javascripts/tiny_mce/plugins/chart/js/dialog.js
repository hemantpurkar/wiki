tinyMCEPopup.requireLangPack();

var ExampleDialog = {
	init : function() {
		var f = document.forms[0];

		// Get the selected contents as text and place it in the input
		//alert('Initialization...');
		f.someval.value = tinyMCEPopup.editor.selection.getContent({format : 'text'});
		f.somearg.value = tinyMCEPopup.getWindowArg('some_custom_arg');
	},

	insert : function() {
		// Insert the contents from the input into the document
		var outputOfChartPlugin = "";
		var noOfRowSets = document.getElementById('chartsTinyMceRowsCount').value;
		var theChartTitle = document.getElementById('chartTitle').value;
		if(!isNaN(new Number(noOfRowSets))){
			if(noOfRowSets>0){
				//Get Rows Values and min max value
				var chartDescriptionsArray = new Array();
				var chartValuesArray = new Array();
				var minValueIs = 0;
				var maxValueIs = 0;
				var countAllNumberValues = -1;
				var rowsSetsNumber = new Number(noOfRowSets);
				for (i=1;i<=rowsSetsNumber;i++){
					if(document.getElementById('somearg'+i).value!=null && document.getElementById('somearg'+i).value!=''){
						if(!isNaN(new Number(document.getElementById('somearg'+i).value))){
							countAllNumberValues = countAllNumberValues + 1;
							chartDescriptionsArray[countAllNumberValues]=document.getElementById('someval'+i).value;
							chartValuesArray[countAllNumberValues]=document.getElementById('somearg'+i).value;
						}
					}
				}
				maxValueIs = Math.max.apply( Math, chartValuesArray );
				minValueIs = Math.min.apply( Math, chartValuesArray );
				//alert('Min = '+maxValueIs);
				//alert('Max = '+minValueIs);
				//alert('Number of Rows = '+countAllNumberValues);
				if(countAllNumberValues>=0){
					var chartsTinyMceWidth = 150;
					if(document.getElementById('chartsTinyMceWidth').value!=null){
						if(!isNaN(new Number(document.getElementById('chartsTinyMceWidth').value))){
							chartsTinyMceWidth = new Number(document.getElementById('chartsTinyMceWidth').value)/2.0;
						}
					}
					var negativeAreaWith = 0;
					var positiveAreaWith = 0;
					if(maxValueIs>0){
						positiveAreaWith = chartsTinyMceWidth;
					}
					if(minValueIs<0){
						negativeAreaWith = chartsTinyMceWidth;
					}
					var theNumberMaxValueIs = new Number(maxValueIs);
					var theNumberMinValueIs = new Number(minValueIs);
					var theNumberMaxValueIsAbs = 0;
					var theNumberMinValueIsAbs = 0;
					if(theNumberMaxValueIs<0){
						theNumberMaxValueIsAbs = - theNumberMaxValueIs;
					}
					else{
						theNumberMaxValueIsAbs = theNumberMaxValueIs;
					}
					if(theNumberMinValueIs<0){
						theNumberMinValueIsAbs = - theNumberMinValueIs;
					}
					else{
						theNumberMinValueIsAbs = theNumberMinValueIs;
					}
					var absoluteMaxValue = 0;
					if(theNumberMaxValueIsAbs>theNumberMinValueIsAbs){
						absoluteMaxValue = theNumberMaxValueIsAbs;
					}
					else{
						absoluteMaxValue = theNumberMinValueIsAbs;
					}
					//alert('Absolute MAX = '+absoluteMaxValue);
					if(absoluteMaxValue==0){
						alert('You inserted Zero Values. As a result no Chart will be created.');
					}
					else{
						var chartBackgroundColor = 'FFFFFF';
						if(document.getElementById('chartsTinyMceBackgroundColor').value!=null){
							if(document.getElementById('chartsTinyMceBackgroundColor').value.length==6){
								chartBackgroundColor = document.getElementById('chartsTinyMceBackgroundColor').value;
							}
						}
						var chartBorderColor = '666666';
						if(document.getElementById('chartsTinyMceBorderColor').value!=null){
							if(document.getElementById('chartsTinyMceBorderColor').value.length==6){
								chartBorderColor = document.getElementById('chartsTinyMceBorderColor').value;
							}
						}
						//Build HTML code
						outputOfChartPlugin = outputOfChartPlugin + '<table border="0" cellspacing="0" cellpadding="0" bgcolor="#'+chartBackgroundColor+'" style="border:1px solid #'+chartBorderColor+'" >';
						outputOfChartPlugin = outputOfChartPlugin + '<tr>';
						outputOfChartPlugin = outputOfChartPlugin + '<td colspan="4" align="center" valign="middle" height="30" style="border-bottom:1px solid #'+chartBorderColor+';"><strong>'+theChartTitle+'</strong></td>';
						outputOfChartPlugin = outputOfChartPlugin + '</tr>';
						for (i=0;i<=countAllNumberValues;i++){
							//alert('row->'+i);
							outputOfChartPlugin = outputOfChartPlugin + '<tr>';
							outputOfChartPlugin = outputOfChartPlugin + '<td height="24" align="right" valign="middle" style="border-right:1px dotted #'+chartBorderColor+';"><span style="margin-right:10px;">'+chartDescriptionsArray[i]+'</span></td>';
							var negativeColor = '006699';
							var positiveColor = 'ff9900';
							if(document.getElementById('chartsTinyMceNegativeColor').value!=null){
								if(document.getElementById('chartsTinyMceNegativeColor').value.length==6){
									negativeColor = document.getElementById('chartsTinyMceNegativeColor').value;
								}
							}
							if(document.getElementById('chartsTinyMcePositiveColor').value!=null){
								if(document.getElementById('chartsTinyMcePositiveColor').value.length==6){
									positiveColor = document.getElementById('chartsTinyMcePositiveColor').value;
								}
							}
							if(chartValuesArray[i]<0){
								outputOfChartPlugin = outputOfChartPlugin + '<td width="'+negativeAreaWith+'" align="right" valign="middle" style="border-right:1px solid #'+chartBorderColor+'">';
								var cellWidth = chartsTinyMceWidth*(-chartValuesArray[i])/absoluteMaxValue;
								//alert('Negative Cell width = '+Math.round(cellWidth));
								outputOfChartPlugin = outputOfChartPlugin + '<table width="'+Math.round(cellWidth)+'" border="0" cellspacing="0" cellpadding="0">';
								outputOfChartPlugin = outputOfChartPlugin + '<tr>';
								outputOfChartPlugin = outputOfChartPlugin + '<td height="14" style="background-color:#'+negativeColor+';"></td>';
								outputOfChartPlugin = outputOfChartPlugin + '</tr>';
								outputOfChartPlugin = outputOfChartPlugin + '</table>';
								outputOfChartPlugin = outputOfChartPlugin + '</td>';
								outputOfChartPlugin = outputOfChartPlugin + '<td width="'+positiveAreaWith+'" align="left" valign="middle">';
								outputOfChartPlugin = outputOfChartPlugin + '</td>';
							}
							if(chartValuesArray[i]>=0){
								outputOfChartPlugin = outputOfChartPlugin + '<td width="'+negativeAreaWith+'" align="right" valign="middle" style="border-right:1px solid #'+chartBorderColor+'">&nbsp;';
								outputOfChartPlugin = outputOfChartPlugin + '</td>';
								outputOfChartPlugin = outputOfChartPlugin + '<td width="'+positiveAreaWith+'" align="left" valign="middle">';
								var cellWidth = chartsTinyMceWidth*chartValuesArray[i]/absoluteMaxValue;
								//alert('Positive Cell width = '+Math.round(cellWidth));
								outputOfChartPlugin = outputOfChartPlugin + '<table width="'+Math.round(cellWidth)+'" border="0" cellspacing="0" cellpadding="0">';
								outputOfChartPlugin = outputOfChartPlugin + '<tr>';
								outputOfChartPlugin = outputOfChartPlugin + '<td height="14" style="background-color:#'+positiveColor+';"></td>';
								outputOfChartPlugin = outputOfChartPlugin + '</tr>';
								outputOfChartPlugin = outputOfChartPlugin + '</table>';
								outputOfChartPlugin = outputOfChartPlugin + '</td>';
							}
							//alert('ending row '+i+'...');
							outputOfChartPlugin = outputOfChartPlugin + '<td align="left" valign="middle"><em style="margin-left:10px; font-size:10px;">'+chartValuesArray[i]+'</em></td>';
							outputOfChartPlugin = outputOfChartPlugin + '</tr>';
						}
					}
					outputOfChartPlugin = outputOfChartPlugin + '</table>';
				}
			}
		}
		//alert('applying content to editor...');
		//alert(outputOfChartPlugin);
		//tinyMCEPopup.restoreSelection();
		//tinyMCEPopup.editor.execCommand('mceInsertContent', false, outputOfChartPlugin);
		tinyMCEPopup.editor.execCommand('mceInsertRawHTML', false, outputOfChartPlugin);
		//Approach 2: tinyMCEPopup.editor.execCommand('mceInsertClipboardContent', false, {content : outputOfChartPlugin});
		//alert('closing...');
		tinyMCEPopup.close();
	}
};

tinyMCEPopup.onInit.add(ExampleDialog.init, ExampleDialog);
