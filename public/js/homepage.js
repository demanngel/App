const element = document.querySelector("#accbtn");
const reg = document.getElementById('reg');
const loginform = document.getElementById('loginform');
const regform = document.getElementById('regform');
const regbtn = document.getElementById('regbtn');

if(element) {
    element.addEventListener('click', () => {
        reg.style.display = 'block';
    });
}

reg.addEventListener('click', (e) => {
    if(reg.style.display=='block') {
        const withinBoundaries = e.composedPath().includes(document.getElementById('form'));
    
        if ( !withinBoundaries ) {
            reg.style.display = 'none';
            regform.reset();
            loginform.reset();
            regform.style.display='none';
            loginform.style.display='block';
        }
    }
});

regbtn.addEventListener('click', ()=> {
    loginform.style.display='none';
    regform.style.display='block';
})

regform.addEventListener('submit', function (event) {
    if (!regform.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      console.log("invalid");
    }
});

loginform.addEventListener('submit', function (event) {
    if (!loginform.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      console.log("invalid");
    }
});