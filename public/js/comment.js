export default {

    data() {
        return {
            heading: "user-comment",
            comments: [],
            username: "",
            comment: "",
        };
    },

    props: ["ImageId"],

    mounted: function () {
        console.log("comment mounted successfully!!!!!");
        // makes a **GET** request to retrieve all comments made about the image currently shown in the modal!
        app.fetch("/comments.json" + this.id).then(function (res) {
            method: "GET", (this.comments = res.data);
        });
    },

    methods: {
    fetch ("/comment.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: { comment, username, image_id },
    })
},
  

    template: `<div class="user-comment">
        <input type="text" placehoder="your comment">
        <input type="test" placehoder="username">
        <button>submit</button>
        </div>`,  
    
};



      
        

    