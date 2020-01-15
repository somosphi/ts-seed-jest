import elasticApmNode from 'elastic-apm-node';
import dotenv from 'dotenv';

dotenv.config();

import { Logger } from '../logger';

export function start() {
  const apmServiceName = process.env.APM_SERVICE_NAME;
  const apmServerUrl = process.env.APM_SERVER_URL;

  if (apmServiceName && apmServerUrl) {
    const elasticAgent = elasticApmNode.start({
      serviceName: apmServiceName,
      serverUrl: apmServerUrl,
    });

    if (!elasticAgent.isStarted()) {
      Logger.error('Failed to start APM server');
    } else {
      Logger.info(`Registered service "${apmServiceName}" in APM Server: ${apmServerUrl}`);
    }
  }
}
