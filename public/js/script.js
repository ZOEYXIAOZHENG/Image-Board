(function () {
    window.onload = function () {
        var input = document.getElementById("file");

        // var label = input.nextElementSibling;
        // var labelVal = label.innerHTML;

        input.addEventListener("change", function (e) {
            var fileName = "";
            // extract the name of the file outside of the browsers fakepath
            fileName = e.target.value.split("\\").pop();
            if (fileName) {
                // document.querySelector("span").innerHTML = fileName;
            }
            // else {
            //     label.innerHTML = labelVal;
            // }
        });
    };
})();
