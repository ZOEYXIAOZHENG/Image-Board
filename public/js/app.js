import * as Vue from "./vue.js";
// Vue.createApp({}).mount('#main');

Vue.createApp({
    data() {
        return {
            images: [],
        };
    },
    mounted: function () {
        fetch("/images.json")
            .then((images) => images.json())
            .then((images) => {
                this.images = images.rows;
            });
    },
}).mount("#main");
