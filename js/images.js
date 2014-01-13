      var images = new Array();
      
      function executeUrlRequest(url, httpMethod){
    	  var xmlHttp = new XMLHttpRequest();
    	  xmlHttp.open(httpMethod, url, false);
    	  xmlHttp.send(null);
    	  obj = JSON.parse(xmlHttp.responseText);
    	  return obj;
      }
      
    	function select(index){
			parent = window.opener;
			if (!parent)
	      		return true;
			
			image = images[index];
			parent.selectIcon(image['id']); // pass back the uniqueId of the image
      		window.close();
      		return false;
      	}
      
      
      function fetchImages(){
    	  url = '/api/images';
    	  
      	response = executeUrlRequest(url, 'GET');
    	results = response.results;
    	console.log(JSON.stringify(results));
    	if (results.confirmation=='success'){
    		images = results['images'];
    		
    		list = '<ol>';
    		for (var i=0; i<images.length; i++){
    			image = images[i];
    			list += '<li><div style="background-color:#999;border-radius:3px;text-align:center;padding:5px;margin-top:5px"><a onclick="return select('+i+');" target="_blank" href="/site/images/'+image['id']+'"><img src="'+image['address']+'=s120-c" /></a><br /><span style="color:#fff">Image ID: '+image['id']+'</span></div></li>';
    		}
    		list += '</ol>';
    		document.getElementById('imagesbox').innerHTML = list;
    		return false;
    	}
    	
    	alert(results['message']);
    	return false;
      }
      
