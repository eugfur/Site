(function($) {
	$.fn.KendoYT = function() {
	
		var template = kendo.template($("#template").html());

		var url ="http://gdata.youtube.com/feeds/users/GoogleDevelopers/uploads?alt=json&max-results=30";
		
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: url, 
                    dataType: "jsonp",
                    data: {
                        q: function() {
                            return $("#searchfor").val();
                        }
                    }
                }
            },
            schema: { 
                data: "feed.entry" 
            },
            change: function() { 
                $("#youtubes").html(kendo.render(template, this.view()));
                $(".youtube>div:first-of-type").css("width","");
                $(".youtube table").css("width","100%");
                $("td").css("vertical-align","top");
            }
        });

        dataSource.read();

        $("#search").click(function() {
        	url ="http://gdata.youtube.com/feeds/users/GoogleDevelopers/uploads?alt=json&max-results=30";
            dataSource.read();
        });

        $("#searchfor").keydown(function(e) {
            if (e.keyCode === kendo.keys.ENTER) {
            	url ="http://gdata.youtube.com/feeds/users/GoogleDevelopers/uploads?alt=json&max-results=30";
                dataSource.read();
            }
        });
        
         $("#mostvwdlnk").click(function() {
        	$("#searchfor").val('');
			url ="http://gdata.youtube.com/feeds/api/standardfeeds/most_viewed?time=this_week&alt=json&max-results=30&format=5";
            dataSource.read();
        });
	
	}
	
})(jQuery);
