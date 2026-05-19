import { Injectable } from "@nestjs/common";
import Consul from "consul";

@Injectable()

export class AppService {
  private consul = new Consul({ host: 'localhost', port: 8500 });

  async discoverAndCallPayment() {
    const services = await this.consul.agent.service.list();

    const paymentInfo = services['payment-unique-id-1'];

    if(!paymentInfo) {
      throw new Error("Payment service not found in registry");
    }

    const address = 'localhost';
    const port = paymentInfo.Port;

    const finalUrl = `http://${address}:${port}/api/health`;

    console.log(`Discovery successful - Calling payment service at ${finalUrl}`);

    return { message: 'Service discovery successful',
      discoveredUrl: finalUrl,
      serviceData: paymentInfo
    }
  }
}