DROP DATABASE IF EXISTS nail_db_2;
CREATE DATABASE nail_db_2;
USE nail_db_2;

CREATE TABLE  employee 
(
	id INTEGER(3) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    emp_name VARCHAR(100) NOT NULL,
    busy INTEGER(2) DEFAULT 0,
    last_activities TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo VARCHAR(500) DEFAULT "http://54.163.73.103/configfiles/No_Image.png",
    turn DECIMAL(2,1) DEFAULT 1,
    enabled BOOLEAN DEFAULT TRUE,
    emp_deleted BOOLEAN DEFAULT FALSE
);
CREATE TABLE  services
(
	id INTEGER(3) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL
);

INSERT INTO services (service_name) VALUES ("Manicure"),("Full Set"), ("Gel/Refill"), ("Repair"), ("Fiberglass/Fill"), ("Wraps/Silk"), ("Cut Down"), ("Franch Manicure"), ("Polish Change"), ("Hot Oil"), ("Nail Art"), ("Pedicure"), ("Pink/White");

CREATE TABLE waitlist (
	id INTEGER(3) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    cust_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(100),
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    service_1 INTEGER(3),
    service_2 INTEGER(3),
    service_3 INTEGER(3),
    service_4 INTEGER(3),
    service_5 INTEGER(3),
    FOREIGN KEY (service_1) REFERENCES services(id),
    FOREIGN KEY (service_2) REFERENCES services(id),
    FOREIGN KEY (service_3) REFERENCES services(id),
    FOREIGN KEY (service_4) REFERENCES services(id),
    FOREIGN KEY (service_5) REFERENCES services(id)
);

CREATE TABLE in_service 
(
	id INTEGER(3) AUTO_INCREMENT NOT NULL PRIMARY KEY,
    customer VARCHAR(100) NOT NULL,
    phone_number VARCHAR(11) DEFAULT "0000000000",
    start_time TIMESTAMP,
    employee_id INTEGER(3),
    being_served BOOLEAN DEFAULT TRUE,
    deleted BOOLEAN DEFAULT FALSE,
    services VARCHAR(200),
    end_time TIMESTAMP,
    bill DECIMAL(8,2) DEFAULT 0,
    owner_discount DECIMAL(8,2) DEFAULT 0,
    bill_after_discount DECIMAL(8,2) DEFAULT 0,
    tip_card DECIMAL(8,2) DEFAULT 0,
    tip_cash DECIMAL(8,2) DEFAULT 0,
    turn_count Decimal(2,1) DEFAULT 1,
    del_reason VARCHAR(500) DEFAULT null, 
    FOREIGN KEY (employee_id) REFERENCES employee(id)
);
INSERT INTO employee (emp_name, photo, turn) VALUES ("Vu Duong", "https://orig00.deviantart.net/5e94/f/2016/021/9/9/profile_picture_by_knkl-d9otd61.jpg",1);
INSERT INTO employee (emp_name, photo, turn) VALUES ("Anna Tran", "https://pbs.twimg.com/profile_images/448058009282170880/eD3cmUp5.jpeg",12);
INSERT INTO employee (emp_name, photo, turn) VALUES ("Robert Miller", "https://s3-media2.fl.yelpcdn.com/bphoto/B2ujcI4TEk0inm5Bwm7XJw/o.jpg",5);
INSERT INTO employee (emp_name, photo, turn) VALUES ("Steve Lee", "http://img0.ndsstatic.com/article/620/culture/clark-kent-de-smallville_2a75fa31e0a70a61f9eff88ec510be78c95f6e9d.jpg",1);
INSERT INTO employee (emp_name, photo, turn, enabled) VALUES ("Quin Young", "http://4.bp.blogspot.com/-k8BVtx53Ixc/T15wXEr6__I/AAAAAAAAAd8/fBGVJDzP-Qw/s1600/Cute+Girl-15634.jpg",2,false);
INSERT INTO employee (emp_name, photo,turn, busy) VALUES ("Clara Gwen", "https://pbs.twimg.com/profile_images/759379267230765057/9StO1d_T_400x400.jpg",4, 1);

INSERT INTO in_service (customer, being_served, employee_id, services, start_time, end_time, bill, tip_card) VALUES ("Rebertas Cavali",false,"1", "Gel, Refill","2018-12-18 13:18:00","2018-12-18 13:58:15","24.25","6.00");
INSERT INTO in_service (deleted,customer, being_served, employee_id, services, start_time, end_time, bill, tip_card, del_reason) VALUES (true,"Mon Lee",false,"1", "Gel","2018-12-18 12:28:00","2018-12-18 14:18:15","14.25","4.32", "Customer did not pay");
INSERT INTO in_service (deleted,customer, being_served, employee_id, services, start_time, end_time, bill, tip_card, del_reason) VALUES (true,"Emily Blinkat",false,"1", "Gel","2018-12-18 08:28:00","2018-12-18 12:18:15","08.25","4.32","Typo");


DROP TABLE in_service;
DROP TABLE employee;
DROP TABLE services;
SELECT * FROM employee;
SELECT * FROM in_service;
SELECT * FROM in_service LEFT JOIN employee ON employee_id = employee.id;