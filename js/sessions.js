	var sessionsSummary = {};
	var sessions = new Array();
	var offset = 0;
	var deviceMap = {};

	function executeUrlRequest(url, httpMethod){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open(httpMethod, url, false);
		xmlHttp.send(null);
		obj = JSON.parse(xmlHttp.responseText);
		return obj;
	}
	
	function fetchDevices(){
		url = '/api/devices';
		response = executeUrlRequest(url, 'GET');
		results = response['results'];
		confirmation = results['confirmation'];
		if (confirmation=='success'){
			devices = results['devices'];
			for (var i=0; i<devices.length; i++){
				device = devices[i];
				deviceMap[device['uuid']] = device;
			}

//			console.log(JSON.stringify(deviceMap));
			fetchSessions();
			return;
		}
		
		alert(results['message']);
	}
	
	function fetchSessions(){
		url = '/api/sessions?offset='+offset;
		response = executeUrlRequest(url, 'GET');
		results = response['results'];
		confirmation = results['confirmation'];
		if (confirmation=='success'){
			sessions = results['sessions'];
//			console.log(JSON.stringify(sessions));
			
			if (sessions.length < 25)
				offset = 0; // start over
			else
				offset += sessions.length;
			
			showRecentSessions();
			fetchSummary();
			return false;
		}
		
		alert(results['message']);
		return false;
	}
	
	function loadPrevious(){
		console.log('Load Previous');
		offset -= (2*sessions.length);
		if (offset < 0)
			offset = 0;
		
		fetchSessions();
		return false;
	}
	
    function processTime(time){
    	date = moment(new Date(time)).format('MMM D, h:mma');
    	return date;
    }
    
    function showRecentSessions(){
    	
		sessionList = '';
		for (var i=0; i<sessions.length; i++){
			session = sessions[i];
			deviceId = session['device'];
			
			if (deviceMap.hasOwnProperty(deviceId)) {
				device = deviceMap[deviceId];
				sessionList += '<tr><td><a href="/site/devices/'+deviceId+'">'+device['name']+'</a></td><td>'+processTime(session['date'])+'</td><td>'+session['duration']+'</td></tr>';
			}
		}

		recentsessionsTpl = $('#recentsessions').html();
		recentsessionsTpl = recentsessionsTpl.replace("{{sessions}}", sessionList);
		document.getElementById('sessionscontent').innerHTML = recentsessionsTpl;

    }
    
    function showDays(){
		daysTpl = $('#daystable').html();
		daysSummary = sessionsSummary['daysSummary']; //daysSummary":{"Thu":"42","Sun":"59","Wed":"74","Sat":"77","Fri":"80","Mon":"74","Tue":"84"}
		days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		daysList = '';
		for (var i=0; i<days.length; i++){
			d = days[i];
			daysList += '<tr><td>'+d+'</td><td>'+daysSummary[d]+'</td></tr>';
		}
		
		daysTpl = daysTpl.replace("{{daysList}}", daysList);
		document.getElementById('sessionscontent').innerHTML = daysTpl;
    }

    
    function showHours(){
		hoursTpl = $('#hourstable').html();
		hoursSummary = sessionsSummary['hoursSummary']; //daysSummary":{"Thu":"42","Sun":"59","Wed":"74","Sat":"77","Fri":"80","Mon":"74","Tue":"84"}
		hoursList = '';
		for (var i=0; i<24; i++){
			hour = i.toString();
			hoursList += '<tr><td>'+hour+'</td><td>'+hoursSummary[hour]+'</td></tr>';
		}
		
		hoursTpl = hoursTpl.replace("{{hoursList}}", hoursList);
		document.getElementById('sessionscontent').innerHTML = hoursTpl;
    }
    
    function showCategories(){
		categoriesTpl = $('#categoriestable').html();
		categoriesSummary = sessionsSummary['categoriesSummary']; //daysSummary":{"Thu":"42","Sun":"59","Wed":"74","Sat":"77","Fri":"80","Mon":"74","Tue":"84"}
		categoriesList = '';
		
		var keys = Object.keys(categoriesSummary);
		for (var i=0; i<keys.length; i++){
			categoryName = keys[i];
			category = categoriesSummary[categoryName];
			categoriesList += '<tr><td>'+categoryName.toUpperCase()+'</td><td>'+category['count']+'</td><td>'+category['duration']+'</td><td>'+category['average']+'</td></tr>';
		}
		
		categoriesTpl = categoriesTpl.replace("{{categoriesList}}", categoriesList);
		document.getElementById('sessionscontent').innerHTML = categoriesTpl;
    }

    
    function showSection(section){
    	console.log('SHOW SECTION: '+section);
    	if (section=='recentSessions'){
    		showRecentSessions();
    		return false;
    	}
    	
    	if (section=='days'){
    		showDays();
    		return false;
    	}

    	
    	if (section=='hours'){
    		showHours();
    		return false;
    	}

    	if (section=='categories'){
    		showCategories();
    		return false;
    	}

		return false;
    }
    
    function fetchSummary(){
		url = '/api/sessionssummary';
		response = executeUrlRequest(url, 'GET');
		results = response['results'];
		confirmation = results['confirmation'];
		if (confirmation=='success'){
			sessionsSummary = results['sessions summary'];
			
			document.getElementById('updated').innerHTML = sessionsSummary['updated'];
			
			console.log(JSON.stringify(sessionsSummary));
			return;
		}
		
		alert(results['message']);
    	
    }

