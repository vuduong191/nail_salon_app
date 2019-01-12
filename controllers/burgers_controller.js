var express = require("express");
var router = express.Router();

// Import the model (cat.js) to use its database functions.
var burger= require("../models/burger.js");
router.get("/", function(req, res) {
  burger.allEmp(function(data) {
    var hbsObject = {
      employees: data
    };
    burger.allCust(function(data1){
        hbsObject.custs = data1;      
        burger.allService(function(data2){
          hbsObject.services=data2;
          res.render("index", hbsObject);
        })
    })
  });
});
router.get("/manager", function(req, res) {
  burger.allEmp(function(data) {
    var hbsObject = {
      employees: data
    };
    burger.allCust(function(data1){
        hbsObject.custs = data1;
        console.log(hbsObject.custs);        
        res.render("manager", hbsObject);
    })
  });
});

router.post("/api/custs", function(req, res) {
  var newCust=req.body;
  burger.insertOneCust([newCust.name, newCust.employee_id, newCust.services, newCust.start_time, newCust.phone_number, newCust.turn_count], function(result) {});
});
router.post("/api/newemp", function(req, res) {
  var newEmp=req.body.newEmp;
  console.log(newEmp)
  burger.insertOneEmp(newEmp, function(result) {});
});
router.delete("/api/del_emps", function(req,res){
  var id_array=req.body.id_array;
  burger.deleteEmp(id_array, function(result){})
})
router.put("/api/emp", function(req, res) {
  var id_array = req.body.emp_id_array;
  var newStatus = req.body.newStatus;
  burger.updateEmpStatus(newStatus, id_array, function(result) {
    if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end()
  })
});
router.put("/api/resettime", function(req, res) {
  var newStatus = req.body;
  burger.updateAll("employee", newStatus, function(result) {
    if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end()
  })
});
router.put("/api/updateemp/:id", function(req, res) {
  var objColVals = req.body;
  var id = req.params.id;
  burger.updateOne("employee", objColVals, "id="+id, function(result) {
    if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end()
  })
});
router.put("/api/complete_cust/:id", function(req, res) {
  var condition = "id="+ req.params.id;
  var bill_info = req.body;
  console.log(condition)
  burger.updateOne("in_service",bill_info,condition, function(result) {
    if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end()
  })
});

router.delete("/api/delete/:id", function(req, res) {
  var id = req.params.id;
  burger.deleteCust(id, function(result) {
    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});
router.delete("/api/resetcust", function(req, res) {
  burger.deleteAll("in_service", function(result) {
    if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  });
});
// Export routes for server.js to use.
module.exports = router;