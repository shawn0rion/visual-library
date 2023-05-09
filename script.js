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

    dragTag(tag){
        tag.draggable = true;
        tag.addEventListener('drag', event => {
            if (event.clientX !== 0 && event.clientY !== 0){
                lastPosition.x = event.clientX;
                lastPosition.y = event.clientY;
            }
        })
        tag.addEventListener('dragend', event => {
            // use list of DOM image objects to check if tag is dropped in any img.
            imagesUI.images.forEach(image => {
                if(image.inDropZone()){
                    const imgObject = images.getImageByFile(image.img.src);
                    imgObject.addTag(event.target.value);
                    image.addTag(event.target.value);
                    console.log(imgObject.tags)
                } 
            })
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

class Image{
    constructor(file){
        this.img = file;
        this.tags = [];
    }
    addTag(tag){
        this.tags.push(tag);
    }
}

class Images{
    constructor(){
        this.images = [];
    }

    addImage(img){
        this.images.push(img);
    }
    // pass imageUI.img.src here, after drop
    // returned img can be used for add Tag function
    getImageByFile(file){
        return this.images.filter(image => image.img === file)[0];
    }

    // returns array of images, which can be displayed in the gallery
    getImagesByTag(tag){
        return this.images.filter(image => image.tags.includes(tag));
    }
}

class ImageUI{
    constructor(){
        this.wrapper = document.createElement('div');
        this.img = document.createElement('img');
        this.tags = document.createElement('ul');
    }
    createImage(file){
        this.img.src = file;
        this.tags.classList.add('tags');
        this.wrapper.appendChild(this.img);
        this.wrapper.appendChild(this.tags);
        imagesUI.container.appendChild(this.wrapper);
        console.log(this.wrapper);
        console.log(imagesUI.container);
    }

    addTag(tag){
        const tagItem = document.createElement('li');
        tagItem.textContent = tag;
        this.tags.appendChild(tagItem);
    }

    inDropZone(){
        const bounds = this.wrapper.getBoundingClientRect();
        if (lastPosition.x <= bounds.right &&
            lastPosition.x >= bounds.left &&
            lastPosition.y <= bounds.bottom &&
            lastPosition.y >= bounds.top){
            return true;
        }
        return false;
    }
}

class ImagesUI{
    constructor(){
        this.container = document.querySelector('.gallery')
        this.images = [];
    }

    addImage(image){
        this.images.push(image);
    }
}


const tags = new Tags();
const tagsUI = new TagsUI();
const images = new Images();
const imagesUI = new ImagesUI();

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
            const img = new Image(e.target.result); 
            const imgWrapper = new ImageUI();
            imgWrapper.createImage(e.target.result);
            images.addImage(img);
            imagesUI.addImage(imgWrapper);

        }
        // read file
        reader.readAsDataURL(file);
    }
}