      var venue = {};
      
      function executeUrlRequest(url, httpMethod){
    	  var xmlHttp = new XMLHttpRequest();
    	  xmlHttp.open(httpMethod, url, false);
    	  xmlHttp.send(null);
    	  obj = JSON.parse(xmlHttp.responseText);
    	  return obj;
      }
      
      function fetchVenue(id){
    	  url = '/api/venues/'+id;
    	  
      	response = executeUrlRequest(url, 'GET');
    	results = response.results;
    	console.log(JSON.stringify(results));
    	if (results.confirmation=='success'){
    		venue = results['venue'];
    		
          	var keys = Object.keys(venue);
          	for (var i=0; i<keys.length; i++){
          		key = keys[i];
          		document.getElementById(key).value = venue[key];
          	}

    		return false;
    	}
    	
    	alert(results['message']);
    	return false;
      }
      
      function updateVenue(){
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
    	  
    	  // update venue info:
    	  venue['name'] = name;
    	  venue['address'] = address;
    	  venue['website'] = website;
    	  console.log('update venue: '+JSON.stringify(venue));
    	  
    	  
    	  var xmlHttp = new XMLHttpRequest();
    	  var params = "venue="+JSON.stringify(venue);
    	  xmlHttp.open('PUT', '/api/venues/'+venue["id"], false);
    	  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    	  xmlHttp.send(params);

    	  obj = JSON.parse(xmlHttp.responseText);
    	  results = obj['results'];
    	  console.log(JSON.stringify(results));

    	  confirmation = results['confirmation'];
    	  if (confirmation=='success'){
    		  venue = results['venue'];
    		  
    		  alert('Venue has been updated.');
    		  return false;
    	  }
    	  
    	  alert(results['message']);
    	  return false;
      }
      
