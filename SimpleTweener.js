var tween = function(obj, duration, props, callback) {
				var framerate = 35;
				var par = this;
				var handler= function(){par.onFrame(obj, duration, props, callback);};
				
				if(window.tweenTimer)window.clearInterval(window.tweenTimer);
				window.tweenTimer = setInterval(handler,35);
				
				this.onFrame = function(obj, duration, props, callback)
				{
					var doneCount=0;
					var children=0;
					for (var name in props) {	
						var newProp;
						children++;
						if(props[name].value==null)
						{
							var suffix = (String(props[name]).indexOf("px")>=0);
							newProp = String(props[name]).replace("px", "");
							props[name]={value:newProp,negative:null,complete:false,subtraction:null,currentProp:null,suffix:suffix};
							props[name].currentProp = obj.style[name].replace("px", "");
						
						}else{
							newProp = props[name].value;
						}
							
						if ( props[name].currentProp == null || props[name].currentProp == "")
						{
							if(name=="opacity")
							{
								props[name].currentProp = 1;
							}else{
								props[name].currentProp = 0;
							}
						}
									
						
						if(props[name].negative==null)
							{
								props[name].negative = Number(newProp) < Number(props[name].currentProp)  ? true : false;
							
								props[name].subtraction = Math.abs(Number(props[name].currentProp) - Number(newProp)) / ( (duration * 1000) /framerate);
							}
						
						if (props[name].negative && Number(props[name].currentProp) >= Number(newProp) || !props[name].negative && Number(props[name].currentProp) <= Number(newProp)) {
							
							
							if(props[name].negative)
							{
								props[name].currentProp = Number(props[name].currentProp) - Number(props[name].subtraction); 
								
							}else{
								
								props[name].currentProp = Number(props[name].currentProp) + Number(props[name].subtraction); 
							}
							
							obj.style[name] = props[name].currentProp + (props[name].suffix?"px":"");
							if(name=="opacity")this.setOpacity(obj,props[name].currentProp);
						}else if(!props[name].complete){
							props[name].complete=true;
							doneCount++;
							
						}
	
					}
					if(doneCount>=children)
						{
							window.clearInterval(window.tweenTimer);
							if(callback)callback();
						}
				}
				this.setOpacity=function(obj,value)
				{
					obj.style['-ms-filter']="progid:DXImageTransform.Microsoft.Alpha(Opacity="+(value*100)+")";
					obj.style['filter']=value;
					obj.style['-moz-opacity']=value;
					obj.style['-khtml-opacity']=value;
				}
			}