const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const User = require('../models/User');

/*Configaration Multer for File upload */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');//Store uploaded files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, req.body.firstName);//Use the original file name
    }
});





/*USER REGISTER*/
router.post("/register",upload.single('profileImage'), async (req, res) => {
    try{
        /*Take all infromation from the from */
        const {firstName, lastName, email, password, confirmPassword} = req.body;

        /*The uploaded file is available as req.file */
        const profileImage = req.file;

    }catch(err){
        console.log(err);
    }
})