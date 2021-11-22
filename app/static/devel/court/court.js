!function() {

   var C3D = {
     desc: "3D Tennis Court",
     version: "1.0.0",
   };

   var   DESCENDER_ADJUST = 1.28; 
   var   width = window.innerWidth;
   var   height = window.innerHeight;
   var   holding = false;
   var   clientY0;
   var   clientX0;
   var   pageY0;
   var   pageX0;

   var renderer;
   var crosshair;
   var court_container;
   var camera; 
   var scene;

   var body = d3.select("body")
   var text_group = new THREE.Group();
   text_group.name = "Text";

   var trajectory_group = new THREE.Group();
   trajectory_group.name = "Trajectories";

   var ball_group = new THREE.Group();
   ball_group.name = "Balls";

   var scale = 30;
   var court = { 
      singles_width: 8.23 * scale, width: 10.97 * scale, length: 11.89 * 2 * scale, 
      clear_width: 30 * scale, clear_length: 50 * scale, line_width: .06 * scale,
      service_line: 6.4 * scale, net_height: 1.07 * scale, net_center: .914 * scale, 
      post_height: 1.095 * scale, post_width: .14 * scale, post_offset: .91 * scale, 
      ball_radius: .15 * scale 
   }

   var ball_geometry = new THREE.SphereGeometry( court.ball_radius, 32, 32 );

   var mtouch = mtouch_events()
         .on("touch", touchstarted)
         .on("mdrag", dragmove)
         .on("release", dragend)
         .on("hold", starthold);

   var container = d3.select("#container")
        .style({
          "width" :   "100%",
          "height":   "100%",
          "position": "fixed",
          "top":0,
          "left":0,
          "bottom":0,
          "right":0
        })

   var svg = body.append("svg")
       .attr("preserveAspectRatio", "none")
       .attr("width", width)
       .attr("height", height)
       .style({
         "width" :   "100%",
         "height":   "100%",
         "position": "fixed",
         "top":0,
         "left":0,
         "bottom":0,
         "right":0,
       })

   var overlay = svg.append("rect")
       .attr("class", "overlay")
       .attr("width", width)
       .attr("height", height)
       .style({
         "opacity": 0
       })
       .datum({})
       .call(mtouch);

   d3.selectAll('.player_name')
      .attr({
          "font-size": "36px",
          "stroke": "black",
          "opacity": .5
      })

   function touchstarted() {
     updateCrosshair(d3.event.finger);
     var touch = d3.event.finger.pos;
     clientX0 = touch[0];
     clientY0 = touch[1];
     pageY0 = pageYOffset;
     pageX0 = pageXOffset;
     body.interrupt();
   }

   function starthold() { holding = true; }

   function dragmove(d) {
     var fingers = d3.event.dragged_fingers;
     fingers.forEach(function (finger, i) {
       if (i == 0) { updateCrosshair(finger, true); }
     });
   }

   function updateCrosshair(finger, notify) {
      var x = finger.pos[0]
      var y = finger.pos[1]
      var intersects = C3D.intersect(x, y).filter(function(f) { return f.object.name == 'surround'; });
      if (intersects.length) {
         var pointer = intersects[0];
         scene.worldToLocal(pointer.point);
         move(crosshair, { x: pointer.point.x, y: pointer.point.y });
         if (notify) crosshairNotify(pointer);
      }
   }

   function crosshairNotify(pointer) {
      if (inSingles(pointer)) {
         C3D.crosshairColor('#00ff00', true)
      } else {
         C3D.crosshairColor('red', true)
      }
   }

   function inSingles(pointer) {
      return (Math.abs(pointer.point.y) <= (court.singles_width / 2) + court.ball_radius / 2 &&
              Math.abs(pointer.point.x) <= (court.length / 2) + court.ball_radius / 2);
   }

   function dragend(d) {
      C3D.crosshairColor('')

      var finger = d3.event.finger;
      var view_changed = swipe(finger);
      if (view_changed) { return; }

      var intersects = C3D.intersect(finger.pos[0], finger.pos[1]).filter(function(f) { return f.object.name == 'surround'; });

      if (intersects.length) {
         var pointer = intersects[0];
         scene.worldToLocal(pointer.point);
         var color = inSingles(pointer) ? '#00ff00' : 'red';
         C3D.addBall({x: pointer.point.x, y: pointer.point.y, z: 2, color: color })
      }

      C3D.createTrajectory();
      C3D.render();

      delete d[d3.event.finger.id];

      if (holding) {
         holding = false;
         C3D.clear();
      }
   }

   function swipe(finger) {
     var clientX1 = finger.pos[0];
     var clientY1 = finger.pos[1];
     var pageY1 = pageY0 + clientY0 - clientY1;
     var pageX1 = pageX0 + clientX0 - clientX1;
     var direction;
     var changed;

     if (Math.abs(pageY1) > Math.abs(pageX1)) {
        if (pageY1 < -20) {
          direction = 'd';
          if (isLandscape()) {
             changed = true;
             scene.rotation.set(0, 0, 0);
             C3D.render();
          }
        } else if (pageY1 > 20) {
          direction = 'u';
          if (isLandscape()) {
             changed = true;
             scene.rotation.set(-1.0472, 0, 0);
             C3D.render();
          }
        }
     } else {
        if (pageX1 < -20) {
          if (isPortrait()) {
             d3.select('#colorwheel').style('display', 'none')
             changed = true;
             scene.rotation.set(0, 0, 1.57);
             C3D.render();
          }
          direction = 'r';
        } else if (pageX1 > 20) {
          if (isPortrait()) {
             d3.select('#colorwheel').style('display', 'inline')
             changed = true;
             scene.rotation.set(-1.13, 1.6653345369377348e-16, 1.57);
             C3D.render();
          }
          direction = 'l';
        }
     }
     return changed;
   }

   // iOS reports the wrong innerHeight on load!
   d3.timer(function() {
     resized();
     return true;
   });

   function resized() {
     width = window.innerWidth;
     height = window.innerHeight;

     if (camera != undefined) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );
        render();
     }

     container
       .attr("width", width)
       .attr("height", height)
     svg
       .attr("width", width)
       .attr("height", height)
     overlay
       .attr("width", width)
       .attr("height", height)

     applyOrientation();
   }

   window.addEventListener( 'resize', resized, false );

   function applyOrientation() {
     var aspect_ratio = window.innerWidth / window.innerHeight
     var dist = (court.length * 1.1) / ( 2 * Math.tan( camera.fov * Math.PI / 360 ) );
     if (isPortrait()) {
        camera.position.set(0,0, dist);
        scene.rotation.z = Math.PI / 2;
        C3D.look();
     } else {
        d3.select('#colorwheel').style('display', 'none')
        dist = dist / aspect_ratio;
        camera.position.set(0,0, dist);
        scene.rotation.z = 0;
        C3D.look();
     }
   }

   function isPortrait() { return window.innerHeight > window.innerWidth; }
   function isLandscape() { return window.innerHeight < window.innerWidth; }

   if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

   function animate() {
      requestAnimationFrame(animate);
   }

   C3D.intersect = intersect;
   function intersect(x, y) {
      var vector = new THREE.Vector3(( x / window.innerWidth ) * 2 - 1, -( y / window.innerHeight ) * 2 + 1, 0.5);
      vector = vector.unproject(camera);

      var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
      var intersects = raycaster.intersectObjects(scene.children);
      return intersects;
   }

   C3D.init = init;
   function init() {

      camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
      C3D.camera = camera;
      camera.position.set(0, 0, 480);

      scene = new THREE.Scene();
      C3D.scene = scene;
      loadTextures();

      addCourt();
      addLights();
      addCrosshair();
      scene.add(ball_group);
      scene.add(trajectory_group);

      renderer = new THREE.WebGLRenderer( { antialias: false } );
      renderer.setClearColor( "white" );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );

      court_container = document.getElementById( 'container' );
      court_container.appendChild( renderer.domElement );

      C3D.courtColors('darkblue', 'lightblue')

      /*
      var loader = new THREE.FontLoader();
      loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.js', function ( font ) {
          text_group.add(addText("Player One", font, { x: -court.length / 4, y: court.width / 2 + 30, z: 1 }));
          text_group.add(addText("Player Two", font, { x: court.length / 4, y: court.width / 2 + 30, z: 1 }));
          scene.add(text_group);
          render();
      });
      */

      var txSprite = makeTextSprite( "Center-Center", 0, 0, 380, { fontsize: 1272, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0},  
          borderThickness:10, radius:10, fillColor: {r:255, g:255, b:255, a:1.0}, vAlign:"center", hAlign:"center" } ); 
      scene.add( txSprite ); 
   }

   function addText(text, font, position) {
       var sometext = new THREE.TextGeometry( text, {
           font: font,
           size: 20,
           height: 1,
           curveSegments: 12,
           bevelThickness: 0,
           bevelSize: 0,
           bevelEnabled: false
       });
       sometext.center();
       var textMaterial = new THREE.MeshPhongMaterial( { color: 'blue' } );
       var mesh = new THREE.Mesh( sometext, textMaterial );
       mesh.name = "player_one";
       mesh.position.y = position.y;
       mesh.position.x = position.x;
       mesh.position.z = position.z;
       mesh.castShadow = false;
       mesh.receiveShadow = false;
       return mesh;
   }

   function addCourt() {
      var geometry = new THREE.PlaneGeometry( court.clear_length, court.clear_width );
      var surround = new THREE.Mesh( geometry );
      surround.position.z = -.05;
      surround.name = 'surround';
      scene.add( surround );

      var court_group = new THREE.Group();
      court_group.name = 'court';

      /*
      var geometry = new THREE.PlaneGeometry(court.length, court.width );
      var court_surface = new THREE.Mesh( geometry );
      court_surface.material.side = THREE.DoubleSide;
      court_surface.name = 'court';
      court_group.add( court_surface );
      */

      var geometry = new THREE.PlaneGeometry(court.service_line, court.singles_width / 2 );
      var surface = new THREE.Mesh( geometry );
      surface.material = new THREE.MeshBasicMaterial( { color: "blue" } ); 
      surface.position.x = court.service_line / 2;
      surface.position.y = court.singles_width / 4;
      surface.name = 'deuce0';
      court_group.add( surface );

      var geometry = new THREE.PlaneGeometry(court.service_line, court.singles_width / 2 );
      var surface = new THREE.Mesh( geometry );
      surface.material = new THREE.MeshBasicMaterial( { color: "blue" } ); 
      surface.position.x = -court.service_line / 2;
      surface.position.y = -court.singles_width / 4;
      surface.name = 'deuce1';
      court_group.add( surface );

      var geometry = new THREE.PlaneGeometry(court.service_line, court.singles_width / 2 );
      var surface = new THREE.Mesh( geometry );
      surface.material = new THREE.MeshBasicMaterial( { color: "green" } ); 
      surface.position.x = court.service_line / 2;
      surface.position.y = -court.singles_width / 4;
      surface.name = 'ad0';
      court_group.add( surface );

      var geometry = new THREE.PlaneGeometry(court.service_line, court.singles_width / 2 );
      var surface = new THREE.Mesh( geometry );
      surface.material = new THREE.MeshBasicMaterial( { color: "green" } ); 
      surface.position.x = -court.service_line / 2;
      surface.position.y = court.singles_width / 4;
      surface.name = 'ad1';
      court_group.add( surface );

      var geometry = new THREE.PlaneGeometry(court.length / 2 - court.service_line, court.singles_width );
      var surface = new THREE.Mesh( geometry );
      surface.material = new THREE.MeshBasicMaterial( { color: "red" } ); 
      surface.position.x = (court.length / 2 + court.service_line) / 2;
      surface.name = 'backcourt0';
      court_group.add( surface );

      var geometry = new THREE.PlaneGeometry(court.length / 2 - court.service_line, court.singles_width );
      var surface = new THREE.Mesh( geometry );
      surface.material = new THREE.MeshBasicMaterial( { color: "red" } ); 
      surface.position.x = -(court.length / 2 + court.service_line) / 2;
      surface.name = 'backcourt1';
      court_group.add( surface );

      var geometry = new THREE.PlaneGeometry(court.length, (court.width - court.singles_width) / 2 );
      var surface = new THREE.Mesh( geometry );
      surface.material = new THREE.MeshBasicMaterial( { color: "darkblue" } ); 
      surface.position.y = (court.singles_width + court.width) / 4;
      surface.name = 'doubles_right';
      court_group.add( surface );

      var geometry = new THREE.PlaneGeometry(court.length, (court.width - court.singles_width) / 2 );
      var surface = new THREE.Mesh( geometry );
      surface.material = new THREE.MeshBasicMaterial( { color: "darkblue" } ); 
      surface.position.y = -(court.singles_width + court.width) / 4;
      surface.name = 'doubles_left';
      court_group.add( surface );

      court_group.add(courtLines());
      scene.add(court_group);
   }

   function addLights() {
      var lights = new THREE.Group();
      lights.name = "Lights";
      var light = new THREE.DirectionalLight( 0x222222 );
      light.position.set( -1, 1, 1 );
      lights.add( light );
      var light = new THREE.DirectionalLight( 0x222222 );
      light.position.set( 1, -1, 1 );
      lights.add( light );
      var light = new THREE.DirectionalLight( 0xffffff );
      light.position.set( 1, 1, 1 );
      lights.add( light );
      var light = new THREE.DirectionalLight( 0xffffff );
      light.position.set( -1, -1, -1 );
      lights.add( light );

      // var light = new THREE.AmbientLight( 0x222222 );
      // lights.add( light );

      scene.add(lights);
   }

   function courtLines() {
      var lines = new THREE.Group();
      lines.name = "Lines";
      var line_material = new THREE.MeshBasicMaterial( {color: "white" } ); 

      add_line(court.length, court.line_width, 0, court.width / 2, .1);
      add_line(court.length, court.line_width, 0, -1 * court.width / 2, .1);
      add_line(court.length, court.line_width, 0, -1 * court.singles_width / 2, .1);
      add_line(court.length, court.line_width, 0, court.singles_width / 2, .1);
      add_line(court.service_line * 2, court.line_width, 0, 0, .1);

      add_line(court.line_width * 2, court.width, 0, 0, .1);
      add_line(court.line_width * 2, court.width, -1 * court.length / 2, 0, .1);
      add_line(court.line_width, court.width, court.length / 2, 0, .1);
      add_line(court.line_width, court.singles_width, court.service_line, 0, .1);
      add_line(court.line_width, court.singles_width, -1 * court.service_line, 0, .1);

      add_line(court.line_width * 4, court.line_width, (court.length / 2) - (court.line_width * 2), 0, .1);
      add_line(court.line_width * 4, court.line_width, -1 * ((court.length / 2) - (court.line_width * 2)), 0, .1);

      function add_line(length, width, x, y, z) {
         var line = createLine(line_material, length, width, x, y, z);
         lines.add( line );
      }
      return lines;
   }

   function createLine(material, length, width, x, y, z) {
      var geometry = new THREE.PlaneGeometry( length, width, 32 );
      var line = new THREE.Mesh( geometry, material );
      line.position.x = x;
      line.position.y = y;
      line.position.z = z;
      return line;
   }

   function addCrosshair() {
      var crosshair_material = new THREE.MeshBasicMaterial( ); 
      crosshair_material.opacity = 0;
      crosshair_material.transparent = true;
      crosshair = new THREE.Group();
      crosshair.name = "Crosshair";
      crosshair.add( createLine(crosshair_material, 120, 2, 0, 0, 3) );
      crosshair.add( createLine(crosshair_material, 2, 120, 0, 0, 3) );

      var ball = new THREE.Mesh( ball_geometry, crosshair_material );
      ball.geometry = ball_geometry;
      ball.position.x = 0;
      ball.position.y = 0;
      ball.position.z = 3;
      ball.updateMatrix();
      ball.matrixAutoUpdate = false;
      crosshair.add(ball);

      scene.add(crosshair);
   }

   C3D.render = render;
   function render() {
      renderer.render( scene, camera );
   }

   C3D.courtColors = courtColors;
   function courtColors(court, surround) {
      var c = scene.children.filter(function(f) { return f.name == 'court'; })[0];
      if (c) {
         c.children.forEach(function(e) {
            e.material = new THREE.MeshBasicMaterial( { color: court } ); 
         })
      }
      var s = scene.children.filter(function(f) { return f.name == 'surround'; })[0];
      s.material = new THREE.MeshBasicMaterial( { color: surround } );
      render();
   }

   C3D.crosshairColor = crosshairColor;
   function crosshairColor(color, display) {
      crosshair.children.forEach(function(c) {
         if (display) {
            c.material = new THREE.MeshBasicMaterial( { color: color } ); 
            show(c.material);
         } else {
            C3D.hide(c.material);
         }
      });
   }

   C3D.toggle = toggle;
   function toggle(material) {
      material.opacity = 1 - material.opacity;
      material.transparent = ! material.transparent;
      render();
   }

   C3D.show = show;
   function show(material) {
      material.opacity = 1;
      material.transparent = false;
      render();
   }

   C3D.hide = hide;
   function hide(material) {
      material.opacity = 0;
      material.transparent = true;
      render();
   }

   C3D.look = look;
   function look(x, y, z) {
      camera.lookAt(new THREE.Vector3(x, y, z));
      camera.updateProjectionMatrix();
      render();
   }

   C3D.rotateObject = rotateObject;
   function rotateObject(object,degreeX, degreeY, degreeZ){
      degreeX = (degreeX * Math.PI)/180;
      degreeY = (degreeY * Math.PI)/180;
      degreeZ = (degreeZ * Math.PI)/180;

      object.rotateX(degreeX);
      object.rotateY(degreeY);
      object.rotateZ(degreeZ);
   }

   C3D.clear = clean_scene;
   function clean_scene() {
      for (var i = ball_group.children.length - 1; i >= 0; i--) {
         ball_group.remove(ball_group.children[i]);
      }
      for (var i = trajectory_group.children.length - 1; i >= 0; i--) {
         trajectory_group.remove(trajectory_group.children[i]);
      }
      render();
   }

   C3D.move = move;
   function move(object, location) {
      if (location.x) object.position.x = location.x;
      if (location.y) object.position.y = location.y;
      if (location.z) object.position.z = location.z;
      object.updateMatrix();
      render();
   }

   C3D.createTrajectory = createTrajectory;
   function createTrajectory() {
      if (ball_group.children.length < 2) return;

      var last = ball_group.children.slice(ball_group.children.length - 2);
      var midX = (last[0].position.x + last[1].position.x) / 2;
      var midY = (last[0].position.y + last[1].position.y) / 2;

      var distance = hypotenuse = Math.sqrt(
         Math.pow(last[0].position.x - last[1].position.x, 2) + 
         Math.pow(last[0].position.y - last[1].position.y, 2)
      );

      // var slope = (last[1].position.y - last[0].position.y) / (last[1].position.x - last[0].position.x);
      // var changeX = Math.abs(last[0].position.x - last[1].position.x);
      // var changeY = opposite = Math.abs(last[0].position.y - last[1].position.y);
      // var angle = Math.asin(opposite / hypotenuse);

      var numPoints = 100;
      spline = new THREE.CatmullRomCurve3([
         last[0].position, 
         new THREE.Vector3(midX, midY, 50), 
         last[1].position
      ]);

      var material = new THREE.LineBasicMaterial({ color: "yellow", linewidth: 3 });
      var geometry = new THREE.Geometry();
      var splinePoints = spline.getPoints(numPoints);
      splinePoints.forEach(function(s) { geometry.vertices.push(s);  });
      var line = new THREE.Line(geometry, material);
      trajectory_group.add(line);
   }

   // create net
   function createNet() {
      var netShape = [];
      var net_group = new THREE.Group();
      net_group.name = "Net";

      var tape_material = new THREE.MeshBasicMaterial( {color: "white", side: THREE.DoubleSide } ); 
      var geometry = new THREE.PlaneGeometry( court.line_width, court.net_center, 32 );
      var center_tape = new THREE.Mesh( geometry, tape_material );
      center_tape.position.set(.1, 0, court.net_center / 2);
      center_tape.rotation.x = Math.PI / 2;
      center_tape.rotation.y = Math.PI / 2;
      net_group.add( center_tape );

      var geometry = new THREE.PlaneGeometry( court.line_width, court.net_center, 32 );
      var center_tape = new THREE.Mesh( geometry, tape_material );
      center_tape.position.set(-.1, 0, court.net_center / 2);
      center_tape.rotation.x = Math.PI / 2;
      center_tape.rotation.y = Math.PI / 2;
      net_group.add( center_tape );

      var post_material = new THREE.MeshBasicMaterial( {color: "darkgreen" } ); 
      add_post();
      add_post(1);

      function add_post(side) {
         var neg = side ? 1 : -1;
         var geometry = new THREE.BoxGeometry( court.post_width, court.post_width, court.post_height ); 
         var post = new THREE.Mesh( geometry, post_material ); 
         post.position.z = court.post_height / 2;
         post.position.y = neg * (court.width / 2 + court.post_offset);
         net_group.add( post );
      }


      netShape[0] = new THREE.Shape();
      netShape[0].moveTo( 0, scale );
      netShape[0].lineTo( court.width / 2, scale );
      netShape[0].lineTo( court.width / 2, 1.85 * court.net_height );
      netShape[0].lineTo( 0, 1.75 * court.net_height );
      netShape[0].lineTo( 0, scale );

      netShape[1] = new THREE.Shape();
      netShape[1].moveTo( 0, scale );
      netShape[1].lineTo( - court.width / 2, scale );
      netShape[1].lineTo( - court.width / 2, 1.85 * court.net_height );
      netShape[1].lineTo( 0, 1.75 * court.net_height );
      netShape[1].lineTo( 0, scale );

      netShape[2] = new THREE.Shape();
      netShape[2].moveTo( 0, 56);
      netShape[2].lineTo( - ((court.width / 2) + court.post_offset), 59);
      netShape[2].lineTo( - ((court.width / 2) + court.post_offset), 60.5);
      netShape[2].lineTo( 0, 57.5 );

      netShape[3] = new THREE.Shape();
      netShape[3].moveTo( 0, 56);
      netShape[3].lineTo( ((court.width / 2) + court.post_offset), 59);
      netShape[3].lineTo( ((court.width / 2) + court.post_offset), 60.5);
      netShape[3].lineTo( 0, 57.5 );

      var extrudeSettings = { amount: .5, bevelEnabled: false };

      var myshape = createShape( netShape[0], null, null, 0, 0, 3 - court.net_height, Math.PI / 2, Math.PI / 2, 0, 1 );
      net_group.add (myshape);
      var myshape = createShape( netShape[1], null, null, 0, 0, 3 - court.net_height, Math.PI / 2, Math.PI / 2, 0, 1 );
      net_group.add (myshape);
      var myshape = createShape( netShape[2], extrudeSettings, "white", - .25, 0, 3 - court.net_height, Math.PI / 2, Math.PI / 2, 0, 1 );
      net_group.add (myshape);
      var myshape = createShape( netShape[3], extrudeSettings, "white", - .25, 0, 3 - court.net_height, Math.PI / 2, Math.PI / 2, 0, 1 );
      net_group.add (myshape);

      function createShape( shape, extrudeSettings, color, x, y, z, rx, ry, rz, s ) {

         if (extrudeSettings) {
            // 3d shape
            var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );

            var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: color } ) );
            mesh.position.set( x, y, z );
            mesh.rotation.set( rx, ry, rz );
            mesh.scale.set( s, s, s );
         } else {
            // flat shape
            var geometry = new THREE.ShapeGeometry( shape );

            var material = new THREE.MeshPhongMaterial( { alphaTest: 0.1, side: THREE.DoubleSide, map: net_texture } ); 
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.set( x, y, z );
            mesh.rotation.set( rx, ry, rz );
            mesh.scale.set( s, s, s );
         }
         return mesh;
      }
      scene.add(net_group);
      C3D.look();
   }

   // -------------------------------------------------------------------------------------------------
   // display balls and trajectories
   C3D.addBall = addBall;
   function addBall(b) {
      var material = new THREE.MeshBasicMaterial( {color: b.color ? b.color : "yellow"} );
      var ball = new THREE.Mesh( ball_geometry, material );
      ball.geometry = ball_geometry;
      ball.position.x = b.x;
      ball.position.y = b.y;
      ball.position.z = b.z;
      ball.updateMatrix();
      ball.matrixAutoUpdate = false;
      ball_group.add(ball);
      return ball;
   }

   function loadTextures() {
      var TexturesToLoad = []
      TexturesToLoad.push("./images/net.png")

      var callback = function(ReturnedMaterials) {
        ReturnedMaterials[0].wrapS = ReturnedMaterials[0].wrapT = THREE.RepeatWrapping;
        ReturnedMaterials[0].repeat.set( .08, .08 ); 
        net_texture = ReturnedMaterials[0];
        createNet();
      };

      MultiLoader(TexturesToLoad, callback)
   }

   function MultiLoader(TexturesToLoad, callback, ReturnObjects) {
       if (TexturesToLoad.length == 0) return;
       if (!ReturnObjects) ReturnObjects = [];
       var loader = new THREE.TextureLoader();
       var texture = TexturesToLoad.shift();

       loader.load(texture,

          function (texture) {
              ReturnObjects.push(texture);
              if (TexturesToLoad.length > 0) {
                  MultiLoader(TexturesToLoad, callback, ReturnObjects)
              } else {
                  callback(ReturnObjects)
              }
          },
          LoadProgress,
          LoadError
       );
    }

    function LoadProgress(xhr) {
       console.log(('Loading  ' + xhr.loaded / xhr.total * 100) + '% loaded ');
    }

    function LoadError(xhr) {
       console.log('An error happened  ');
    }

    function makeTextSprite( message, x, y, z, parameters ) {
        if ( parameters === undefined ) parameters = {}; 
         
        var fontface = parameters.hasOwnProperty("fontface") ?  
            parameters["fontface"] : "Arial"; 
         
        var fontsize = parameters.hasOwnProperty("fontsize") ?  
            parameters["fontsize"] : 18; 
         
        var borderThickness = parameters.hasOwnProperty("borderThickness") ?  
            parameters["borderThickness"] : 4; 
         
        var borderColor = parameters.hasOwnProperty("borderColor") ? 
            parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 }; 
         
        var fillColor = parameters.hasOwnProperty("fillColor") ? 
            parameters["fillColor"] : undefined; 
     
        var textColor = parameters.hasOwnProperty("textColor") ? 
            parameters["textColor"] : { r:0, g:0, b:255, a:1.0 }; 
     
        var radius = parameters.hasOwnProperty("radius") ? 
                    parameters["radius"] : 6; 
     
        var vAlign = parameters.hasOwnProperty("vAlign") ? 
                            parameters["vAlign"] : "center"; 
     
        var hAlign = parameters.hasOwnProperty("hAlign") ? 
                            parameters["hAlign"] : "center"; 
     
        var canvas = document.createElement('canvas'); 
        var context = canvas.getContext('2d'); 
         
        canvas.width = 2048; 
        canvas.height = 1024; 
         
        context.font = fontsize + "px " + fontface; 
        context.textBaseline = "alphabetic"; 
        context.textAlign = "left"; 
         
        // get size data (height depends only on font size) 
        var metrics = context.measureText( message ); 
        var textWidth = metrics.width; 
         
        // find the center of the canvas and the half of the font width and height 
        // we do it this way because the sprite's position is the CENTER of the sprite 
        var cx = canvas.width / 2; 
        var cy = canvas.height / 2; 
        var tx = textWidth/ 2.0; 
        var ty = fontsize / 2.0; 
     
        // then adjust for the justification 
        if ( vAlign == "bottom") 
            ty = 0; 
        else if (vAlign == "top") 
            ty = fontsize; 
         
        if (hAlign == "left") 
            tx = textWidth; 
        else if (hAlign == "right") 
            tx = 0; 
         
        // the DESCENDER_ADJUST is extra height factor for text below baseline: g,j,p,q. since we don't know the true bbox 
        roundRect(context, cx - tx , cy + ty + 0.28 * fontsize,  
                textWidth, fontsize * DESCENDER_ADJUST, radius, borderThickness, borderColor, fillColor); 
         
        // text color.  Note that we have to do this AFTER the round-rect as it also uses the "fillstyle" of the canvas 
        context.fillStyle = getCanvasColor(textColor); 
        context.fillText( message, cx - tx, cy + ty); 
      
        // draw some visual references - debug only 
        // drawCrossHairs( context, cx, cy );     
        // outlineCanvas(context, canvas); 
        
        // canvas contents will be used for a texture 
        var texture = new THREE.Texture(canvas) 
        texture.needsUpdate = true; 
     
        var spriteMaterial = new THREE.SpriteMaterial( { map: texture } ); 
        var sprite = new THREE.Sprite( spriteMaterial ); 
         
        // we MUST set the scale to 2:1.  The canvas is already at a 2:1 scale, 
        // but the sprite itself is square: 1.0 by 1.0 
        // Note also that the size of the scale factors controls the actual size of the text-label 
        sprite.scale.set(4,2,1); 
         
        // set the sprite's position.  Note that this position is in the CENTER of the sprite 
        sprite.position.set(x, y, z); 
         
        return sprite;     
    } 

    function roundRect(ctx, x, y, w, h, r, borderThickness, borderColor, fillColor)  {
        if (fillColor == undefined && borderColor == undefined)  
            return; 
     
        x -= borderThickness + r; 
        y += borderThickness + r; 
        w += borderThickness * 2 + r * 2; 
        h += borderThickness * 2 + r * 2; 
         
        ctx.beginPath(); 
        ctx.moveTo(x+r, y); 
        ctx.lineTo(x+w-r, y); 
        ctx.quadraticCurveTo(x+w, y, x+w, y-r); 
        ctx.lineTo(x+w, y-h+r); 
        ctx.quadraticCurveTo(x+w, y-h, x+w-r, y-h); 
        ctx.lineTo(x+r, y-h); 
        ctx.quadraticCurveTo(x, y-h, x, y-h+r); 
        ctx.lineTo(x, y-r); 
        ctx.quadraticCurveTo(x, y, x+r, y); 
        ctx.closePath(); 
         
        ctx.lineWidth = borderThickness; 
     
        if (fillColor != undefined) { 
            ctx.fillStyle = getCanvasColor(fillColor); 
            ctx.fill(); 
        } 
         
        if (borderThickness > 0 && borderColor != undefined) { 
            ctx.strokeStyle = getCanvasColor(borderColor); 
            ctx.stroke(); 
        } 
    } 

    function getCanvasColor ( color ) { 
        return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")"; 
    } 

  this.C3D = C3D;
}();
