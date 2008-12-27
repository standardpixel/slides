
/************************************************

	Standard Pixel JavaScript Library for YUI 2x
						                  =Core=
								
	Version : 0
	Tested with YUI Version : 2.6.0
	Author : Eric Gelinas
	
	There are enough libraries out there so lets
	start extending the ones we have ;-)
	

*************************************************/

(function(){
	
	/*********************************************
		
		=Core=
		Core setup of STAPX namespace and library 
		shortcut variables
	
	*********************************************/
	
	//Setup namespace
	window.STAPX = {};
	
	//Library shortcuts for the YUI Library
	STAPX.Y = {
		
		Dom : YAHOO.util.Dom,
		Event : YAHOO.util.Event,
		byClass : YAHOO.util.Dom.getElementsByClassName
		
	}
	
	//Componant Namespaces
	STAPX.widgets = {};
	
})();

(function(){
	
	/*********************************************
		
		=Slides=
		This is a componant of the STAPX library
		extension for YUI. This componant
		creates a presentation slideshow from a 
		standard FAQ markup template. This
		aims to provide similar features to
		Powerpoint or Keynote, in pure web-native
		technologies.
	
	*********************************************/
	
	STAPX.widgets.Slides = function( containerId, config ) {
		
		//Private
		var	S = STAPX.widgets.Slides,
			Y = STAPX.Y;
		
		//Static
		S.CLASS_SLIDE = "slide";
		S.CLASS_HIDE = "hide";
		S.CLASS_STEPS = "steps";
		S.CLASS_STEP = "step";
		S.CLASS_TRANSITIONED = "transitioned";
		
		//Public
		var public_methods = {
			
			el : Y.Dom.get( containerId ),
			
			selectedSlide : null,
			
			steps : null,
			
			transitions : {
				
				show : function( element ){
					
					Y.Dom.removeClass( element, S.CLASS_HIDE );
					
				}
				
			},
			
			getSlides : function(){
				
				return Y.byClass( S.CLASS_SLIDE, "div", this.el );
				
			},
			
			getPreviousSlide : function(){
			
				return Y.Dom.getPreviousSibling( this.selectedSlide );
				
			},
			
			getNextSlide : function(){
			
				return Y.Dom.getNextSibling( this.selectedSlide );
				
			},
			
			advanceStep : function( slideId ){
				var 	slide = Y.Dom.get( slideId ),
						steps = Y.Dom.byByClass( S.CLASS_STEP, 'li', slide ),
						step = null;
				
				for( var i=0, l=steps.length; l > i; i++ ){
					var tStep = steps[ i ];
					
					if( !Y.Dom.hasClass( tStep, S.CLASS_HIDE ) && !Y.Dom.hasClass( tStep, S.CLASS_TRANSITIONED ) ){
						
						Y.Dom.addClass( tStep, S.CLASS_TRANSITIONED );
						if( steps[ i+1 ] ){
							step = steps[ i+1 ];
						}
						
					}
					
				}
						
			},
			
			selectSlide : function( slideId ){
				
				if( slideId ){
				
					Y.Dom.addClass( this.getSlides(), S.CLASS_HIDE );
					Y.Dom.removeClass( slideId, S.CLASS_HIDE );

					this.selectedSlide = Y.Dom.get( slideId ); 
					
					return this.selectedSlide;
					
				} else {
					
					return false;
					
				}
				
			},
			
			initSteps : function( slideId ){
				
				var	steps = Y.Dom.byByClass( 
							S.CLASS_STEPS, 
							"ul", 
							Y.Dom.get( slideId ) 
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
								
								Y.Dom.addClass( element, S.CLASS_HIDE );
								Y.Dom.addClass( element, S.CLASS_STEP );
								
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
		Y.Event.on( public_methods.el, "click", function( event ){
			
			if( event.shiftKey ){
				
				this.selectSlide( this.getPreviousSlide() );
				
			} else {
			
				this.selectSlide( this.getNextSlide() );
				
			}
			
		}, null, public_methods )
		
		return public_methods;
		
	}
})();