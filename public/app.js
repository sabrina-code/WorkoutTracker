const create = document.getElementById("create");
const clear = document.getElementById("clear-all");
const list = document.getElementById("list");
const del = document.getElementById("delete");

function firstLoad() {
  fetch("/all").then((res) => {
    res.json().then((data) => {
      newPlanSnippet(data);
    });
  });
}

function newPlanSnippet(data) {
  for (var i = 0; i < data.length; i++) {
    let data_id = data[i]["_id"];
    let trail = data[i]["trail"];
    let time = data[i]["time"];
    let meet = data[i]["meet"];
    let note = data[i]["note"];

    snippet = `
            <div id="dataEntry">
            <button id="delete" data-id=${data_id}>X</button>
            <div id="dataTrail" data-id=${data_id}>${trail}
            </div> 
            <div class="details">
            <p id="time" data-id=${data_id} >date/time: ${time}</p>
            <p id="meet" data-id=${data_id} >meet location: ${meet}</p>
            </div> 
            <p id="dataNote" data-id=${data_id} >${note}</p>
                    
            </div>`;

    let myPlan = document.getElementById("list");
    myPlan.insertAdjacentHTML("beforeend", snippet);
  }
}

firstLoad();

/*----------- CRUD ----------*/
function resetTrailAndNote() {
  const note = document.getElementById("note");
  note.value = "";
  const time = document.getElementById("time");
  note.value = "";
  const meet = document.getElementById("meet");
  note.value = "";
  const trail = document.getElementById("trail");
  trail.value = "";
}

function updateTrailAndNote(data) {
  const note = document.getElementById("note");
  note.value = data.note;
  const time = document.getElementById("time");
  note.value = data.note;
  const meet = document.getElementById("meet");
  note.value = data.note;
  const trail = document.getElementById("trail");
  trail.value = data.trail;
}

//CREATE:: POST : resetTrailAndNote()
create.addEventListener("click", function (e) {
  if (e.target.matches("#create")) {
    element = e.target;
    data_id = element.getAttribute("data-id");
    fetch("/submit", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trail: document.getElementById("trail").value,
        time: document.getElementById("timeDate").value,
        meet: document.getElementById("meetUp").value,
        note: document.getElementById("note").value,
        created: Date.now(),
      }),
    })
      .then((res) => res.json())
      .then((res) => newPlanSnippet([res]));
    resetTrailAndNote();
  }
});

//UPDATE:: GET: updateTrailAndNote(): postUpdate(): resetTrailAndNote()
list.addEventListener("click", function (e) {
  if (e.target.matches("#dataTrail") || e.target.matches("#dataNote")) {
    element = e.target;
    data_id = element.getAttribute("data-id");
    fetch("/find/" + data_id, { method: "get" })
      .then((res) => res.json())
      .then(function (data) {
        updateTrailAndNote(data);
        let updaterBtn = `<button class="btn-primary" id='updater' data-id=${data_id}>Update</button>`;
        btnGroup.innerHTML = updaterBtn;
      });
  }
  postUpdate();
});

function postUpdate() {
  btnGroup.addEventListener("click", function (e) {
    if (e.target.matches("#updater")) {
      element = e.target;
      data_id = element.getAttribute("data-id");
      fetch("/update/" + data_id, {
        method: "post",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trail: document.getElementById("trail").value,
          time: document.getElementById("time").value,
          meet: document.getElementById("meet").value,
          note: document.getElementById("note").value,
          success: window.location.reload(true),
        }),
      })
        .then((res) => {
          res.json();
          console.log("again");
        })
        .then((data) => {
          resetTrailAndNote(data);
        });
    }
  });
}

//DELETE:: GET: updateTrailAndNote(): postUpdate(): resetTrailAndNote()
list.addEventListener("click", function (e) {
  if (e.target.matches("#delete")) {
    element = e.target;
    data_id = element.getAttribute("data-id");
    fetch("/delete/" + data_id, { method: "delete" }).then((res) => {
      element.parentNode.remove();
    });
  }
});
