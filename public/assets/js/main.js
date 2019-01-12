// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
  $(document).on("click", "button.paymentCompleteSubmit", submitPayment);
  $(document).on("click", "button.addCustomerBtn", insertCust);  
  $(document).on("click", "button.addService", toggleAddService);
  $(document).on("click", "button.deleteService", toggleDelService);  
  $(document).on("click", "button.completeService", toggleCompleteService);

  function toggleCompleteService(event){
    event.stopPropagation();
    var services="";
    var cust_id = $(this).data("cust_id");
    services = $(this).data("services");
    var emp_id = $(this).data("emp_id");
    $("#paymentModalEmpID").text(emp_id);     
    $("#paymentModelCustID").text(cust_id);
    $("#payment_services").attr("value", services);     
    var custName = $(this).data("cust_name");
    $("#paymentModalCust").text(custName)
  }
  // Force input in payment to be numeric
  $("#payment_bill").blur(function(){
    if(!/^-?\d*[.,]?\d{0,2}$/.test($(this).val().trim())){
      alert("Only input number!");
      $(this).focusin()      
    }
  });
  $("#payment_tip_cash").blur(function(){
    if(!/^-?\d*[.,]?\d{0,2}$/.test($(this).val().trim())){
      alert("Only input number!");
      $(this).focusin()      
    }
  }); 
  $("#payment_tip_card").blur(function(){
    if(!/^-?\d*[.,]?\d{0,2}$/.test($(this).val().trim())){
      alert("Only input number!");
      $(this).focusin()      
    }
  });  
  $("#payment_owner_discount").blur(function(){
    if(!/^-?\d*[.,]?\d{0,2}$/.test($(this).val().trim())){
      alert("Only input number!");
      $(this).focusin()      
    }
  });      

    // This function deletes a line in the service session, reduce busy score 
  function toggleDelService(event) {
    if (confirm("This action cannot be undone. Proceed?")) {
      event.stopPropagation();
      var turn_count=$(this).parent().siblings(".tableTurnCount").text();
      console.log(turn_count)
      var cust_id = $(this).data("cust_id");
      var emp_id = $(this).data("emp_id");
      var del_reason = "'"+escape(prompt("Reason for entry deletion:", "..."))+"'";
      $.ajax("/api/complete_cust/"+cust_id,{
        type: "PUT",
        data: {deleted:true, del_reason:del_reason}
      }).then(function() {
          console.log("Customer's status changed.");
          var currentTurn= parseFloat($("#turn_col_"+emp_id).text());
          var newTurn = currentTurn - parseFloat(turn_count);      
          var currentBusyScore=$("#emp_col_"+emp_id).data("busy");
          var newBusyScore = (parseInt(currentBusyScore)-1)<0?0:(parseInt(currentBusyScore)-1);

          // Change the last_activities and status of employee
          var newStatus = {
            busy: newBusyScore,
            turn: newTurn    
          }
          var idArray=[emp_id];
          updateEmpStatus(idArray,newStatus);
          location.reload();                         
      });
    }
  }

  // This function capture the current customer phone and name to add service
  function toggleAddService(event) {
    event.stopPropagation();
    $("#addCustModal").modal();
    $("#cust_name").attr("value", $(this).data("cust_name")); 
    $("#phone_number_input").attr("value", $(this).data("cust_phone"));    
  }

  // This function move a customer from In-service block to Log Book (complete)
  function submitPayment(event) {
    event.stopPropagation();
    var custID = $("#paymentModelCustID").text();
    var empID= $("#paymentModalEmpID").text();
    var currentBusyScore=$("#emp_col_"+empID).data("busy");
    var newBusyScore = (parseInt(currentBusyScore)-1)<0?0:(parseInt(currentBusyScore)-1);
    var actTime = moment().format("YYYY-MM-DD HH:mm:ss");
    var servicesInput = $("#payment_services").val().trim();
    var bill = $("#payment_bill").val().trim()==""?0:$("#payment_bill").val().trim();
    var tipCard =  $("#payment_tip_card").val().trim()==""?0:$("#payment_tip_card").val().trim();
    var tipCash = $("#payment_tip_cash").val().trim()==""?0:$("#payment_tip_cash").val().trim();
    var discount = $("#payment_owner_discount").val().trim()==""?0:$("#payment_owner_discount").val().trim();
    var billAfterDisc = parseFloat(bill)-parseFloat(discount);
    var noteInput = $("#payment_note").val().trim()==""?"NA ":$("#payment_note").val().trim()+" ";

    var bill_info = {
      services: servicesInput,
      being_served: false,
      bill: bill,
      tip_card: tipCard,
      tip_cash: tipCash,
      end_time: actTime,
      owner_discount: discount,
      bill_after_discount: billAfterDisc,
      note: noteInput
    };
    // cannot use .trim() up there.

    $.ajax("/api/complete_cust/"+custID,{
      type: "PUT",
      data: bill_info
    }).then(function() {});
    // Change the last_activities and status of employee
    var newStatus = {
      busy: newBusyScore    
    }
    var idArray=[empID];
    updateEmpStatus(idArray,newStatus);
    location.reload();
  };

  function insertCust(event) {
    event.preventDefault();
    var actTime = moment().format("YYYY-MM-DD HH:mm:ss")
    var newCust = {
      start_time: actTime,
      name: $("#cust_name").val().trim(),
      employee_id: $("#emp_select").val().trim(),
      services: $("#service_select option:selected").text().trim()+"| |"+ $("#note").val().trim(),
      turn_count: $("#turn_input").val().trim(),
      phone_number: $("#phone_number_input").val().trim()
    };
    console.log($("#turn_input").val().trim())
    var currentTurn= parseFloat($("#turn_col_"+newCust.employee_id).text());
    var newTurn = currentTurn + parseFloat(newCust.turn_count)
    var currentBusyScore=$("#emp_col_"+newCust.employee_id).data("busy");
    var newBusyScore = parseInt(currentBusyScore)+1
    // Send the POST request.    
    $.ajax("/api/custs", {
      type: "POST",
      data: newCust
    }).then(function() {
    });
    // Change the last_activities and status of employee
    var newStatus = {
      busy: newBusyScore,
      last_activities: actTime,
      turn: newTurn
    }
    console.log(newStatus)
    var idArray=[newCust.employee_id];
    updateEmpStatus(idArray,newStatus);
    location.reload();    
  };
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
});
