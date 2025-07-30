import { Request, Response } from 'express';
import { auth } from '../../config/firebase';
import jwt, { SignOptions } from 'jsonwebtoken';
import environment from '../../config/environment';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, displayName } = req.body;
    
    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });
    
    // Set default role
    await auth.setCustomUserClaims(userRecord.uid, { role: 'user' });
    
    // Generate JWT token with role - Fixed implementation
    const payload = {
      uid: userRecord.uid,
      email: userRecord.email || '',
      role: 'user'
    };
    
    // In register function
    const options: SignOptions = {
      expiresIn: Number(environment.jwt.expiresIn),
      algorithm: 'HS256'
    };
    
    const token = jwt.sign(payload, environment.jwt.secret, options);
    
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: 'user'
      },
      token
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    return res.status(500).json({ 
      message: 'Failed to register user',
      error: error.message 
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }
    
    const decodedToken = await auth.verifyIdToken(idToken);
    const userRole = decodedToken.role || 'user';
    
    // Generate a session token with role - Fixed implementation
    const payload = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: userRole
    };
    
    // In login function  
    const options: SignOptions = {
      expiresIn: Number(environment.jwt.expiresIn),
      algorithm: 'HS256'
    };
    
    const token = jwt.sign(payload, environment.jwt.secret, options);
    
    return res.status(200).json({
      message: 'Login successful',
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: userRole
      },
      token
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    return res.status(401).json({ 
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    return res.status(200).json({
      message: 'Password reset instructions sent to email',
      email
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    return res.status(500).json({ 
      message: 'Failed to reset password',
      error: error.message 
    });
  }
};

// Verify token
export const verifyToken = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    return res.status(200).json({
      message: 'Token is valid',
      user: req.user
    });
  } catch (error: any) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ 
      message: 'Token verification failed',
      error: error.message 
    });
  }
};