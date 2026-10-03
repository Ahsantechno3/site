const Setting = require('../models/Setting');
const axios = require('axios');

/**
 * Universal Integration Runner
 * @param {string} serviceSlug - e.g. "cloudinary-storage"
 * @param {string} actionName - e.g. "upload"
 * @param {object} payload - Body params
 * @param {object} queryParams - Query params
 */
const runIntegration = async (serviceSlug, actionName, payload = {}, queryParams = {}) => {
  const settings = await Setting.findOne();
  if (!settings) throw new Error("System settings not configured");

  const service = settings.integrations.find(
    (item) => item.serviceSlug === serviceSlug && item.isConnected
  );
  if (!service) throw new Error(`Integration service '${serviceSlug}' active nahi hai.`);

  const endpoint = service.endpoints.find((ep) => ep.name === actionName);
  if (!endpoint) throw new Error(`Action '${actionName}' endpoint missing in '${serviceSlug}'`);

  const headers = {
    'Content-Type': 'application/json',
    ...(service.globalHeaders ? Object.fromEntries(service.globalHeaders) : {}),
    ...(endpoint.defaultHeaders ? Object.fromEntries(endpoint.defaultHeaders) : {})
  };

  if (service.authType === 'BEARER_TOKEN') {
    headers['Authorization'] = `Bearer ${service.authCredentials?.apiKey}`;
  } else if (service.authType === 'API_KEY' || service.authType === 'CUSTOM_HEADER') {
    const headerName = service.authCredentials?.headerKey || 'X-API-KEY';
    headers[headerName] = service.authCredentials?.apiKey;
  } else if (service.authType === 'BASIC') {
    const creds = Buffer.from(
      `${service.authCredentials?.username}:${service.authCredentials?.password}`
    ).toString('base64');
    headers['Authorization'] = `Basic ${creds}`;
  }

  const fullUrl = `${service.baseUrl.replace(/\/$/, '')}/${endpoint.path.replace(/^\//, '')}`;

  const response = await axios({
    method: endpoint.method || 'POST',
    url: fullUrl,
    headers,
    params: queryParams,
    data: ['POST', 'PUT', 'PATCH'].includes(endpoint.method) ? payload : undefined
  });

  return response.data;
};

module.exports = { runIntegration };