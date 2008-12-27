(function(){
	
	var Dom = YAHOO.util.Dom,
	Event = YAHOO.util.Event,
	byClass = Dom.getElementsByClassName;

	window.STAPX = {};
	STAPX.widgets = {};
	STAPX.widgets.Slides = function( containerId, config ) {
		
		//Private
		var S = STAPX.widgets.Slides;
		
		//Static
		S.CLASS_SLIDE = "slide";
		S.CLASS_HIDE = "hide";
		S.CLASS_STEPS = "steps";
		S.CLASS_STEP = "step";
		S.CLASS_TRANSITIONED = "transitioned";
		
		//Public
		var public_methods = {
			
			el : Dom.get( containerId ),
			
			selectedSlide : null,
			
			steps : null,
			
			transitions : {
				
				show : function( element ){
					
					Dom.removeClass( element, S.CLASS_HIDE );
					
				}
				
			},
			
			getSlides : function(){
				
				return byClass( S.CLASS_SLIDE, "div", this.el );
				
			},
			
			getPreviousSlide : function(){
			
				return Dom.getPreviousSibling( this.selectedSlide );
				
			},
			
			getNextSlide : function(){
			
				return Dom.getNextSibling( this.selectedSlide );
				
			},
			
			advanceStep : function( slideId ){
				var 	slide = Dom.get( slideId ),
						steps = Dom.getElementsByClassName( S.CLASS_STEP, 'li', slide ),
						step = null;
				
				for( var i=0, l=steps.length; l > i; i++ ){
					var tStep = steps[ i ];
					
					if( !Dom.hasClass( tStep, S.CLASS_HIDE ) && !Dom.hasClass( tStep, S.CLASS_TRANSITIONED ) ){
						
						Dom.addClass( tStep, S.CLASS_TRANSITIONED );
						if( steps[ i+1 ] ){
							step = steps[ i+1 ];
						}
						
					}
					
				}
						
			},
			
			selectSlide : function( slideId ){
				
				if( slideId ){
				
					Dom.addClass( this.getSlides(), S.CLASS_HIDE );
					Dom.removeClass( slideId, S.CLASS_HIDE );

					this.selectedSlide = Dom.get( slideId ); 
					
					return this.selectedSlide;
					
				} else {
					
					return false;
					
				}
				
			},
			
			initSteps : function( slideId ){
				
				var	steps = Dom.getElementsByClassName( 
							S.CLASS_STEPS, 
							"ul", 
							Dom.get( slideId ) 
						)[ 0 ].getElementsByTagName( "li" ),
				
						getTransitions = function( element ){
							
							var	classes = element.className.split(" ")
									transitions = [];
							
							for( var i=0, l=classes.length; l > i; i++ ){
								var classArray = classes[ i ].split( ":" );
								
								if( classArray.length > 1 && classArray[0] === "transition" ){
									
									transitions.push( classArray[ 1 ] );
									
								}
								
							}
							
							if( transitions.length ){
								
								Dom.addClass( element, S.CLASS_HIDE );
								Dom.addClass( element, S.CLASS_STEP );
								
							}
							
							return transitions;
							
						};
				
				this.steps = [];
				
				for( var i = 0, l = steps.length; l > i; i++ ){
					
					this.steps.push({
						element : steps[ i ],
						transition : getTransitions( steps[ i ] )
					})
					
				}
				
				return this.steps;
				
			}
			
		}
		
		//Initialize
		public_methods.selectSlide( public_methods.getSlides()[ 0 ] );
		Event.on( public_methods.el, "click", function( event ){
			
			if( event.shiftKey ){
				
				this.selectSlide( this.getPreviousSlide() );
				
			} else {
			
				this.selectSlide( this.getNextSlide() );
				
			}
			
		}, null, public_methods )
		
		return public_methods;
		
	}
	
	STAPX.app = {};
	STAPX.app.slideshow = new STAPX.widgets.Slides( "mySlideshow" );
	
})();