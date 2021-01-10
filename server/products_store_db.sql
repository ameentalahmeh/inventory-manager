DROP TABLE IF EXISTS location,
product,
productmovement CASCADE;

CREATE TABLE location (
    location_id VARCHAR(45) NOT NULL,
    city TEXT NOT NULL,
    PRIMARY KEY (location_id)
);

CREATE TABLE product (
    product_id VARCHAR(45) NOT NULL,
    name TEXT NOT NULL,
    warehouse TEXT NOT NULL,
    qty FLOAT NOT NULL DEFAULT '0',
    prod_location_id VARCHAR(45) NOT NULL,
    PRIMARY KEY (product_id),
    FOREIGN KEY (prod_location_id) REFERENCES location(location_id)
);

CREATE TABLE productmovement (
    movement_id VARCHAR(45) NOT NULL,
    movement_timestamp TIMESTAMP NOT NULL,
    from_location TEXT NULL DEFAULT NULL,
    to_location TEXT NULL DEFAULT NULL,
    product_id VARCHAR(45) NOT NULL,
    qty FLOAT NOT NULL DEFAULT '0',
    PRIMARY KEY (movement_id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

-- Add Locations
INSERT INTO
    location (location_id, city)
VALUES
    ("1", "Hebron");

INSERT INTO
    location (location_id, city)
VALUES
    ("2", "Jenin");

INSERT INTO
    location (location_id, city)
VALUES
    ("3", "Ramallah");

-- Add Products
INSERT INTO
    product (
        product_id,
        name,
        warehouse,
        qty,
        prod_location_id
    )
VALUES
    (
        "1",
        "Laptop",
        "Hebron Warehouse 1",
        300,
        "1"
    );

INSERT INTO
    product (
        product_id,
        name,
        warehouse,
        qty,
        prod_location_id
    )
VALUES
    (
        "2",
        "Tablet",
        "Hebron Warehouse 2",
        100,
        "1"
    );

INSERT INTO
    product (
        product_id,
        name,
        warehouse,
        qty,
        prod_location_id
    )
VALUES
    (
        "3",
        "Phone",
        "Jenin Warehouse 1",
        200,
        "2"
    );

INSERT INTO
    product (
        product_id,
        name,
        warehouse,
        qty,
        prod_location_id
    )
VALUES
    (
        "4",
        "Phone Cover",
        "Jenin Warehouse 2",
        60,
        "2"
    );

INSERT INTO
    product (
        product_id,
        name,
        warehouse,
        qty,
        prod_location_id
    )
VALUES
    (
        "5",
        "Clock",
        "Ramallah Warehouse 1",
        150,
        "3"
    );

INSERT INTO
    product (
        product_id,
        name,
        warehouse,
        qty,
        prod_location_id
    )
VALUES
    (
        "6",
        "Shoes",
        "Ramallah Warehouse 2",
        400,
        "3"
    );

INSERT INTO
    product (
        product_id,
        name,
        warehouse,
        qty,
        prod_location_id
    )
VALUES
    (
        "7",
        "Glass",
        "Ramallah Warehouse 3",
        80,
        "3"
    );

INSERT INTO
    product (
        product_id,
        name,
        warehouse,
        qty,
        prod_location_id
    )
VALUES
    (
        "8",
        "T-Shirt",
        "Ramallah Warehouse 4",
        30,
        "3 "
    );

-- Add Movements 
INSERT INTO
    productmovement (
        movement_id,
        movement_timestamp,
        from_location,
        to_location,
        product_id,
        qty
    )
VALUES
    (
        "1",
        "2021-01-05 11:52:00",
        "Hebron",
        "Jenin",
        "1",
        2
    );