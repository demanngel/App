const element = document.querySelector("#accbtn");
const side_bar = document.getElementById('side_bar');

if(element) {
    element.addEventListener('click', () => {
        side_bar.style.display = 'block';
    });
}

side_bar.addEventListener('click', (e) => {
    if(side_bar.style.display=='block') {
        const withinBoundaries = e.composedPath().includes(document.getElementById('bar'));
    
        if ( !withinBoundaries ) {
            side_bar.style.display = 'none';
        }
    }
});
