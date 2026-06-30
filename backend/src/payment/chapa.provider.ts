import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChapaProvider {
  private readonly logger = new Logger(ChapaProvider.name);

  constructor(private config: ConfigService) {}

  private get baseUrl() {
    return this.config.get<string>('CHAPA_API_URL');
  }

  private get secretKey() {
    return this.config.get<string>('CHAPA_SECRET_KEY');
  }

  async initialize(data: {
    amount: number;
    email: string;
    firstName: string;
    lastName: string;
    txRef: string;
    returnUrl: string;
  }) {
    try {
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

      if (!response.ok || result.status !== 'success') {
        this.logger.error(`Chapa Init Failed: ${JSON.stringify(result)}`);
        throw new InternalServerErrorException(result.message || 'Payment initialization failed');
      }

      return result.data; // Returns { checkout_url: '...' }
    } catch (error) {
      this.logger.error('Chapa Initialization Error', error);
      throw new InternalServerErrorException('Could not connect to payment gateway');
    }
  }

  async verify(txRef: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transaction/verify/${txRef}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      });

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        this.logger.error(`Chapa Verification Failed for ${txRef}: ${JSON.stringify(result)}`);
        return { success: false, message: result.message };
      }

      return { success: true, data: result.data };
    } catch (error) {
      this.logger.error(`Verification Network Error for ${txRef}`, error);
      return { success: false, message: 'Verification service unavailable' };
    }
  }
}