// Importing necessary dependencies

import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Default get route

app.get("/", (req, res) => {
    res.render("index.ejs");
})

const API_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

// When user clicks on the random button, the following post request is sent

app.post("/random", async (req, res) => {

    // Try-catch block for axios

    try {

        // Getting the total number of artworks in the MET museum

        const getTotal = await axios.get(API_URL + "/objects");
        const total = getTotal.data.total;

        // Generate random artwork ID

        const randomID = Math.floor(Math.random() * total);

        // Fetching the artwork given the randomID and creating a class for it with all the necessary attributes

        const result = await axios.get(API_URL + "/objects/" + randomID);
        const randomArtwork = result.data;
        const artwork = {
            "artID": randomArtwork.objectID,
            "artTitle": randomArtwork.title,
            "artImage": randomArtwork.primaryImage,
            "artPeriod": randomArtwork.period,
            "artArtistName": randomArtwork.artistDisplayName,
            "artArtistBio": randomArtwork.artistDisplayBio,
            "artDate": randomArtwork.objectDate,
            "artCity": randomArtwork.city,
            "artCountry": randomArtwork.country
        };

        console.log(artwork);
        res.render("index.ejs")

        // Error handling

    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
            error: error.message
        });
    }
})

// Starting the server

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});