function onChange(n) {
    const el = document.getElementById(n);
    
    if(n == 'confirmpassword') {
        if(el.value !== document.getElementById('password').value) {
            el.setCustomValidity("invalid");
        }
        else el.setCustomValidity("");
    } 
  
    if(!el.checkValidity()) {
        el.style.backgroundColor = '#b36a6f';
    } else {
        el.style.backgroundColor = '#D9D9D9';
    }
    
}