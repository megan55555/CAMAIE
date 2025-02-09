const formidable = require("formidable-serverless");
const fs = require("fs");

exports.handler = async (event) => {
    const form = new formidable.IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(event, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing files:", err);
                return resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: "File parsing error." }),
                });
            }

            try {
                const rulesFile = files.rulesFile ? fs.readFileSync(files.rulesFile.path, "utf-8") : "";
                const teamFile = files.teamFile ? fs.readFileSync(files.teamFile.path, "utf-8") : "";
                const subsFile = files.subsFile ? fs.readFileSync(files.subsFile.path, "utf-8") : "";

                // Example Logic: Filter subs based on team and rules
                const rules = rulesFile.split("\n").map(line => line.toLowerCase());
                const team = teamFile.split("\n").map(line => line.toLowerCase());
                const subs = subsFile.split("\n").map(line => line.toLowerCase());

                const suitableSubs = subs.filter(sub => {
                    return rules.every(rule => sub.includes(rule)) && !team.includes(sub);
                });

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({ suitableSubs }),
                });
            } catch (error) {
                console.error("Error processing files:", error);
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: "Error processing files." }),
                });
            }
        });
    });
};
