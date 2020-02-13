import elasticApmNode from 'elastic-apm-node';

const apmServiceName = process.env.APM_SERVICE_NAME;
const apmServerUrl = process.env.APM_SERVER_URL;

let elasticAgent = null;
if (apmServiceName && apmServerUrl) {
  elasticAgent = elasticApmNode.start({
    serviceName: apmServiceName,
    serverUrl: apmServerUrl,
  });
}

import { Logger } from '../logger';

if (!elasticAgent?.isStarted()) {
  Logger.error('Failed to start APM server');
} else {
  Logger.info(`Registered service "${apmServiceName}" in APM Server: ${apmServerUrl}`);
}
