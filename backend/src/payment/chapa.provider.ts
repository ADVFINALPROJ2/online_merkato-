import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChapaProvider {
  constructor(private config: ConfigService) {}

  private get baseUrl() {
    return this.config.get<string>('CHAPA_API_URL');
  }

  private get secretKey() {
    return this.config.get<string>('CHAPA_SECRET_KEY');
  }

  // Initialize a payment - returns a checkout URL
  async initialize(data: {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
    txRef: string;
    returnUrl: string;
  }) {
    const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: data.amount.toString(),
        currency: 'ETB',
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        tx_ref: data.txRef,
        return_url: data.returnUrl,
      }),
    });

    const result = await response.json();
    return result;
  }

  // Verify a payment after callback
  async verify(txRef: string) {
    const response = await fetch(`${this.baseUrl}/transaction/verify/${txRef}`, {
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    });

    const result = await response.json();
    return result;
  }
}
