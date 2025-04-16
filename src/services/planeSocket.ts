import { planeStore } from '../stores/planeStore';
import type { Plane } from '../models/Plane';

let socket: WebSocket;

export function initPlaneSocket(url: string) {
  socket = new WebSocket(url);

  socket.onopen = () => console.log('[WebSocket] Connected');
  socket.onmessage = handleMessage;
  socket.onclose = () => console.warn('[WebSocket] Disconnected');
  socket.onerror = (err) => {
    console.error('[WebSocket] Error:', err);
    socket.close();
  };
}

function handleMessage(event: MessageEvent) {
  try {
    const data: Plane | Plane[] = JSON.parse(event.data);
    if (Array.isArray(data)) {
      data.forEach(plane => {
        planeStore.updatePlane(plane.id, plane);
      });
    } else {
      planeStore.updatePlane(data.id, data);
    }
  } catch (err) {
    console.error('[WebSocket] Failed to parse message:', err);
  }
}

export function closePlaneSocket() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
    console.log('[WebSocket] Closed by client');
  }
}
