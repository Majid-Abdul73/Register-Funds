import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { toast } from 'react-hot-toast';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
}

export default function Notifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: false,
    sms: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get current user ID
  const userId = auth.currentUser?.uid;

  // Load notification settings from localStorage
  useEffect(() => {
    if (userId) {
      try {
        const savedSettings = localStorage.getItem(`notificationSettings_${userId}`);
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
        toast.error('Failed to load notification settings');
      }
    }
    setLoading(false);
  }, [userId]);

  // Update notification setting
  const updateSetting = async (type: 'email' | 'sms', value: boolean) => {
    if (!userId) {
      toast.error('You must be logged in to update settings');
      return;
    }

    try {
      setSaving(true);
      
      const newSettings = { ...settings, [type]: value };
      
      // Save to localStorage (temporary solution)
      localStorage.setItem(`notificationSettings_${userId}`, JSON.stringify(newSettings));
      
      // Update local state
      setSettings(newSettings);
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${value ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-12">Loading notification settings...</div>;
  }

  return (
    <div>
      <h1 className='font-semibold text-2xl mb-1'>Notification Settings</h1>
      <p className="text-gray-500 mb-8">Turn on notifications to get updates about your campaign, donor messages, and important platform alerts.</p>
      
      <div className="space-y-8">
        <section>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-sm text-gray-500">Get important updates sent straight to your inbox.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${settings.email ? 'text-green-600' : 'text-gray-400'}`}>
                {settings.email ? 'ON' : 'OFF'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.email}
                  onChange={(e) => updateSetting('email', e.target.checked)}
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-medium">SMS</h3>
              <p className="text-sm text-gray-500">Get important updates and alerts by SMS.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${settings.sms ? 'text-green-600' : 'text-gray-400'}`}>
                {settings.sms ? 'ON' : 'OFF'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.sms}
                  onChange={(e) => updateSetting('sms', e.target.checked)}
                  disabled={saving}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}