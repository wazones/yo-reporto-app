 function onDeviceReady()
 {
 
 //alert("JAJAJA");
		// function for parsing links
		function parseLinks(text) {
			var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
			return text.replace(exp,'<a href="$1" target="_blank">$1</a>'); 
		}
 
		// function for parsing @username
		function parseUsers(text) {
			var exp = /@(\w+)/ig;
			return text.replace(exp,'<a href="https://twitter.com/$1" target="_blank">@$1</a>');
		}
 
		// function for parsing #hashtags
		function parseHashtags(text) {
			var exp = /#(\w+)/ig;
			return text.replace(exp,'<a href="https://twitter.com/search?q=%23$1" target="_blank">#$1</a>');
		}
 
		// create a new codebird
		var cb = new Codebird;
		
		// YOU MUST SET THESE KEYS!
		// create a new app here: https://dev.twitter.com/apps/new
		cb.setConsumerKey('Tn6r0Z1A5KQyLn9JSvGcUg', 'RB7zzubyt6l5lYs83wGLVEB7lEf1xUj5uhTLOCETSM');
		cb.setToken('280834227-AHrkpZpjOCFfAOUtPZTs1A2tdCu4dltIDzwtslpU', 'WRpz3BshrGRDDPbb0PW48CqUIAsU4GLdQJRAxiTItWrmb');
 
		// returns the user's timline
		cb.__call(
			'statuses_userTimeline',
			{},
			function (reply) {
				var i = 0;
				for (var key in reply) {
					i++;
					// limit to 5
					if (i <= 5 && reply[key].text) {
						// add these to the #tweets ul
						$('#tweets').append('<li>'+ parseHashtags(parseUsers(parseLinks(reply[key].text))) +'</li>');
					};
				}
			}
		);
 }