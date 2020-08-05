<template>
    <div class="file-drag-drop">
        <form ref="fileform">
            <svg class="box-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43"><path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path></svg>
            <span class="drop-files" v-on:click="addFiles()">Drop the files here!</span>
            <input class="drop-input" type="file" id="files" ref="files" accept="image/*" multiple v-on:change="handleFilesUpload()"/>
        </form>
        <div  v-for="(file, key) in files" :key="key" class="file-listing">
            <img @click="open" class="preview" v-bind:ref="'preview'+parseInt(key)"/>
            {{ file.name }}
            <div class="remove-container">
                <a class="remove" v-on:click="removeImage(key)">Remove</a>
            </div>
        </div>
        <a class="submit-button" v-on:click="submitFiles()" v-show="files.length > 0">Submit</a>
        <croppa v-model="myCroppa">
        </croppa > 
        <PopUp v-if="popUpOpened" />
    </div>
</template>

<script>
import PopUp from './PopUp.vue';

    export default {
        components:{
            PopUp,
        },
        name: 'DrugDrop',  
        data(){
            return{
                dragAndDropCapable: false,
                files: [],
                popUpOpened: false,
                myCroppa: {}
            }
        },
        computed: {
            
        },
        methods: {
            open(){
                this.popUpOpened = true;
            },
            handleFilesUpload () {
                /*let uploadedFiles = this.$refs.files.files
                for (let i = 0; i < uploadedFiles.length; i++) {
                    let reader = new FileReader()
                    reader.onload = function () {
                        this.files.push({image: reader.result, file: reader.fileName})
                    }
                reader.fileName = uploadedFiles[i].name
                reader.readAsDataURL(uploadedFiles[i])
                this.getImagePreviews();
                }*/
                let uploadedFiles = this.$refs.files.files
                for (var i = 0; i < uploadedFiles.length; i++) {
                    this.files.push(uploadedFiles[i])
                }
                this.getImagePreviews()

            },
            addFiles(){
                console.log(this.files[0])
                this.$refs.files.click();
            },
            removeImage(key){
                console.log(key);
                console.log(this.files[key]);
                this.files.splice(key, 1);
                this.getImagePreviews();
            },
            determineDragAndDropCapable(){
                const div = document.createElement('div');
                return (('draggle' in div)
                || ('ondragstart' in div && 'ondrop' in div))
                && 'FormData' in window
                && 'FileReader' in window;
            },
            getImagePreviews(){
                for( let i = 0; i < this.files.length; i++ ){
                    if ( /\.(jpe?g|png|gif)$/i.test( this.files[i].name ) ) {
                        let reader = new FileReader();
                        reader.addEventListener("load", function(){
                            this.$refs['preview'+parseInt( i )][0].src = reader.result;
                        }.bind(this), false);
                        reader.readAsDataURL( this.files[i] );
                    } else {
                        this.$nextTick(function(){
                        this.$refs['preview' + parseInt( i )][0].src = '/images/file.png';
                        });
                    }
                }
            },
            /*submitFiles(){
                let formData = new FormData();
                for( var i = 0; i < this.files.length; i++ ){
                    let file = this.files[i];
                    formData.append('files[' + i + ']', file);
                }
                axios.post( '/file-drag-drop',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                ).then(function(){
                    console.log('SUCCESS!!');
                })
                .catch(function(){
                    console.log('FAILURE!!');
                });
            },*/
        },
        mounted(){
            this.dragAndDropCapable = this.determineDragAndDropCapable();
            if (this.dragAndDropCapable){
                ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {
                    this.$refs.fileform.addEventListener(evt, function(e){
                        e.preventDefault();
                        e.stopPropagation();
                    }.bind(this), false);
                }.bind(this));

                this.$refs.fileform.addEventListener('drop', function(e){
                    for( let i = 0; i < e.dataTransfer.files.length; i++ ){
                        this.files.push( e.dataTransfer.files[i] );
                        this.getImagePreviews();
                    }
                }.bind(this))
            }
        },
    }    
</script>

<style>
    form{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 400px;
        width: 600px;
        background: #c8dadf;
        margin: auto;
        margin-top: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 4px;

        font-size: 1.25rem;
        font-weight: 600;
        color: #0f3c4b; 

        outline: 2px dashed #92b0b3;
        outline-offset: -10px;
    }
    .drop-input{
        display: none;
    }
    .drop-files{
        width: max-content;
        margin: 0 auto;
    }
    .drop-files:hover{
        color: #39bfd3;
        cursor: pointer;
    }
    .box-icon {
        width: 100%;
        height: 80px;
        fill: #92b0b3;
        display: block;
        margin-bottom: 40px;
    }
    div.file-listing{
        width: 400px;
        margin: auto;
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }
    div.file-listing img{
        height: 100px;
    }
    div.remove-container{
        text-align: center;
    }
    div.remove-container a{
        color: red;
        cursor: pointer;
    }
    a.submit-button{
        display: block;
        margin: auto;
        text-align: center;
        width: 200px;
        padding: 10px;
        text-transform: uppercase;
        background-color: #CCC;
        color: white;
        font-weight: bold;
        margin-top: 20px;
    }
</style>
