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
const deliveryTypes = (type) => {
  let t = {
    1: "Same Day",
    2: "Next Day",
    3: "Light Cargo Freight",
    5: "Heavy Cargo Freight",
  };
  return t[type];
};

const parametrize = (url, params = {}) => {
  params.api_token = $("meta[name='token']").attr("content");
  return Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
};
const api_key = "91d98ef3e489ee54f28ebfef8e6c6862";
let suburb, deliveryTownId;
function fetchAllSuburb() {
  const url = new URL(
    "https://api.collivery.co.za/v3/town_suburb_search?api_token=OpSjx5TlXGCGkzGAvUOm"
  );

  let params = {
    search_text: document
      .getElementById("_collectionTownInput")
      .value.toString()
      .substring(0, 4),
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );
  fetch(url, {
    method: "GET",
    headers: header,
  })
    .then((response) => response.json())
    .then((res) => {
      console.log("ta reponse " + res);
      getTownId(res.data[0].suburb.town.id);
      // getTownDelId(res.data[0].suburb.town.id);
    });
}
function fetchDeliveryTownInput() {
  const url = new URL(
    "https://api.collivery.co.za/v3/town_suburb_search?api_token=OpSjx5TlXGCGkzGAvUOm"
  );
  let params = {
    search_text: document
      .getElementById("_deliveryTownInput")
      .value.toString()
      .substring(0, 4),
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  fetch(url, {
    method: "GET",
    headers: header,
  })
    .then((response) => response.json())
    .then((res) => {
      console.log("ta reponse " + res);
      getTownDelId(res.data[0].suburb.town.id);
    });
}
function getTownId(id) {
  suburb = id;
  console.log(suburb);
  return suburb;
}
function getTownDelId(id) {
  deliveryTownId = id;
  console.log(deliveryTownId);
  return deliveryTownId;
}

form.onsubmit = async function (e) {
  e.preventDefault();

  console.log(suburb);
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
        headers: header,
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
          collection_town: suburb,
          delivery_town: deliveryTownId,
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
};
function appendData(data) {
  var mainContainer = document.getElementById("myData");
  for (var i = 0; i < data.length; i++) {
    var div = document.createElement("div");
    div.innerHTML = `
                 <ul class="list-group mb-3">fastway
                 <li class="list-group-item">Option: ${data[i].type}  ${data[i].name} ${data[i].totalprice_frequent}</li> </ul>
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

                 <li class="list-group-item"> ${deliveryTypes(data[i].service_type)}  Delivery${data[i].delivery_type} Total R: ${data[i].total}</li>             
                            </ul>
                `;
    mainContainer.appendChild(div);
  }
}

const apiCall = {
  login: async (creds = credentials) => {
    let url = new URL(server("login"));
    return await fetch(url, { method: "POST", headers: header, body: creds });
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

  addressTownSuburbs: async (search = "cape town") => {
    let url = new URL(server(`town_suburb_search`));
    parametrize(url, { search_text: search });
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
          if (!d.data | ($("#_collectionTownInput").val() < 3)) return;
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
          if (!d.data | ($("#_deliveryTownInput").val() < 3)) return;
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
};
/* EXE */
Object.values(actions).forEach((v) => v());
