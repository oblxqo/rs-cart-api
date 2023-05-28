// Carts
export const GET_USER_CART_LIST_QUERY = `select * from carts where user_id = $1`;
export const GET_USER_CART_LIST_QUERY_BY_STATUS = `${GET_USER_CART_LIST_QUERY} AND status = $2`;
export const CREATE_CART = `INSERT INTO carts(user_id, status)
    VALUES($1,$2)
    RETURNING *`;
export const UPDATE_CART_STATUS_QUERY = `UPDATE carts SET status = $1 WHERE id = $2 RETURNING *`;

// Orders
export const GET_ORDERS_LIST_QUERY = `select * from orders`;
export const GET_ORDERS_LIST_BY_USER_QUERY = `select * from orders where user_id = $1`;
export const GET_ORDER_BY_ID_QUERY = `select * from orders where id = $1`;
export const UPDATE_ORDER_STATUS_QUERY = `UPDATE orders SET status = $1 WHERE id = $2 RETURNING status`;
export const CREATE_ORDER_QUERY = `INSERT INTO orders(user_id, cart_id, payment, delivery, comments, status, total)
    VALUES($1,$2,$3,$4,$5,$6,$7)`;
export const ORDERS_WITH_ITEMS_QUERY_BASE = `select id, user_id, ci.cart_id, payment, delivery, comments, status, total,
array_agg(json_build_object('productId', product_id, 'count', count)) as items from orders o left join cart_items ci on o.cart_id = ci.cart_id`;
export const GET_ORDERS_WITH_ITEMS_QUERY = `${ORDERS_WITH_ITEMS_QUERY_BASE} group by id, ci.cart_id;`;
export const GET_ORDER_BY_ID_WITH_ITEMS_QUERY = `${ORDERS_WITH_ITEMS_QUERY_BASE} where id = $1 group by id, ci.cart_id;`;
export const GET_ORDER_BY_USER_ID_WITH_ITEMS_QUERY = `${ORDERS_WITH_ITEMS_QUERY_BASE} where user_id = $1 group by id, ci.cart_id;`;
export const DELETE_ORDER_QUERY = `DELETE FROM orders WHERE id = $1 RETURNING *`;

// Cart items
export const GET_CART_ITEMS_LIST_QUERY = `select * from cart_items where cart_id = $1`;
export const GET_CART_ITEMS_LIST_QUERY_WITH_PRODUCT = `
select * from cart_items INNER JOIN products ON product_id = id where cart_id = $1`;
export const GET_CART_ITEM_BY_PRODUCT_ID_QUERY = `${GET_CART_ITEMS_LIST_QUERY} AND product_id = $2`;
export const UPDATE_COUNT_CART_BY_ID_QUERY = `UPDATE cart_items SET count = $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *`;
export const CREATE_PRODUCT_IN_CART_QUERY = `INSERT INTO cart_items(cart_id, product_id, count)
    VALUES($1,$2,$3)
    RETURNING *`;
export const DELETE_CART_ITEM_BY_CART_AND_PRODUCT_QUERY = `DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2 RETURNING *`;
export const DELETE_CART_ITEMS_BY_CART_ID_QUERY = `DELETE FROM cart_items WHERE cart_id = $1`;

// Users
export const GET_USER_LIST = `SELECT u.id, u.name, u.password
    FROM users AS u`;
export const GET_USER_BY_NAME = `${GET_USER_LIST} WHERE u.id = $1;`;
export const GET_USER_BY_ID = `${GET_USER_LIST} WHERE u.name = $1;`;
export const CREATE_USER_QUERY = `INSERT INTO users(name, password, email)
    VALUES($1,$2,$3)
    RETURNING *`;

