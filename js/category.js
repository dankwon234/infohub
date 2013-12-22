	var category = {}
	var subcategories = new Array();

	function executeUrlRequest(url, httpMethod){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open(httpMethod, url, false);
		xmlHttp.send(null);
		obj = JSON.parse(xmlHttp.responseText);
		return obj;
	}
	
	function fetchCatgory(categoryId){
		url = '/api/categories/'+categoryId;
		response = executeUrlRequest(url, 'GET');
		results = response['results'];
		confirmation = results['confirmation'];
		if (confirmation=='success'){
			category = results['category'];
			console.log(JSON.stringify(category));
			
			renderCategory();
			fetchSubcategories();
			return;
		}
		
		alert(results['message']);
	}
	
	function renderCategory(){
		document.getElementById('categoryname').innerHTML = category['name'];
		
		subcategoriesTpl = $('#subcategoriesTpl').html();
		currentSubcategories = category['subcategories'];
		subcategoriesList = '';
		for (var i=0; i<currentSubcategories.length; i++){
			subcategory = currentSubcategories[i];
//			subcategoriesList += '<li><a onclick="return fetchProviders('+i+');" style="color:#ea503d; "href="#">'+subcategory['name']+'</a></li>';
			subcategoriesList += '<tr><td><a onclick="return fetchProviders('+i+');" style="color:#ea503d; "href="#">'+subcategory['name']+'</a></td><td>remove</td></tr>';
		}
//		subcategoriesList += '</ol>';
		subcategoriesTpl = subcategoriesTpl.replace("{{subcategoriesList}}", subcategoriesList);
		
		document.getElementById('categorydiv').innerHTML = subcategoriesTpl;
	}
	
    function processTime(time){
    	date = moment(new Date(time)).format('MMM D, h:mma');
    	return date;
    }
    
    function fetchProviders(index){
		subcategories = category['subcategories'];
		subcategory = subcategories[index];
    	console.log('FETCH PROVIDERS: '+JSON.stringify(subcategory));
    	
    	//{"id":"GSqJDHnMlG","providers":["8XNIFEESkh","AzXDqVnTng","CJ6Ce5sCs7","HJJXPLqMqD","xMXN4c9wVB"],"name":"headlines"}
    	providers = subcategory['providers'];
    	if (providers.length==0){
    		alert(subcategory['name']+' has no providers.');
    		return false;
    	}
    	
    	
    	ids = '';
    	for (var i=0; i<providers.length; i++){
    		id = providers[i];
    		ids += id;
    		if (i != providers.length-1)
    			ids += ',';
    	}
    	
    	url = '/api/providers?ids='+ids;
    	response = executeUrlRequest(url, 'GET');
    	
		results = response['results'];
    	console.log('FETCH PROVIDERS: '+JSON.stringify(results));
		confirmation = results['confirmation'];
		if (confirmation=='success'){
			providers = results['providers'];
			return false;
		}
		
		alert(results['message']);
    	return false;
    }
    
	function fetchSubcategories(){
    	url = '/api/subcategories';

		response = executeUrlRequest(url, 'GET');
		results = response['results'];
		confirmation = results['confirmation'];
		if (confirmation=='success'){
			subcategories = results['subcategories'];
			console.log(JSON.stringify(results));
			
			list = '';
			for (var i=0; i<subcategories.length; i++){
				sub = subcategories[i];
				list += '<tr><td>'+sub['name']+'</td><td><a onclick="return addSubcategory('+i+');" href="#">add</a></td></tr>';
			}
			document.getElementById('subcategoriesTable').innerHTML = list;
			return;
		}
		
		alert(results['message']);
		return;
	}
	
	function addSubcategory(index){
		sub = subcategories[index];
		console.log('ADD SUBCATEGORY: '+JSON.stringify(sub));
		
		currentSubcategories = category['subcategories'];
		currentSubcategories.push(sub);
		category['subcategories'] = currentSubcategories;
		renderCategory();
		return false;
	}
	
	function updateCategory(){
		console.log('UPDATE CATEGORY: '+JSON.stringify(category));
		
		url = '/api/categories/'+category['id'];
		
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open('PUT', url, false); // set last param to 'true' only for POST requests
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		var dataToSend = new FormData(); // create a new FormData object
		dataToSend.append('category', JSON.stringify(category)); // add data to the object
		xmlHttp.send(dataToSend);
		
		response = JSON.parse(xmlHttp.responseText);
		results = response['results'];
    	console.log('UPDATE CATEGORY RESPONSE: '+JSON.stringify(results));
		confirmation = results['confirmation'];
		if (confirmation=='success'){
			category = results['category'];
			alert('This category has been successfully updated.');
			return false;
		}
		
		alert(results['message']);
    	return false;
	}
    
