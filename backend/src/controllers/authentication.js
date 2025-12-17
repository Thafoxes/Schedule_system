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

        // validate required fields
        if (!email || !firstName || !lastName || !password || !role){
            return res.status(400).json({
                 error: true,
                message: 'Missing required fields: email, firstName, lastName, password, role'
            });
        }

        //validate role
        if (!['student', 'teacher', 'itstaff'].includes(role)){
             return res.status(400).json({
                 error: true,
                message: 'Invalid role.'
            });
        }

        if (role === 'student' && !studentMatricNumber){
            return res.status(400).json({
                error: true,
                message: 'Student matrix number is required for student accounts'
            });
        }

        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Call appropriate stored procedure based on role
        let result;
        switch (role) {
            case 'student':
                result = await executeStoredProcedure('create_student_account', [
                    email, firstName, lastName, passwordHash, studentMatricNumber
                ]);
                break;
            case 'teacher':
                result = await executeStoredProcedure('create_teacher_account', [
                    email, firstName, lastName, passwordHash
                ]);
                break;
            case 'itstaff':
                result = await executeStoredProcedure('create_it_account', [
                    email, firstName, lastName, passwordHash
                ]);
                break;
            
        }

         console.log(`✅ ${role} account created for: ${email}`);

        res.status(201).json({
            success: true,
            message: `${role} account created successfully`,
            user: {
                email,
                firstName,
                lastName,
                role
            }
        });
    }catch (error) {
        console.error('Registration error:', error);

        // Handle duplicate email error
        if (error.message.includes('Duplicate entry') || error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: true,
                message: 'Email address already exists'
            });
        }

        res.status(500).json({
            error: true,
            message: 'Registration failed',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

// login user
const login = async (req, res) => {
    try{
        const{ email, password, role} = req.body;

        // validate required fields
        if(!email || !password || !role){
             return res.status(400).json({
                error: true,
                message: 'Email, password, and role are required'
            });
        }

        console.log(`🔍 Login attempt: ${email} as ${role}`);

        // Get user by email and role
        const users = await executeQuery(
            'SELECT user_id, email, first_name, last_name, role, password_hash FROM schedule_management.user WHERE email = ? AND role = ?',
            [email, role]
        );

        console.log('🔍 Query result:', users);
        console.log('🔍 Users array length:', users.length);
        console.log('🔍 First user object:', users[0]);

        if(users.length === 0){
            return res.status(401).json({
                error: true,
                message: 'Invalid credentials or role'
            });
        }

        const user = users[0];

        // verify password 
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: true,
                message: 'Invalid credentials'
            });
        }

        // Get additional user details based on role
        let userDetails = {
            userId: user.user_id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role
        };

        //get student matric number if student
        if (role === 'student') {
            const [studentData] = await executeQuery(
                'SELECT student_matrix_number FROM schedule_management.student WHERE user_id = ?',
                [user.user_id]
            );
            if (studentData.length > 0) {
                userDetails.studentMatricNumber = studentData[0].student_matrix_number;
            }
        }

        // generate JWT token
        const token = generateToken(userDetails);

        console.log(`✅ User logged in: ${email} as ${role}`);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: userDetails
        });

    }catch(error){
        console.error('Login error:', error);
        res.status(500).json({
            error: true,
            message: 'Login failed',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });     
    }
}


// Get current user profile
const getProfile = async (req, res) => {
    try{
        const userId = req.user.userId;
        const role = req.user.role;

        // Get user details using stored procedures
        let userData;
        switch (role) {
            case 'student':
                userData = await executeStoredProcedure('view_student_account_by_id', [userId]);
                break;
            case 'teacher':
                userData = await executeStoredProcedure('view_teacher_account_by_id', [userId]);
                break;
            case 'itstaff':
                userData = await executeStoredProcedure('view_it_account_by_id', [userId]);
                break;
        }

        if (!userData || userData.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'User profile not found'
            });
        }

        res.json({
            success: true,
            user: userData[0]
        });
    }catch(error){
        console.error('Profile fetch error:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to fetch profile',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

// update user profile
const updateProfile = async(req, res) => {
    try{
        const userId = req.user.userId;
        const role = req.user.role;
        const { firstName, lastName, email, studentMatrixNumber } = req.body;
    
        if(!firstName || !lastName || !email){
            return res.status(400).json({
                error: true,
                message: 'First name, last name, and email are required'
            });
        }

        // Call appropriate stored procedure based on role
        let result;
        switch(role){
            case 'student':
                if(!studentMatrixNumber){
                     return res.status(400).json({
                        error: true,
                        message: 'Student matrix number is required for student accounts'
                    });
                }
                result = await executeStoredProcedure('p_update_student_profile', [
                    userId, firstName, lastName, email, studentMatrixNumber
                ]);
                break;
            case 'teacher':
                result = await executeStoredProcedure('p_update_teacher_profile', [
                    userId, firstName, lastName, email
                ]);
                break;
            case 'itstaff':
                 result = await executeStoredProcedure('p_update_user_profile', [
                    userId, firstName, lastName, email
                ]);
                break;

        }

        console.log(`✅ Profile updated for user: ${userId}`);

         res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                userId,
                firstName,
                lastName,
                email,
                role,
                ...(role === 'student' && { studentMatrixNumber })
            }
        });
    }catch (error) {
        console.error('Profile update error:', error);
        
        // Handle duplicate email error
        if (error.message.includes('Duplicate entry') || error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                error: true,
                message: 'Email address already exists'
            });
        }

        res.status(500).json({
            error: true,
            message: 'Profile update failed',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

// Update password
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: true,
                message: 'Current password and new password are required'
            });
        }

        // Get current user data to verify current password
        const users = await executeQuery(
            'SELECT password_hash FROM schedule_management.user WHERE user_id = ?',
            [userId]
        );

        if (!users || users.length === 0) {
            return res.status(404).json({
                error: true,
                message: 'User not found'
            });
        }

        const user = Array.isArray(users) ? users[0] : users;

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                error: true,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await executeStoredProcedure('p_update_user_password', [userId, newPasswordHash]);

        console.log(`✅ Password updated for user: ${userId}`);

        res.json({
            success: true,
            message: 'Password updated successfully'
        });

    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({
            error: true,
            message: 'Password update failed',
            details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    updatePassword
};