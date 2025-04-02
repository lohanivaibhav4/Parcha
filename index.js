// HTML-ELEMENTS
const addBtn = document.getElementById('add-btn')
const container = document.getElementById('container')
const lockedNotesBtn = document.getElementById('lockedNotes')
const deletedNotesBtn = document.getElementById('deletedNotes')

// JS_ELEMENTS
let currentType = 'default'
let savedLocal = JSON.parse(localStorage.getItem(currentType))
let password = JSON.parse(localStorage.getItem('password'))


// ADD_NOTES_ELEMENTS
const createNotesDiv = document.getElementById('create-notes')
const createNotesTitle = document.getElementById('create-notes-title')
const createNotesText = document.getElementById('create-notes-text')


//FUNCTION_CALLS
renderNotes()

//FUNCTIONS

function renderNotes(){
    savedLocal = JSON.parse(localStorage.getItem(currentType))
    if(!savedLocal){
    savedLocal = []
    localStorage.setItem(currentType,JSON.stringify(savedLocal))
}
    let savedNotesHTML =''
    if(savedLocal){
        savedLocal.forEach(localSaved=>{
            savedNotesHTML += `<div class="notes">
                                    <div class="notes-title-div">
                                        <h2>${localSaved.title}</h2>
                                        <button id="edit-note-btn"><i class="fa-solid fa-pen"></i></i></button>
                                        <button id="copy-note-btn"><i class="fa-solid fa-copy"></i></i></i></button>
                                        <button id="lock-note-btn"><i class="fa-solid fa-lock"></i></i></i></button>
                                        <button id="delete-note-btn"><i class="fa-solid fa-trash-can"></i></button>
                                        
                                    </div>
                                    <p class="notes-text">${localSaved.text}</p>
                                </div>`
        })
    }
    container.innerHTML = savedNotesHTML
}


// EVENT-LISTNERS

addBtn.addEventListener('click',()=>{
    createNotesDiv.style.display = "grid"
    container.classList.add('blurred')
})
lockedNotesBtn.addEventListener('click',()=>{
    if(!password){
        password = prompt("Please, Create A Password !")
        localStorage.setItem('password',JSON.stringify(password))
    }
    let passkey = ''
    while(passkey != password){
        passkey = prompt("Enter Your Password")
        if(passkey === null)
            break
    }
    if(passkey === password){
        currentType = 'locked'
        addBtn.classList.remove('hidden')
        renderNotes()
    }
})
deletedNotesBtn.addEventListener('click',()=>{
    currentType = 'deleted'
    addBtn.classList.add('hidden')
    renderNotes()
})

//ADD_NEW_NOTES_LISTNERS


document.getElementById('discard-new').addEventListener('click',()=>{
    createNotesTitle.value = ''
    createNotesText.value = ''
    createNotesDiv.style.display = "none"
    container.classList.toggle('blurred')
})

document.getElementById('save-new').addEventListener('click',()=>{
    if(createNotesText.value){
        let newNote = {
            title:createNotesTitle.value,
            text:createNotesText.value
        }
        savedLocal.unshift(newNote)
        localStorage.setItem(currentType,JSON.stringify(savedLocal))
        renderNotes()
    createNotesTitle.value = ''
    createNotesText.value = ''
    createNotesDiv.style.display = "none"
    container.classList.toggle('blurred')
    }
    else{
        alert("Write Something To Save")
    }
                            
})






