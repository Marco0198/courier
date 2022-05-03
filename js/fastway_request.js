const credentials = JSON.stringify({
  email: "demo@collivery.co.za",
  password: "demo",
});
const header = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-App-Name": "My Custom App",
  "X-App-Version": "0.2.1",
  "X-App-Host": ".NET Framework 4.8",
  "X-App-Lang": "C#",
  "X-App-Url": "https://example.com",
};
const server = (val) => "https://api.collivery.co.za/v3/".concat(val);
const parametrize = (url, params = {}) => {
  params.api_token = $("meta[name='token']").attr("content");
  return Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
};

const api_key = "91d98ef3e489ee54f28ebfef8e6c6862";

let suburb,deliveryTownId ;

function fetchAllSuburb() {
  const url = new URL(
    "https://api.collivery.co.za/v3/town_suburb_search?api_token=OpSjx5TlXGCGkzGAvUOm"
  );

  let params = {
    search_text: document.form._collectionTownInput.value,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-App-Name": "My Custom App",
    "X-App-Version": "0.2.1",
    "X-App-Host": ".NET Framework 4.8",
    "X-App-Lang": "C#",
    "X-App-Url": "https://example.com",
  }

  fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((res) => {
     // townId = res.data[0].suburb.town.id;
     //let townId= res.data[0].suburb.id;
     //localStorage.setItem("townId", res.data[0].suburb.id);
     console.log("ta reponse "+ res);
     getTownId(res.data[0].suburb.town.id);
      
    });
    
}
function fetchDeliveryTownInput() {
  const url = new URL(
    "https://api.collivery.co.za/v3/town_suburb_search?api_token=OpSjx5TlXGCGkzGAvUOm"
  );

  let params = {
    search_text: document.form._deliveryTownInput.value,
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  let headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-App-Name": "My Custom App",
    "X-App-Version": "0.2.1",
    "X-App-Host": ".NET Framework 4.8",
    "X-App-Lang": "C#",
    "X-App-Url": "https://example.com",
  }

  fetch(url, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((res) => {
     // townId = res.data[0].suburb.town.id;
     //let townId= res.data[0].suburb.id;
     //localStorage.setItem("townId", res.data[0].suburb.id);
     console.log("ta reponse "+ res);
     getTownDelId(res.data[0].suburb.town.id);
      
    });
    
}

function getTownId(id){
  
  suburb=id;
  console.log(suburb)
  return suburb;
}
function getTownDelId(id){
  
  deliveryTownId=id;
  console.log(deliveryTownId)
  return deliveryTownId;
}
//fetchAllSuburb()

form.onsubmit = async function (e) {
 
 e.preventDefault();
 console.log(suburb);
 //console.log("this is"+city.townId)
  const url = `https://sa.api.fastway.org/v3/psc/lookup?api_key=${api_key}`;
  const token = "OpSjx5TlXGCGkzGAvUOm";
  const result = await Promise.allSettled([
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        RFCode: document.form.pFranchisee.value,
        Suburb: document.form.vTown.value,
        DestPostcode: document.form.vPostcode.value,
        WeightInKg: document.form.vWeight.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        appendData(data.result.services);
      }),
    fetch(
      "https://api.collivery.co.za/v3/quote?api_token=OpSjx5TlXGCGkzGAvUOm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-App-Name": "SandBox App",
          "X-App-Version": "1.0.0.0",
          "X-App-Host": "ReactJS",
          "X-App-Lang": "Javascript",
          "X-App-Url": "https://oroafrica.com",
        },
        body: JSON.stringify({
          parcels: [
            {
              length: 21.5,
              width: 10,
              height: 5.5,
              weight: 5.2,
              quantity: 2,
            },
          ],
          collection_town:suburb,
          delivery_town:deliveryTownId,
          collection_location_type: 1,
          delivery_location_type: 5,
        }),
      }
    )
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        appendDataCollivery(res.data);
      }),
  ]).catch((err) => {
    console.log(err);
  });
  // fetchAllSuburb()
};
function appendData(data) {
  var mainContainer = document.getElementById("myData");
  for (var i = 0; i < data.length; i++) {
    var div = document.createElement("div");
    div.innerHTML = `
                 <ul class="list-group mb-3">fastway
                 <li class="list-group-item">Country: ${data[i].type}  ${data[i].name} ${data[i].totalprice_frequent}</li> </ul>
                `;
    mainContainer.appendChild(div);
  }
}
function appendDataCollivery(data) {
  var mainContainer = document.getElementById("myData");
  for (var i = 0; i < data.length; i++) {
    //   console.log("data"+data)
    var div = document.createElement("div");
    div.innerHTML = `
                 <ul class="list-group mb-3"> collivery
                 <li class="list-group-item">Country: ${data[i].service_type}  ${data[i].delivery_type} ${data[i].total}</li>              </ul>
                `;
    mainContainer.appendChild(div);
  }
}

