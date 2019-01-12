# Node Express Handlebars

### Nail Service Tracking App

#### Overview

This is week 14 assignment, in which we were to create a burger logger with MySQL, Node, Express, Handlebars and a homemade ORM (yum!). This is also the first time we follow the MVC design pattern; using Node and MySQL to query and route data in the app, and Handlebars to generate HTML.

The original requirement is a very simple app [Demo](https://youtu.be/msvdn95x9OM). However, I consider this app ridiculously useless, probably the most useless app among all the homework I did so far. Therefore, I decided to create another app called Service Tracking app, which maybe useful in nail salons or barbershops. To serve the purpose of understanding and practicing what we learned during the week, this alternative app works just as well because it uses very similar concepts.

#### Features

##### Employee List
![Employee List](/public/assets/images/emp_list.PNG)

This block features information of employees. The information includes ID, name, time when he/she starts serving the most recent customers, and status whether he/she is serving customers or is idle. The order of employee in the list reflects the start serving time of the most recent customers. 

##### New Customer Block
![New Customer](/public/assets/images/new_cust.PNG)

This block allows recording the serving time of customers and the serving employee. The drop-down list only contains available (idle) employees, also in the same order as the employee list block. The default value for employee selection is who has waited the longest. 

When a customer is logged into the system. The status of the employee who serves that customer will be updated to busy (is serving customers), and the last-activity time is also updated, ensuing the change in employee list order.

##### Customer Log
![Customer Log](/public/assets/images/cust_block.PNG)

When the complete button is clicked (the service is finished), the customer name is moved to the Customer Log Book section, the employee's status is updated to idle. 

When the delte button is clicked, the customer information is removed from the database.

##### Demo

![Demo](/public/assets/images/demo.gif)