// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(function() {
    var service_count=1;    
    $("#waitlistModalAddService").on("click",addServiceModal);  
    $("#CustSignInBtn").on("click",addWaitlistCust);      
    function addServiceModal(event){
        event.stopPropagation();
        event.preventDefault();        
        if(service_count==5){
            alert("Sorry. The maximum number of services reached.")
        } else {
        service_count=service_count+1;
        $("#waitlist_service_select_"+service_count).show();
        }
    };
    function addWaitlistCust(){
        event.preventDefault();
        var newWaitlistCust = {
            cust_name: $("#waitlist_cust_name").val().trim(),
            phone_number: $("#waitlist_phone_number_input").val().trim()==""?"NA":$("#waitlist_phone_number_input").val().trim(),
            appointment: $("#waitlist_appointment_input").val()=="true"?1:0
        };
        // Send the POST request.    
        $.ajax("/api/newWaitlistCust", {
            type: "POST",
            data: newWaitlistCust
        }).then(function() {
            console.log("Done posting")
            // get the ID of the most recent customer
            $.ajax("/api/maxIDWaitlistCust", {
                type: "GET"
            }).then(function(res){
                var maxId=res[0].max_id;
                // Make sure "Others" service has an ID of 14 in the waitlist_service table
                var serviceInput1=$("#waitlist_service_select_1").children("select").val()==""?14:$("#waitlist_service_select_1").children("select").val();
                // Add the first service
                addWaitlistService(maxId,serviceInput1)
                for (let i=2;i<6;i++){
                    if($("#waitlist_service_select_"+i).css("display")!="none"){
                        var serviceInput = $("#waitlist_service_select_"+i).children("select").val()==""?14:$("#waitlist_service_select_"+i).children("select").val();
                        addWaitlistService(maxId,serviceInput)
                    }
                }
            });
        location.reload();              
        });      
    };
    function addWaitlistService(custId, service){
        var newService ={
            customer_id: custId,
            service: service
        }
       $.ajax("/api/newWaitlistService/", {
            type: "POST",
            data: newService
        }).then(function() {});
    }

});
