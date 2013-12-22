	var categories = new Array();

	function executeUrlRequest(url, httpMethod){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open(httpMethod, url, false);
		xmlHttp.send(null);
		obj = JSON.parse(xmlHttp.responseText);
		return obj;
	}
	
	function fetchCatgories(){
		url = '/api/categories';
		response = executeUrlRequest(url, 'GET');
		results = response['results'];
		confirmation = results['confirmation'];
		if (confirmation=='success'){
			categories = results['categories'];
			console.log(JSON.stringify(categories));
			
			renderCategories();
			return;
		}
		
		alert(results['message']);
	}
	
	function renderCategories(){
		categoriesList = '<ol>';
		for (var i=0; i<categories.length; i++){
			category = categories[i];
			categoriesList += '<li><a href="/site/categories/'+category['id']+'">'+category['name']+'</a></li>';
		}
		categoriesList += '</ol>';
		document.getElementById('categoriesList').innerHTML = categoriesList;
	}
	
    function processTime(time){
    	date = moment(new Date(time)).format('MMM D, h:mma');
    	return date;
    }
    
    function addCategory(){
  	  name = document.getElementById('name').value;
	  if (name.length<2){
		  alert('Please Enter a Valid Category Name.');
		  return false;
	  }
	  
	  c = {"name":name};
	  console.log('Add Category: '+JSON.stringify(c));
	  
  	var xmlHttp = new XMLHttpRequest();
	var params = "category="+JSON.stringify(c);
	xmlHttp.open('POST', '/api/categories', false); 
	xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlHttp.send(params);

	obj = JSON.parse(xmlHttp.responseText);
	results = obj['results'];
	console.log(JSON.stringify(results));

	confirmation = results['confirmation'];
	if (confirmation=='success'){
		categories = results['categories'];
		
		renderCategories();
		alert('Category has been added.');
		
		document.getElementById('name').value = '';
		return false;
	}
	
	alert(results['message']);
	return false;
    	
    }
    
