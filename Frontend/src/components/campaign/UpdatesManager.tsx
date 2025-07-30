import { useState } from 'react';
import { useCampaignUpdates, useCreateUpdate, useUpdateUpdate, useDeleteUpdate } from '../../hooks/useUpdates';

interface UpdatesManagerProps {
  campaignId: string;
}

export default function UpdatesManager({ campaignId }: UpdatesManagerProps) {
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<string | null>(null);
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [editContent, setEditContent] = useState('');

  // Use real API hooks
  const { data: updates = [], isLoading } = useCampaignUpdates(campaignId);
  const createUpdateMutation = useCreateUpdate();
  const updateUpdateMutation = useUpdateUpdate();
  const deleteUpdateMutation = useDeleteUpdate();

  const addUpdate = async () => {
    if (!newUpdateContent.trim()) return;

    try {
      await createUpdateMutation.mutateAsync({
        content: newUpdateContent.trim(),
        campaignId,
        author: 'Campaign Organizer' // Replace with real user data
      });
      
      setNewUpdateContent('');
      setIsAddingUpdate(false);
    } catch (error) {
      console.error('Error adding update:', error);
    }
  };

  const editUpdate = async (updateId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateUpdateMutation.mutateAsync({
        id: updateId,
        data: { content: editContent.trim() }
      });
      
      setEditingUpdate(null);
      setEditContent('');
    } catch (error) {
      console.error('Error editing update:', error);
    }
  };

  const deleteUpdate = async (updateId: string) => {
    try {
      await deleteUpdateMutation.mutateAsync(updateId);
    } catch (error) {
      console.error('Error deleting update:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="border-t-2 border-b-2 py-6 md:py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-register-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t-2 border-b-2 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-3 mb-4">
        <h2 className="text-xl font-bold">Updates</h2>
        <button
          onClick={() => setIsAddingUpdate(true)}
          className="text-gray-600 text-sm font-medium bg-register-gray/10 rounded py-2 px-4 w-full sm:w-auto hover:bg-gray-200"
          disabled={createUpdateMutation.isPending}
        >
          {createUpdateMutation.isPending ? 'Adding...' : 'Add an Update'}
        </button>
      </div>

      {isAddingUpdate && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <textarea
            value={newUpdateContent}
            onChange={(e) => setNewUpdateContent(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green"
            placeholder="Write your update..."
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={() => {
                setIsAddingUpdate(false);
                setNewUpdateContent('');
              }}
              className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={createUpdateMutation.isPending}
            >
              Cancel
            </button>
            <button
              onClick={addUpdate}
              disabled={createUpdateMutation.isPending || !newUpdateContent.trim()}
              className="py-2 px-4 bg-register-green text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {createUpdateMutation.isPending ? 'Adding...' : 'Add Update'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="border-b border-gray-100 pb-4">
            {editingUpdate === update.id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-register-green"
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => {
                      setEditingUpdate(null);
                      setEditContent('');
                    }}
                    className="py-1 px-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={updateUpdateMutation.isPending}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editUpdate(update.id)}
                    disabled={updateUpdateMutation.isPending || !editContent.trim()}
                    className="py-1 px-3 text-sm bg-register-green text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                  >
                    {updateUpdateMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full gap-3 mb-2">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <span>{new Date(update.createdAt).toLocaleDateString()}</span>
                    <span>by {update.author}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingUpdate(update.id);
                        setEditContent(update.content);
                      }}
                      className="text-gray-600 text-sm font-medium bg-register-gray/10 rounded py-1 px-3 hover:bg-gray-200"
                      disabled={updateUpdateMutation.isPending}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUpdate(update.id)}
                      className="text-red-600 text-sm font-medium bg-red-50 rounded py-1 px-3 hover:bg-red-100"
                      disabled={deleteUpdateMutation.isPending}
                    >
                      {deleteUpdateMutation.isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{update.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}