const messageScreen = document.getElementById("messages");
const modalForm = document.getElementById("exampleModal");
const messageForm = document.getElementById("messageForm");
const msgInput = document.getElementById("msg-input");
const msgBtn = document.getElementById("msg-button");
const db = firebase.database();
const msgRef = db.ref("/msgs");
const idpwRef = db.ref("/idpw");
const id = uuid();
let name = 'guest';
let nameImg = "assests/icons-male.png";

// Firebase Facebook Authentication

const facebookLogin = document.getElementById('facebook');

facebookLogin.addEventListener('click', e => {
    e.preventDefault();
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function (result) {
        var user = result.user;
        name = user.displayName;
        nameImg = user.photoURL;
        if (name != 'guest') {
            bootbox.alert("Login Sucessfully");
            msgInput.removeAttribute('disabled')
            msgBtn.removeAttribute('disabled')
            modalForm.style.display = 'none'
            $("#exampleModal").remove();
            $('.modal-backdrop').remove();
        }
    }).catch(function (error) {
        bootbox.alert({
            message: "Please login with your facebook account",
            className: 'rubberBand animated'
        })
    });
    // modalForm.style.display = 'none'
    // $("#exampleModal").remove();
    // $('.modal-backdrop').remove();
})

// Message Input and firebase  

messageForm.addEventListener("submit", e => {
    e.preventDefault();

    const text = msgInput.value;
    if (!text.trim()) return;

    const msg = {
        id,
        name,
        text,
        nameImg
    };

    // Pushing to Firebase Database

    msgRef.push(msg);
    msgInput.value = "";
});



// Message Delivering part 

const updateMsg = data => {
    const { id: userID, name, text, nameImg } = data.val();
    const msg = `<li class="msg ${id == userID && "act"}" id="msg">
                    <img id="userImg" src=${nameImg} class="userImg">
                    <span class="msg-box">
                      <i class="name">${name}:</i>
                        ${text}
                    </span>
                </li>`;
    messageScreen.innerHTML += msg


};
msgRef.on('child_added', updateMsg)

// Logout on reload //

// if ( location.reload()) {
//     firebase.auth().signOut().then(function () {
//         // Sign-out successful.
//     }).catch(function (error) {
//         // An error happened.
//     });
// }
