var Session = Backbone.Model.extend({
    defaults: {
        id:"",
        duration:0,
        device:"",
        date:"",
        selectedCategories:[],
        started: ""
    },
    urlRoot: '/api/sessions',
});

var SingleSessionView = Backbone.View.extend({
    template: _.template($('#single-session').html()),
    el: $('.session'),
    events: {
        'click .line': 'line',
        'click .bar': 'bar',
        'click .pie': 'pie'
    },

    initialize: function () {
    	/* Attach listener to model for on change of properties such that when anything changes, view renders again: */
    	this.model.on('change', this.render, this);


    	/* ! Have to declare a separate pointer here for the model because in the completion handler, this.model doesn't pick up
    	 * but the local variable does. ! */
    	var m = this.model;

        this.model.fetch({
        	success: function(model, response){
        		console.log('FETCH SESSION: '+model.id);

        		//parse the response:
        		results = response['results'];
        		confirmation = results['confirmation'];
        		if (confirmation == 'success'){
        			s = results['session'];
        	        console.log(JSON.stringify(s));

        	        console.log(m);

        			m.set({duration:s['duration'], device:s['device'], date:s['date'], selectedCategories:s['selectedCategories'], started:s['started']});
        		}
        		else{
        			alert(results['message']);
        		}
        	},
        	error: function(model, response){
    			alert(response);
        	}
        });

    },

    render: function () {
    	console.log('RENDER');
        this.$el.html(this.template());
        this.chart();
    },

    chart: function (type) {
        dataset = this.parseDuration();

        selectedCategoriesArray = this.model.get('selectedCategories');
        axisLabels = new Array();
        for (var i=0; selectedCategoriesArray.length>i; i++) {
        	category = selectedCategoriesArray[i];
            var categoryName = category.category;
            var subcategoryName = category.subcategory.name;
            label = categoryName + ': ' + subcategoryName;
            axisLabels.push(label);
        }

        if (type) {
            type = type;
        } else {
            type = 'line';
        }

        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'highchart',
                type: type
            },
            title: {
                text: this.model.date
            },
            xAxis: {
                title: {
                    text: 'Category'
                },
                categories: axisLabels, // Highchart wants array of strings for naming x-axis
                labels: {
                    rotation: -45
                }
            },
            yAxis: {
                title: {
                    text: 'Time (s)'
                }
            },
            series: [{
                name: this.model.device,
                data: dataset
            }],
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.label}</b>: {point.percentage:.1f}%'
                    },
                    tooltip: {
                        pointFormat: 'Time: <b>{point.y}s</b>'
                    }
                }
            }
        });
    },

    parseDuration: function () {
        var durations = [];
        var i = 0;

        selectedCategories = this.model.get('selectedCategories');
        while (selectedCategories.length > i) {
        	var category = selectedCategories[i];
        	categoryName = category['category'];
        	subcategoryName = category.subcategory.name;
        	
            console.log('CATEGORY: '+JSON.stringify(category));

            //2013-11-26 21:35:30 +0000
            var startTime = moment(category['started'].replace(" +0000", ""), "YYYY-MM-DD HH:mm:ss");
            startTimestamp = new Date(startTime).getTime();

            endTimestamp = 0;
            if (category['finished']){
                var endTime = moment(category['finished'].replace(" +0000", ""), "YYYY-MM-DD HH:mm:ss");
            }
            else{
                var endTime = moment(this.model.get('date'), "ddd MMM DD HH:mm:ss z YYYY"); // Tue Nov 26 21:45:29 UTC 2013 == ddd MMM DD HH:mm:ss z YYYY
            }

            endTimestamp = new Date(endTime).getTime();


            difference = (endTimestamp - startTimestamp) / 1000;

            if (difference < 0) {
                difference = 0;
            }

            console.log(category['category']+': DIFFERENCE= '+difference);
            
            axisLabel = categoryName+': '+subcategoryName;
            dataPoint = {y:difference, label:axisLabel};
            durations.push(dataPoint);
            i++;
        }

        return durations;
    },

    line: function () {
        this.chart('line');
    },

    bar: function () {
        this.chart('bar');
    },

    pie: function () {
        this.chart('pie');
    }
});

var AppRouter = Backbone.Router.extend({
    routes: {
    	// this failed because the base root was already set up as '/site/sessions' for the application in Backbone.history.start()
        // '/site/sessions/:sessionid' : 'url'

    	':sessionid' : 'initializeModel'
    },

    initializeModel: function (sessionid) {
        console.log('TEST 4: Session Id == '+sessionid);
        var sessionView = new SingleSessionView({model: new Session({id:sessionid})});
    }
});

var app = new AppRouter();

/* Setting pushState to true tells Backbone that this in NOT a single page application
 * and ignores the # prefix on the root which is automatically built in  */
Backbone.history.start({pushState:true, root:'/site/sessions'});