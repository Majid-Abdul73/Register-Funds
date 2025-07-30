import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { School } from '../../models/school.model';

const schoolsCollection = db.collection('schools');

// Create a new school
export const createSchool = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const schoolData: School = {
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Create a document with the user's UID
    const schoolRef = schoolsCollection.doc(req.user.uid);
    await schoolRef.set(schoolData);

    return res.status(201).json({
      id: req.user.uid,
      ...schoolData
    });
  } catch (error) {
    console.error('Error creating school:', error);
    return res.status(500).json({ message: 'Failed to create school' });
  }
};

// Get school by ID (user ID)
export const getSchool = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const schoolId = req.params.id || req.user.uid;
    const schoolDoc = await schoolsCollection.doc(schoolId).get();

    if (!schoolDoc.exists) {
      return res.status(404).json({ message: 'School not found' });
    }

    return res.status(200).json({
      id: schoolDoc.id,
      ...schoolDoc.data()
    });
  } catch (error) {
    console.error('Error getting school:', error);
    return res.status(500).json({ message: 'Failed to get school' });
  }
};

// Update school
export const updateSchool = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const schoolId = req.params.id || req.user.uid;
    const schoolRef = schoolsCollection.doc(schoolId);
    const schoolDoc = await schoolRef.get();

    if (!schoolDoc.exists) {
      return res.status(404).json({ message: 'School not found' });
    }

    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await schoolRef.update(updatedData);

    return res.status(200).json({
      id: schoolId,
      ...updatedData
    });
  } catch (error) {
    console.error('Error updating school:', error);
    return res.status(500).json({ message: 'Failed to update school' });
  }
};