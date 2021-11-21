import comment from "./comment.js";

export default {
    data() {
        return {
            title: "",
            username: "",
            url: "",
            description: "",
            created_at: "",
            show: false,
            prevId: null,
            nextId: null,
        };
    },

    props: ["selectedImageId"],

    components: {
        "user-comments": comment,
    },

    mounted() {
        console.log("💛MOUNTED:", this.selectedImageId);
        this.getImageById(this.selectedImageId);
    },

    watch: {
        selectedImageId(id) {
            this.getImageById(id);
        },
    },

    methods: {
        getImageById(id) {
            fetch(`/image/${id}`)
                .then((res) => {
                    if (res.status === 500) {
                        return null;
                    }
                    return res.json();
                })
                .then((image) => {
                    if (image === null || image.rows.length === 0) {
                        this.$emit("close");
                        return history.replaceState({}, "", "/");
                    }
                    this.url = image.rows[0].url;
                    this.title = image.rows[0].title;
                    this.description = image.rows[0].description;
                    this.username = image.rows[0].username;
                    this.date = image.rows[0].publDate;
                    this.prevId = image.rows[0].prevId;
                    this.nextId = image.rows[0].nextId;

                    this.show = true;

                    console.log(this.prevId, this.selectedImageId, this.nextId);
                });
        },

        closemodal() {
            this.$emit("close");
            history.pushState({}, "", "/");
        },

        showPrev() {
            this.$emit("prev", this.prevId);
        },

        showNext() {
            this.$emit("next", this.nextId);
        },
    },

    template: `
            <div v-if="show" class="modal">
                <img :src="url">
                <div @click="closemodal" class="close"></div>
                <div id="info-box">
                <h2>{{title}}</h2>
                <h3>{{username}}</h3>
                <h3>{{description}}</h3>
                <user-comments :selected-image-id="selectedImageId"></user-comments>
                </div>
                <div class='next-button' :style="{visibility: nextId != null ? 'visible' : 'hidden'}" @click="showNext"></div>
                <div class='prev-button' :style="{visibility: prevId != null ? 'visible' : 'hidden'}" @click="showPrev"></div>
            </div>
            `,

    // When the click event happens, this.$emit should be called to signal to the parent it is time to close the modal
};
