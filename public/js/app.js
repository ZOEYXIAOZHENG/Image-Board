import * as Vue from "./vue.js";
import modal from "./modal.js";
import comment from "./comment.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            username: "",
            description: "",
            file: null,
        };
    },

    mounted: function () {
        console.log("vue app just mounted");
        fetch("/images.json")
            .then((images) => images.json())
            .then((images) => {
                this.images = images;
            });
    },
    methods: {
        // track ID of the selected image
        selectImage(imageId) {
            this.selectImage = imageId;
        },

        setFile(e) {
            this.file = e.target.files[0]; //file the user has specified in the form
        },

        upload() {
            const formData = new FormData();
            formData.append("file", this.file);
            formData.append("username", this.username);
            formData.append("title", this.title);
            formData.append("description", this.description);

            fetch("/upload", {
                method: "POST",
                body: formData,
            });
        },
    },

    components: {
        "image-modal": modal,
        "user-comment": comment,
    },

    
}).mount("#main");
