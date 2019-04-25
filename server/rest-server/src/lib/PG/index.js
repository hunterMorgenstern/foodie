import db from '../../config/databases/pg';
import { success, error } from '../../../../lib/log';

const database =
  process.env.NODE_ENV === 'production'
    ? process.env.AWS_DATABASE
    : process.env.LOCAL_DATABASE;

/**
 * SQL statements for syncing and dropping tables
 *
 * Used in npm script `db:setup:rest-server`
 *
 * Database
 * Users
 * Challenges
 * Friends
 * Histories
 * TestCases
 * UsersChallenges
 * Sabotages
 */

// database SQL statements to create, drop, and use a database
export const createDatabase = async () => {
  try {
    await db.query(`CREATE DATABASE ${database}`);
    success('successfully created database ', database);
  } catch (err) {
    error('error creating database ', err);
  }
};

export const dropDatabase = async () => {
  try {
    await db.query(`DROP DATABASE IF EXISTS ${database}`);
    success('successfully dropped database ', database);
  } catch (err) {
    error('error dropping database ', err);
  }
};

export const useDatabase = async () => {
  try {
    await db.query(`USE IF EXISTS ${database}`);
    success('successfully using database ', database);
  } catch (err) {
    error('error using database ', err);
  }
};

// user table - creation and deletion (0 is a user, 1 is a business, 2 is a delivery user)

export const createUsersTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS users
      (
        id SERIAL,
        name varchar (50),
        profilepicture varchar (255),
        email varchar (50) UNIQUE,
        password varchar (255),
        type varchar(50),
        phone varchar (50), 
        paymentid varchar (50),
        stripeAccount varchar (50), 
        CONSTRAINT users_pk
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created Users table');
  } catch (err) {
    error('error creating Users table ', err);
  }
};

export const dropUsersTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS users`);
    success('successfully dropped Users table');
  } catch (err) {
    error('error dropping Users table ', err);
  }
};

// create Businesses table - creation and deletion

export const createBusinessesTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS businesses
      (
        id SERIAL,
        businesspicture varchar(255),
        coverpicture varchar(255),
        address varchar (255),
        email varchar (50) UNIQUE,
        type varchar (50),
        password varchar (100),
        rating int,
        foodcategory varchar (50),
        totalorder int,
        dailyorders int,
        gross int,
        phone varchar(10),
        latitude double precision,
        longitude double precision,
        price int,
        businessname varchar (100),
        contactname varchar (50),
        CONSTRAINT businesses_pk
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created Businesses table');
  } catch (err) {
    error('error creating Businesses table ', err);
  }
};

export const dropBusinessesTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS businesses`);
    success('successfully dropped Businesses table');
  } catch (err) {
    error('error dropping Businessess table ', err);
  }
};

// Delivery_Users table - creation and deletion

export const createDelivery_UsersTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS delivery_users
      (
        id SERIAL,
        id_users int NOT NULL,
        id_businesses int NOT NULL,
        CONSTRAINT fk_delivery_users_id_users
          FOREIGN KEY(id_users) REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_delivery_users_id_businesses  
          FOREIGN KEY(id_businesses) REFERENCES businesses(id)
          ON DELETE CASCADE,
        CONSTRAINT delivery_users_pk  
          PRIMARY KEY (id)
      )
      `
    );
    success('succesfully created Delivery_Users table');
  } catch (err) {
    error('error creating Delivery_Users table ', err);
  }
};

export const dropDelivery_UsersTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS delivery_users`);
  } catch (err) {
    error('error dropping Delivery_Users table ', err);
  }
};

// Reviews table - creation and deletion

export const createReviewsTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS reviews
      (
        id SERIAL,
        rating int NOT NULL,
        comment varchar (255),
        createdAt bigint,
        id_businesses int NOT NULL,
        CONSTRAINT fk_reviews_id_businesses
          FOREIGN KEY(id_businesses) REFERENCES businesses(id)
          ON DELETE CASCADE,
        CONSTRAINT reviews_pk  
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created Reviews table');
  } catch (err) {
    error('error creating Reviews table ', err);
  }
};

