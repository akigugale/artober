document.addEventListener('DOMContentLoaded', function(){

	var joystick = document.getElementById("joystick"),
			    knob = document.getElementById("knob"),
			target_x = joystick.clientWidth/2-knob.clientWidth/2,
			target_y = joystick.clientHeight/2-knob.clientHeight/2;

	var panSpan  = document.getElementById("panValue"),
            tiltSpan = document.getElementById("tiltValue")
            rotation = document.getElementById("rotation");

	knob.style.webkitTransform = "translate("+target_x+"px, "+target_y+"px)";

	// update the position attributes
	var target = document.getElementById("knob");
	updatePositionAttributes(target,target_x,target_y);

	// target elements with the "draggable" class
	interact('.draggable')
		.draggable({
			inertia: false,
			// keep the element within the area of its parent
			restrict: {
				restriction: "parent",
				endOnly: false,
				elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
			},
			onmove: dragMoveListener,
			onend: function (event) {
				var target = event.target;
				TweenLite.to(target, 0.2, {ease: Back.easeOut.config(1.7), "webkitTransform":"translate("+target_x+"px, "+target_y+"px)"});
				updatePositionAttributes(target,target_x,target_y);
				panSpan.innerHTML = 0;
				tiltSpan.innerHTML = 0;
			}
		});

	function dragMoveListener (event) {
		var target = event.target,
				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
				y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

		// translate the element
		target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
		updatePositionAttributes(target,x,y);

		// update text display
		panSpan.innerHTML = (x-joystick.clientWidth/4);
		tiltSpan.innerHTML = -1*(y-joystick.clientHeight/4);
	}

	function updatePositionAttributes(element,x,y){
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
        // console.log(getAngleDeg(x,y));
        angle = getAngleDeg(x,y);
        // turnGoldfish(angle);
    }

    var previousangle = 0, ax = 0, ay =0;
    function getAngleDeg(bx,by) {
        bx = (bx-joystick.clientWidth/4);
        by = (by-joystick.clientHeight/4);
        console.log('X = ' + bx + "&  Y = " + by);
        var angleRad = Math.atan2(bx, by);
        var angleDeg = Math.floor((90+180+(angleRad * 180 / Math.PI))%360);
        rotation.innerHTML = angleDeg;
        angleChange = previousangle - angleDeg;

        if(Math.abs(angleChange) > 10 || Math.abs(bx - ax) > 5 || Math.abs(by - ay) > 5){
            ay = by;
            ax = bx;
            previousangle = angleDeg;
            turnGoldfish(angleDeg, bx, by);
        }
    }

    // console.log("Animation is - " + document.getElementById('goldfish')) ;
    // console.log(el.getAttribute('animation__rotation'));

    function turnGoldfish(angle, ax, ay) {
        el = document.getElementById('goldfish');
        el.setAttribute('animation__rotation', {
            to: "0 " + (angle+90)%360 + " 0"
        });
        pos = (ax / 50) + " 0.5 " + (ay / 50);
        console.log(pos);

        el.setAttribute('animation__position', {
            to: pos
        })
    }
});