const bcrypt = require('bcryptjs');
const { executeStoredProcedure, executeQuery } = require('../config/database');
const { generateToken } = require('../utils/jwt');

const register = async (req, res) => {
    try{
        const {
            email,
            firstName,
            lastName,
            password,
            role, 
            studentMatricNumber
        } = req.body;
    }
}