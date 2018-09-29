$(document).on("ready", function() {

	// Returns to Top
	$("#returntotop").on("click", function() {
		$("html, body").animate({ scrollTop: 0}, 1500);
	});

	// Returns to Top Hover Functionality
	$("#returntotop").on({
		"mouseenter": function() {
			$("#rtt").attr("src", "../assets/img/carolunita-white.png");
		},
		"mouseleave": function() {
			$("#rtt").attr("src", "../assets/img/carolunita.png");
		}
	});

	// Reloads the Page
	$(document).on("click", ".reload", function() {
	 location.reload();
	});

	// logo hover functionality for Miami New Times
	$("#addmnh").on({
		"mouseenter": function() {
			$("#mnh").attr("src", "../assets/img/mnh-logo-red.png");
		},
		"mouseleave": function() {
			$("#mnh").attr("src", "../assets/img/mnh-logo.png");
		}
	});	

	// Logo Hover Functionality for The Wall Street Journal
	$("#addwsj").on({
		"mouseenter": function() {
			$("#wsj").attr("src", "../assets/img/wsj-logo-red.png");
		},
		"mouseleave": function() {
			$("#wsj").attr("src", "../assets/img/wsj-logo.png");
		}
	});
	
	// Logo Hover Functionality for The Washington Post
	$("#addwp").on({
		"mouseenter": function() {
			$("#wp").attr("src", "../assets/img/wp-logo-red.png");
		},
		"mouseleave": function() {
			$("#wp").attr("src", "../assets/img/wp-logo.png");
		}
	});

	// Remove all unsaved articles and reload page
	$("#clear").on("click", function() {
		$.ajax({
		    method: "GET",
		    url: "/clear"
		});

		location.reload();
	});

	// add articles from Miami New Times and display updated message
	$("#addmnh").on("click", function() {
		$.ajax({
			method: "GET",
			url: "/mnh"
		});

		$("#count").html("You are now completely up-to-date with <i>Miami New Times</i>.");
		$("#added").modal("show");
	});	

	// Add articles from The Wall Street Journal and display updated message
	$("#addwsj").on("click", function() {
		$.ajax({
			method: "GET",
			url: "/wsj"
		});

		$("#count").html("You are now completely up-to-date with <i>The Wall Street Journal</i>.");
		$("#added").modal("show");
	});

	// Add articles from The Washington Post and display updated message
	$("#addwp").on("click", function() {
		$.ajax({
		    method: "GET",
		    url: "/wp"
		});

		$("#count").html("You are now completely up-to-date with <i>The Washington Post</i>.");
    	$("#added").modal("show");
	});

	// Saves an Article
	$(".savearticle").on("click", function() {
		var id = $(this).attr("data-id");

		$.ajax({
		    method: "POST",
		    url: "/save/" + id
		});
	});

	// Deletes an Article
	$(".deletearticle").on("click", function() {
		var id = $(this).attr("data-id");

		$.ajax({
		    method: "POST",
		    url: "/delete/" + id
		});
	});

	// Shows All Notes for an Article
	$(".notes").on("click", function() {
		var id = $(this).attr("data-id");

		$.ajax({
		    method: "GET",
		    url: "/notes/" + id
		}).done(function(result) {

			// If notes exist...
			if (result.notes.length > 0) {
				$("#notecollection").empty();

				// Displays all Notes for the Returned Article
				for (var i = 0; i < result.notes.length; i++) {
					// Creates Elements for each Note
					var div = $("<div class='article'>");
					var h2 = $("<h2 class='heading'>");
					var p = $("<p>");
					var button = $("<button class='standard delete deletenote reload'>Delete</button>");

					// Updates Contents of Note
					h2.text("Written by " + result.notes[i].author);
					p.text(result.notes[i].body);
					button.attr("data-id", result.notes[i]._id);

					// Render Notes
					div.append(h2).append(p).append(button);
					$("#notecollection").append(div);
				}
			}

			// Displays Modal and Apply Irticle ID to Note Submission Button
	    	$("#notes").modal("show");
	    	$("#submit").attr("data-id", id);
		});
	});

	// Submits a New Note
	$("#submit").on("click", function() {
		var id = $(this).attr("data-id");
		console.log(id);

		$.ajax({
		    method: "POST",
		    data: {
			    author: $("#author").val().trim(),
				body: $("#body").val().trim()
			},
		    url: "/notes/" + id
		}).done(function() {
	    	$("#notes").modal("show");

	    	// Empties Input Fields
	    	$("#author").val("");
			$("#body").val("");
		});
	});

	// Deletes a Note
	$("#notecollection").on("click", ".deletenote", function() {
		var id = $(this).attr("data-id");

		$.ajax({
		    method: "POST",
		    url: "/delete/notes/" + id
		});
	});
});