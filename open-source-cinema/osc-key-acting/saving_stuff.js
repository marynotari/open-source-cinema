// // Grabbing
// let selectedElement;
// let numberOfElements = 0;
// let dragging = false;
// let allElements = [];

// UI VARIABLES
let name_field;
let take_field;
let scene_field;
let takeNum = 1;
let scene = 0;
let scenes = ["Signing In The Rain", "Jurassic Park", "Star Wars Episode V: The Empire Strikes Back"];
//let other_people;

//go to  http://docs.mlab.com/ sign up and get get your own api Key and make your own db and collection
let apiKey = "5MvINM5k1SkaPwnYmtPC6Rpu4y4vJlBs";
let db = "open-source-cinema";
let coll = "osc_acting";


function htmlInterface(){
  name_field = $("#name");
  name_field.val("Mary");
  take_field = $("#takeNum");
  scene_field = $("#scene");
  $("#previous").click(previous);
  $("#next").click(next);
  $("#previous_scene").click(previousScene);
  $("#next_scene").click(nextScene);
  take_field.val(takeNum);
  scene_field.val(scenes[scene]);
}

function nextScene(){
  scene = scene + 1;
  scene_field.val(scenes[scene]);
}

function previousScene(){
  scene = max(1, scene-1);
  scene_field.val(scenes[scene]);
}

function previous(){
  saveCamera();
  takeNum = max(1,takeNum -1);
  take_field.val(takeNum);
  // getTake()
}

function next(){
  saveCamera();
  takeNum++;
  take_field.val(takeNum);
  // getTake()
}

function keyPressed(){
   //opportunity for you to change the background?
}

function saveKeying(thisObj){
      let myName =  name_field.val() ;
      let thisElementArray = {}; //make an array for sending
      thisElementArray.owner = myName;
      thisElementArray.type = "keying";
      thisElementArray.take = takeNum ;
      thisElementArray.x = thisObj.position.x;
      thisElementArray.y = thisObj.position.y;
      thisElementArray.z = thisObj.position.z;
      thisElementArray.rx = thisObj.rotation.x;
      thisElementArray.ry = thisObj.rotation.y;
      thisElementArray.rz = thisObj.rotation.z;
      thisElementArray.scene = scenes[scene];
      let data = JSON.stringify(thisElementArray ) ;

      //REMOVED type:"camera" FROM JSON.stringify
      let query =  "q=" + JSON.stringify({take:takeNum, type:"keying"}) + "&";
      $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?" +  query + "u=true&apiKey=" + apiKey,
      data: data,
      type: "PUT",
      contentType: "application/json",
      success: function(data){console.log("saved Keying" );},
      failure: function(data){console.log("didn't keying" );}
    });
    }

// //MIGHT NOT NEED THIS IF NO 3D CAMERA
// function saveCamera(){
//
//       let heading = panorama.getPov();
//       console.log(heading);
//       let pos = panorama.getPano();
//       console.log(pos);
//
//       let myName =  name_field.val() ;
//       let thisElementArray = {}; //make an array for sending
//       thisElementArray.owner = myName;
//       thisElementArray.type = "camera"
//       thisElementArray.take = takeNum ;
//       thisElementArray.camera = camera3D.matrix.toArray();
//       thisElementArray.cameraFOV = camera3D.fov; //camera3D.fov;
//       thisElementArray.panoID = panorama.getPano(); //camera3D.fov;
//       thisElementArray.panoPOV = panorama.getPov(); //camera3D.fov;
//       thisElementArray.scene = scenes[scene];
//       let data = JSON.stringify(thisElementArray ) ;
//
//       let query =  "q=" + JSON.stringify({type:"camera", scene:sceneNum}) + "&";
//       $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?" +  query + "u=true&apiKey=" + apiKey,
//       data: data,
//       type: "PUT",
//       contentType: "application/json",
//       success: function(data){console.log("saved camera" );},
//       failure: function(data){console.log("didn't savecamera" );}
//     });
//     }

// NEED TO FIGURE OUT WHAT SHOULD BE HERE IN ORDER TO RECORD KINECTRON DATA
// function getTake(){
//
//   //get all the info for this user and this scene
//   let myName = name_field.val() ;
//   let query = JSON.stringify({owner:myName, take:takeNum});
//
//   $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db +"/collections/"+coll+"/?q=" + query +"&apiKey=" + apiKey,
//   type: "GET",
//   success: function (data){  //create the select ui element based on what came back from db
//     $.each(data, function(index,obj){
//       //MIGHT NOT NEED SINCE NO 3D CAMERA
//       if(obj.type == "camera"){
//         camera3D.matrix.fromArray(obj.camera); // set the camera using saved camera settings
//         camera3D.matrix.decompose(camera3D.position,camera3D.quaternion,camera3D.scale);
//         camera3D.fov = obj.cameraFOV;
//         camera3D.updateProjectionMatrix();
//       } else
//       if(obj.type == "keying"){
//         if(selectedObject){
//             selectedObject.position.x = obj.x;
//             selectedObject.position.y = obj.y;
//             selectedObject.position.z = obj.z;
//             selectedObject.rotation.x = obj.rx;
//             selectedObject.rotation.y = obj.ry;
//             selectedObject.rotation.z = obj.rz;
//         }
//     }else{
//
//     }
//     })
//   },
//   contentType: "application/json" } );
// }
//
// function listOfUsers(){
//   $.ajax( { url: "https://api.mlab.com/api/1/databases/"+ db + "/runCommand?apiKey=" + apiKey,
//   data: JSON.stringify( {"distinct": coll,"key": "owner"} ),
//   type: "POST",
//   contentType: "application/json",
//   success: function(msg) {
//     let allPeople =  msg.values;
//     for(let i = 0; i < allPeople.length; i++){
//       $("#other_people").append('<option>'+allPeople[i]+'</option>');
//     }
//     $("#other_people").change(pickedNewPerson);
//   } } )
// }
//
// function pickedNewPerson() {
//   let newName= $("#other_people").val();
//   name_field.val(newName);
//   sceneNum = 1;
//   // getTake();
// }
