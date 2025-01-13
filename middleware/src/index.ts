import Express from "express";
import { myDB } from "./lmdb";
import { SETUP_KEY } from "./constants";
import { relationSetupConfig } from "./global_directory";
const app = Express();

app.get("/test", (req, res) => {
    res.send("Test");
})

app.listen(10_000, async() => {
    let hasSetup = myDB.get(SETUP_KEY);
    if (hasSetup !== "true") {
        // Setup global relations
        for (const [key, value] of Object.entries(relationSetupConfig)) {
            value();
        }

        await myDB.put(SETUP_KEY, "true");
    }
    console.log("Server listening on port 10000 ....");
})