import { io, Socket } from 'socket.io-client';
import { store } from '@/store';
import { addOrderRealtime, updateOrderStatusRealtime } from '@/store/slices/orderSlice';
import { triggerAlarm } from '@/store/slices/uiSlice';
import { toast } from 'sonner';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketManager {
  private socket: Socket | null = null;

  connect() {
    const token = localStorage.getItem('token');

    // If no token, don't even try — socket server requires auth
    if (!token) return;

    // If already connected with a live socket, skip
    if (this.socket?.connected) return;

    // If socket exists but disconnected (e.g. from a previous session), clean up
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 2000,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket?.id);

      // After connecting, join the branch room if admin/staff
      const role = store.getState().auth.role;
      if (role === 'ADMIN' || role === 'STAFF' || role === 'SUPER_ADMIN') {
        this.joinBranch(1); // Default branch 1 — in a real app, fetch from user profile
      }
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // NEW ORDER → add to store + trigger alarm for admin/staff
    this.socket.on('NEW_ORDER', (orderData) => {
      console.log('🔔 NEW_ORDER received:', orderData);
      store.dispatch(addOrderRealtime(orderData));

      const role = store.getState().auth.role;
      if (role === 'ADMIN' || role === 'STAFF' || role === 'SUPER_ADMIN') {
        store.dispatch(triggerAlarm({ 
          id: orderData.id, 
          message: `Yeni sipariş geldi! Sipariş NO: #${orderData.id}` 
        }));
      }
    });

    // MISSED_ORDERS on reconnect → load into store
    this.socket.on('MISSED_ORDERS', (orders: unknown[]) => {
      console.log('📦 Missed orders loaded:', orders.length);
      orders.forEach((order) => {
        store.dispatch(addOrderRealtime(order as Parameters<typeof addOrderRealtime>[0]));
      });
    });

    // ORDER STATUS CHANGE
    this.socket.on('ORDER_STATUS_CHANGED', (data: { id: number; status: string }) => {
      store.dispatch(updateOrderStatusRealtime(data));
    });

    // CUSTOMER SPECIFIC STATUS CHANGE
    this.socket.on('CUSTOMER_ORDER_STATUS_CHANGED', (data: { id: number; status: string; message: string }) => {
      console.log('✨ Customer Status Update:', data);
      toast.success(data.message, {
        description: `Sipariş NO: #${data.id}`,
        duration: 5000,
      });
      // Also update local store if needed (though the general event might have handled it)
      store.dispatch(updateOrderStatusRealtime({ id: data.id, status: data.status }));
    });
  }

  joinBranch(branchId: number) {
    if (this.socket?.connected) {
      console.log(`📡 Joining branch_${branchId} room...`);
      this.socket.emit('join_branch', branchId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  acknowledgeOrder(orderId: number) {
    if (this.socket) {
      this.socket.emit('ACK_ORDER', { orderId });
    }
  }
}

export const socketManager = new SocketManager();
