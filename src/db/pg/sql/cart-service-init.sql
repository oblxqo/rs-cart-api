CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
   id uuid primary key default uuid_generate_v4(),
   name text NOT NULL,
   password text NOT NULL,
   created_at date NOT NULL default now(),
   updated_at date NOT NULL default now()
);

DROP TABLE IF EXISTS carts;
CREATE TYPE status_enum as enum ('OPEN', 'ORDERED');
CREATE TYPE order_status_enum as enum ('OPEN', 'APPROVED', 'SENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
CREATE TABLE IF NOT EXISTS carts (
   id uuid primary key default uuid_generate_v4(),
   user_id uuid default uuid_generate_v4() NOT NULL,
   foreign key ("user_id") references "users" ("id"),
   created_at date NOT NULL default now(),
   updated_at date NOT NULL default now(),
   status status_enum
);

DROP TABLE IF EXISTS cart_items;
CREATE TABLE IF NOT EXISTS cart_items (
   cart_id uuid,
   foreign key ("cart_id") references "carts" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
   product_id uuid,
   foreign key ("product_id") references "products" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
   count integer NOT NULL default 1
);

DROP TABLE IF EXISTS orders;
CREATE TABLE IF NOT EXISTS orders (
	id uuid primary key default uuid_generate_v4(),
	user_id uuid,
	foreign key ("user_id") references "users" ("id"),
	cart_id uuid,
	foreign key ("cart_id") references "carts" ("id"),
	payment jsonb,
	delivery jsonb,
	comments text,
	status order_status_enum default 'OPEN',
	total integer NOT NULL
);

insert into users (name, password) values ('oblxqo', 'TEST_PASSWORD');

insert into carts (user_id, created_at, updated_at, status) VALUES
('3559d3da-568c-4653-a78b-80ccc57489b1', '2023-05-16', '2023-05-16', 'ORDERED'),
('3559d3da-568c-4653-a78b-80ccc57489b1', '2023-05-16', '2023-05-16', 'OPEN'),


insert into cart_items (cart_id, product_id, count) VALUES
('4a65de64-62fe-4eca-bb5c-796c20f7cf1e', 'cbffce06-d54d-45bb-bd5c-7561670e64b5', 1),
('95338eca-616e-45ba-9c5e-99439c412e82', 'f893ca1d-512b-41c0-82b9-3af5287a4a89', 4),

INSERT INTO orders (id, user_id, cart_id, payment, delivery, comments, status, total) VALUES
('cef48beb-338f-40c7-97e4-20007e0ae236', '3559d3da-568c-4653-a78b-80ccc57489b1', '4a65de64-62fe-4eca-bb5c-796c20f7cf1e', '{"type":"card"}', '{"type":"UPS","address":"Orlando, Florida, USA", "firstName":"Clark", "lastName":"Kent"}', 'After midnight', 'COMPLETED', 1456),
('d729e6e3-c6b8-474e-a029-57704677733b', '3559d3da-568c-4653-a78b-80ccc57489b1', '95338eca-616e-45ba-9c5e-99439c412e82', '{"type":"card"}', '{"type":"DHL","address":"Louisville, Kentucky, USA", "firstName":"Bruce", "lastName":"Wayne"}', 'Fragile item', 'OPEN', 326);