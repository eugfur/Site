(function($) {
	$.fn.EmberYT = function() {
		
		var el = $(this);

		if (typeof(AppEmber) == "undefined"){
		
			AppEmber = Em.Application.create({
				rootElement: el
			});
			
			AppEmber.YouTube = Em.Object.extend({
				'ytitem': null
			});
			
			AppEmber.SearchTextField = Em.TextField.extend({
				insertNewline: function(){
					AppEmber.youtubeController.loadYT();
				}
			});
			
			AppEmber.youtubeController = Em.ArrayController.create({
				 content: [],
				 query: '',
				 loadYT: function() {
				 		var me = this;
			        	var query = me.get("query");
				    	$.getJSON("http://gdata.youtube.com/feeds/users/GoogleDevelopers/uploads", { alt: 'json', 'max-results': 20, q: query }).then(function(response) {
				        	me.set('content', []);
					 
					        response.feed.entry.forEach( function (item) {
					        	var t = AppEmber.YouTube.create({
									'ytitem': item.content.$t
								});
								me.pushObject(t);
			
					        });
					        //ovewrite some of the YouTube inline styles.
					        var tm = setTimeout(function(){$(".youtube>div:first-of-type").css("width","");$("td").css("vertical-align","top");},0);
							
				      });
				  }
			});
			
			AppEmber.youtubeController.loadYT();
		}
	}
	
})(jQuery);


