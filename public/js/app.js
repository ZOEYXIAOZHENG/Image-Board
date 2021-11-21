import * as Vue from "./vue.js";
import modal from "../components/modal.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            username: "",
            description: "",
            file: null,
            id: null,
            moreImages: undefined,
            selectedImageId: location.pathname.slice(1),
            open: location.pathname.slice(1),
        };
    },

    components: {
        "image-modal": modal,
    },

    mounted: function () {
        // "mounted" is rendering a initial page here
        console.log("Vue app mounted");
        window.addEventListener("popstate", (e) => {
            console.log(location.pathname, e.state);
            this.selectedImageId = location.pathname.slice(1);
        });
        fetch("/images.json")
            .then((images) => images.json())
            .then((images) => {
                this.images = images.rows;
                this.checkLoadMoreButton(images);
            });
    },

    updated: function () {
        console.log("Vue updated!!!");
    },

    methods: {
        // track ID of the selected image
        selectedImage(imageId) {
            console.log(imageId);
            this.selectedImage = selectedImageId;
        },

        setFile(e) {
            this.file = e.target.files[0];
            console.log("this.file:", this.file);
        },

        upload() {
            const formData = new FormData();
            formData.append("file", this.file);
            formData.append("id", this.id);
            formData.append("username", this.username);
            formData.append("title", this.title);
            formData.append("description", this.description);

            fetch("/upload", {
                method: "POST",
                body: formData,
            })
                .then((image) => image.json())
                .then((image) => {
                    this.images.unshift(image); //to put the lastest uploaded img at the beginning.
                });
        },

        click(selectedImageId) {
            console.log("click");
            this.selectedImageId = selectedImageId;
            history.pushState({}, "", `/${this.selectedImageId}`);
            document.querySelector(".container").classList.add("blur");
            document.querySelector("#title-bar").classList.add("blur");
            document.querySelector("#file-upload").classList.add("blur");
            document
                .querySelectorAll(".text")
                .forEach((q) => q.classList.add("blur"));
            document.querySelector("body").classList.add("disable-scroll");
        },
        closeModal() {
            this.selectedImageId = null;
            document.querySelector(".container").classList.remove("blur");
            document.querySelector("#title-bar").classList.remove("blur");
            document.querySelector("#file-upload").classList.remove("blur");
            document
                .querySelectorAll(".text")
                .forEach((q) => q.classList.remove("blur"));
            document.querySelector("body").classList.remove("disable-scroll");
        },
        loadMore() {
            let smallestImageId = this.images[this.images.length - 1].id;
            fetch(`/more-images/${smallestImageId}`)
                .then((images) => images.json())
                .then((images) => {
                    images.rows.forEach((image) => this.images.push(image));
                    // check whether there are more images to show
                    this.checkLoadMoreButton(images);
                });
        },

        checkLoadMoreButton(images) {
            this.moreImages =
                this.images[this.images.length - 1].id !==
                images.rows[0].lowestId;
        },
        showNext(nextId) {
            // set the selectedImageId to nextId
            this.selectedImageId = nextId;
            console.log(this.selectedImageId);
        },
        showPrev(prevId) {
            this.selectedImageId = prevId;
            console.log(this.selectedImageId);
        },
    },
}).mount("#main");