export const dropReviewsTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS reviews`);
    success('successfully dropped Reviews table');
  } catch (err) {
    error('error dropping Reviews table ', err);
  }
};

// Reviews_Users table - creation and deletion

export const createReviews_UsersTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS reviews_users
      (
        id SERIAL,
        id_users int NOT NULL,
        id_reviews int NOT NULL,
        CONSTRAINT fk_reviews_users_id_users
          FOREIGN KEY(id_users) REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_reviews_users_id_reviews  
          FOREIGN KEY(id_reviews) REFERENCES reviews(id)
          ON DELETE CASCADE,
        CONSTRAINT reviews_users_pk  
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created Reviews_Users table');
  } catch (err) {
    error('error creating Reviews_Users table ', err);
  }
};

export const dropReviews_UsersTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS reviews_users`);
    success('successfully dropped Reviews_Users table');
  } catch (err) {
    error('error dropping Reviews_Users table ', err);
  }
};

// Menus table - creation and deletion

export const createMenusTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS menus
      (
        id SERIAL,
        fooditem varchar (255),
        price int NOT NULL,
        foodtype int NOT NULL,
        id_businesses int NOT NULL,
        CONSTRAINT fk_menus_id_businesses
          FOREIGN KEY(id_businesses) REFERENCES businesses(id)
          ON DELETE CASCADE,
        CONSTRAINT menus_pk  
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created Menus table');
  } catch (err) {
    error('error creating Menus table ', err);
  }
};

export const dropMenusTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS menus`);
    success('successfully dropped Menus table');
  } catch (err) {
    error('error dropping Menus table ', err);
  }
};

// Friends table - creation and deletion

export const createFriendsTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS friends
      (
        id SERIAL,
        id_friendsent int NOT NULL,
        id_friendreceived int NOT NULL,
        CONSTRAINT fk_friends_id_friendsent
          FOREIGN KEY (id_friendsent) REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_friends_id_friendreceived
          FOREIGN KEY (id_friendreceived) REFERENCES users(id)
          ON DELETE CASCADE,
        accepted boolean NOT NULL,
        CONSTRAINT friends_pk
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created friends table');
  } catch (err) {
    error('error creating friends table ', err);
  }
};

export const dropFriendsTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS friends`);
    success('successfully dropped Friends table');
  } catch (err) {
    error('error dropping Friends table');
  }
};

// Orders table - creation and deletion

export const createOrdersTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS orders
      (
        id SERIAL,
        id_users int NOT NULL,
        id_businesses int NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        cart varchar (255),
        total int NOT NULL,
        location int NOT NULL,
        totalusersineachorder int NOT NULL,
        CONSTRAINT fk_orders_id_users
          FOREIGN KEY (id_users) REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_orders_id_businesses
          FOREIGN KEY (id_businesses) REFERENCES businesses (id)
          ON DELETE CASCADE,
        CONSTRAINT orders_pk
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created Orders table');
  } catch (err) {
    error('error creating Orders table ', err);
  }
};

export const dropOrdersTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS orders`);
    success('successfully dropped Orders table');
  } catch (err) {
    error('error dropping Orders table ', err);
  }
};

export const createUsers_OrdersTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS users_orders
      (
        id SERIAL,
        id_users int NOT NULL,
        id_orders int NOT NULL,
        CONSTRAINT fk_users_orders_id_users
          FOREIGN KEY (id_users) REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_users_orders_id_orders
          FOREIGN KEY (id_orders) REFERENCES orders (id)
          ON DELETE CASCADE,
        CONSTRAINT users_orders_pk
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created Users_Orders table');
  } catch (err) {
    error('error creating Users_Orders table ', err);
  }
};

export const dropUsers_OrdersTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS users_orders`);
    success('successfully dropped Users_Orders table');
  } catch (err) {
    error('error dropping Users_Orders table ', err);
  }
};

