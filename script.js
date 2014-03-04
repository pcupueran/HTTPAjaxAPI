// github user finder example
$(document).ready(function(){

	$(document).on('keypress','#username',function(e){
		if(e.which == 13){
			var username = $("#username").val();
			var response = getGithubInfo(username);
		}
	});

	function getResponse(url,cfunc){
	
		if(window.XMLHttpRequest){
			xmlhttp = new XMLHttpRequest();
		}
		else{
			xmlhttp =  new ActiveXObject();
		}
		xmlhttp.onreadystatechange=cfunc;
		xmlhttp.open("GET",url,true);
		xmlhttp.send();
	}

	function getGithubInfo(username){

		var url = "https://api.github.com/users/" + username;
		getResponse(url, function(){
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
				var user = JSON.parse(xmlhttp.responseText);
				showUser(user);
			}

		});
	}
	
	function showUser(user){
		
		$("#profile h2").html("user login: " + user.login + " is Github user #" + user.id);
    $("#profile .information").append('<a class="profile" href =' + user.url + '>Profile </a>');
		$("#profile .avatar").append('<img src="' + user.avatar_url + '"/>')
	}
});