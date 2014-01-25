      var device = {};
      var sessions = new Array();
      var selectedCategory = '';
      var subcategorySelected = '';
      var errorMessages = new Array('Cant do that.', 'Seriously, thats not allowed.', 'stop it.');
      var errorCount = 0;
      var currentSelectedEntry = '';


      function populateDeviceProfile(json){
		  subcategorySelected = '';
    	  device = json;

    	  config = device["configuration"];
    	  categories = config['sequence'];

    	  var categoriesHtml = '';
    	  for (var i=0; i<categories.length; i++){
    		  category = categories[i];

    		  categoriesHtml += '<div class="media comment-item"><div id="'+category+'" draggable="true" ondragstart="dragCategory(event)" ondragenter="handleDragEnter(event)" ondragover="draggedOver(event)" ondragleave="dragLeave(event)" ondrop="dropCategory(event)" class="media-body"><h4 class="rs comment-author"><a style="color:#ea503d" onClick="return selectCategory(\''+category+'\');" href="#">'+category+'</a></h4>';

    		  c = config[category];
    		  subs = c['order'];
    		  for (var k=0; k<subs.length; k++){
    			  sub = subs[k];
    			  id = category+'-'+sub;
        		  categoriesHtml += '<a id="'+id+'" onclick="return subcategoryTapped(\''+id+'\');" style="margin-left:5px" class="btn btn-blue" href="#">'+sub+'</a>';
    		  }
    		  categoriesHtml += '<br /><a style="color:red" onclick="return removeCategory('+i+');" href="#">remove category</a>';
    		  categoriesHtml += '</div></div>';
    	  }

    	  document.getElementById('categories').innerHTML = categoriesHtml;


    	  radioHtml = '';
    	  if (device['isLive']=='yes'){
    		  radioHtml = '<input onchange="return radioChanged(this);" style="margin-right:5px" type="radio" name="isLive" value="yes" checked><label style="vertical-align:middle">YES</label><br />';
    		  radioHtml += '<input onchange="return radioChanged(this);" style="margin-right:5px" type="radio" name="isLive" value="no"><label style="vertical-align:middle">NO</label><br />';
    	  }
    	  else{
    		  radioHtml = '<input onchange="return radioChanged(this);" style="margin-right:5px" type="radio" name="isLive" value="yes"><label style="vertical-align:middle">YES</label><br />';
    		  radioHtml += '<input onchange="return radioChanged(this);" style="margin-right:5px" type="radio" name="isLive" value="no" checked><label style="vertical-align:middle">NO</label>';
    	  }

    	  document.getElementById('radio').innerHTML = radioHtml;
      }


      function updateDevice(){
    	  device["uuid"] = document.getElementById('uuid').value;
    	  device["name"] = document.getElementById('name').value;
    	  device["venue id"] = document.getElementById('venue id').value;
    	  device["loc1"] = document.getElementById('location1').value;
    	  device["loc2"] = document.getElementById('location2').value;
    	  device["loc3"] = document.getElementById('location3').value;
    	  device["loc4"] = document.getElementById('location4').value;
    	  device["image"] = document.getElementById('image').value;


    	  var xmlHttp = new XMLHttpRequest();
    	  xmlHttp.open('PUT', '/api/device/'+device["uuid"], false);
    	  xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    	  var dataToSend = new FormData(); // create a new FormData object
    	  console.log('UPDATE DEVICE: '+JSON.stringify(device));
    	  dataToSend.append('device', JSON.stringify(device)); // add data to the object
    	  xmlHttp.send(dataToSend);

    	  confirmation = JSON.parse(xmlHttp.responseText);

    	  if (confirmation.results.confirmation === "success") {
    		  populateDeviceProfile(confirmation.results.device);
    		  alert('UPDATE DEVICE - - SUCCESS: ');
    		  return false;
    	  }

    	  alert('UPDATE DEVICE - - FAIL: '+confirmation.results.message);
    	  return false;
      }



      function selectCategory(category){
    	  selectedCategory = category;
    	  config = device["configuration"];
		  c = config[category];
		  console.log('SELECT CATEGORY: '+JSON.stringify(c));
    	  subcategoryKeys = c['order'];

		  subcategoriesHtml = '';
		  for (var k=0; k<subcategoryKeys.length; k++){
			  subcategoryName = subcategoryKeys[k];
			  subcategoriesHtml += '<p style="margin-top:20px" class="rs fc-gray"><input id="'+category+'-'+k+'" class="subcategoryinput" type="text" value="'+subcategoryName+'"></p><div class="subcategory">';

      		  providers = c[subcategoryName];
      		  for (var j=0; j<8; j++){
      			  provider = (j < providers.length) ? providers[j] : '';

                  subcatInputId = subcategoryName+'-'+j;
      			  subcategoriesHtml += '<a href="" id="'+subcatInputId+'" onClick="return showEntries(this.id);">'+provider+'</a><a id="'+subcatInputId+'" href="" style="float:right;" onClick="return removeEntry(this.id)">x</a><br />';
      		  }

      		  subcategoriesHtml += '</div>';
		  }

		  icon = c['icon'];
    	  document.getElementById('selectedcategory').innerHTML = '<h4 class="rs pb10">'+category+'</h4><hr /><div style="background-color:#999;border-radius:3px;text-align:center;padding:5px"><strong>Icon</strong><br /><a onclick="return showIcons();" href="#"><img src="/site/images/'+icon+'?crop=80" /></a><br />(click icon to change)</div>'+subcategoriesHtml+'<br /><div class="val"><button onClick="return commitCategory(\''+category+'\');" style="width:100%" class="btn btn-blue btn-submit-all">Commit</button></div>';
    	  return false;
      }


      function commitCategory(category){
    	  console.log('Commit Category: '+category);

    	  config = device["configuration"];
		  subcategories = config[category];

    	  subcategoryKeys = subcategories['order']; // ["sports","world","headlines","local","tech","business"]
    	  console.log('SUBCATEGORIES: '+JSON.stringify(subcategoryKeys));

    	  updatedSubcategories = {};
    	  updatedOrder = new Array(); //
		  for (var i=0; i<subcategoryKeys.length; i++){
			  subcategoryName = subcategoryKeys[i];
			  providers = new Array();
      		  for (var j=0; j<8; j++) {
      			  inputId = subcategoryName+'-'+j;
      			  provider = document.getElementById(inputId).value;
      			  if (provider.length > 0)
      				  providers.push(provider);
      		  }

			  id = category+'-'+i;
			  subcategory = document.getElementById(id).value;  // subcategory name might have been changed:
      		  updatedSubcategories[subcategory] = providers;
      		  updatedOrder.push(subcategory);
		  }

    	  updatedSubcategories['order'] = updatedOrder; // update the order
    	  updatedSubcategories['icon'] = subcategories['icon']; // update the icon

    	  console.log('UPDATED SUBCATEGORIES: '+JSON.stringify(updatedSubcategories));
    	  config[category] = updatedSubcategories;
    	  device["configuration"] = config;

    	  updateDevice();
    	  return false;
      }

      function updateVenue(){
    	  venues = document.getElementById('venues');
    	  newVenueId = venues.options[venues.selectedIndex].value;
    	  console.log('Venue Selected: ');

    	  document.getElementById('venue id').value = newVenueId;
      }


      function deleteDevice(){
    	  confirmation = confirm('Are You Sure?');

    	  if (confirmation){
  	  			var xmlHttp = new XMLHttpRequest();
				xmlHttp.open('DELETE', '/api/device/'+device["uuid"], false);
				xmlHttp.send();

				response = JSON.parse(xmlHttp.responseText);
				console.log(JSON.stringify(response));
				results = response['results'];
				conf = results['confirmation'];
				if (conf=='success'){
					window.location.replace("/");
				}
				else{
					message = results['message'];
					alert(message);
				}
    	  }
    	  return false;
      }


	    function processTime(time){
	    	date = moment(new Date(time)).format('MMM D, h:mma');
	    	return date;
	    }

      function executeUrlRequest(url, httpMethod){
    	  var xmlHttp = new XMLHttpRequest();
    	  xmlHttp.open(httpMethod, url, false);
    	  xmlHttp.send(null);
    	  obj = JSON.parse(xmlHttp.responseText);
    	  return obj;
      }



      function fetchSessions(){
    	var url = '/api/sessions?device='+device['uuid'];
    	response = executeUrlRequest(url, 'GET');
    	results = response.results;
    	if (results.confirmation=='success'){
    		sessions = results.sessions;
//    		console.log('FETCH SESSIONS: '+JSON.stringify(sessions));

    		list = '<ol>';
    		for (var i=0; i<sessions.length; i++){
    			session = sessions[i];
    			date = session['date']; //Thu Nov 21 14:39:18 UTC 2013
    			list += '<li><a target="_blank" href="/site/sessions/'+session['id']+'">'+processTime(date)+'</a></li>'
    		}
    		list += '</ol>';

      	    document.getElementById('sessions').innerHTML = list;
      	    fetchCateogories();
    		return;
    	}

    	alert(results['message']);
    	return;
    }


      function handleDragEnter(event) { // this / e.target is the current hover target.
    	  console.log('DRAGGED ENTER: '+event.target.parentNode.id);
    	  event.target.classList.add('over');
      }

      function draggedOver(event){
    	  event.preventDefault();

//    	  console.log('DRAGGED OVER: '+event.target.parentNode.id);
    	  event.dataTransfer.dropEffect = 'move';
      }

      function dragLeave(event){
//    	  console.log('DRAG LEAVE: '+event.target.parentNode.id);
    	  event.target.classList.remove('over');

      }

      function dragCategory(event){
    	  console.log('DRAG CATEGORY: '+event.target.className);
    	  event.dataTransfer.setData("categoryId", event.target.id);
      }

      function dropCategory(event){
    	  console.log('DROP CATEGORY: '+event.target.id);
    	  var movedCategory = event.dataTransfer.getData("categoryId");
    	  console.log('MOVED CATEGORY: '+movedCategory);

    	  if (movedCategory==null){
        	  populateDeviceProfile(device);
        	  event.preventDefault();
        	  return;
    	  }

    	  if (movedCategory.length < 2){
        	  populateDeviceProfile(device);
        	  event.preventDefault();
        	  return;
    	  }

    	  var replacedCategory = event.target.parentNode.id;
    	  console.log('REPLACED CATEGORY: '+replacedCategory);

    	  if (movedCategory==replacedCategory){ // no change, ignore
        	  populateDeviceProfile(device);
        	  event.preventDefault();
        	  return;
    	  }

    	  config = device['configuration'];
    	  sequence = config['sequence'];
    	  console.log('SEQUENCE 1: '+JSON.stringify(sequence));

    	  var index = sequence.indexOf(movedCategory);
    	  sequence.splice(index, 1);
    	  console.log('SEQUENCE 2: '+JSON.stringify(sequence));

    	  updatedSequence = new Array();
    	  for (var i=0; i<sequence.length; i++){
    		  category = sequence[i];
    		  console.log('INDEX '+i+" == "+category);

    		  if (category==replacedCategory){
    			  updatedSequence.push(movedCategory);
    		  }

    		  updatedSequence.push(category);
    	  }
    	  console.log('SEQUENCE 3: '+JSON.stringify(updatedSequence));


    	  config['sequence'] = updatedSequence;
    	  device['configuration'] = config;

    	  populateDeviceProfile(device);
    	  event.preventDefault();
      }

      function subcategoryTapped(buttonId){
    	  console.log('subcategoryTapped '+buttonId);
    	  button = document.getElementById(buttonId);
    	  parts = buttonId.split("-");

    	  console.log('category: '+parts[0]);
    	  console.log('subcategory: '+parts[1]);

    	  if (subcategorySelected==''){
    		  subcategorySelected = buttonId;
        	  removeClass(button, 'btn btn-blue');
        	  addClass(button, 'btn btn-red');
        	  return false;
    	  }

    	  button = document.getElementById(subcategorySelected);

    	  parts = subcategorySelected.split("-");
    	  categoryName = parts[0];
    	  subcategoryName = parts[1];

    	  p = buttonId.split("-");
    	  movingCategory = p[0];
    	  movingSubcategory = p[1];


    	  if (categoryName!=movingCategory){
    		  i = errorCount % errorMessages.length;
    		  alert(errorMessages[i]);
    		  errorCount++;
    		  return false;
    	  }


    	  config = device['configuration'];
    	  category = config[categoryName];

    	  updatedOrder = new Array();
    	  order = category['order'];
    	  for (var i=0; i<order.length; i++){
    		  sub = order[i];
//        	  console.log('SUB = '+sub);
        	  if (sub==subcategoryName)
        		  updatedOrder.push(movingSubcategory);
        	  else if (sub==movingSubcategory)
        		  updatedOrder.push(subcategoryName);
        	  else
        		  updatedOrder.push(sub);
    	  }

    	  category['order'] = updatedOrder;
    	  config[categoryName] = category;
    	  device['configuration'] = config;
    	  populateDeviceProfile(device);

    	  selectCategory(categoryName);
    	  return false;
      }


      function addClass(el, className){
    	    el.className += ' '+className;
      }

      function removeClass(el, classNm){
    	  var elClass = ' '+el.className+' ';
    	  while(elClass.indexOf(' '+classNm+' ') != -1)
    		  elClass = elClass.replace(' '+classNm+' ', '');

    	  el.className = elClass;
      }

      function showSection(section){
    	  console.log('Show Section: '+section);
    	  sidebar = document.getElementById('sidebar');
    	  if (section=='device'){
    		  deviceTemplate = $('#deviceinfo').html();

    		  // populate with specific device information
    		  deviceTemplate = deviceTemplate.replace("{{deviceId}}", device['uuid']);
    		  deviceTemplate = deviceTemplate.replace("{{timestamp}}", device['timestamp']);
    		  deviceTemplate = deviceTemplate.replace("{{image}}", device['image']);

    		  sidebar.innerHTML = deviceTemplate;
    		  return true;
    	  }


    	  if (section=='configuration'){
    		  configurationTemplate = $('#configuration').html();


    		  sidebar.innerHTML = configurationTemplate;
    		  return true;
    	  }


    	  if (section=='sessions'){
    		  sessionsTemplate = $('#sessionInfo').html();
    		  sessionsTemplate = sessionsTemplate.replace("{{numSessions}}", device['numSessions']);
    		  sessionsTemplate = sessionsTemplate.replace("{{totalSeconds}}", device['totalSeconds']);

    		  sidebar.innerHTML = sessionsTemplate;
    		  return true;
    	  }


    	  if (section=='providers'){
    		  configuration = device['configuration'];
    		  sequence = configuration.sequence;

    		  content = '';
    		  totalProviders = 0;
    		  for (var i=0; i<sequence.length; i++){
    			  categoryName = sequence[i];
    			  content += '<div style="padding:10px;border-bottom:1px dotted #888"><h3>'+categoryName+'</h3>';

        		  console.log(JSON.stringify(categoryName));

        		  category = configuration[categoryName];
        		  order = category['order'];
        		  for (var j=0; j<order.length; j++){
        			  subcategory = order[j];
        			  content += '<h4>'+subcategory+'</h4>';
        			  providers = category[subcategory];

            		  console.log(subcategory+': '+JSON.stringify(providers));
            		  if (providers.length > 0){
            			  content += '<ol style="padding:0px 0px 0px 20px">';
            			  for (var k=0; k<providers.length; k++){
            				  provider = providers[k];
            				  totalProviders++;
            				  url = providers[k];
            				  if (provider.length > 60)
            					  provider = provider.substring(0, 60)+'...';

            				  content += '<li><a style="color:#ea503d;" target="_blank" href="'+url+'">'+provider+'</a></li>';
            			  }
            			  content += '</ol>';
            		  }
            		  else{
            			  content += 'none';
            		  }


        		  }

    			  content += '</div>';
    		  }

    		  document.getElementById('providers').innerHTML = content;

    		  providersSidebar = $('#providersSidebar').html();
    		  providersSidebar = providersSidebar.replace("{{numProviders}}", totalProviders);
    		  providersSidebar = providersSidebar.replace("{{deviceId}}", device['uuid']);


    		  sidebar.innerHTML = providersSidebar;

    		  return true;
    	  }



    	  return true;
      }

      function radioChanged(radio){
    	  console.log('RADIO CHANGED: '+radio.value);
    	  device["isLive"] = radio.value;
      }

      function addCategory(){
    	  categoryId = document.getElementById('addcategory').value;
    	  console.log('ADD CATEGORY: '+categoryId);
    	  url = '/api/device/'+device['uuid']+'?action=addcategory&category='+categoryId;

    	  response = executeUrlRequest(url, 'PUT');
    	  results = response['results'];
    	  confirmation = results['confirmation'];
    	  if (confirmation=='success'){
    		  device = results['device'];
    		  console.log(JSON.stringify(results));
    		  populateDeviceProfile(device);
    		  alert('Device has been updated.');
    		  return;
    	  }

		  alert(results['message']);
		  return;
      }

      function fetchCateogories(){
    	  url = '/api/categories';
    	  response = executeUrlRequest(url, 'GET');
    	  results = response['results'];
    	  confirmation = results['confirmation'];
    	  if (confirmation=='success'){
    		  categories = results['categories'];

    		  list = '';
    		  for (var i=0; i<categories.length; i++){
    			  category = categories[i];
    			  list += '<option value="'+category['id']+'">'+category['name']+'</option>';
    		  }

    		  document.getElementById('addcategory').innerHTML = list;
    	  }
      }

      function removeCategory(index){
    	  config = device["configuration"];
    	  categoriesSequence = config['sequence'];
		  categoryName = categoriesSequence[index];

    	  url = '/api/device/'+device['uuid']+'?action=removecategory&category='+categoryName;

    	  response = executeUrlRequest(url, 'PUT');
    	  results = response['results'];
    	  confirmation = results['confirmation'];
    	  if (confirmation=='success'){
    		  device = results['device'];
    		  populateDeviceProfile(device);
    		  alert('Device has been updated.');
    		  return false;
    	  }

		  alert(results['message']);
    	  return false;
      }

      function removeEntry(entryId){
          console.log("ENTRY ID: "+entryId);

          config = device["configuration"];
          console.log(config);
          c = config[selectedCategory];
          console.log(c);

          var splitEntry = entryId.split("-");
          var currentCat = c[entryId[0]];
          console.log(currentCat);
          var arrIndex = currentCat.indexOf(splitEntry[1]);
          console.log(arrIndex);

          currentCat.splice(arrIndex, 1);
          console.log(currentCat);
          // currentCat[splitEntry[1]] = entryId;

          console.log(c);
          selectCategory(selectedCategory);
          return;
      }

      function showEntries(entry){
          console.log('Show Entries');
          currentSelectedEntry = entry;

          popup('/git/entries?action=select&branch=select_entries'); // @NOTE: CHANGE TO /site/entries?action=select
          return false;
      }

      function showIcons(){
    	  console.log('Show Icons');

    	  popup('/site/images');
    	  return false;
      }

      function selectEntry(entryId) {
          console.log("ENTRY ID: "+entryId);

          config = device["configuration"];
          c = config[selectedCategory];

          var splitEntry = currentSelectedEntry.split("-");
          var currentCat = c[splitEntry[0]];

          currentCat[splitEntry[1]] = entryId;

          console.log(c);
          selectCategory(selectedCategory);
		  return;
      }

      function selectIcon(iconId){
    	  console.log('Select Icon: '+iconId);

    	  config = device["configuration"];
		  c = config[selectedCategory];
		  c['icon'] = iconId;
    	  console.log('Category: '+JSON.stringify(c));

		  config[selectedCategory] = c;
		  device["configuration"] = config;
		  selectCategory(selectedCategory);
		  return;
      }

	    function popup(url) {
		  	newwindow = window.open(url,'name','height=450,width=900');
		  	if (window.focus) {
		  		newwindow.focus();
		  	}
		  	return false;
		  }


