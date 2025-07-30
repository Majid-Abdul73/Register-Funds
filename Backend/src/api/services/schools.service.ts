import { db } from '../../config/firebase';
import { School } from '../../models/School';

export class SchoolsService {
  private schoolsCollection = db.collection('schools');
  
  /**
   * Create a new school
   * @param schoolData School data
   * @param userId User ID
   * @returns Created school
   */
  async createSchool(schoolData: Partial<School>, userId: string) {
    try {
      const timestamp = new Date().toISOString();
      
      const newSchool: School = {
        ...schoolData as School,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      
      // Create a document with the user's UID
      const schoolRef = this.schoolsCollection.doc(userId);
      await schoolRef.set(newSchool);
      
      return {
        id: userId,
        ...newSchool
      };
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  }
  
  /**
   * Get school by ID
   * @param schoolId School ID
   * @returns School data
   */
  async getSchoolById(schoolId: string) {
    try {
      const schoolDoc = await this.schoolsCollection.doc(schoolId).get();
      
      if (!schoolDoc.exists) {
        throw new Error('School not found');
      }
      
      return {
        id: schoolDoc.id,
        ...schoolDoc.data() as School
      };
    } catch (error) {
      console.error('Error getting school:', error);
      throw error;
    }
  }
  
  /**
   * Update school
   * @param schoolId School ID
   * @param updateData Update data
   * @returns Updated school
   */
  async updateSchool(schoolId: string, updateData: Partial<School>) {
    try {
      const schoolRef = this.schoolsCollection.doc(schoolId);
      const schoolDoc = await schoolRef.get();
      
      if (!schoolDoc.exists) {
        throw new Error('School not found');
      }
      
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      await schoolRef.update(updatedData);
      
      return {
        id: schoolId,
        ...schoolDoc.data() as School,
        ...updatedData
      };
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  }
  
  /**
   * Get all schools (admin only)
   * @param limit Limit
   * @param page Page
   * @returns List of schools
   */
  async getAllSchools(limit: number = 10, page: number = 1) {
    try {
      // Calculate pagination
      const offset = (page - 1) * limit;
      
      // Get total count (for pagination info)
      const countSnapshot = await this.schoolsCollection.get();
      const totalCount = countSnapshot.size;
      
      // Apply pagination
      const snapshot = await this.schoolsCollection.limit(limit).offset(offset).get();
      
      const schools: (School & { id: string })[] = [];
      snapshot.forEach(doc => {
        schools.push({
          id: doc.id,
          ...doc.data() as School
        });
      });
      
      return {
        schools,
        pagination: {
          total: totalCount,
          page,
          limit,
          pages: Math.ceil(totalCount / limit)
        }
      };
    } catch (error) {
      console.error('Error getting schools:', error);
      throw error;
    }
  }
}

export const schoolsService = new SchoolsService();