export const createMessagesTable = async () => {
  try {
    await db.query(
      `
      CREATE TABLE IF NOT EXISTS messages
      (
        id SERIAL,
        id_usersending int NOT NULL,
        id_userreceiving int NOT NULL,
        id_orders int NOT NULL,
        CONSTRAINT fk_messages_id_usersending
          FOREIGN KEY (id_usersending) REFERENCES users(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_messages_id_userreceiving
          FOREIGN KEY (id_userreceiving) REFERENCES users(id)
          ON DELETE CASCADE,
        messagebody varchar (255),
        CONSTRAINT fk_messages_id_orders
          FOREIGN KEY (id_orders) REFERENCES orders(id)
          ON DELETE CASCADE,
        CONSTRAINT messages_pk
          PRIMARY KEY (id)
      )
      `
    );
    success('successfully created Messages table');
  } catch (err) {
    error('error creating Messages table ', err);
  }
};

export const dropMessagesTable = async () => {
  try {
    await db.query(`DROP TABLE IF EXISTS messages`);
    success('successfully dropped Messages table');
  } catch (err) {
    error('error dropping Messages table ', err);
  }
};

export const dummyData = async () => {
  try {
    await db.query(
      `INSERT INTO businesses (businessname, email, password, businesspicture, coverpicture, contactname, address, latitude, longitude, foodcategory, phone, rating, price, totalorder, dailyorders, gross, type)
      VALUES ('Michaels Cheese', 'michael@gmail.com', '$2b$10$3niVF5WXrwckMA6RpmhkSO9VK5HPfZFfaEanTrSd2XoelZlek/6hm', 'https://source.unsplash.com/225x225/?cheese', 'https://source.unsplash.com/900x200/?cheese', 'Michael Pourshalimi', '6060 Center Dr Culver City CA', 33.9759755, -118.3908877, 'american', '3108008735', 5, 1, 4000, 10, 40000, '1');
      INSERT INTO businesses (businessname, email, password, businesspicture, coverpicture, contactname, address, latitude, longitude, foodcategory, phone, rating, price, totalorder, dailyorders, gross, type)
      VALUES ('Wine Cheese Bakery', 'daniel1@gmail.com', '$2b$10$3niVF5WXrwckMA6RpmhkSO9VK5HPfZFfaEanTrSd2XoelZlek/6hm', 'https://source.unsplash.com/225x225/?cheese', 'https://source.unsplash.com/900x200/?cheese', 'Mike P', '327 S Western Los Angeles CA', 34.068154, -118.309459, 'American', '2139485924', 4, 2, 2500, 5, 20000, '1');
      INSERT INTO businesses (businessname, email, password, businesspicture, coverpicture, contactname, address, latitude, longitude, foodcategory, phone, rating, price, totalorder, dailyorders, gross, type)
      VALUES ('Daniels Korean BBQ', 'daniel@gmail.com', '$2b$10$3niVF5WXrwckMA6RpmhkSO9VK5HPfZFfaEanTrSd2XoelZlek/6hm', 'https://source.unsplash.com/225x225/?korean', 'https://source.unsplash.com/900x200/?korean', 'Daniel Kim', '327 S Western Los Angeles CA', 34.068154, -118.309459, 'Korean', '3108789000', 4.1, 2, 3000, 20, 30000, '1');
      INSERT INTO businesses (businessname, email, password, businesspicture, coverpicture, contactname, address, latitude, longitude, foodcategory, phone, rating, price, totalorder, dailyorders, gross, type)
      VALUES ('Hunters', 'hunter@gmail.com', '$2b$10$3niVF5WXrwckMA6RpmhkSO9VK5HPfZFfaEanTrSd2XoelZlek/6hm', 'https://source.unsplash.com/225x225/?boat', 'https://source.unsplash.com/900x200/?mountain', 'Hunter Morgenstern', '8600 Melrose Los Angeles CA', 34.052235, -118.243683, 'english', '8189008765', 3.5, 3, 2000, 30, 20000, '1');
      INSERT INTO businesses (businessname, email, password, businesspicture, coverpicture, contactname, address, latitude, longitude, foodcategory, phone, rating, price, totalorder, dailyorders, gross, type)
      VALUES ('Isabellas Guatemalan Bazaar', 'isa@gmail.com', '$2b$10$3niVF5WXrwckMA6RpmhkSO9VK5HPfZFfaEanTrSd2XoelZlek/6hm', 'https://source.unsplash.com/225x225/?guatemala', 'https://source.unsplash.com/900x200/?guatemala', 'Isabella Beltran', '13463 Washington Blvd Culver City CA', 33.993043, -118.447266, 'hispanic', '2139894852', 4.7, 4, 1000, 40, 10000, '1');
      INSERT INTO businesses (businessname, email, password, businesspicture, coverpicture, contactname, address, latitude, longitude, foodcategory, phone, rating, price, totalorder, dailyorders, gross, type)
      VALUES ('Test', 'test@gmail.com', '$2b$10$KTJwIL0UKf.3SGMxY4fiLe5NLARfRfiqQX0aLyOllKV4U5P6rYsJ6', 'https://source.unsplash.com/225x225/?guatemala', 'https://source.unsplash.com/900x200/?guatemala', 'Isabella Beltran', '327 S Western Los Angeles CA', 34.068154, -118.309459, 'hispanic', '2139894852', 4.7, 4, 1000, 40, 10000, '1');
      
      INSERT INTO users (name, profilepicture, email, password, type, phone)
      VALUES ('tilly duck', 'https://source.unsplash.com/225x225/?duck', 'tilly@duck.com', '$2b$10$3niVF5WXrwckMA6RpmhkSO9VK5HPfZFfaEanTrSd2XoelZlek/6hm', '0', '3103103103');
      INSERT INTO users (name, profilepicture, email, password, type, phone)
      VALUES ('test user', 'https://source.unsplash.com/225x225/?test', 'test@test.com', '$2b$10$3niVF5WXrwckMA6RpmhkSO9VK5HPfZFfaEanTrSd2XoelZlek/6hm', '0', '2102102102');
      VALUES ('Michael', '', 'michael@gmail.com', '$2b$10$KTJwIL0UKf.3SGMxY4fiLe5NLARfRfiqQX0aLyOllKV4U5P6rYsJ6', '0', '3157599526', 'cus_4x9tlO3czkPwWt');
      INSERT INTO users (name, profilePicture, email, password, type, phone, stripeaccount)
      VALUES ('Patrick', '', 'patrick@gmail.com', '$2b$10$3niVF5WXrwckMA6RpmhkSO9VK5HPfZFfaEanTrSd2XoelZlek/6hm', '0', '3157599526', '');
      INSERT INTO users (name, profilePicture, email, password, type, phone, stripeaccount)
      VALUES ('Isabella', '', 'isa@gmail.com', '$2b$10$KTJwIL0UKf.3SGMxY4fiLe5NLARfRfiqQX0aLyOllKV4U5P6rYsJ6', '0', '3157599526', '');

      INSERT INTO reviews (rating, comment, createdAt, id_businesses)
      VALUES (5, 'I love this place', 1526678767742, 1);
      INSERT INTO reviews (rating, comment, createdAt, id_businesses)
      VALUES (4, 'I love this place less than the last guy', 1526678767742, 1);
      
      INSERT INTO reviews_users (id_users, id_reviews)
      VALUES (2, 1);
      INSERT INTO reviews_users (id_users, id_reviews)
      VALUES (2, 2);
      `
    );
    success('successfully created dummyData');
  } catch (err) {
    error('error creating DummyData table ', err);
  }
};
