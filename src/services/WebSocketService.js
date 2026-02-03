import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import config from '../config/config';
import AuthenticationService from './AuthenticationService';

class WebSocketService {
  constructor() {
    this.servicesClient = null;
    this.telemetryClient = null;
    this.connected = false;
    this.serviceCallbacks = new Map();
    this.telemetryCallbacks = new Map();
  }

  connect() {
    if (this.connected || !AuthenticationService.isAuthenticated()) {
      return;
    }

    const token = AuthenticationService.getAuthenticationToken();
    const username = AuthenticationService.getUserName();

    // Services WebSocket Client
    this.servicesClient = new Client({
      brokerURL: config.webSocket.services,
      debug: (str) => {
        console.debug('[WS Services]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      webSocketFactory: () => new SockJS(config.webSocket.services),
      onConnect: () => {
        console.log('[WS Services] Connected');
        this.servicesClient.subscribe(
          `/app/v2/messaging/topic/user-${username}`,
          this.onServiceMessage.bind(this)
        );
      },
      onDisconnect: () => {
        console.log('[WS Services] Disconnected');
      },
      onStompError: (frame) => {
        console.error('[WS Services] Error:', frame);
      },
    });

    // Telemetry WebSocket Client
    this.telemetryClient = new Client({
      brokerURL: config.webSocket.telemetry,
      debug: (str) => {
        console.debug('[WS Telemetry]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      webSocketFactory: () => new SockJS(config.webSocket.telemetry),
      onConnect: () => {
        console.log('[WS Telemetry] Connected');
        this.telemetryClient.subscribe(
          `/app/v2/messaging/topic/user-${username}`,
          this.onTelemetryMessage.bind(this)
        );
      },
      onDisconnect: () => {
        console.log('[WS Telemetry] Disconnected');
      },
      onStompError: (frame) => {
        console.error('[WS Telemetry] Error:', frame);
      },
    });

    this.servicesClient.activate();
    this.telemetryClient.activate();
    this.connected = true;
  }

  disconnect() {
    if (this.servicesClient) {
      this.servicesClient.deactivate();
    }
    if (this.telemetryClient) {
      this.telemetryClient.deactivate();
    }
    this.connected = false;
    this.serviceCallbacks.clear();
    this.telemetryCallbacks.clear();
  }

  onServiceMessage(message) {
    console.log('[WS Services] Message received:', message.headers.destination);
    
    try {
      const data = JSON.parse(message.body);
      
      this.serviceCallbacks.forEach((callback, key) => {
        if (callback.topic === message.headers.destination || callback.topic === 'all') {
          callback.handler(data, message);
        }
      });
    } catch (error) {
      console.error('[WS Services] Error parsing message:', error);
    }
  }

  onTelemetryMessage(message) {
    console.log('[WS Telemetry] Message received:', message.headers.destination);
    
    try {
      const data = JSON.parse(message.body);
      
      this.telemetryCallbacks.forEach((callback, key) => {
        if (callback.topic === message.headers.destination || callback.topic === 'all') {
          callback.handler(data, message);
        }
      });
    } catch (error) {
      console.error('[WS Telemetry] Error parsing message:', error);
    }
  }

  subscribeService(callbackId, topic, handler) {
    this.serviceCallbacks.set(callbackId, { topic, handler });
    
    if (!this.connected) {
      this.connect();
    }
  }

  subscribeTelemetry(callbackId, topic, handler) {
    this.telemetryCallbacks.set(callbackId, { topic, handler });
    
    if (!this.connected) {
      this.connect();
    }
  }

  unsubscribeService(callbackId) {
    this.serviceCallbacks.delete(callbackId);
  }

  unsubscribeTelemetry(callbackId) {
    this.telemetryCallbacks.delete(callbackId);
  }

  sendServiceMessage(destination, body) {
    if (this.servicesClient && this.servicesClient.connected) {
      this.servicesClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('[WS Services] Not connected');
    }
  }

  sendTelemetryMessage(destination, body) {
    if (this.telemetryClient && this.telemetryClient.connected) {
      this.telemetryClient.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.error('[WS Telemetry] Not connected');
    }
  }
}

const webSocketService = new WebSocketService();

export default webSocketService;
