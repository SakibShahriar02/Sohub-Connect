import { supabase } from './supabase';

interface GraphQLConfig {
  token_url: string;
  gql_url: string;
  client_id: string;
  client_secret: string;
}

interface ExtensionData {
  extensionId: string;
  name: string;
  tech: string;
  callerID: string;
  secret: string;
}

class GraphQLService {
  private config: GraphQLConfig | null = null;
  private accessToken: string = '';

  async getConfig(): Promise<GraphQLConfig> {
    if (this.config) return this.config;

    try {
      const { data, error } = await supabase
        .from('global_settings')
        .select('freepbx_token_url, freepbx_graphql_url, freepbx_client_id, freepbx_client_secret')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No global settings found');
      }

      // Check if all required fields are present
      if (!data.freepbx_token_url || !data.freepbx_graphql_url || !data.freepbx_client_id || !data.freepbx_client_secret) {
        console.error('Missing GraphQL configuration fields:', data);
        throw new Error('Incomplete GraphQL configuration');
      }

      // Use proxy URLs in development to avoid CORS
      const isDev = import.meta.env.DEV;
      this.config = {
        token_url: isDev ? '/freepbx-api/admin/api/api/token' : data.freepbx_token_url,
        gql_url: isDev ? '/freepbx-api/admin/api/api/gql' : data.freepbx_graphql_url,
        client_id: data.freepbx_client_id,
        client_secret: data.freepbx_client_secret
      };



      return this.config;
    } catch (error) {
      console.error('Failed to get GraphQL config:', error);
      throw error;
    }
  }

  async getToken(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    try {
      const config = await this.getConfig();
      

      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(config.token_url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: config.client_id,
          client_secret: config.client_secret,
          grant_type: 'client_credentials',
          scope: 'gql'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token request failed:', response.status, errorText);
        throw new Error(`Failed to get access token: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      
      if (!data.access_token) {
        throw new Error('No access token in response');
      }
      
      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('FreePBX server is not responding (timeout)');
        }
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          throw new Error('CORS error: Cannot connect to FreePBX server from browser');
        }
      }
      console.error('Token request failed:', error);
      throw error;
    }
  }

  async executeQuery(query: string): Promise<any> {
    try {
      const config = await this.getConfig();
      const token = await this.getToken();



      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(config.gql_url, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);


      if (!response.ok) {
        const errorText = await response.text();
        console.error('GraphQL request failed:', response.status, errorText);
        throw new Error(`GraphQL request failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();

      
      if (result.errors) {
        console.error('GraphQL errors:', result.errors);
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }
      
      return result;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('FreePBX server is not responding (timeout)');
      }
      console.error('GraphQL query failed:', error);
      throw error;
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'GraphQL disabled in production' };
  }

  async createExtension(data: ExtensionData): Promise<any> {
    throw new Error('GraphQL disabled in production');
  }

  async updateExtension(data: ExtensionData): Promise<any> {
    throw new Error('GraphQL disabled in production');
  }

  async deleteExtension(extensionId: string): Promise<any> {
    throw new Error('GraphQL disabled in production');
  }

  async _createExtension_disabled(data: ExtensionData): Promise<any> {
    const addQuery = `mutation {
      addExtension(input: {
        extensionId: ${data.extensionId}, 
        name: "${data.name}",
        tech: "${data.tech}",
        email: "",
        channelName: "", 
        outboundCid: "${data.callerID}",
        callerID: "${data.callerID}",
        maxContacts: "2",
      }) {
        status
        message
      }
    }`;

    const updateQuery = `mutation {
      updateExtension(input: {
        extensionId: ${data.extensionId}, 
        name: "${data.name}",
        tech: "${data.tech}",
        email: "",
        channelName: "", 
        outboundCid: "${data.callerID}",
        callerID: "${data.callerID}",
        extPassword: "${data.secret}",
      }) {
        status
        message
      }
    }`;

    const applyQuery = `mutation { 
      doreload(input: {}) { 
        message 
        status 
        transaction_id 
      } 
    }`;

    try {
      await this.executeQuery(addQuery);
      await this.executeQuery(updateQuery);
      await this.executeQuery(applyQuery);
      
      return { success: true };
    } catch (error) {
      console.error('Create extension failed:', error);
      throw error;
    }
  }


}

export const graphqlService = new GraphQLService();