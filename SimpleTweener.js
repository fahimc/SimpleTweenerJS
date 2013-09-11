var tween = {
	fs:35,
	tweens : [],
	to : function(obj, duration, props, callback) {
		var tweener = new Tweener(obj, duration, props, callback);
		this.tweens.push(tweener);
		if(!window.tweenTimer)
		{
			var par = this;
			var handler = function() {
				par.onFrame();
			};
			window.tweenTimer = setInterval(handler, 35);
		}
	},
	onFrame:function()
	{
		for(var a=0;a<this.tweens.length;a++)
		{
			if(this.tweens[a].done)
			{
				delete this.tweens[a];
				this.tweens.splice(a,1);
			}else{
			this.tweens[a].onFrame();				
			}
		}
		if(this.tweens.length==0)
		{
			clearInterval(window.tweenTimer);
			window.tweenTimer=null;
		}
	},
	setOpacity: function(obj, value) {
		if (obj.style['-ms-filter'])
			obj.style['-ms-filter'] = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (value * 100) + ")";
		if (obj.style['filter'])
			obj.style['filter'] = value;
		if (obj.style['-moz-opacity'])
			obj.style['-moz-opacity'] = value;
		if (obj.style['-khtml-opacity'])
			obj.style['-khtml-opacity'] = value;
	},
	getStyle: function(el, cssprop) {
		if (el.currentStyle)//IE
			return el.currentStyle[cssprop]
		else if (document.defaultView && document.defaultView.getComputedStyle)//Firefox
			return document.defaultView.getComputedStyle(el, "")[cssprop]
		else//try and get inline style
			return el.style[cssprop]
	}
};

var Tweener = function(obj, duration, props, callback) {
	this.obj = obj;
	this.duration = duration;
	this.props = props;
	this.callback = callback;
	this.done=false;
	var framerate = 35;
	this.onFrame = function() {
		var doneCount = 0;
		var children = 0;
		for (var name in this.props) {
			var newProp;
			children++;
			if (this.props[name].value == null) {
				var suffix = (String(props[name]).indexOf("px") >= 0);
				newProp = String(this.props[name]).replace("px", "");
				this.props[name] = {
					value : newProp,
					negative : null,
					complete : false,
					subtraction : null,
					currentProp : null,
					suffix : suffix
				};
				this.props[name].currentProp = this.obj.style[name] ? obj.style[name].replace("px", "") : 0;

			} else {
				newProp = this.props[name].value;
			}

			if (this.props[name].currentProp == null || this.props[name].currentProp == "") {

				if (tween.getStyle(this.obj, name) == "" || tween.getStyle(obj, name) == null || tween.getStyle(obj, name) == undefined) {
					this.props[name].currentProp = (name == "opacity") ? 1 : 0;
				} else {
					this.props[name].currentProp = tween.getStyle(obj, name).replace(/\D/g, '');
				}
			}

			if (this.props[name].negative == null) {
				this.props[name].negative = Number(newProp) < Number(this.props[name].currentProp) ? true : false;

				this.props[name].subtraction = Math.abs(Number(this.props[name].currentProp) - Number(newProp)) / ((this.duration * 1000) / framerate);
			}

			if (this.props[name].negative && Number(this.props[name].currentProp) - Number(this.props[name].subtraction) >= Number(newProp) || !this.props[name].negative && Number(this.props[name].currentProp) + Number(this.props[name].subtraction) <= Number(newProp)) {

				if (this.props[name].negative) {
					this.props[name].currentProp = Number(this.props[name].currentProp) - Number(this.props[name].subtraction);

				} else {

					this.props[name].currentProp = Number(this.props[name].currentProp) + Number(this.props[name].subtraction);
				}

				this.obj.style[name] = this.props[name].currentProp + (this.props[name].suffix ? "px" : "");
				if (name == "opacity")
					tween.setOpacity(this.obj, this.props[name].currentProp);
			} else if (!this.props[name].complete) {
				this.obj.style[name] = newProp + (this.props[name].suffix ? "px" : "");
				this.props[name].complete = true;
				doneCount++;

			}

		}
		if (doneCount >= children) {
			this.done=true;
			if (this.callback)
				this.callback();
		}
	};
	
	
}; 