const apiCall = {
  login: async (creds = credentials) => {
    let url = new URL(server("login"));
    return await fetch(url, { method: "POST", headers: header, body: creds });
  },
  addressIndex: async (search = "mds", customId = "") => {
    let url = new URL(server("address"));
    parametrize(url, {
      search: search,
      custom_id: customId,
      include: "contacts",
    }); //search|custom_id
    return await fetch(url, { method: "GET", headers: header });
  },
  addressId: async (addressId = "0") => {
    let url = new URL(server(`address/${addressId}`));
    parametrize(url, { include: "contacts" });
    return await fetch(url, { method: "GET", headers: header });
  },
  addressSave: async (body = {}) => {
    let url = new URL(server("address"));
    parametrize(url);
    return await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(body),
    });
  },
  addressUpdate: async (body = {}, addressId = "") => {
    let url = new URL(server(`address/${addressId}`));
    parametrize(url);
    return await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(body),
    });
  },
  addressDelete: async (addressId = "0") => {
    let url = new URL(server(`address/${addressId}`));
    parametrize(url);
    return await fetch(url, { method: "DELETE", headers: header });
  },
  addressDefault: async () => {
    let url = new URL(server("default_address"));
    parametrize(url);
    return await fetch(url, { method: "GET", headers: header });
  },
  contactIndex: async (search = "mds", addressId = "") => {
    let url = new URL(server("contacts"));
    parametrize(url, { search: search, address_id: addressId }); //address_id | search
    return await fetch(url, { method: "GET", headers: header });
  },
  contactSave: async (body = {}) => {
    let url = new URL(server("contacts"));
    parametrize(url);
    return await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(body),
    });
  },
  contactShow: async (contactId = "") => {
    let url = new URL(server(`contacts/${contactId}`));
    parametrize(url);
    return await fetch(url, { method: "GET", headers: header });
  },
  contactUpdate: async (contactId = "") => {
    let url = new URL(server(`contacts/${contactId}`));
    parametrize(url);
    let body = {
      address_id: "3722446",
      email: "world@example.com",
      full_name: "Sandra banks",
      cellphone: "0721234567",
      work_phone: "0214242000",
    };

    return await fetch(url, {
      method: "PUT",
      headers: header,
      body: JSON.stringify(body),
    });
  },
  contactDelete: async (contactId = "0") => {
    let url = new URL(server(`contacts/${contactId}`));
    parametrize(url);
    return await fetch(url, { method: "DELETE", headers: header });
  },
  addressTown: async (town = "") => {
    let url = new URL(server("towns"));
    parametrize(url, { search: town });
    return await fetch(url, { method: "GET", headers: header });
  },
  addressSuburbs: async (suburb = "", postalCode = "", country = "ZAF") => {
    let url = new URL(server("suburbs"));
    parametrize(url, {
      search: suburb,
      postal_code: postalCode,
      country: country,
    });
    return await fetch(url, { method: "GET", headers: header });
  },
  addressSuburbsId: async (id = "", country = "ZAF") => {
    let url = new URL(server(`suburbs/${id}`));
    parametrize(url, { country: country });
    return await fetch(url, { method: "GET", headers: header });
  },
  addressTownSuburbs: async (search = "cape town") => {
    let url = new URL(server(`town_suburb_search`));
    parametrize(url, { search_text: search });
    return await fetch(url, { method: "GET", headers: header });
  },
  serviceTypes: async () => {
    let url = new URL(server(`service_types`));
    parametrize(url);
    return await fetch(url, { method: "GET", headers: header });
  },
  serviceTypes: async () => {
    let url = new URL(server(`service_types`));
    parametrize(url);
    return await fetch(url, { method: "GET", headers: header });
  },
};
const actions = {
  login: () => {
    $(document).on("click", "input:button", (ev) => {
      let _fail = () => {
        alert("Login Failed");
      };
      let _success = (d) => {
        $("meta[name='token']").attr("content", d.data.api_token);
        $(".onAuth").removeClass("d-none");
      };
      if (ev.target.value === "login") {
        if (!$("meta[name='token']").attr("content")) {
          apiCall
            .login(
              JSON.stringify({
                email: $("#_email").val(),
                password: $("#_password").val(),
              })
            )
            .then((resp) => (resp.ok ? resp.json() : "error"))
            .then((d) => (d === "error" ? _fail() : _success(d)));
        } else if ($("meta[name='token']").attr("content")) {
          $(".onAuth").removeClass("d-none");
        }
      }
    });
  },
  collectionPoint: () => {
    $(document).on("keyup", "#_collectionTownInput", (ev) => {
      apiCall
        .addressTownSuburbs($("#_collectionTownInput").val())
        .then((resp) => resp.json())
        .then((d) => {
          if (!d.data | ($("#_collectionTownInput").val() < 4)) return;
          $("#_collectionTown").html("");

          d.data.slice(0, 10).map((k) => {
            $("#_collectionTown").append(
              `<option id="onme" >`
                .concat(k.formatted_result)
                .concat("</option>")
            );
          });
        });
    });
  },
  deliveryPoint: () => {
    $(document).on("keyup", "#_deliveryTownInput", (ev) => {
      apiCall
        .addressTownSuburbs($("#_deliveryTownInput").val())
        .then((resp) => resp.json())
        .then((d) => {
          if (!d.data | ($("#_deliveryTownInput").val() < 4)) return;
          $("#_deliveryTown").html("");

          d.data.slice(0, 10).map((k) => {
            $("#_deliveryTown").append(
              `<option id="onme" >`
                .concat(k.formatted_result)
                .concat("</option>")
            );
          });
        });
    });
  },
  resetQuote: () => {
    $(document).on("click", "input:button", (ev) => {
      if (ev.target.value === "reset") {
        $("#_collectionTownInput").val("");
        $("#_deliveryTownInput").val("");
        $("#deliveryType").prop("selectedIndex", 0);
        $(".qbox").html("");
      }
    });
  },
  packageSize: () => {},
  getQuote: () => {
    $("#btn_name").click((ev) => {
      if (ev.target.value === "quotes") {
        //get collection town id
        const _collectAddress = apiCall
          .addressTownSuburbs($("#_collectionTownInput").val().split(",")[0])
          .then((resp) => resp.json())
          .then((d) => {
            log(
              "COLLECTION: ",
              d.data[0].suburb.name + " - " + d.data[0].suburb.town.name
            );
            return {
              suburbId: d.data[0].suburb.id,
              townId: d.data[0].suburb.town.id,
            };
          });
        //get delivery town id
        const _deliverAddress = apiCall
          .addressTownSuburbs($("#_deliveryTownInput").val().split(",")[0])
          .then((resp) => resp.json())
          .then((d) => {
            log(
              "DELIVER: ",
              d.data[0].suburb.name + " - " + d.data[0].suburb.town.name
            );
            return {
              suburbId: d.data[0].suburb.id,
              townId: d.data[0].suburb.town.id,
            };
          });
        //get quote
        Promise.all([_collectAddress, _deliverAddress],  fetch(url, {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
        
            "RFCode": "JnB",
            "Suburb": "Rondebosch",
            "DestPostcode": 7700,
            "WeightInKg": 7
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            appendData(data.result.services);
          })).then((val) => {
          //get parcel info
          var _parcel = parcelSizes($("#deliveryType").val());
          let quot = {
            /* optional/improvised parameters
                                "services": [2],
                                "parcels": [{"length": 21.5,"width": 10,"height": 5.5,"weight": 5.2,"quantity": 1}],
                                "collection_town": 147,
                                "collection_time": "2025-01-24T12:00",
                                "delivery_time": "2025-01-25T16:00:00" 
                                "delivery_town": 200,
                                 */
            parcels: [_parcel],
            collection_town: val[0].townId,
            delivery_town: val[1].townId,
            collection_location_type: 1,
            delivery_location_type: 5,
          };
          apiCall
            .requestQuote(quot)
            .then((res) => res.json())
            .then((d) => {
              $(".qbox").html("");
              d.data.map((val) => {
                let parent = $("<div class='form-floating mb-3 _qval' />");
                let total = $(
                  `<input type='text' class='form-control' placeholder='header' id=${deliveryTypes(
                    val.service_type
                  )} value='R ${val.total}' />`
                );
                let label = $(
                  `<label class='form-label' for=${deliveryTypes(
                    val.service_type
                  )} > ${deliveryTypes(val.service_type)} : ${
                    val.delivery_type
                  }</label>`
                );
                parent.append(total, label);
                $(".qbox").append(parent);
              });
              //remove mb-3 to avoid margin overhang
              $("._qval").last().removeClass("mb-3");
            });
        });
      }
    });
  },
};
/* EXE */
Object.values(actions).forEach((v) => v());
