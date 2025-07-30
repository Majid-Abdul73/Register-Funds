import { Request, Response, NextFunction } from 'express';
import { auth } from '../../config/firebase';
import jwt from 'jsonwebtoken';
import environment from '../../config/environment';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        role?: string;
      };
    }
  }
}

/** Middleware to authenticate users via Firebase token */
export const authenticateFirebase = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }
    
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'user'
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

/** Middleware to authenticate users via JWT token  */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction): Response | void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token format' });
    }
    
    const decoded = jwt.verify(token, environment.jwt.secret) as { uid: string; email?: string; role?: string };
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || 'user'
    };
    
    next();
  } catch (error) {
    console.error('JWT Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

/** Middleware to authorize admin users */
export const authorizeAdmin = (req: Request, res: Response, next: NextFunction): Response | void => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

/** Middleware to authorize school owners */
export const authorizeSchoolOwner = (req: Request, res: Response, next: NextFunction): Response | void => {
  const schoolId = req.params.id || req.params.schoolId;
  
  if (!schoolId || req.user?.uid !== schoolId) {
    return res.status(403).json({ message: 'Forbidden: You do not have permission to access this school' });
  }
  
  next();
};

/** Middleware to authorize campaign owners */
export const authorizeCampaignOwner = async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    const campaignId = req.params.id;
    
    if (!campaignId) {
      return res.status(400).json({ message: 'Campaign ID is required' });
    }
    
    const campaignDoc = await db.collection('campaigns').doc(campaignId).get();
    
    if (!campaignDoc.exists) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    const campaignData = campaignDoc.data();
    
    if (campaignData?.schoolId !== req.user?.uid) {
      return res.status(403).json({ message: 'Forbidden: You do not own this campaign' });
    }
    
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    return res.status(500).json({ message: 'Failed to authorize campaign owner' });
  }
};

// Export the existing authenticate function for backward compatibility
export { authenticate } from '../middleware/auth';

// Import db for campaign owner authorization
import { db } from '../../config/firebase';