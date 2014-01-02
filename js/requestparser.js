function parseLocation(stem){
	console.log('PARSE LOCATION: '+stem);
	var resourcePath = location.href.replace(window.location.origin, ''); // strip out the domain root (e.g. http://localhost:8888)

	var parts = resourcePath.split(stem+'/');
	request = {"resource":null, "identifier":null};
	if (parts.length > 1){
		var hierarchy = parts[1].split('/');
		for (var i=0; i<hierarchy.length; i++){
			if (i==0)
				request['resource'] = hierarchy[i]

			if (i==1) {
			    request['identifier'] = hierarchy[i].split('?')[0];
			}
		}
	}

	console.log(JSON.stringify(request));
	return request;
}
