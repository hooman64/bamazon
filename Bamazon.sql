CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
	item_id INT (11) auto_increment NOT NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR (100) NULL,
    price DECIMAL (10, 4) DEFAULT NULL,
    stock_quantity INT (20),
    PRIMARY KEY (item_id)
);

INSERT INTO
	products (item_id, product_name, department_name, price, stock_quantity)
VALUES
(1,'Beats Solo3 headphones','Audio Department',39.99,20),
(2,'Nike SB Max','Clothing Department',109.99,10),
(3,'Kendrick Lamar - DAMN', 'Audio Department',19.99,15),
(4,'Logitech C920 webcam', 'Electronics Department', 50.99, 10),
(5,'Nintendo Switch', 'Electronics Department', 250.99, 1),
(6,'Fractal Design Node 202','Electronics Department',139.99, 200),
(7,'Apple iPad mini 256gb', 'Electronics Department',199.99, 20),
(8,'Lacoste Polo', 'Clothing Department', 149.99, 10),
(9,'Pride and Prejudice and Zombies','Books Department',11.99,10),
(10,'Mamiya 645DF Medium Format DSLR Camera', 'Photography Department',5990.99,5);

