export const toOrdersBody = (orders: any[]) => {
  return orders.map((order) => {
    return {
      id: order.id,
      cartId: order.cart_id,
      address: {
        firstName: order.delivery?.firstName,
        lastName: order.delivery?.lastName,
        address: order.delivery?.address,
        comment: order.comment,
      },
      items: order.items,
      statusHistory: [ {
        status: order.status,
        timestamp: 5,
        comment: 'Additional info'
      } ],
    }
  })
};

export const toOrderDeliveryDB = (order: any) => {
  return {
    delivery: {
      firstName: order.address?.firstName,
      lastName: order.address?.lastName,
      address: order.address?.address,
    },
    comments: order.address.comment,
  }
};