document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired");

    const toggleButton = document.getElementById("toggleButton");
    toggleButton.style.display = "inline-block"; 
    console.log("Toggle button:", toggleButton); 
    const gridContainer = document.getElementById("gridContainer");
    const collageContainer = document.getElementById("collageContainer");
    const infoContainer = document.getElementById("infoContainer");
    let data; 


function toggleGrid() {
    console.log("Toggle grid function called");
    console.log("Grid container style before toggling:", gridContainer.style.display);
    console.log("Collage container style before toggling:", collageContainer.style.display);
    console.log("Toggle button text content before toggling:", toggleButton.textContent);
    if (gridContainer.style.display === "none") {
        console.log("Grid container is currently hidden. Showing grid.");
        gridContainer.style.display = "grid";
        toggleButton.textContent = "Hide Grid";
        collageContainer.style.display = "none"; 
    } else {
        console.log("Grid container is currently visible. Hiding grid.");
        gridContainer.style.display = "none";
        toggleButton.textContent = "Show Grid";
        collageContainer.style.display = "block";
        infoContainer.style.display = "none"; 
    }
    console.log("Grid container style after toggling:", gridContainer.style.display);
    console.log("Collage container style after toggling:", collageContainer.style.display);
    console.log("Toggle button text content after toggling:", toggleButton.textContent);
}

function positionCollageItems() {
    console.log("Positioning collage items based on viewport size");
    const isMobile = window.innerWidth <= 768; 
    const collageItems = document.querySelectorAll(".collage-item");

    collageItems.forEach(collageItem => {
        const itemData = collageItem.dataset;
        const position = isMobile ? itemData.positionCollageImagesMobile : itemData.positionCollageImagesDesktop;
        const size = isMobile ? itemData.collageImageSize.mobile : itemData.collageImageSize.desktop;
        if (position) {
            collageItem.style.left = position.x + "px";
            collageItem.style.top = position.y + "px";
        }
        if (size && isMobile) { 
            collageItem.querySelector("img").style.width = size.width + "px";
            collageItem.querySelector("img").style.height = size.height + "px";
        }
    });
}

    console.log("Hiding collage container initially");
    collageContainer.style.display = "none";

    function filterBy(property, value) {
        console.log("Filtering by", property, "with value", value);
        const gridItems = document.querySelectorAll(".grid-item-container");
        const collageItems = document.querySelectorAll(".collage-item");

        let isFiltered = false;

        gridItems.forEach(gridItem => {
            if (gridItem.style.display === "none") {
                isFiltered = true;
            }
        });

        collageItems.forEach(collageItem => {
            if (collageItem.style.display === "none") {
                isFiltered = true;
            }
        });

        if (isFiltered) {
            gridItems.forEach(gridItem => {
                gridItem.style.display = "block";
            });
            collageItems.forEach(collageItem => {
                collageItem.style.display = "block";
            });
            return;
        }

        gridItems.forEach(gridItem => {
            const itemValue = gridItem.querySelector("img").dataset[property];
            if (itemValue !== value) {
                gridItem.style.display = "none"; 
            }
        });

        collageItems.forEach(collageItem => {
            const itemValue = collageItem.querySelector("img").dataset[property];
            if (itemValue !== value) {
                collageItem.style.display = "none";
            }
        });
    }

    function createFilterButtons(property) {
        console.log("Creating filter buttons for", property);
        const values = new Set(data.map(item => item[property]));
        const buttonContainer = document.querySelector(".button-container");

        buttonContainer.innerHTML = '';

        values.forEach(value => {
            const button = document.createElement("button");
            button.textContent = `${property}: ${value}`;
            button.addEventListener("click", () => filterBy(property, value));
            buttonContainer.appendChild(button); 
        });
    }

    function positionElement(element, reference) {
        console.log("Positioning element relative to the viewport");
        const rect = reference.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const offsetTop = rect.top + scrollTop;
        const offsetLeft = rect.left + scrollLeft;
        element.style.left = `${offsetLeft}px`;
        element.style.top = `${offsetTop}px`;
    }

    function positionCollageItems() {
        console.log("Positioning collage items based on viewport size");
        const isMobile = window.innerWidth <= 768;
        const collageItems = document.querySelectorAll(".collage-item");

        collageItems.forEach(collageItem => {
            const itemData = collageItem.dataset;
            const position = isMobile ? itemData.positionCollageImagesMobile : itemData.positionCollageImagesDesktop;
            if (position) {
                collageItem.style.left = position.x + "px";
                collageItem.style.top = position.y + "px";
            }
        });
    }

    function showInfoContainer(image) {
        console.log("Showing info container for image");
        const name = image.dataset.name;
        const time = image.dataset.time;
        const type = image.dataset.type;
        const func = image.dataset.function;

        infoContainer.innerHTML = `<h3>${name}</h3><p>Time: ${time}</p><p>Type: ${type}</p><p>Function: ${func}</p>`;

        const imageWidth = image.offsetWidth;
        const imageHeight = image.offsetHeight;
        infoContainer.style.width = `${imageWidth}px`;
        infoContainer.style.height = `${imageHeight}px`;

        positionElement(infoContainer, image);

        infoContainer.style.display = "block";
    }

    toggleButton.addEventListener("click", toggleGrid);

    console.log("Fetching and processing data");
    fetch("data.json")
        .then(response => response.json())
        .then(jsonData => {
            console.log("Data fetched:", jsonData);
            data = jsonData;

            jsonData.forEach(item => {
                const gridItemContainer = document.createElement("div");
                gridItemContainer.classList.add("grid-item-container");

                const gridItem = document.createElement("div");
                gridItem.classList.add("grid-item");

                const image = document.createElement("img");
                image.src = item.imageUrl;
                image.alt = item.name;

                for (const key in item) {
                    if (key !== "imageUrl" && key !== "collageImageUrl" && key !== "position") {
                        image.dataset[key] = item[key];
                    }
                }

                gridItem.appendChild(image);
                gridItemContainer.appendChild(gridItem);
                gridContainer.appendChild(gridItemContainer);

                gridItem.addEventListener("mouseover", function (event) {
                    console.log("Mouse over grid item");
                    const image = event.target.closest("img");
                    if (image) {
                        showInfoContainer(image);
                    }
                });

                gridItem.addEventListener("mouseout", function () {
                    console.log("Mouse out of grid item");
                    infoContainer.style.display = "none";
                });

                const collageItem = document.createElement("div");
                collageItem.classList.add("collage-item");

                const collageImage = document.createElement("img");
                collageImage.src = item.collageImageUrl;
                collageImage.alt = item.name;

                collageImage.style.width = item.collageImageSize.width + "px";
                collageImage.style.height = item.collageImageSize.height + "px";

                for (const key in item) {
                    if (key !== "imageUrl" && key !== "collageImageUrl" && key !== "collageImageSize" && key !== "position") {
                        collageImage.dataset[key] = item[key];
                    }
                }

                collageItem.appendChild(collageImage);
                collageContainer.appendChild(collageItem);
            });

            console.log("Positioning collage items initially");
            positionCollageItems();
            window.addEventListener("resize", positionCollageItems);

            console.log("Creating filter buttons for types and functions");
            createFilterButtons("type");
            createFilterButtons("function");
        })
        .catch(error => console.error("Error fetching data:", error));
});
