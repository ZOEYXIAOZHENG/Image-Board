export default {
    // a data function that returns an object with properties for all the image details that are show
    data() {
        return {
            heading: "modal",
            imageUrl: null,
            title: "",
            username: "",
            description: "",
        };
    },

    // a props array containing a string for the image id it will be passed
    props: ["ImageId"],

    // a mounted function that fetches the image info for the image whose id was passed as a prop. Upon receiving the info, the data properties should be set
    mounted() {
        console.log("💛MOUNTED:", this.ImageId);
        fetch(`/images/${this.ImageId}`)
            .then((data) => data.json())
            .then((data) => {
                console.log("images from server:", data);
            });
    },

    template: `
            <div class="modal">
                <div>{{heading}}</div>
                <img:src="imageUrl">
                <h2>{{title}}<h2>
                <h4>{{username}}</h4>
                <p>{{description}}</p>
            </div>

            `,

    // When the click event happens, this.$emit should be called to signal to the parent it is time to close the modal
    methods: {
        closemodal: function () {
            this.$emit("closemodal", {});
        },
    },
};
