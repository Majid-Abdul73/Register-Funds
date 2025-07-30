import { Request, Response } from 'express';
import { db } from '../../config/firebase';
import { Update } from '../../models/update.model';

const updatesCollection = db.collection('updates');

// Create a new update
export const createUpdate = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updateData: Update = {
      ...req.body,
      schoolId: req.user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updateRef = await updatesCollection.add(updateData);

    return res.status(201).json({
      id: updateRef.id,
      ...updateData
    });
  } catch (error: any) {
    console.error('Error creating update:', error);
    return res.status(500).json({ 
      message: 'Failed to create update',
      error: error.message 
    });
  }
};

// Get all updates
export const getUpdates = async (req: Request, res: Response) => {
  try {
    const { schoolId, limit = '10', page = '1' } = req.query;
    let query = updatesCollection.orderBy('createdAt', 'desc');

    if (schoolId && typeof schoolId === 'string') {
      query = query.where('schoolId', '==', schoolId);
    }

    const limitNum = parseInt(limit as string, 10) || 10;
    const pageNum = parseInt(page as string, 10) || 1;
    const offset = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const countSnapshot = await query.get();
    const totalCount = countSnapshot.size;

    // Apply pagination
    const snapshot = await query.limit(limitNum).offset(offset).get();
    const updates: (Update & { id: string })[] = [];

    snapshot.forEach(doc => {
      updates.push({
        id: doc.id,
        ...doc.data() as Update
      });
    });

    return res.status(200).json({
      updates,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(totalCount / limitNum)
      }
    });
  } catch (error: any) {
    console.error('Error getting updates:', error);
    return res.status(500).json({ 
      message: 'Failed to get updates',
      error: error.message 
    });
  }
};

// Get update by ID
export const getUpdateById = async (req: Request, res: Response) => {
  try {
    const updateId = req.params.id;
    const updateDoc = await updatesCollection.doc(updateId).get();

    if (!updateDoc.exists) {
      return res.status(404).json({ message: 'Update not found' });
    }

    return res.status(200).json({
      id: updateDoc.id,
      ...updateDoc.data()
    });
  } catch (error: any) {
    console.error('Error getting update:', error);
    return res.status(500).json({ 
      message: 'Failed to get update',
      error: error.message 
    });
  }
};

// Update an update
export const updateUpdate = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updateId = req.params.id;
    const updateRef = updatesCollection.doc(updateId);
    const updateDoc = await updateRef.get();

    if (!updateDoc.exists) {
      return res.status(404).json({ message: 'Update not found' });
    }

    const updateData = updateDoc.data() as Update;

    // Check if the user owns this update
    if (updateData.schoolId !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: You do not own this update' });
    }

    const updatedData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await updateRef.update(updatedData);

    return res.status(200).json({
      id: updateId,
      ...updatedData
    });
  } catch (error: any) {
    console.error('Error updating update:', error);
    return res.status(500).json({ 
      message: 'Failed to update update',
      error: error.message 
    });
  }
};

// Delete an update
export const deleteUpdate = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const updateId = req.params.id;
    const updateRef = updatesCollection.doc(updateId);
    const updateDoc = await updateRef.get();

    if (!updateDoc.exists) {
      return res.status(404).json({ message: 'Update not found' });
    }

    const updateData = updateDoc.data() as Update;

    // Check if the user owns this update
    if (updateData.schoolId !== req.user.uid) {
      return res.status(403).json({ message: 'Forbidden: You do not own this update' });
    }

    await updateRef.delete();

    return res.status(200).json({
      message: 'Update deleted successfully',
      id: updateId
    });
  } catch (error: any) {
    console.error('Error deleting update:', error);
    return res.status(500).json({ 
      message: 'Failed to delete update',
      error: error.message 
    });
  }
};