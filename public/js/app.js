import * as Vue from "./vue.js";

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
        setFile(e) {
            this.file = e.target.files[0];
        },
        upload() {
            const formData = new FormData();
            formData.append("file", this.file);
            formData.append("title", this.title);
            formData.append("description", this.description);
            fetch("/upload", {
                method: "POST",
                body: FormData,
            });
        },
    },
}).mount("#main");
