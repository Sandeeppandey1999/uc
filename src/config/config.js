const getVariables = () => {
  if (process.env.REACT_APP_API_BASE_URL) {
    return {
      api: {
        services: process.env.REACT_APP_API_BASE_URL,
        telemetry: process.env.REACT_APP_TELEMETRY_API_URL,
      },
      app: {
        services: process.env.REACT_APP_APP_BASE_URL,
        telemetry: process.env.REACT_APP_TELEMETRY_APP_URL,
      },
      webSocket: {
        services: process.env.REACT_APP_WS_SERVICES,
        telemetry: process.env.REACT_APP_WS_TELEMETRY,
      },
      sip: {
        domain: process.env.REACT_APP_SIP_DOMAIN,
        webRTCServer: process.env.REACT_APP_SIP_WEBSOCKET,
      },
    };
  }
  return {
    api: {
      services: window.location.origin + '/services/api/v2/',
      telemetry: window.location.origin + '/telemetry/api/v2/',
    },
    app: {
      services: window.location.origin + '/services/app/v2/',
      telemetry: window.location.origin + '/telemetry/app/v2/',
    },
    webSocket: {
      services: window.location.origin + '/services/app/v2/messaging/messages',
      telemetry: window.location.origin + '/telemetry/app/v2/messaging/messages',
    },
    sip: {
      domain: window.location.hostname,
      webRTCServer: `${window.location.protocol.replace('http', 'ws')}//${window.location.hostname}:7443`,
    },
  };
};

const variables = getVariables();

const config = {
  ...variables,
  application: {
    name: process.env.REACT_APP_APPLICATION_NAME || 'Unified Communication',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    secretKey: process.env.REACT_APP_SECRET_KEY || 'YOUR_SECRET_KEY1',
    inactiveTime: parseInt(process.env.REACT_APP_INACTIVE_TIME) || 30,
  },
};

export default config;
