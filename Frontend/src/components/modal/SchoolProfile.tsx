import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import ContactSchool from './ContactSchool';
import { useSchool } from '../../hooks/useSchools'; // Add this import

interface SchoolProfileProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
}

export default function SchoolProfile({ isOpen, onClose, schoolId }: SchoolProfileProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  // Use real API instead of mock data
  const { data: schoolData, isLoading: loading, error } = useSchool(schoolId);

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {loading ? 'Loading...' : (schoolData?.schoolName || 'School Profile')}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-register-green"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-500">Failed to load school data</p>
                    </div>
                  ) : schoolData ? (
                    <>
                      <h3 className="text-sm text-gray-500">Top Challenges School Faces</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {schoolData.challenges && schoolData.challenges.length > 0 ? (
                          schoolData.challenges.map((challenge, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full bg-green-100 text-register-green text-sm"
                            >
                              {challenge}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No challenges specified</span>
                        )}
                      </div>

                      <div className="mt-4">
                        <h3 className="text-sm text-gray-500">Location</h3>
                        <p className="mt-1">{schoolData.city}, {schoolData.country}</p>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-sm text-gray-500">School Type</h3>
                        <p className="mt-1">{schoolData.schoolType}</p>
                      </div>

                      {schoolData.students && (
                        <div className="mt-4">
                          <h3 className="text-sm text-gray-500">Total Student Population</h3>
                          <p className="mt-1">{schoolData.students.total || 0}</p>
                        </div>
                      )}

                      <div className="mt-6 pt-6 border-t">
                        <h3 className="text-lg font-medium">School Representative</h3>
                        <div className="mt-3 flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {schoolData.contactName ? schoolData.contactName.charAt(0).toUpperCase() : 'S'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">{schoolData.contactName || 'Not specified'}</p>
                            <p className="text-sm text-gray-500">School Representative</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setIsContactOpen(true)}
                        className="mt-6 w-full bg-register-green text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Contact School
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">School not found</p>
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
        
        <ContactSchool
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          recipient={{
            name: schoolData?.contactName || 'School Representative',
            role: 'School Representative',
            email: schoolData?.email
          }}
        />
      </Dialog>
    </Transition>
  );
}