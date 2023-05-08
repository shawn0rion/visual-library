// cursor's position in the window
const lastPosition = {x: 0, y: 0};

class Tags{
    constructor(){
        this.list = [];
    }

    newTag(title){
        // event which handles duplicate tags
        if (this.list.includes(title)){
            alert('This tag already exists');
            tagsUI.list.removeChild(tagsUI.list.lastChild);
            return;
        }
        this.list.push(title);
    }

    removeTag(title){
        const idx = this.list.indexOf(title);
        this.list = this.list.slice(0,idx).concat(this.list.slice(idx + 1));
    }
    
}

class TagsUI{
    constructor(){
        this.list = document.querySelector('.tags');
        this.btn = document.querySelector('.new-tag');
        this.btn.addEventListener('click', () => this.renderTag());
    }

    dragTag(element){
        element.draggable = true;
        element.addEventListener('drag', event => {
            if (event.clientX !== 0 && event.clientY !== 0){
                lastPosition.x = event.clientX;
                lastPosition.y = event.clientY;
            }
        })
    }

    renderTag(){
        const tagWrapper = document.createElement('div');
        tagWrapper.classList.add('tag-wrapper');
        const tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.value = 'New Tag'
        tagInput.classList.add('tag');        
        tagWrapper.appendChild(tagInput);
        this.list.appendChild(tagWrapper);
        // enter a new tag's text
        tagInput.focus();
        // add the new tag 
        tagInput.addEventListener('blur', function renderNewTag(event) {
            tags.newTag(event.target.value);
            // prevent new tag on blur
            event.target.removeEventListener('blur', renderNewTag);
            // prevent focus on click
            event.target.addEventListener('click', event => {
                event.target.blur();
            })
            // drag the tag on mousedown
            event.target.style.cursor = 'grab';
            event.target.addEventListener('mousedown', event => {
                if (!event.target.draggable){
                    tagsUI.dragTag(event.target);
                }
            })
        });
    } 
}   

const tags = new Tags();
const tagsUI = new TagsUI();

const fileInput = document.querySelector('#file-input');
const uploadBtn = document.querySelector('.new-image');
uploadBtn.addEventListener('click', () => {
    fileInput.click();
})
fileInput.addEventListener('change', event => readFile(event));


function readFile(event){
    const file = event.target.files[0];
    if (file){
        const reader = new FileReader();
        // event triggers after file is read
        reader.onload = function (e) {
            // render Image
        }
        // read file
        reader.readAsDataURL(file);
    }
}