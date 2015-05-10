$(function() {
   $("#sel_case")
	  .change(function( event ) {
		 dataFile=$("#sel_case").val();
		 dataLabel=$("#sel_case option:selected").text();
		 console.log('you wanna see '+dataFile+'?');
		 updateData(dataFile)
		});
});