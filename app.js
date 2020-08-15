const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");
const submitBtn = document.querySelector("#form-btn");

//create el and render cafes

function renderCafe(doc) {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("span");
  let edit = document.createElement("span");

  li.setAttribute("id", doc.id);
  cross.setAttribute("class", "fa fa-times cafe-delete");
  edit.setAttribute("class", "fa fa-pencil cafe-edit");
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;

  // cross.textContent = "X";
  // cross.innerHTML = "<i class=''></i>";
  //edit.innerHTML = "<i class=''></i>";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  li.appendChild(edit);

  cafeList.appendChild(li);

  //delete initiation
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("id");
    db.collection("cafes").doc(id).delete();
  });

  //edit initiation
  edit.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log(e.target);
    let id = e.target.parentElement.getAttribute("id");

    db.collection("cafes")
      .doc(id)
      .get()
      .then((res) => {
        console.log(res.data());
        form.name.value = res.data().name;
        form.city.value = res.data().city;

        form.setAttribute("update-id", id);
        form.setAttribute("action", "update");
        submitBtn.textContent = "Update Cafe";
      });
  });
}

//get data
// where query: .where("city", "==", "surat")
//order query:  .orderBy("name")
// db.collection("cafes")
//   .get()
//   .then((snapshot) => {
//     snapshot.docs.forEach((doc) => {
//       console.log(doc.data());
//       renderCafe(doc);
//     });
//   });

//add data

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e.target);
  let action = e.target.getAttribute("action");
  console.log(action);
  if (action == "add") {
    db.collection("cafes").add({
      name: form.name.value,
      city: form.city.value,
    });
  } else if (action == "update") {
    let id = e.target.getAttribute("update-id");
    db.collection("cafes").doc(id).update({
      name: form.name.value,
      city: form.city.value,
    });
  }

  form.name.value = "";
  form.city.value = "";
  form.setAttribute("update-id", "");
  form.setAttribute("action", "add");
  submitBtn.textContent = "Add Cafe";
});

//realtime listener

db.collection("cafes")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();

    changes.forEach((change) => {
      console.log(change.doc.data());
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector("[data-id=" + change.doc.id + "]");
        cafeList.removeChild(li);
      }
    });
  });

//update data
// .update({}) //to update
// .set({})   //overwrite whole document data

//db.collection("cafes").doc("id").update({name:"mario world"})
