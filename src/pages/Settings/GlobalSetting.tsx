import { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

export default function GlobalSetting() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    // System Settings
    system_name: 'SOHUB Connect',
    system_timezone: 'Asia/Dhaka',
    date_format: 'DD/MM/YYYY',
    time_format: '24',
    language: 'en',
    
    // PBX Settings
    sip_domain: 'sip.sohub.com.bd',
    rtp_port_range: '10000-20000',
    max_call_duration: '3600',
    recording_enabled: true,
    auto_answer_enabled: false,
    
    // Security Settings
    session_timeout: '30',
    password_policy: 'strong',
    two_factor_auth: false,
    ip_whitelist_enabled: false,
    
    // Email Settings
    email: '',
    protocol: 'smtp',
    smtp_host: 'smtp.gmail.com',
    smtp_user: '',
    smtp_pass: '',
    smtp_port: '587',
    smtp_encryption: 'tls',
    smtp_auth: 'true',
    branch_id: 1,
    
    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    
    // Billing Settings
    currency: 'BDT',
    tax_rate: '15',
    billing_cycle: 'monthly',
    
    // Backup Settings
    auto_backup: true,
    backup_frequency: 'daily',
    backup_retention: '30',
    
    // FreePBX Settings
    freepbx_enabled: 'true',
    freepbx_token_url: 'https://voice.tolpar.com.bd/admin/api/api/token',
    freepbx_graphql_url: 'https://voice.tolpar.com.bd/admin/api/api/gql',
    freepbx_rest_url: 'https://voice.tolpar.com.bd/admin/api/api/rest',
    freepbx_client_id: 'e76bdc5ea8c9b588ec0ce3a796bfb52e83a3a4925a6fb4f2935815ac05575c91',
    freepbx_client_secret: '9afa837ebb1523b6a15437181f04aebb',
    
    // GraphQL Settings
    gql_endpoint: 'http://127.0.0.1/admin/api/api/gql',
    gql_token_endpoint: 'http://localhost/admin/api/api/token',
    gql_client_id: 'a64ae3de81d8f1f2196df3b88bc3fc3186d495614d83328d9c3823183d185a32',
    gql_client_secret: 'f479509a48bfdbea86768fce8ed5c720',
    gql_grant_type: 'client_credentials',
    gql_scope: 'gql',
    gql_timeout: '3'
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch general settings
      const { data: generalData } = await supabase
        .from('global_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      // Fetch email config
      const { data: emailData } = await supabase
        .from('email_config')
        .select('*')
        .eq('id', 1)
        .single();
      
      // Fetch GraphQL config
      const { data: gqlData } = await supabase
        .from('graphql_config')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (generalData || emailData) {
        setSettings(prev => ({
          ...prev,
          ...(generalData && {
            system_name: generalData.system_name || prev.system_name,
            system_timezone: generalData.system_timezone || prev.system_timezone,
            language: generalData.language || prev.language,
            sip_domain: generalData.sip_domain || prev.sip_domain,
            session_timeout: generalData.session_timeout?.toString() || prev.session_timeout,
            password_policy: generalData.password_policy || prev.password_policy,
            two_factor_auth: generalData.two_factor_auth ?? prev.two_factor_auth,
            currency: generalData.currency || prev.currency,
            tax_rate: generalData.tax_rate?.toString() || prev.tax_rate,
            email_notifications: generalData.email_notifications ?? prev.email_notifications,
            sms_notifications: generalData.sms_notifications ?? prev.sms_notifications,
            push_notifications: generalData.push_notifications ?? prev.push_notifications,
            freepbx_enabled: generalData.freepbx_enabled ? 'true' : 'false',
            freepbx_token_url: generalData.freepbx_token_url || prev.freepbx_token_url,
            freepbx_graphql_url: generalData.freepbx_graphql_url || prev.freepbx_graphql_url,
            freepbx_rest_url: generalData.freepbx_rest_url || prev.freepbx_rest_url,
            freepbx_client_id: generalData.freepbx_client_id || prev.freepbx_client_id,
            freepbx_client_secret: generalData.freepbx_client_secret || prev.freepbx_client_secret
          }),
          ...(emailData && {
            email: emailData.email || prev.email,
            protocol: emailData.protocol || prev.protocol,
            smtp_host: emailData.smtp_host || prev.smtp_host,
            smtp_user: emailData.smtp_user || prev.smtp_user,
            smtp_pass: emailData.smtp_pass || prev.smtp_pass,
            smtp_port: emailData.smtp_port || prev.smtp_port,
            smtp_encryption: emailData.smtp_encryption || prev.smtp_encryption,
            smtp_auth: emailData.smtp_auth || prev.smtp_auth,
            branch_id: emailData.branch_id || prev.branch_id
          }),
          ...(gqlData && {
            gql_endpoint: gqlData.endpoint || prev.gql_endpoint,
            gql_token_endpoint: gqlData.token_endpoint || prev.gql_token_endpoint,
            gql_client_id: gqlData.client_id || prev.gql_client_id,
            gql_client_secret: gqlData.client_secret || prev.gql_client_secret,
            gql_grant_type: gqlData.grant_type || prev.gql_grant_type,
            gql_scope: gqlData.scope || prev.gql_scope,
            gql_timeout: gqlData.timeout?.toString() || prev.gql_timeout
          })
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving settings:', settings);
      
      // Update general settings
      const { data: generalData, error: generalError } = await supabase
        .from('global_settings')
        .update({
          system_name: settings.system_name,
          system_timezone: settings.system_timezone,
          language: settings.language,
          sip_domain: settings.sip_domain,
          session_timeout: parseInt(settings.session_timeout),
          password_policy: settings.password_policy,
          two_factor_auth: settings.two_factor_auth,
          currency: settings.currency,
          tax_rate: parseFloat(settings.tax_rate),
          email_notifications: settings.email_notifications,
          sms_notifications: settings.sms_notifications,
          push_notifications: settings.push_notifications,
          freepbx_enabled: settings.freepbx_enabled === 'true',
          freepbx_token_url: settings.freepbx_token_url,
          freepbx_graphql_url: settings.freepbx_graphql_url,
          freepbx_rest_url: settings.freepbx_rest_url,
          freepbx_client_id: settings.freepbx_client_id,
          freepbx_client_secret: settings.freepbx_client_secret,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      console.log('General settings result:', { generalData, generalError });

      // Update email config
      const { data: emailData, error: emailError } = await supabase
        .from('email_config')
        .update({
          email: settings.email,
          protocol: settings.protocol,
          smtp_host: settings.smtp_host,
          smtp_user: settings.smtp_user,
          smtp_pass: settings.smtp_pass,
          smtp_port: settings.smtp_port,
          smtp_encryption: settings.smtp_encryption,
          smtp_auth: settings.smtp_auth,
          branch_id: settings.branch_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      console.log('Email config result:', { emailData, emailError });
      
      // Update GraphQL config
      const { data: gqlData, error: gqlError } = await supabase
        .from('graphql_config')
        .update({
          endpoint: settings.gql_endpoint,
          token_endpoint: settings.gql_token_endpoint,
          client_id: settings.gql_client_id,
          client_secret: settings.gql_client_secret,
          grant_type: settings.gql_grant_type,
          scope: settings.gql_scope,
          timeout: parseInt(settings.gql_timeout),
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      console.log('GraphQL config result:', { gqlData, gqlError });

      if (generalError) {
        console.error('General settings error:', generalError);
        throw generalError;
      }
      
      if (emailError) {
        console.error('Email config error:', emailError);
        throw emailError;
      }
      
      if (gqlError) {
        console.error('GraphQL config error:', gqlError);
        throw gqlError;
      }

      Swal.fire({
        title: 'Success!',
        text: 'Settings saved successfully!',
        icon: 'success',
        confirmButtonColor: '#3b82f6'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      Swal.fire({
        title: 'Error!',
        text: `Failed to save settings: ${error.message}`,
        icon: 'error',
        confirmButtonColor: '#3b82f6'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Global Settings | SOHUB Connect"
        description="Configure global system settings"
      />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure system-wide settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'general', label: 'General' },
              { id: 'email', label: 'Email' },
              { id: 'api', label: 'GraphQL Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          {activeTab === 'general' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Settings</h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* System Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">System</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">System Name</label>
                      <input
                        type="text"
                        value={settings.system_name}
                        onChange={(e) => handleInputChange('system_name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
                      <select
                        value={settings.system_timezone}
                        onChange={(e) => handleInputChange('system_timezone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="Asia/Dhaka">Asia/Dhaka</option>
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">America/New_York</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="bn">বাংলা</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Security</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.session_timeout}
                        onChange={(e) => handleInputChange('session_timeout', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password Policy</label>
                      <select
                        value={settings.password_policy}
                        onChange={(e) => handleInputChange('password_policy', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="weak">Weak</option>
                        <option value="medium">Medium</option>
                        <option value="strong">Strong</option>
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.two_factor_auth}
                        onChange={(e) => handleInputChange('two_factor_auth', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Two-Factor Authentication</label>
                    </div>
                  </div>
                </div>

                {/* PBX Settings */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">PBX</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SIP Domain</label>
                      <input
                        type="text"
                        value={settings.sip_domain}
                        onChange={(e) => handleInputChange('sip_domain', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing & Notifications */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Billing & Notifications</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Currency</label>
                      <select
                        value={settings.currency}
                        onChange={(e) => handleInputChange('currency', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      >
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax Rate (%)</label>
                      <input
                        type="number"
                        value={settings.tax_rate}
                        onChange={(e) => handleInputChange('tax_rate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.email_notifications}
                        onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email Notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.sms_notifications}
                        onChange={(e) => handleInputChange('sms_notifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS Notifications</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.push_notifications}
                        onChange={(e) => handleInputChange('push_notifications', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Push Notifications</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}





          {activeTab === 'email' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Configuration</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="noreply@sohub.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Protocol</label>
                    <select
                      value={settings.protocol}
                      onChange={(e) => handleInputChange('protocol', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="smtp">SMTP</option>
                      <option value="sendmail">Sendmail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      value={settings.smtp_host}
                      onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Port</label>
                    <input
                      type="text"
                      value={settings.smtp_port}
                      onChange={(e) => handleInputChange('smtp_port', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Username</label>
                    <input
                      type="text"
                      value={settings.smtp_user}
                      onChange={(e) => handleInputChange('smtp_user', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="username@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">SMTP Password</label>
                    <input
                      type="password"
                      value={settings.smtp_pass}
                      onChange={(e) => handleInputChange('smtp_pass', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Encryption</label>
                    <select
                      value={settings.smtp_encryption}
                      onChange={(e) => handleInputChange('smtp_encryption', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="none">None</option>
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.smtp_auth === 'true'}
                      onChange={(e) => handleInputChange('smtp_auth', e.target.checked ? 'true' : 'false')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable SMTP Authentication</label>
                  </div>
                </div>
              </div>
            </div>
          )}





          {activeTab === 'api' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">GraphQL Settings</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    GraphQL Integration
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={settings.freepbx_enabled === 'true'}
                        onChange={(e) => handleInputChange('freepbx_enabled', e.target.checked ? 'true' : 'false')}
                        className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Enable GraphQL Integration</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Token URL</label>
                      <input
                        type="url"
                        value={settings.freepbx_token_url || ''}
                        onChange={(e) => handleInputChange('freepbx_token_url', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="https://voice.example.com/admin/api/api/token"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">REST URL</label>
                      <input
                        type="url"
                        value={settings.freepbx_rest_url || ''}
                        onChange={(e) => handleInputChange('freepbx_rest_url', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="https://voice.example.com/admin/api/api/rest"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client ID</label>
                      <input
                        type="text"
                        value={settings.freepbx_client_id || ''}
                        onChange={(e) => handleInputChange('freepbx_client_id', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="Client ID"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client Secret</label>
                      <input
                        type="password"
                        value={settings.freepbx_client_secret || ''}
                        onChange={(e) => handleInputChange('freepbx_client_secret', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="••••••••••••••••••••••••••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    GraphQL Configuration
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GraphQL URL</label>
                      <input
                        type="url"
                        value={settings.freepbx_graphql_url || ''}
                        onChange={(e) => handleInputChange('freepbx_graphql_url', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                        placeholder="https://voice.example.com/admin/api/api/gql"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}