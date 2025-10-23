import platformClient from 'purecloud-platform-client-v2';
import { config } from '../config/env.js';
import { t } from '../config/i18n.js';

let client = null;

/**
 * Initializes and authenticates with Genesys Cloud
 * @returns {Promise<platformClient>} Authenticated Genesys client
 */
export async function initializeGenesysClient() {
  if (client) {
    return client;
  }

  try {
    console.log(t('genesys.connecting', { region: config.genesysRegion }));

    // Set the environment (region)
    client = platformClient.ApiClient.instance;
    client.setEnvironment(config.genesysRegion);

    // Authenticate using Client Credentials
    await client.loginClientCredentialsGrant(
      config.genesysClientId,
      config.genesysClientSecret
    );

    console.log(t('genesys.connected'));
    return client;

  } catch (error) {
    console.error(t('genesys.connection_error', { message: error.message }));
    throw new Error(`Failed to connect to Genesys Cloud: ${error.message}`);
  }
}

/**
 * Gets an authenticated Genesys API instance
 * @returns {platformClient} Genesys API client
 */
export function getGenesysClient() {
  if (!client) {
    throw new Error('Genesys client not initialized. Call initializeGenesysClient() first.');
  }
  return client;
}

/**
 * Creates an Analytics API instance
 * @returns {Promise<Object>} Analytics API instance
 */
export async function getAnalyticsApi() {
  await initializeGenesysClient();
  return new platformClient.AnalyticsApi();
}

/**
 * Creates a Routing API instance
 * @returns {Promise<Object>} Routing API instance
 */
export async function getRoutingApi() {
  await initializeGenesysClient();
  return new platformClient.RoutingApi();
}

/**
 * Creates a Conversations API instance
 * @returns {Promise<Object>} Conversations API instance
 */
export async function getConversationsApi() {
  await initializeGenesysClient();
  return new platformClient.ConversationsApi();
}
