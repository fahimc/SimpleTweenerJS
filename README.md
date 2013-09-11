SimpleTweenerJS
===============

A cross-browser simple tweening class for quick transitions in Javascript. 

# How to use

call tween(object,duration,{properties},callback);  

- object: the DOM element you want to animate.  
- duration: the duration on seconds (1 for 1 second)
- {properites}: provide a object with the properties you want to animate. (opacity works cross browser)  
- callback: prodvide a function which you want to callback after the animation has complete.  

# Example  

    var box = document.getElementById('box');

    tween.to(box, 1, {left : "200px",top:"200px",opacity:0},complete);
		
		function complete()
		{
			alert("done");
		}
