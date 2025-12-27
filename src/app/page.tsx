import { v4 as uuidv4 } from 'uuid';

enum OrderType {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
  STOP_LOSS = 'STOP_LOSS',
  TAKE_PROFIT = 'TAKE_PROFIT',
  TRAILING_STOP = 'TRAILING_STOP',
  OCO = 'OCO',
  CONDITIONAL = 'CONDITIONAL'
}

enum OrderStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  EXECUTED = 'EXECUTED',
  CANCELLED = 'CANCELLED'
}

interface BaseOrder {
  id: string;
  symbol: string;
  quantity: number;
  type: OrderType;
  status: OrderStatus;
  timestamp: number;
}

interface TrailingStopOrder extends BaseOrder {
  trailAmount: number;
  trailPercent: number;
  triggerPrice: number;
}

interface OCOOrder extends BaseOrder {
  stopLossPrice: number;
  takeProfitPrice: number;
  primaryOrderId: string;
  secondaryOrderId: string;
}

interface ConditionalOrder extends BaseOrder {
  condition: string;
  triggerPrice: number;
  conditionFunction: (currentPrice: number) => boolean;
}

class AdvancedOrderManager {
  private orders: Map<string, BaseOrder> = new Map();

  createTrailingStopOrder(
    symbol: string, 
    quantity: number, 
    trailAmount?: number, 
    trailPercent?: number
  ): TrailingStopOrder {
    const order: TrailingStopOrder = {
      id: uuidv4(),
      symbol,
      quantity,
      type: OrderType.TRAILING_STOP,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      trailAmount: trailAmount || 0,
      trailPercent: trailPercent || 0,
      triggerPrice: 0
    };

    this.orders.set(order.id, order);
    return order;
  }

  createOCOOrder(
    symbol: string, 
    quantity: number, 
    stopLossPrice: number, 
    takeProfitPrice: number
  ): OCOOrder {
    const primaryOrder: BaseOrder = {
      id: uuidv4(),
      symbol,
      quantity,
      type: OrderType.OCO,
      status: OrderStatus.PENDING,
      timestamp: Date.now()
    };

    const secondaryOrder: BaseOrder = {
      id: uuidv4(),
      symbol,
      quantity,
      type: OrderType.OCO,
      status: OrderStatus.PENDING,
      timestamp: Date.now()
    };

    const ocoOrder: OCOOrder = {
      ...primaryOrder,
      stopLossPrice,
      takeProfitPrice,
      primaryOrderId: primaryOrder.id,
      secondaryOrderId: secondaryOrder.id
    };

    this.orders.set(ocoOrder.id, ocoOrder);
    return ocoOrder;
  }

  createConditionalOrder(
    symbol: string, 
    quantity: number, 
    condition: string,
    triggerPrice: number
  ): ConditionalOrder {
    const conditionFunction = new Function(
      'currentPrice', 
      `return ${condition}`
    ) as (currentPrice: number) => boolean;

    const order: ConditionalOrder = {
      id: uuidv4(),
      symbol,
      quantity,
      type: OrderType.CONDITIONAL,
      status: OrderStatus.PENDING,
      timestamp: Date.now(),
      condition,
      triggerPrice,
      conditionFunction
    };

    this.orders.set(order.id, order);
    return order;
  }

  executeConditionalOrder(orderId: string, currentPrice: number): boolean {
    const order = this.orders.get(orderId) as ConditionalOrder;
    
    if (!order || order.status !== OrderStatus.PENDING) {
      return false;
    }

    if (order.conditionFunction(currentPrice)) {
      order.status = OrderStatus.EXECUTED;
      return true;
    }

    return false;
  }

  analyzeOrderExecutionMetrics(): OrderExecutionAnalytics {
    const allOrders = Array.from(this.orders.values());
    
    return {
      totalOrders: allOrders.length,
      executedOrders: allOrders.filter(o => o.status === OrderStatus.EXECUTED).length,
      pendingOrders: allOrders.filter(o => o.status === OrderStatus.PENDING).length,
      cancelledOrders: allOrders.filter(o => o.status === OrderStatus.CANCELLED).length
    };
  }
}

interface OrderExecutionAnalytics {
  totalOrders: number;
  executedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
}

export {
  AdvancedOrderManager,
  OrderType,
  OrderStatus
};

This implementation provides:

1. Advanced Order Types
   - Trailing Stop Orders
   - OCO (One Cancels Other) Orders
   - Conditional Market/Limit Orders

2. Key Features
   - Unique Order ID generation
   - Flexible order creation
   - Conditional order execution
   - Order status tracking
   - Execution analytics

3. Advanced Capabilities
   - Dynamic condition evaluation
   - Metrics and analytics
   - Typescript strong typing

Technologies:
- TypeScript
- UUID for unique identifiers
- Functional programming concepts

Recommended Extensions:
1. Add persistent storage
2. Implement WebSocket real-time updates
3. Create comprehensive logging
4. Add more complex condition evaluations
5. Integrate with trading platforms

Would you like me to elaborate on any specific aspect of the implementation?