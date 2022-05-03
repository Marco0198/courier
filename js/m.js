(()=>
{
    "use strict";
    const { log } = console;
   // const credentials = JSON.stringify({ "email":"demo@collivery.co.za", "password":"demo" });
    const header ={ "Content-Type": "application/json","Accept": "application/json","X-App-Name": "SandBox App","X-App-Version": "1.0.0.0","X-App-Host": "ReactJS","X-App-Lang": "Javascript","X-App-Url": "https://oroafrica.com" }; 
    const server = (val)=> "https://api.collivery.co.za/v3/".concat(val);
    const deliveryTypes = (type)=>{ let t = {"1":"Same Day","2":"Next Day","3":"Light Cargo Freight","5":"Heavy Cargo Freight"}; return t[type]; };
    const parcelSizes = (type)=>{return {
                envelope:{"length": 40,"width": 30,"height": 1,"weight": 1,"quantity": 1}
                ,box:{"length": 60,"width": 60,"height": 60,"weight": 6,"quantity": 1}
                ,crate:{"length": 90,"width": 90,"height": 90,"weight": 6,"quantity": 1}
                }[type]; };
    const parametrize =(url, params={})=> {params.api_token = $("meta[name='token']").attr("content"); return Object.keys(params).forEach(key=> url.searchParams.append(key,params[key]));};

    //sample data
    let contact_id= "3909956";
    let address_id= "3722446";
     const _contact = { "address_id": 952,"email": "tyron@hotmail.com","full_name": "Tyron Blakes","cellphone": "0831234569","work_phone": "021 4242000" }; 
     const _address = {    "town_id": 147,
                        "town_name": "Johannesburg",
                        "province": "Gauteng",
                        "suburb_id": 1936,
                        "suburb_name": "Selby",
                        "company_name": "Billing House",
                        "building": "My Building",
                        "street_number": "700",
                        "street": "Webber Street",
                        "location_type": 1,
                        "location_type_name": "Business Premises",
                        "contact": 
                        {
                            "id": 2519728
                            ,"full_name": "Jane Wick Jones"
                            ,"cellphone": "0723456700"
                            ,"email_address": "demo@collivery.co.za"
                            ,"work_phone": "0723456000"
                        } };
    const _quote =
                    {
                        "services": [2],
                        "parcels": [{"length": 21.5,"width": 10,"height": 5.5,"weight": 5.2,"quantity": 2}],
                        "collection_town": 147,
                        "delivery_town": 200,
                        "collection_location_type": 1,
                        "delivery_location_type": 5,
                        "collection_time": "2025-01-24T12:00",
                        "delivery_time": "2025-01-25T16:00:00" 
                    };
     
    const apiCall=
    {
        login: async (creds=credentials)=>
        {
           let url = new URL(server("login"));
           return await fetch(url,{ method:"POST",headers:header,body:creds });
        }
        ,addressIndex: async (search="mds", customId="")=>
        {
           let url = new URL(server("address"));
           parametrize(url,{"search":search,custom_id:customId,"include":"contacts" }); //search|custom_id 
           return await fetch(url,{ method:"GET",headers:header });
        }
        ,addressId: async (addressId="0")=>
        {
           let url = new URL(server(`address/${addressId}`));
           parametrize(url,{"include":"contacts" });
           return await fetch(url,{ method:"GET",headers:header });
        }
        ,addressSave:async (body={})=>
        {
            let url = new URL(server("address"));
            parametrize(url);
            return await fetch(url,{ method:"POST",headers:header,body:JSON.stringify(body) });
        }
        ,addressUpdate:async (body={},addressId="")=>
        {
            let url = new URL(server(`address/${addressId}`));
            parametrize(url); 
           return await fetch(url,{ method:"PUT",headers:header,body:JSON.stringify(body) });
        }
        ,addressDelete:async (addressId="0")=>
        {
            let url = new URL(server(`address/${addressId}`));
            parametrize(url); 
            return await fetch(url,{ method:"DELETE",headers:header });
        }
        ,addressDefault:async ()=>
        {
            let url = new URL(server("default_address"));
            parametrize(url); 
           return await fetch(url,{ method:"GET",headers:header });
        }
        ,contactIndex:async (search="mds",addressId="")=>
        {
            let url = new URL(server("contacts"));
            parametrize(url,{ "search":search,address_id:addressId});  //address_id | search
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,contactSave:async (body={})=>
        {
            let url = new URL(server("contacts"));
            parametrize(url); 
           return await fetch(url,{ method:"POST",headers:header,body:JSON.stringify(body) });
        }
        ,contactShow:async (contactId="")=>
        {
            let url = new URL(server(`contacts/${contactId}`));
            parametrize(url); 
           return await fetch(url,{ method:"GET",headers:header });
        }
        ,contactUpdate:async (contactId="")=>
        {
            let url = new URL(server(`contacts/${contactId}`));
            parametrize(url); 
            let body = 
            {
                "address_id": "3722446",
                "email": "world@example.com",
                "full_name": "Sandra banks",
                "cellphone": "0721234567"
                ,"work_phone": "0214242000"
            };
            
           return await fetch(url,{ method:"PUT",headers:header,body:JSON.stringify(body) });
        }
        ,contactDelete:async (contactId="0")=>
        {
            let url = new URL(server(`contacts/${contactId}`));
            parametrize(url); 
           return await fetch(url,{ method:"DELETE",headers:header });
        }
        ,addressTown:async (town="")=>
        {
            let url = new URL(server("towns"));
            parametrize(url,{ "search": town }); 
           return await fetch(url,{ method:"GET",headers:header });
        }
        ,addressSuburbs:async (suburb="",postalCode="",country="ZAF")=>
        {
            let url = new URL(server("suburbs"));
            parametrize(url,{ "search": suburb,postal_code:postalCode, country:country});
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,addressSuburbsId:async (id="",country="ZAF")=>
        {
            let url = new URL(server(`suburbs/${id}`));
            parametrize(url,{ country:country }); 
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,addressTownSuburbs:async (search="cape town")=>
        {
            let url = new URL(server(`town_suburb_search`));
            parametrize(url,{ search_text:search }); 
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,serviceTypes:async ()=>
        {
            let url = new URL(server(`service_types`));
            parametrize(url); 
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,serviceTypes:async ()=>
        {
            let url = new URL(server(`service_types`));
            parametrize(url); 
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,serviceTypesId:async (serviceId)=>
        {
            let url = new URL(server(`service_type/${serviceId}`));
            parametrize(url); 
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,location_types:async (search="")=>
        {
            let url = new URL(server(`location_types`));
            parametrize(url,{search:search}); 
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,statuses:async ()=>
        {
            let url = new URL(server(`statuses`));
            parametrize(url); 
            return await fetch(url,{ method:"GET",headers:header });
        }
        ,requestQuote:async (body={})=>
        {
            let url = new URL(server("quote"));
            parametrize(url); 
           return await fetch(url,{ method:"POST",headers:header,body:JSON.stringify(body) });
        }
        ,requestQuoteFastway:async (body={})=>
        {
            let url = `https://sa.api.fastway.org/v3/psc/lookup?api_key=91d98ef3e489ee54f28ebfef8e6c6862`;
            
           return await fetch(url,{ method:"POST",headers:{
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },body:JSON.stringify(body) });
        }
    };


    const actions =
    {
        login:()=>
        {
            $(document).on("click","input:button",(ev)=>
            {
                let _fail = ()=>{ alert("Login Failed");};
                let _success = (d)=>{$("meta[name='token']").attr("content",d.data.api_token); $(".onAuth").removeClass("d-none");};
                if (ev.target.value === "login" ) 
                {
                    if(!$("meta[name='token']").attr("content"))
                    {
                        apiCall.login(JSON.stringify({ "email":$("#_email").val(), "password":$("#_password").val() }))
                        .then(resp=> (resp.ok) ? resp.json() : "error")
                        .then(d=> (d === "error") ? _fail() : _success(d));                       
                    }
                    else if($("meta[name='token']").attr("content"))
                    {
                        $(".onAuth").removeClass("d-none");
                    }
                };
            });
        }
        ,collectionPoint:()=>
        {
            $(document).on("keyup","#_collectionTownInput",(ev)=>
            {
                apiCall.addressTownSuburbs($("#_collectionTownInput").val())
                    .then(resp=> resp.json())
                    .then(d=> 
                    {
                       if (!d.data | $("#_collectionTownInput").val() < 4) return;
                        $("#_collectionTown").html("");
                       
                        d.data.slice(0,20).map(k=>
                        {
                            $("#_collectionTown").append(`<option id="onme" >`.concat(k.formatted_result).concat("</option>"));
                        });
                    });
            });
        }
        ,deliveryPoint:()=>
        {
            $(document).on("keyup","#_deliveryTownInput",(ev)=>
            {
                apiCall.addressTownSuburbs($("#_deliveryTownInput").val())
                    .then(resp=> resp.json())
                    .then(d=> 
                    {
                        if (!d.data | $("#_deliveryTownInput").val() < 4) return;
                        $("#_deliveryTown").html("");
                       
                        d.data.slice(0,20).map(k=>
                        {
                            $("#_deliveryTown").append(`<option id="onme" >`.concat(k.formatted_result).concat("</option>"));
                        });
                    });
            });
        }
        ,resetQuote:()=>
        {
            $(document).on("click","input:button",(ev)=>
            {
                if (ev.target.value === "reset" ) 
                {
                    $("#_collectionTownInput").val("");
                    $("#_deliveryTownInput").val("");
                    $("#deliveryType").prop("selectedIndex",0);
                    $(".qbox").html("");
                }
            });    
        }
        ,packageSize:()=>
        {

        }
        ,getQuote:()=>
        {
            $(document).on("click","input:button",(ev)=>
            {
                if (ev.target.value === "quotes" ) 
                {
                    //get collection town id
                    const _collectAddress = apiCall.addressTownSuburbs($("#_collectionTownInput").val().split(",")[0])
                                .then(resp=> resp.json())
                                .then(d=> 
                                {
                                    log("COLLECTION: ",d.data[0].suburb.name + " - " + d.data[0].suburb.town.name);
                                    return { suburbId:d.data[0].suburb.id, townId:d.data[0].suburb.town.id};
                                });
                    //get delivery town id
                    const _deliverAddress = apiCall.addressTownSuburbs($("#_deliveryTownInput").val().split(",")[0])
                                .then(resp=> resp.json())
                                .then(d=> 
                                {
                                    log("DELIVER: ",d.data[0].suburb.name + " - " + d.data[0].suburb.town.name);
                                    return { suburbId:d.data[0].suburb.id, townId:d.data[0].suburb.town.id};
                                });
                                         let body1 =
                                {
                                    /* optional/improvised parameters
                                    "services": [2],
                                    "parcels": [{"length": 21.5,"width": 10,"height": 5.5,"weight": 5.2,"quantity": 1}],
                                    "collection_town": 147,
                                    "collection_time": "2025-01-24T12:00",
                                    "delivery_time": "2025-01-25T16:00:00" 
                                    "delivery_town": 200,
                                     */
                                    
            "RFCode": "JnB",
            "Suburb": "Rondebosch",
            "DestPostcode": 7700,
            "WeightInKg": 7
                                };
                                
                   const _fastWayReques= apiCall.requestQuoteFastway(body1)
        .then((response) => response.json())
          .then((data) => {
            console.log(data);
            appendData(data.result.services);
          });       
                    //get quote
                    Promise.all([_collectAddress,_deliverAddress,_fastWayReques])
                            .then(val=> 
                            {
                                //get parcel info
                                var _parcel = parcelSizes($("#deliveryType").val());
                                let quot =
                                {
                                    /* optional/improvised parameters
                                    "services": [2],
                                    "parcels": [{"length": 21.5,"width": 10,"height": 5.5,"weight": 5.2,"quantity": 1}],
                                    "collection_town": 147,
                                    "collection_time": "2025-01-24T12:00",
                                    "delivery_time": "2025-01-25T16:00:00" 
                                    "delivery_town": 200,
                                     */
                                    "parcels": [_parcel],
                                    "collection_town": val[0].townId,
                                    "delivery_town": val[1].townId,
                                    "collection_location_type": 1,
                                    "delivery_location_type": 5
                                };
                            
                                
                                 apiCall.
                                apiCall.requestQuote(quot)
                                        .then(res=> res.json())
                                        .then(d=> 
                                        {
                                            $(".qbox").html("");
                                            d.data.map((val)=>
                                            {
                                                let parent = $("<div class='form-floating mb-3 _qval' />");
                                                let total = $(`<input type='text' class='form-control' placeholder='header' id=${deliveryTypes(val.service_type)} value='R ${val.total}' />`);
                                                let label = $(`<label class='form-label' for=${deliveryTypes(val.service_type)} > ${deliveryTypes(val.service_type)} : ${val.delivery_type}</label>`);
                                                parent.append(total,label);
                                                $(".qbox").append(parent);
                                            });
                                            //remove mb-3 to avoid margin overhang
                                            $("._qval").last().removeClass("mb-3");
                                        });
                            });
                }
            });    
        }
    };
     
    /* EXE */
   // Object.values(actions).forEach(v=> v());
})();
