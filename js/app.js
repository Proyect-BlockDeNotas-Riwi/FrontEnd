/* API CONST */
const api = "http://localhost:5152/api/notes"

/* BUTTON CREATE NOTE TEMPLATE*/
var new_note = document.querySelector('.new_note');
new_note.addEventListener("click", ()=>{
    create_note()
})

var counter = 0;
const root = document.querySelector('#root')
function create_note(){
    root.innerHTML += 
    `<div class="main_container">
        <div class="option_bar">
            <button class="btn_save" id="save${counter}" onclick="save_note(${counter})">
                <lord-icon
                    src="https://cdn.lordicon.com/wwmtsdzm.json"
                    trigger="hover"
                    stroke="bold"
                    colors="primary:#e88c30,secondary:#242424"
                    class="icon">
                </lord-icon>
            </button>
            <input type="text" class="title" id="title${counter}" placeholder="Type the title">
            <button class="btn_delete" onclick="delete_child()">
                <lord-icon
                    src="https://cdn.lordicon.com/drxwpfop.json"
                    trigger="morph"
                    stroke="bold"
                    state="morph-trash-in"
                    colors="primary:#5c0e0a,secondary:#911710"
                    class="icon">
                </lord-icon>
            </button>
        </div>
        <textarea class="textarea" id="note${counter}" required placeholder="Type the content"></textarea>
    </div>`

    var text_area = document.querySelectorAll('textarea');
    text_area.forEach(function(area){
    area.addEventListener("keyup", function(e){
        area.style.height = "auto"
        let height = e.target.scrollHeight;
        area.style.height = `${height}px`
        })
    })
    counter++;
}

/* SAVE NOTES FUNCTION */
function save_note(id){
    /* GET VALUES */
    let title = document.querySelector(`#title${id}`);
    let note = document.querySelector(`#note${id}`);

    /* MAKE IT THE ARRAY */
    let new_note = {
        Content: note.value,
        title: title.value,
        estado: "Activa",
        user_Id: "1"
    }

    /* SEND DATA WITH FETCH */
    fetch(api,{
        method: "POST",
        headers: {
            "content-type":"application/json",
        },
        body: JSON.stringify(new_note)
    })

    let save = document.querySelector(`#save${id}`);
    save.disabled = true;

    location.href = "";
}

/* BRING CREATED NOTES */
fetch(api)
.then(r => r.json())
.then(d => {
    d.forEach(function(note){
        notes(note)
    })
})

function notes(note){
    root.innerHTML += 
    `<div class="main_container">
        <div class="option_bar">
            <button class="btn_update" onclick="edit('${note.id}')">
                <lord-icon
                    src="https://cdn.lordicon.com/ghhwiltn.json"
                    trigger="hover"
                    stroke="bold"
                    colors="primary:#ffffff,secondary:#0a5c49"
                    class="icon">
                </lord-icon>
            </button>
            <h1 class="title">${note.title}</h1>
            <button class="btn_delete id="delete${counter}" onclick="delete_note('${note.id}')">
                <lord-icon
                    src="https://cdn.lordicon.com/drxwpfop.json"
                    trigger="morph"
                    stroke="bold"
                    state="morph-trash-in"
                    colors="primary:#5c0e0a,secondary:#911710"
                    class="icon">
                </lord-icon>
            </button>
        </div>
        <div class="content"><h4>${note.Content}</h4></div>
    </div>`

    counter++;
}

/* DELETE NOTE */
function delete_note(id){
    fetch(api+id,{
        method: "DELETE"
    })
    .then(r => r.json())
    .then(() => {
        location.href = ""
    })
}

function delete_child(){
    root.removeChild(root.lastChild)
}

const modal = document.querySelector('.modal');

/* MODAL */
function edit(id){
    modal.style.display = "flex";
    modal.showModal();
    fetch(api+id).then(r => r.json())
    .then(d => {
        document.querySelector('#update_title').value = d.title;
        document.querySelector('#id').value = d.id;
        document.querySelector('#update_content').value = d.note;
    })
;}

var text_area = document.querySelectorAll('textarea');
text_area.forEach(function(area){
area.addEventListener("keyup", function(e){
    area.style.height = "auto"
    let height = e.target.scrollHeight;
    area.style.height = `${height}px`
    })
})

/* UPDATE NOTES */
function update(){
    /* GET VALUES */
    let title = document.querySelector('#update_title');
    let note = document.querySelector('#update_content');
    let id = document.querySelector('#id');

    /* MAKE THE ARRAY */
    let update_note = {
        title:title.value,
        Content:note.value
    }

    /* SEND DATA WITH FETCH */
    fetch(api+id.value,{
        method: "PUT",
        headers: {
            "content-type":"application/json"
        },
        body: JSON.stringify(update_note)
    })

    location.href = "";
}

function close_modal(){
    modal.style.display = "none";
    modal.close();
}

/* FILTER */
var search = document.querySelector('.search_input');
search.addEventListener("keyup", function(){
    if (search.value == ""){
        root.innerHTML = "";

        fetch(api).then(r => r.json()).then(d => {
            d.forEach(function(note){
                notes(note);
            })   
        })
    }
    else {
        fetch(api)
        .then(r => r.json())
        .then(d => {
            root.innerHTML = "";   
            let filter = d.filter((d)=> d.title.toLowerCase().includes(search.value.toLowerCase()));
            filter.forEach(function(note){
                notes(note);
            })
        })
    }
})


