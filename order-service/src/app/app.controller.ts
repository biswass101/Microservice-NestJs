import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { AppService } from './app.service';

import { lastValueFrom, Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';

interface InventoryService {
  checkStock(data: { productId: string}) : Observable<any>;
}

@Controller('orders')
export class AppController implements OnModuleInit {
  private inventoryService! : InventoryService;

  constructor(
    @Inject('INVENTORY_PACKAGE') 
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.inventoryService = this.client.getService<InventoryService>('InventoryService');
  }


  @Get('check-item')
  async checkItem(@Query('productId') productId: string) {
    const stockStatus = await lastValueFrom(
      this.inventoryService.checkStock({ productId })
    )

    if(stockStatus.inStock) {
      return {
        status: 'In Stock',
        availableQuantity: stockStatus.availableQuantity,
      }
    }
    return {
      status: 'Out of Stock',
    };
  } 
}
