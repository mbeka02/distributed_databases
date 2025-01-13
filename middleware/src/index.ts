import Express from "express";
const app = Express();

app.get("/test", (req, res) => {
    res.send("Test");
})

app.listen(10_000, () => {
    console.log("Server listening on port 10000 ....");
})