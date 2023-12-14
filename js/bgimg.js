const element = document.querySelector("#accbtn");
const reg = document.getElementById('reg');

if(element) {
    element.addEventListener('click', () => {
        reg.style.display = 'block';
    });
}

reg.addEventListener('click', (e) => {
    if(reg.style.display=='block') {
        const withinBoundaries = e.composedPath().includes(document.getElementById('regform'));
    
        if ( !withinBoundaries ) {
            reg.style.display = 'none';
            document.getElementById('form').reset();
        }
    }
});