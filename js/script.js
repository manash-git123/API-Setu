notification_as_state = true;

function districtButton(){
    document.getElementById("pincodeButton").style.display = "block";
    document.getElementById("districtButton").style.display = "none";
    document.getElementById("searchByDistrict").style.display = "block";
    document.getElementById("searchByPIN").style.display = "none";
    notification_as_state = true;
}
function pincodeButton(){
    document.getElementById("pincodeButton").style.display = "none";
    document.getElementById("districtButton").style.display = "block";
    document.getElementById("searchByDistrict").style.display = "none";
    document.getElementById("searchByPIN").style.display = "block";
    notification_as_state = false;
}

function main(){
    var output = "<option value='0'>Select State</option>"; 
    $.ajax({
        url: "https://cdn-api.co-vin.in/api/v2/admin/location/states",
        success: function (response){
            response.states.forEach(state => {
                output += "<option value='"+state.state_id+"'>"+state.state_name+"</option>"
            });
        },
        async: false
    });
    document.getElementById("state").innerHTML = output;
    document.getElementById("user_state").innerHTML = output;
}

function setDistrictList(){
    var output = "<option value='0'>Select District</option>"; 
    var state_id = document.getElementById("state").value;
    url_api = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+state_id; 
    $.ajax({
        url: url_api,
        success: function (response){
            response.districts.forEach(district => {
                output += "<option value='"+district.district_id+"'>"+district.district_name+"</option>"
            });
        },
        async: false
    });
    document.getElementById("district").innerHTML = output;
}

function setUserDistrictList(){
    var output = "<option value='0'>Select District</option>"; 
    var state_id = document.getElementById("user_state").value;
    url_api = "https://cdn-api.co-vin.in/api/v2/admin/location/districts/"+state_id; 
    $.ajax({
        url: url_api,
        success: function (response){
            response.districts.forEach(district => {
                output += "<option value='"+district.district_id+"'>"+district.district_name+"</option>"
            });
        },
        async: false
    });
    document.getElementById("user_district").innerHTML = output;
}


function vaccinationPincode(){
    var pin = document.getElementById("pincode").value;
    var age = document.getElementById("agePIN").value;
    var vaccineType = document.getElementById("vaccineTypePIN").value;
    if(pin >= 100000){
        document.getElementById("pinError").style.display = "none";
        var d = new Date();
        var date = d.getDate()+'-' + d.getMonth()+'-' + d.getFullYear(); 
        var api_url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode="+pin+"&date="+date;
        // window.open(api_url, '_blank');
        $.ajax({
            url: api_url,
            success: function (response){
                getSlots(age, vaccineType, response);
            },
            async: false
        });
    }else{
        document.getElementById("pinError").style.display = "block";
    }
}

function vaccinationDistrict(){
    var district_id = document.getElementById("district").value;
    var age = document.getElementById("ageDistrict").value;
    var vaccineType = document.getElementById("vaccineTypeDistrict").value;
    if(district_id > 0){
        document.getElementById("districtError").style.display = "none";
        var d = new Date();
        var date = d.getDate()+'-' + d.getMonth()+'-' + d.getFullYear(); 
        var api_url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id="+district_id+"&date="+date;
        $.ajax({
            url: api_url,
            success: function (response){
                getSlots(age, vaccineType, response);
            },
            async: false
        });

    }else{
        document.getElementById("districtError").style.display = "block";
    }
}


function getSlots(age, vaccineType, response){
    var output = new Array();
    if(vaccineType === "ANY"){
        response.centers.forEach(center => {
            center.sessions.forEach(session => {
                if(session.available_capacity > 0){
                    if(session.min_age_limit == age){
                        output.push({
                            name: center.name,
                            address: center.address,
                            block_name: center.block_name,
                            pincode: center.pincode,
                            available_capacity: session.available_capacity,
                            vaccine: session.vaccine,
                            date: session.date
                        });
                    }
                }
            });
        });
    }else{
        response.centers.forEach(center => {
            center.sessions.forEach(session => {
                if(session.available_capacity > 0){
                    if(session.min_age_limit == age && vaccineType == session.vaccine){
                        output.push({
                            name: center.name,
                            address: center.address,
                            block_name: center.block_name,
                            pincode: center.pincode,
                            available_capacity: session.available_capacity,
                            vaccine: session.vaccine,
                            date: session.date
                        });
                    }
                }
            });
        });
    }

    displayOutput(output);
}

