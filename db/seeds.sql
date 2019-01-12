INSERT INTO employee (emp_name, photo) VALUES ("Vu Duong", "https://orig00.deviantart.net/5e94/f/2016/021/9/9/profile_picture_by_knkl-d9otd61.jpg");
INSERT INTO employee (emp_name, photo) VALUES ("Anna Tran", "https://pbs.twimg.com/profile_images/448058009282170880/eD3cmUp5.jpeg");
INSERT INTO employee (emp_name, photo) VALUES ("Robert Miller", "https://s3-media2.fl.yelpcdn.com/bphoto/B2ujcI4TEk0inm5Bwm7XJw/o.jpg");
INSERT INTO employee (emp_name, photo) VALUES ("Steve Lee", "http://img0.ndsstatic.com/article/620/culture/clark-kent-de-smallville_2a75fa31e0a70a61f9eff88ec510be78c95f6e9d.jpg");
INSERT INTO employee (emp_name, photo, busy) VALUES ("Clara Gwen", "https://pbs.twimg.com/profile_images/759379267230765057/9StO1d_T_400x400.jpg", true);

SELECT * FROM employee;
SELECT * FROM in_service;
INSERT INTO in_service (customer, employee_id) VALUES ("Emily Emerson", "5");
INSERT INTO in_service (customer, being_served, employee_id) VALUES ("Rebertas Cavali",false,"1");
