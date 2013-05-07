(function($) {
	$.fn.LinksPl = function() {
	
		var el = $(this);
		var Link = Backbone.Model.extend({
			defaults: {
					name : "",
					path : "",
					comment : ""
			}
		});
		
		var datalnk =  [
	        {
	            "name": "GitHub",
	            "path": "https://github.com/",
	            "comment": "GitHub is the best place to share code"
	        },
	        {
	            "name": "CDNJS",
	            "path": "http://cdnjs.com/",
	            "comment": "Host of all libraries"
	        },
	        {
	            "name": "W3Schools",
	            "path": "http://www.w3schools.com/",
	            "comment": "Online web tutorial"
	        },
	        {
	            "name": "SitePoint",
	            "path": "http://www.sitepoint.com/",
	            "comment": "Learn CSS/HTML5/Javascript"
	        },
	        {
	            "name": "JSONLint",
	            "path": "http://www.jsonlint.com/",
	            "comment": "The JSON validator"
	        },
	        {
	            "name": "ColorZilla",
	            "path": "http://www.colorzilla.com/",
	            "comment": "Advanced Colorful Goodies"
	        },
	        {
	            "name": "Developer Network",
	            "path": "https://developer.mozilla.org/en-US/",
	            "comment": "Mozilla developer network"
	        }
	    ];
	
		
		var Links = Backbone.Collection.extend({ 
			model: Link,
			url: '#',
		    count: function() {
		      return this.length;
		    }
	
		});
	
	
		var List = Backbone.View.extend({
			el : el,
			template : _.template($('#index-template').html()),
			initialize : function() {
				this.links = new Links();
				this.loadLinks(this.links);
				this.links.on('all', this.render, this);
				this.links.fetch();
			},
			render : function() {
				var count = this.links.count();
				this.$el.html(this.template({
					Count : count
				}));
				if (count > 0)
					this.links.each(this.listLink, this);
					
				var addform = new AddForm({collection: this.links});
	      		this.$el.append(addform.render().el);	
					
				return this;
			},
	
			listLink : function(link) {
				var view = new LinksList({
					model : link
				});
				this.$('.linkslist').append(view.render().el);
			},
			
			loadLinks : function(collection){
				$.each(datalnk, function(i,e){
					collection.create({
					    name: e.name,
			        	path: e.path,
			        	comment: e.comment
			      	});
			   });
			}
		})
	
		var LinksList = Backbone.View.extend({
			tagName: 'li',
			events: {
		      'click .del': 'deleteLink'
		    },
			name : function() {
				return this.model.get('name');
			},
			path : function() {
				return this.model.get('path');
			},
			comment : function() {
				return this.model.get('comment');
			},
			template : _.template('<a href="<%= path %>"><%= name %></a> - <%= comment %><a class="del" href="#">&times</a>'),
			render : function() {
				this.$el.html(this.template({name: this.name(),path: this.path(),comment: this.comment()}));
				return this;
			},
			deleteLink : function() {
				this.model.destroy();
			}
			
		}); 
	
		var AddForm = Backbone.View.extend({
			tagName: 'form',
			template : _.template($('#add-template').html()),
			events: {
		      'click #addbtn': 'addlink'
		    },
			render : function() {
				this.$el.html(this.template(this));
				return this;
			},
			addlink: function(e) {
				e.preventDefault();
				var name = this.$('#name').val().trim();
				var path = this.$('#url').val().trim();
				var cmnt = this.$('#comment').val().trim();
				if (name.length != 0 && path.length != 0) {
					this.collection.create({
			        	name: name,
			        	path: path,
			        	comment: cmnt
			      	});
	
		      		this.render();
		      }
		    }
		});
		
		var app = new List();
	
	}
	
})(jQuery);
