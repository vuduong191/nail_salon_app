// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $(document).on("click", "button.delete", deleteCust);
  $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", "button.recover", recoverCust);
  $("#emp_del_submit").on("click",del_emp);
  $("#reset-time-cmd").on("click",resetTime);
  $("#add_emp_but").on("click", addEmp);
  $("#update-emp-btn").on("click", updateEmp);
  $("#emp_update_select").change(populateCurrentEmpInfo);
  $("#reset-cust-cmd").on("click",resetCust);
  
  function resetCust(){
    event.preventDefault();
    event.stopPropagation();
    $.ajax("/api/resetcust", {
        type: "DELETE",
      }).then(function() {          
    });
    location.reload();     
  }
  

  function updateEmp(){
    event.preventDefault();
    event.stopPropagation();   
    // Constructing new emp info object to hand to the database
    var id=$(this).data("id");
    var empName = $("#modal-employee-name").val().trim();
    var empImage = $("#modal-employee-image").val().trim();
    var lastActTime =  moment().format("YYYY-MM-DD")+" "+$("#modal-last-act-time").val().trim()+":00";
    var enabled = $('#switch-orange').prop('checked')?"true":"false";
    var busy = $('#switch-blue').prop('checked')?"true":"false";
    var data={
      emp_name:empName,
      busy: busy,
      last_activities: lastActTime,
      photo: "'"+empImage+"'",
      enabled: enabled,
    }
    function validateForm() {
      var isValid = true;
      $("#update-emp-modal .form-control").each(function() {
        if ($(this).val() == "") {
          isValid = false;
        }
      });
      return isValid;
    };
    if(validateForm()){
      // Send the POST request.    
      $.ajax("/api/updateemp/"+id, {
        type: "PUT",
        data: data
      }).then(function() {         
      });
      alert("Employee Information Changed.");
      location.reload();        
    } else {
      alert("Please provide all information!")
    };        
  }

  function populateCurrentEmpInfo(){
    var id=$(this).val();
    $("#modal-employee-name").attr("value", $("#emp_col_emp_name_"+id).text());
    $("#modal-employee-image").attr("value", $("#emp_col_img_"+id).attr("src"));
    $("#modal-last-act-time").attr("value", $("#emp_col_time_"+id).text());
    $("#update-emp-btn").data("id",id);
    var busy=false;
    var enable=false;
    var busy= $("#emp_block_status_"+id).data("busy");
    var enable= $("#emp_block_status_"+id).data("enable");
    console.log(busy+" "+enable);
    if(busy){
      console.log("busy");
      $("#switch-blue").prop( "checked", true );
    }else{
      $("#switch-blue").prop( "checked", false );
    };
    if(enable){
      console.log("enable");
      $("#switch-orange").prop( "checked", true );
    } else{
      $("#switch-orange").prop( "checked", false );      
    };
  }

  function addEmp(event){
    event.stopPropagation();
    var empName = $("#new_emp_name").val().trim();
    var empPhoto = $("#new_emp_photo").val().trim();
    var data={newEmp:[empName,empPhoto]}
    console.log(data)
      // Form validation
    function validateForm() {
      var isValid = true;
      $("#add-emp-modal .form-control").each(function() {
        if ($(this).val() == "") {
          isValid = false;
        }
      });
      return isValid;
    };
    if(validateForm()){
      // Send the POST request.    
      $.ajax("/api/newemp", {
        type: "POST",
        data: data
      }).then(function() {         
      });
      alert("New employee added.");         
    } else {
      alert("Please provide all information!")
    }
    $("#add-emp-modal .form-control").each(function() {
      $(this).val("")
    });     
  }

  function resetTime(event){
    event.stopPropagation();
    if (confirm("This action will reset all employee time information to current time. Proceed?")) {
    var newStatus={last_activities: moment().format("YYYY-MM-DD HH:mm:ss")};
    $.ajax("/api/resettime", {
        type: "PUT",
        data: newStatus
      }).then(function() {     
        location.reload()             
      });        
  }}
  

  function del_emp(event){
    if (confirm("This action cannot be undone. Proceed?")) {    
    event.stopPropagation();
    var idArray= [$("#emp_del_select").val()];
    var  newStatus = {emp_deleted:true}    
      // Form validation
    function validateForm() {
      var isValid = true;
      // $(".form-control").each(function() {
      //   if ($(this).val() === "") {
      //     isValid = false;
      //   }
      // });
      // $(".chosen-select").each(function() {
      //   if ($(this).val() === "") {
      //     isValid = false;
      //   }
      // });
      if(idArray[0].length==0) {
        isValid = false;
      }
      return isValid;
    }
    console.log(idArray)
    if (validateForm()) {    
      updateEmpStatus(idArray,newStatus);
      alert("Successfully deleted.")
      for(var j=0; j<idArray[0].length; j++){
      $('#emp_del_select #emp_deleted_'+idArray[0][j]).hide();
      $('#emp_del_select').trigger("chosen:updated");
      }      

    } else {
      alert("Please select at least one employee!")
    };
    $('#emp_del_select')
    .find('option').prop('selected', false)
    .end().trigger('chosen:updated');
 
  }}
  // This function deletes employees from an array of IDs, not used yet
  function del_emp_array(id_array) {
    $.ajax("/api/del_emps", {
      type: "DELETE",
      data: {id_array:id_array}
    }).then(
      function() {
      }
    );
  };
    // This function deletes a customer from Log Book
  function deleteCust(event) {
    event.stopPropagation();
    var cust_id = $(this).data("cust_id");
    var del_reason = "'"+escape(prompt("Reason for entry deletion:", "..."))+"'";
    $.ajax("/api/complete_cust/"+cust_id,{
      type: "PUT",
      data: {deleted:true, del_reason:del_reason}
    }).then(function() {
        console.log("Customer's status changed.");
        location.reload();
    });
  };

   function recoverCust(event) {
    event.stopPropagation();
    var cust_id = $(this).data("cust_id");
    $.ajax("/api/complete_cust/"+cust_id,{
      type: "PUT",
      data: {deleted:false}
    }).then(function() {
        console.log("Customer's status changed.");
        location.reload();
    });
  };

  // This function move a customer from In-service block to Log Book (complete)
  function toggleComplete(event) {
    event.stopPropagation();
    var custID = $(this).data("cust_id");
    var empID= $(this).data("emp_id");
    var actTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var bill = $(this).parent().siblings(".bill").children("input").val().trim()==""?"0":$(this).parent().siblings(".bill").children("input").val().trim();
    var tip = $(this).parent().siblings(".tip").children("input").val().trim()==""?"0":$(this).parent().siblings(".tip").children("input").val().trim();   
    console.log("Cust_id and Emp_id for completion: "+bill+" + "+tip);
    var bill_info = {
      being_served: false,
      bill: bill,
      tip: tip,
      end_time: actTime
    }
    // cannot use .trim() up there.

    $.ajax("/api/complete_cust/"+custID,{
      type: "PUT",
      data: bill_info
    }).then(function() {
    var idArray=[empID];
    var  newStatus = {busy:false}
    updateEmpStatus(idArray,newStatus);
    location.reload();      
    });
  }

  $(".create-form").on("submit", function(event) {
    event.preventDefault();
    var actTime = moment().format("YYYY-MM-DD HH:mm:ss")
    var newCust = {
      start_time: actTime,
      name: $("#cust_name").val().trim(),
      employee_id: $("#emp_select").val().trim(),
      services: $("#services").val().trim()
    };

    console.log(newCust)
    console.log(actTime)
    // Send the POST request.    
    $.ajax("/api/custs", {
      type: "POST",
      data: newCust
    }).then(function() {
    });
    // Change the last_activities and status of employee
    var newStatus = {
      busy: true,
      last_activities: actTime      
    }
    var idArray=[newCust.employee_id];
    updateEmpStatus(idArray,newStatus);
    location.reload();    
  });
  function updateEmpStatus(emp_id_array,newStatus){
    var data={
      emp_id_array: emp_id_array,
      newStatus: newStatus
    }
    $.ajax("/api/emp",{
      type: "PUT",
      data: data
    }).then(function() {
        console.log("Employee status changed.");
    })
  }

// Refresh page when the modal is hidden
$("#del-emp-modal").on('hidden.bs.modal', function(){
  location.reload();
});
$("#add-emp-modal").on('hidden.bs.modal', function(){
  location.reload();
});

  // $(".change-sleep").on("click", function(event) {
  //   var id = $(this).data("id");
  //   var newSleep = $(this).data("newsleep");

  //   var newSleepState = {
  //     sleepy: newSleep
  //   };

  //   // Send the PUT request.
  //   $.ajax("/api/cats/" + id, {
  //     type: "PUT",
  //     data: newSleepState
  //   }).then(
  //     function() {
  //       console.log("changed sleep to", newSleep);
  //       // Reload the page to get the updated list
  //       location.reload();
  //     }
  //   );
  // });


});
