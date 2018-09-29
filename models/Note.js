// Initializes Node.js Package
var mongoose = require("mongoose");

// Initializes Schema
var Schema = mongoose.Schema;

// Creates Notes Schema
var NoteSchema = new Schema({
	author: {
	  	type: String,
	  	required: false,
	  	default: "anonymous"
	},
	body: {
	  	type: String,
	  	required: true
	}
});

// Creates Note Model
var Note = mongoose.model("Note", NoteSchema);

// Exports Note Model
module.exports = Note;
