const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require ("../models/Note");
const { body, validationResult } = require("express-validator");


//Route1: Get all the notes using: GET "/api/notes/fetchallnotes". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
    const notes = await Note.find({user: req.user.id})
    res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



//Route2: Add a new notes using: POST "/api/notes/addnote". login required
router.post("/addnote", fetchuser, [
    body("title", "Enter a valid Title").isLength({min : 5}),
    body("description", "Description must be atleast 8 character").isLength({min : 8}),
], async (req, res) => {
    try {
    const {title, description, tag} = req.body;
    //if there are errors, return bad request and error code
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const note = new Note ({
        title, description, tag, user: req.user.id
    })
    const saveNote = await note.save()
    res.json(saveNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



//Route3: Update an existing notes using: PUT "/api/notes/updatenote". login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;

    //Create a newNote object
    try{
    const newNote = {};
    if (title){newNote.title = title};
        if (description){newNote.description = description};
            if (tag){newNote.tag = tag};


    // Find the note to be updated and update it (First find the user)
    let note = await Note.findById(req.params.id);
    if (!note){
        return res.status(404).send({error: "Not Found"})
    }

    //Allow updation only if user own this Note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send({error: "Not Allowed"})

    }

    //update now
    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



//Route4: Delete an existing notes using: DELETE "/api/notes/deletenote". login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {

    try{
    // Find the note to be deleted and delete it (First find the user)
    let note = await Note.findById(req.params.id);
    if (!note){
        return res.status(404).send({error: "Not Found"})
    }

    //Allow deletion only if user own this Note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send({error: "Not Allowed"})

    }

    //Delete Note
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been Deleted", note : note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});

module.exports = router;