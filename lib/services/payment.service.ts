import { apiClient } from './api-client';

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  plan_name: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const PaymentService = {
  async createOrder(planId: string): Promise<RazorpayOrderResponse> {
    const res = await apiClient.post<RazorpayOrderResponse>('/payments/order', { plan_id: planId });
    return res.data!;
  },

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<{ activated: boolean }> {
    const res = await apiClient.post<{ activated: boolean }>('/payments/verify', {
      razorpay_order_id:   razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature:  razorpaySignature,
    });
    return res.data!;
  },

  /**
   * Load Razorpay checkout script and open payment dialog.
   * Returns a promise that resolves when payment is verified.
   */
  async openCheckout(order: RazorpayOrderResponse): Promise<{ activated: boolean }> {
    await this.loadRazorpayScript();

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key:         order.key_id,
        amount:      order.amount,
        currency:    order.currency,
        order_id:    order.order_id,
        name:        'CabSafars',
        description: `${order.plan_name} Subscription`,
        prefill: {
          name:    order.user_name,
          email:   order.user_email,
          contact: order.user_phone,
        },
        theme: { color: '#C0392B' },
        handler: async (response) => {
          try {
            const result = await PaymentService.verifyPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            resolve(result);
          } catch (e) {
            reject(e);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled by user')),
        },
      });
      rzp.open();
    });
  },

  loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window.Razorpay !== 'undefined') {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload  = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.head.appendChild(script);
    });
  },
};

export default PaymentService;
