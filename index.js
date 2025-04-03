// LOCAL_STORAGE_SETUP
if(!JSON.parse(localStorage.getItem('deleted'))){
    localStorage.setItem('deleted',JSON.stringify([]))
}
if(!JSON.parse(localStorage.getItem('locked'))){
    localStorage.setItem('locked',JSON.stringify([]))
}

// HTML-ELEMENTS
const addBtn = document.getElementById('add-btn')
const container = document.getElementById('container')
const lockedNotesBtn = document.getElementById('lockedNotes')
const deletedNotesBtn = document.getElementById('deletedNotes')
const expandNavBtn = document.getElementById('expand-nav')
const navbarBtns = document.querySelector('.nav-btn')

// JS_ELEMENTS
let currentType = 'default'
let savedLocal = JSON.parse(localStorage.getItem(currentType))
let password = JSON.parse(localStorage.getItem('password'))


// ADD_NOTES_ELEMENTS
const createNotesDiv = document.getElementById('create-notes')
const createNotesTitle = document.getElementById('create-notes-title')
const createNotesText = document.getElementById('create-notes-text')


//FUNCTIONS

function renderNotes(){
    savedLocal = JSON.parse(localStorage.getItem(currentType))
    if(!savedLocal){
    savedLocal = []
    localStorage.setItem(currentType,JSON.stringify(savedLocal))
    }
    let savedNotesHTML =''
    if(savedLocal){
        savedLocal.forEach(item=>{
            savedNotesHTML += `<div class="notes">
                                    <div class="notes-title-div" id="${item.id}">
                                        <h2>${item.title}</h2>
                                        <button><i class="fa-solid fa-pen edit"></i></i></button>
                                        <button><i class="fa-solid fa-copy copy"></i></i></i></button>
                                        <button><i class="fa-solid fa-lock lock"></i></i></i></button>
                                        <button><i class="fa-solid fa-trash-can delete"></i></button>
                                        
                                    </div>
                                    <p class="notes-text">${item.text}</p>
                                </div>`
        })
    }
    container.innerHTML = savedNotesHTML
}
function toggleMobNav(){
    navbarBtns.classList.toggle('mobNav')
    container.classList.toggle('blurred')
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
    toggleMobNav()
})

deletedNotesBtn.addEventListener('click',()=>{
    currentType = 'deleted'
    addBtn.classList.add('hidden')
    renderNotes()
   toggleMobNav()
})

expandNavBtn.addEventListener('click',()=>{
    toggleMobNav()
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
            id:crypto.randomUUID(),
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


function handleClicks(e){
    const classArray = Array.from(e.target.classList)
    const selectedItem = savedLocal.filter(item=>{
        return (e.target.closest('div').id === item.id)
    })[0]
    if(classArray.includes('delete')){
        const deletedItem = selectedItem
        if(deletedItem){
          if(currentType === 'deleted'){
            savedLocal.splice(savedLocal.indexOf(deletedItem),1)[0]
            localStorage.setItem(currentType,JSON.stringify(savedLocal))
          }
          else{
            const del = savedLocal.splice(savedLocal.indexOf(deletedItem),1)[0]
            localStorage.setItem(currentType,JSON.stringify(savedLocal))

            //MOVING DELETED ITEM TO DELETED ARRAY
            currentType = 'deleted'
            savedLocal = JSON.parse(localStorage.getItem(currentType))
            savedLocal.unshift(del)
            localStorage.setItem(currentType,JSON.stringify(savedLocal))

            //REMOVE COPY, EDIT & LOCK OPTIONS FROM DELETED NOTES

            //RESETTING_CURRENT_TYPE_TO_DEFAULT
            currentType = 'default'
          }
          renderNotes()
          
        }
    }
    else if(classArray.includes('lock')){
        const lockedItem = selectedItem
        if(lockedItem){
            if(currentType === 'locked'){
                const locked = savedLocal.splice(savedLocal.indexOf(lockedItem),1)[0]
                localStorage.setItem(currentType,JSON.stringify(savedLocal))

                currentType = 'default'
                savedLocal = JSON.parse(localStorage.getItem(currentType))
                savedLocal.unshift(locked)
                localStorage.setItem(currentType,JSON.stringify(savedLocal))
                currentType = 'locked'
            }
            else if(currentType === 'default'){
                const unlocked = savedLocal.splice(savedLocal.indexOf(lockedItem),1)[0]
                localStorage.setItem(currentType,JSON.stringify(savedLocal))

                currentType = 'locked'
                savedLocal = JSON.parse(localStorage.getItem(currentType))
                savedLocal.unshift(unlocked)
                localStorage.setItem(currentType,JSON.stringify(savedLocal))
                currentType = 'default'
            }
            renderNotes()
        }
    }
    else if(classArray.includes('copy')){
        const copiedItem = selectedItem
        if(copiedItem){
            navigator.clipboard.writeText(copiedItem.text)
        }
    }
    else if(classArray.includes('edit')){
        const editedItem = selectedItem
        if(editedItem){
            createNotesDiv.style.display = "grid"
            container.classList.add('blurred')
            createNotesTitle.value = editedItem.title
            createNotesText.value = editedItem.text
            
        }
    }
}

// EDIT_NOTES_EVENT_LISTNERS
container.addEventListener('click',handleClicks)
container.addEventListener('touchstart',handleClicks)


//FUNCTION_CALLS
renderNotes()