import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface PopulationUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type: 'students' | 'teachers';
  formData: {
    male?: number;
    female?: number;
    total?: number;
    steamInvolved?: number;
  };
  onInputChange: (field: string, value: string) => void;
  onUpdate: () => void;
  isLoading: boolean;
}

export default function PopulationUpdateModal({
  isOpen,
  onClose,
  title,
  description,
  type,
  formData,
  onInputChange,
  onUpdate,
  isLoading
}: PopulationUpdateModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate();
  };

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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title className="text-2xl font-semibold text-register-green">
                    {title}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                    disabled={isLoading}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  {description}
                </p>

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="space-y-4">
                    {type === 'students' ? (
                      <>
                        <div>
                          <label htmlFor="male" className="block text-sm font-medium text-gray-700 mb-1">
                            Total Male Population
                          </label>
                          <input
                            type="number"
                            id="male"
                            min="0"
                            value={formData.male || ''}
                            onChange={(e) => onInputChange('male', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green focus:border-transparent"
                            disabled={isLoading}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="female" className="block text-sm font-medium text-gray-700 mb-1">
                            Total Female Population
                          </label>
                          <input
                            type="number"
                            id="female"
                            min="0"
                            value={formData.female || ''}
                            onChange={(e) => onInputChange('female', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green focus:border-transparent"
                            disabled={isLoading}
                            required
                          />
                        </div>
                        {(formData.male || formData.female) && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-600">
                              Total Students: <span className="font-semibold">{(formData.male || 0) + (formData.female || 0)}</span>
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div>
                          <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-1">
                            Total Teacher Population
                          </label>
                          <input
                            type="number"
                            id="total"
                            min="0"
                            value={formData.total || ''}
                            onChange={(e) => onInputChange('total', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green focus:border-transparent"
                            disabled={isLoading}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="steamInvolved" className="block text-sm font-medium text-gray-700 mb-1">
                            Involved in STEAM
                          </label>
                          <input
                            type="number"
                            id="steamInvolved"
                            min="0"
                            max={formData.total || undefined}
                            value={formData.steamInvolved || ''}
                            onChange={(e) => onInputChange('steamInvolved', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green focus:border-transparent"
                            disabled={isLoading}
                            required
                          />
                        </div>
                        {(formData.total && formData.steamInvolved !== undefined) && (
                          <div className="bg-gray-50 p-3 rounded-md">
                            <p className="text-sm text-gray-600">
                              Not Involved in STEAM: <span className="font-semibold">{Math.max(0, (formData.total || 0) - (formData.steamInvolved || 0))}</span>
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium bg-register-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}