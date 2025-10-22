import { supabase } from './supabase';

interface FreePBXConfig {
  tokenUrl: string;
  graphqlUrl: string;
  restUrl: string;
  clientId: string;
  clientSecret: string;
  enabled: boolean;
}

let cachedConfig: FreePBXConfig | null = null;

const getFreePBXConfig = async (): Promise<FreePBXConfig> => {
  if (cachedConfig) return cachedConfig;

  try {
    const { data } = await supabase
      .from('global_settings')
      .select('*')
      .eq('id', 1)
      .single();

    const settings = data || {};

    cachedConfig = {
      tokenUrl: settings.freepbx_token_url || 'https://voice.tolpar.com.bd/admin/api/api/token',
      graphqlUrl: settings.freepbx_graphql_url || 'https://voice.tolpar.com.bd/admin/api/api/gql',
      restUrl: settings.freepbx_rest_url || 'https://voice.tolpar.com.bd/admin/api/api/rest',
      clientId: settings.freepbx_client_id || 'e76bdc5ea8c9b588ec0ce3a796bfb52e83a3a4925a6fb4f2935815ac05575c91',
      clientSecret: settings.freepbx_client_secret || '9afa837ebb1523b6a15437181f04aebb',
      enabled: settings.freepbx_enabled !== false
    };

    return cachedConfig;
  } catch (error) {
    console.error('Failed to load FreePBX config:', error);
    return {
      tokenUrl: 'https://voice.tolpar.com.bd/admin/api/api/token',
      graphqlUrl: 'https://voice.tolpar.com.bd/admin/api/api/gql',
      restUrl: 'https://voice.tolpar.com.bd/admin/api/api/rest',
      clientId: 'e76bdc5ea8c9b588ec0ce3a796bfb52e83a3a4925a6fb4f2935815ac05575c91',
      clientSecret: '9afa837ebb1523b6a15437181f04aebb',
      enabled: true
    };
  }
};

export const clearFreePBXConfigCache = () => {
  cachedConfig = null;
};

let accessToken: string | null = null;

const getAccessToken = async (): Promise<string> => {
  if (accessToken) return accessToken;

  const config = await getFreePBXConfig();
  
  if (!config.enabled) {
    throw new Error('FreePBX integration is disabled');
  }

  try {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: 'gql'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token request failed:', response.status, errorText);
      throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Token response:', data);
    
    if (!data.access_token) {
      throw new Error('No access token in response');
    }
    
    accessToken = data.access_token;
    return accessToken;
  } catch (error) {
    console.error('FreePBX Token Error:', error);
    throw new Error(`FreePBX authentication failed: ${error.message}`);
  }
};

export const createExtensionInFreePBX = async (extensionData: {
  extension: string;
  name: string;
  tech: string;
  secret: string;
}) => {
  try {
    const config = await getFreePBXConfig();
    const token = await getAccessToken();

    const mutation = `
      mutation CreateExtension($extension: String!, $name: String!, $tech: String!, $secret: String!) {
        createExtension(
          extension: $extension
          name: $name
          tech: $tech
          secret: $secret
        ) {
          extension
          name
          tech
        }
      }
    `;

    console.log('Making GraphQL request with token:', token.substring(0, 10) + '...');
    
    const response = await fetch(config.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: extensionData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GraphQL request failed:', response.status, errorText);
      throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('GraphQL response:', result);
    
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }
    
    return result;
  } catch (error) {
    console.warn('FreePBX integration failed:', error);
    throw error;
  }
};

export const updateExtensionInFreePBX = async (extensionData: {
  extension: string;
  name: string;
  tech: string;
  secret?: string;
}) => {
  try {
    const config = await getFreePBXConfig();
    const token = await getAccessToken();

    const mutation = `
      mutation UpdateExtension($extension: String!, $name: String!, $tech: String!, $secret: String) {
        updateExtension(
          extension: $extension
          name: $name
          tech: $tech
          secret: $secret
        ) {
          extension
          name
          tech
        }
      }
    `;

    const response = await fetch(config.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: extensionData,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to update extension in FreePBX`);
    }

    return response.json();
  } catch (error) {
    console.warn('FreePBX integration failed:', error);
    throw error;
  }
};

export const deleteExtensionInFreePBX = async (extension: string) => {
  try {
    const config = await getFreePBXConfig();
    const token = await getAccessToken();

    const mutation = `
      mutation DeleteExtension($extension: String!) {
        deleteExtension(extension: $extension) {
          success
        }
      }
    `;

    const response = await fetch(config.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: { extension },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Failed to delete extension in FreePBX`);
    }

    return response.json();
  } catch (error) {
    console.warn('FreePBX integration failed:', error);
    throw error;
  }
};