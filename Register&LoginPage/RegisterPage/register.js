let eyeicon = document.getElementById("eyeicon");
let pswrd = document.getElementById("password_id");


eyeicon.onclick = () => {
  if (pswrd.type === "password") {
    pswrd.type = "text";
    eyeicon.src = "eye-open.png";
  }
  else {
    pswrd.type = "password";
    eyeicon.src = "eye-close.png";
  }
}

let emailField = document.querySelector("#emailid");
let emailLabel = document.querySelector("#email-label");
let emailError = document.querySelector("#email-error");

function validateEmail() {

  if (!emailField.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
    emailError.innerHTML = "Lütfen geçerli bir email giriniz."
    emailField.style.borderColor = "red";
    return false;
  }
  emailError.innerHTML = "";
  emailField.style.borderColor = "green";
  return true;
}

emailField.addEventListener("blur", validateEmail);


let msg = document.getElementById("message");
let str = document.getElementById("strength");

function GucluSifre(password) {
  let i = 0;
  if (password.length > 6) {
    i++;
  }
  if (password.length >= 10) {
    i++;
  }
  if (/[A-Z]/.test(password)) {
    i++;
  }
  if (/[a-z]/.test(password)) {
    i++;
  }
  if (/[0-9]/.test(password)) {
    i++;
  }
  if (/[A-Za-z0-8]/.test(password)) {
    i++;
  }
  return i;
}

pswrd.addEventListener("input", function () {
  let password = pswrd.value;
  if (password) {
    let gucluSifre = GucluSifre(password);

    if (gucluSifre <= 2) {
      str.innerHTML = "zayıf";
      pswrd.style.borderColor = "#ff5925";
      msg.style.color = "#ff5925"
    }
    else if (gucluSifre >= 2 && gucluSifre <= 4) {
      str.innerHTML = "orta";
      pswrd.style.borderColor = "yellow";
      msg.style.color = "yellow"
    }
    else {
      str.innerHTML = "güçlü";
      pswrd.style.borderColor = "#26d730";
      msg.style.color = "#26d730"
    }

  }
  else {
    // Eğer şifre alanı boşsa, mesajları temizle
    str.innerHTML = "";
    pswrd.style.borderColor = ""; // Varsayılan rengi kullanabilirsiniz
    msg.style.color = "";
  }
})

let contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (event) {
  let password = pswrd.value;
  let gucluSifre = GucluSifre(password);

  if (!validateEmail()) {
    event.preventDefault(); // Formun gönderimini engelle
    alert("Lütfen geçerli bir e-posta giriniz.");
  } else if (gucluSifre <= 2) {
    event.preventDefault(); // Formun gönderimini engelle
    alert("Şifre zayıf, lütfen daha güçlü bir şifre kullanın.");
  } else if (gucluSifre >= 2 && gucluSifre <= 4) {
    event.preventDefault(); // Formun gönderimini engelle
    alert("Şifre orta, lütfen daha güçlü bir şifre kullanın.");
  } else {
    window.location.href = "../LoginPage/login.html";
  }
});

window.addEventListener("load", function () {
  let formElements = document.querySelectorAll("input, textarea, select");
  formElements.forEach(function (element) {
    element.value = ""; // Girdi değerini sıfırla
  });
});



const getElementVal = (id) => {
  return document.getElementById(id).value;
}


const getSelectedGender = () => {
  const maleRadio = document.getElementById("check-male");
  const femaleRadio = document.getElementById("check-female");

  if (maleRadio.checked) {
    return "Erkek";
  } else if (femaleRadio.checked) {
    return "Kadın";
  } else {
    return "Belirtilmemiş";
  }
}


// //FİREBASE START
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
//   import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
//   import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



//   const firebaseConfig = {
//     apiKey: "AIzaSyAc1SskNv-I7HP0xz7ccoIi5f0ZwjSZ-xM",
//     authDomain: "ayakkabisitesi.firebaseapp.com",
//     databaseURL: "https://ayakkabisitesi-default-rtdb.firebaseio.com",
//     projectId: "ayakkabisitesi",
//     storageBucket: "ayakkabisitesi.appspot.com",
//     messagingSenderId: "875012696490",
//     appId: "1:875012696490:web:e9214425c5013aa493a3d3",
//     // measurementId: "G-1JE69N8LLZ"
//   };


//   const app = initializeApp(firebaseConfig);
//   const db = getDatabase();
//   const auth = getAuth(app);

//   let NameInp = document.getElementById('nameid');
//   let NumberInp = document.getElementById('numberid');
//   let DateInp = document.getElementById('dateid');
//   let GenderInp = document.getElementById('genderid');

//   let RegisterUser = evt => {
//     evt.preventDefault();
//     createUserWithEmailAndPassword(auth, NameInp.value, emailField.value, NumberInp.value , DateInp.value , pswrd.value, GenderInp.value )
//     .then((userCredential)=>{
//       const user = userCredential.user;
//     })
//     .catch((error)=>{
//       const errorCode = error.code;
//       const errorMessage = error.message;

//     })
//   }

//   contactForm.addEventListener('submit', RegisterUser);


// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


// const firebaseConfig = {
//   apiKey: "AIzaSyAriMIe1AwyethfXRjra_Rrna68DXYH3Oc",
//   authDomain: "auth-b9ba9.firebaseapp.com",
//   projectId: "auth-b9ba9",
//   storageBucket: "auth-b9ba9.appspot.com",
//   messagingSenderId: "463113484478",
//   appId: "1:463113484478:web:ec4089f598083d13fb86ef"
// };



// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const auth = getAuth();


// RegisterButton.addEventListener('click', (e) => {
//   evt.preventDefault();
//   // let eMailInp = document.getElementById("emailid").value;
//   // let PasswordInp = document.getElementById("password_id").value;
//   let NameInp = document.getElementById("nameid").value;

//   createUserWithEmailAndPassword(auth, emailField.value, pswrd.value)
//     .then((userCredential) => {
//       console.log(credentials);
//       const user = userCredential.user;
//       alert("Kullanıcı başarıyla kayıt oldu.");
//     })
//     .catch((error) => {
//       // alert(error.message);
//       console.log(error.code);
//       console.log(error.message);
//     })
// })
// contactForm.addEventListener("submit", RegisterButton);