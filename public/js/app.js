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
        "my-component": {
            template: `
            <div>
                heading: THIS IS MY Component!
                <img>
                <h2>{{title}}<h2>
                <h4>{{username}}</h4>
                <p>{{description}}</p>
            </div>

            `,
        },
    },
    props: [`{{id}}`],
}).mount("#main");
