      var venues = new Array();
      
      function executeUrlRequest(url, httpMethod){
    	  var xmlHttp = new XMLHttpRequest();
    	  xmlHttp.open(httpMethod, url, false);
    	  xmlHttp.send(null);
    	  obj = JSON.parse(xmlHttp.responseText);
    	  return obj;
      }
      
      function fetchVenues(){
    	  url = '/api/venues';
    	  
      	response = executeUrlRequest(url, 'GET');
    	results = response.results;
    	console.log(JSON.stringify(results));
    	if (results.confirmation=='success'){
    		venues = results['venues'];
    		renderVenues();
    		return false;
    	}
    	
    	alert(results['message']);
    	return false;
      }
      
      function renderVenues(){
  		html = '<ol>';
		for (var i=0; i<venues.length; i++){
			venue = venues[i];
			html += '<li><a href="/site/venues/'+venue['id']+'">'+venue['name']+'</a></li>';
		}
		html += '</ol>';
		
		div = document.getElementById('venuelist');
		div.innerHTML = html;
      }
      
      function addVenue(){
    	  
    	  name = document.getElementById('name').value;
    	  if (name.length<2){
    		  alert('Please Enter a Valid Venue Name.');
    		  return false;
    	  }
    	  
    	  address = document.getElementById('address').value;
    	  if (address.length<2){
    		  alert('Please Enter a Valid Venue Address.');
    		  return false;
    	  }
    	  
    	  website = document.getElementById('website').value;
    	  if (website.length<2){
    		  alert('Please Enter a Valid Venue Website.');
    		  return false;
    	  }
    	  
    	  v = {"name":name, "address":address, "website":website};
    	  console.log('Add Venue: '+JSON.stringify(v));
    	  
    	  
      	var xmlHttp = new XMLHttpRequest();
    	var params = "venue="+JSON.stringify(v);
    	xmlHttp.open('POST', '/api/venues', false); 
    	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    	xmlHttp.send(params);

    	obj = JSON.parse(xmlHttp.responseText);
    	results = obj['results'];
    	console.log(JSON.stringify(results));

    	confirmation = results['confirmation'];
    	if (confirmation=='success'){
    		venues = results['venues'];
    		renderVenues();
    		alert('Venue has been added.');
    		
    		document.getElementById('name').value = '';
    		document.getElementById('address').value = '';
    		document.getElementById('website').value = '';
    		return false;
    	}
    	
    	alert(results['message']);
    	return false;
      }
