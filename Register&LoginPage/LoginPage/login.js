let eyeicon = document.getElementById("eyeicon");
let pass = document.getElementById("password");

eyeicon.onclick = () => {
  if (pass.type == "password") {
    pass.type = "text";
    eyeicon.src = "eye-open.png";
  }
  else {
    pass.type = "password";
    eyeicon.src = "eye-close.png";
  }
}


// let loginButton = document.getElementById("loginButton"); // Ekledik

// loginButton.onclick = (event) => {
//   // Yönlendirme yapılacak sayfanın URL'sini buraya ekleyin
//   event.preventDefault();
//   window.location.href = "../../MainPage/index.html";
// };