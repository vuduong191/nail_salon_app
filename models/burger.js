var orm = require("../config/orm.js");
var burger = {
    allEmp: function(cb){
        orm.selectAllOrder("employee", "enabled DESC, turn ASC, last_activities ASC", function(res){
            cb(res);
        })
    },
    allCust: function(cb){
        var colname = ["in_service.id AS id","customer","employee_id", "emp_name", "being_served", "services","start_time","end_time","deleted", "bill", "tip_cash", "tip_card","turn_count", "del_reason"]
        orm.selectCustomized(colname,"in_service LEFT JOIN employee ON employee_id = employee.id ORDER BY end_time DESC", function(res){
            cb(res);
        })
    },
    allService: function(cb){
        orm.selectAll("services",function(res){
            cb(res);
        })
    }, 
    allWaitlist: function(cb){
        orm.customerQuery("SELECT waitlist.cust_name AS cust_name, waitlist.phone_number AS phone_number, waitlist.check_in_time AS check_in_time, waitlist.appointment AS appointment, services.service_name AS service FROM waitlist_services LEFT JOIN waitlist ON waitlist_services.customer_id = waitlist.id LEFT JOIN services ON waitlist_services.service=services.id ORDER BY check_in_time ASC",function(res){
            cb(res);
        })
    },   
    insertOneWaitlistCust: function(vals, cb){
        orm.insertOne("waitlist",["cust_name","phone_number","appointment"], vals, function(res){
            cb(res);
        })
    },
    insertOneWaitlistService: function(vals, cb){
        orm.insertOne("waitlist_services",["customer_id","service"], vals, function(res){
            cb(res);
        })
    },    
    maxIDWaitlist: function(cb){
        orm.selectMax("waitlist","id", function(res){
            cb(res);
        })
    },
    insertOneCust: function(vals, cb){
        orm.insertOne("in_service",["customer","employee_id","services","start_time", "phone_number", "turn_count"], vals, function(res){
            cb(res);
        })
    },    
    insertOneEmp: function(vals, cb){
        orm.insertOne("employee",["emp_name","photo"], vals, function(res){
            cb(res);
        })
    },    
    updateOne: function(tableInput,objColVals,condition, cb){
        orm.updateOne(tableInput,objColVals,condition,function(res){
            cb(res)
        })
    },
    updateAll: function(tableInput,objColVals, cb){
        orm.updateAll(tableInput,objColVals,function(res){
            cb(res)
        })
    },    
    deleteCust: function(id, cb){
        orm.deleteOne("in_service", "id="+id, function(res){
            cb(res)
        })
    },
    deleteAll: function(tableInput, cb){
        orm.deleteAll(tableInput, function(res){
            cb(res)
        })
    },
    updateEmpStatus: function(objColVals, valueArray, cb){
        orm.updateFromArray("employee", objColVals, "id", valueArray,function(res){
            cb(res)
        })
    },
    deleteEmp: function(id_array,cb){
        orm.deleteFromArray("employee","id", id_array, function(res){
            cb(res)
        })
    }
}
// Export the database functions for the controller (catsController.js).
module.exports = burger;
