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
							props[name].currentProp = obj.style[name]?obj.style[name].replace("px", ""):0;
						
						}else{
							newProp = props[name].value;
						}
							
						if ( props[name].currentProp == null || props[name].currentProp == "")
						{
							if(!obj.style[name])
							{
								props[name].currentProp = (name=="opacity")?1: 0;
							}else{
								props[name].currentProp = obj.style[name].replace(/\D/g,'');
							}
						}
									
						
						if(props[name].negative==null)
							{
								props[name].negative = Number(newProp) < Number(props[name].currentProp)  ? true : false;
							
								props[name].subtraction = Math.abs(Number(props[name].currentProp) - Number(newProp)) / ( (duration * 1000) /framerate);
							}
						
						if (props[name].negative && Number(props[name].currentProp)- Number(props[name].subtraction) >= Number(newProp) || !props[name].negative && Number(props[name].currentProp) + Number(props[name].subtraction) <= Number(newProp)) {
							
							
							if(props[name].negative)
							{
								props[name].currentProp = Number(props[name].currentProp) - Number(props[name].subtraction); 
								
							}else{
								
								props[name].currentProp = Number(props[name].currentProp) + Number(props[name].subtraction); 
							}
							
							obj.style[name] = props[name].currentProp + (props[name].suffix?"px":"");
							if(name=="opacity")this.setOpacity(obj,props[name].currentProp);
						}else if(!props[name].complete){
							obj.style[name] = newProp + (props[name].suffix?"px":"");
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
					if(obj.style['-ms-filter'])obj.style['-ms-filter']="progid:DXImageTransform.Microsoft.Alpha(Opacity="+(value*100)+")";
					if(obj.style['filter'])obj.style['filter']=value;
					if(obj.style['-moz-opacity'])obj.style['-moz-opacity']=value;
					if(obj.style['-khtml-opacity'])obj.style['-khtml-opacity']=value;
				}
			}