function displayOutput(outputs){
    // console.log(outputs);
    var formattedOutput = '';
    outputs.forEach(output => {
        formattedOutput += '<div class="col-md-4 col-lg-2 card mx-2 my-2 shadow-sm p-3 mb-5 bg-white rounded">';
        formattedOutput += '<div class="card-body">';
        formattedOutput += '<h5 class="card-title">'+output.name+'</h5>';
        formattedOutput += '<h6 class="card-subtitle mb-2 text-muted">'+output.address+'('+output.pincode+')</h6>';
        formattedOutput += '<p>Block :'+output.block_name+'</p>';
        formattedOutput += '<p>Vaccine :'+output.vaccine+'</p>';
        formattedOutput += '<p>Date :'+output.date+'</p>';
        formattedOutput += '<p>Slots :'+output.available_capacity+'</p>';
        formattedOutput += '</div>';
        formattedOutput += '</div>';
    });
    // console.log(formattedOutput);
    if(formattedOutput == ''){
        formattedOutput = '<b style="color:red;">No slots Available</b>';
        formattedOutput += '<h4><button type="button" onclick="setUserDetails()" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#user_details">Get Notified</button></h4>'; 
    }
    document.getElementById("displaySection").style.display = 'block';
    document.getElementById("resultOutput").innerHTML = formattedOutput;

}


function setUserDetails(){
    if(notification_as_state){
        document.getElementById("PINOnly").style.display = "none";
        document.getElementById("districtOnly").style.display = "block";
        document.getElementById("user_state").value = document.getElementById("state").value;
        document.getElementById("user_age").value = document.getElementById("ageDistrict").value;
        document.getElementById("user_vaccineType").value = document.getElementById("vaccineTypeDistrict").value;
        setUserDistrictList();
        document.getElementById("user_district").value = document.getElementById("district").value;
    }else{
        document.getElementById("PINOnly").style.display = "block";
        document.getElementById("districtOnly").style.display = "none";
        document.getElementById("user_pin").value = document.getElementById("pincode").value;
        document.getElementById("user_age").value = document.getElementById("agePIN").value;
        document.getElementById("user_vaccineType").value = document.getElementById("vaccineTypePIN").value;
    }
    
}

function submitUserDetails(){
    var _name = document.getElementById("user_name").value;
    var _email = document.getElementById("user_email").value;
    if(!_name || !_email){
       document.getElementById("name_email_error").style.display = "block"; 
    }else{
        document.getElementById("name_email_error").style.display = "none";
        var _age = document.getElementById("user_age").value;
        var _vaccineType = document.getElementById("user_vaccineType").value;
        var _state
        var _district
        var _pincode
        var _method
        var post
        if(notification_as_state){

            _method = "District"
            _state = document.getElementById("user_state").value;
            _district = document.getElementById("user_district").value;
                
            post = {
                "name": _name,
                "email": _email,
                "age": _age,
                "vaccineType": _vaccineType,
                "method": _method,
                "state": _state,
                "district": _district
            }
        }else{
        
            _method = "Pincode"
            _pincode = document.getElementById("user_pin").value;
                
            post = {
                "name": _name,
                "email": _email,
                "age": _age,
                "vaccineType": _vaccineType,
                "method": _method,
                "pincode": _pincode
            }
        }

        console.log(post);
        $.ajax({
            url: ' http://747a23ff9934.ngrok.io/set_user', //the server keeps changing
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(post),
            success: function (response){
                document.getElementById("registered_success").classList.add("show");
                document.getElementById("register_details").innerHTML = "Dear "+response.name+", you successfully registered into the vaccine notification system. <br>Email Id: <strong>"+response.email+"</strong>. We value your privacy our email Id will only be used for notification purpose."
            },
            error: function( jqXhr, textStatus, errorThrown ){
                document.getElementById("registered_failed").classList.add("show");
                console.log( errorThrown );
            }
        });
        document.getElementById("user_modal_close").click();
    }
}
