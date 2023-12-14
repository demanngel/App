const forms = document.getElementById('form');

form.addEventListener('submit', function (event) {
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
    console.log("invalid");
  }
});

const username=document.getElementById('username');
const uhint=document.getElementById('uhint');

const email=document.getElementById('email');
const ehint=document.getElementById('ehint');

const pswd=document.getElementById('pswd');
const phint=document.getElementById('phint');

const cnfpswd=document.getElementById('cnfpswd');
const cphint=document.getElementById('cphint');

username.addEventListener('click', ()=> {
  if(username.checkValidity) {
    uhint.style.display='block';
  }
});

document.addEventListener('click', ()=>{
  if(!username.checkValidity) {
    uhint.style.display='none';
  }
})
