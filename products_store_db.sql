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
    PRIMARY KEY (product_id)
);

CREATE TABLE productmovement (
    movement_id VARCHAR(45) NOT NULL,
    movement_timestamp TIMESTAMP NOT NULL,
    from_location TEXT NULL DEFAULT NULL,
    to_location TEXT NULL DEFAULT NULL,
    product_id VARCHAR(45) NOT NULL,
    qty INT NOT NULL DEFAULT '0',
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
        name
    )
VALUES
    (
        "1",
        "Laptop"
    );

INSERT INTO
    product (
        product_id,
        name
    )
VALUES
    (
        "2",
        "Tablet"
    );

INSERT INTO
    product (
        product_id,
        name
    )
VALUES
    (
        "3",
        "Phone"
    );

INSERT INTO
    product (
        product_id,
        name
    )
VALUES
    (
        "4",
        "Phone Cover"
    );

INSERT INTO
    product (
        product_id,
        name
    )
VALUES
    (
        "5",
        "Clock"
    );

INSERT INTO
    product (
        product_id,
        name
    )
VALUES
    (
        "6",
        "Shoes"
    );

INSERT INTO
    product (
        product_id,
        name
    )
VALUES
    (
        "7",
        "Glass"
    );

INSERT INTO
    product (
        product_id,
        name
    )
VALUES
    (
        "8",
        "T-Shirt"
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