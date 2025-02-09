

const fetch = require("node-fetch"); // Ensure node-fetch v2 is used

exports.handler = async (event) => {
    try {
        const { name, hoursWorked } = JSON.parse(event.body);
        console.log("📩 Received request for:", name, "with hours worked:", hoursWorked);

        // ✅ Ensure Mistral API Key is available (Same as Encore chatbot)
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error("Missing Mistral API Key in environment variables.");
        }

        // Hardcoded employee data (as in previous versions)
       const employees = {
    "Megan O'Neill": { hourlyWage: 40, maritalStatus: "single", otherSalary: 36000 },
    "Aimee O'Neill": { hourlyWage: 40, maritalStatus: "single", otherSalary: 0 },
    "Joeann Hussey": { hourlyWage: 40, maritalStatus: "single", otherSalary: 40000 },
    "Ruth Cahill": { hourlyWage: 40, maritalStatus: "married", otherSalary: 0 },
    "Ciara McKenna": { hourlyWage: 40, maritalStatus: "single", otherSalary: 0 },
};

        // Check if employee exists
        const employee = employees[name];
        if (!employee) {
            console.error("🚨 Employee not found:", name);
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Employee not found" }),
            };
        }

        const grossSalary = employee.hourlyWage * hoursWorked;
        console.log("📊 Calculating salary:", grossSalary);

        // ✅ Format the prompt exactly like a chatbot request
        const prompt = `You are an AI trained in Irish tax rules.
        Given:
        - Gross salary: €${grossSalary}
        - Marital status: ${employee.maritalStatus}
        - Other income: €${employee.otherSalary}

        Calculate the following:
        - Income Tax
        - USC
        - PRSI
        - Net Salary

        Provide the response in a structured JSON format.`;

        console.log("📡 Sending request to Mistral...");

        // ✅ Make the request exactly as done in Encore chatbot
        const aiResponse = await fetch("https://api.mistral.ai/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`, // ✅ Using Netlify-stored key
            },
            body: JSON.stringify({
                model: "mistral-medium", // ✅ Ensure this matches your other bots
                prompt: prompt,
                max_tokens: 300,
            }),
        });

        if (!aiResponse.ok) {
            throw new Error(`Mistral API error: ${aiResponse.status}`);
        }

        const aiText = await aiResponse.text(); // ✅ Capture full response before parsing
        console.log("📩 Mistral API Raw Response:", aiText);

        return {
            statusCode: 200,
            body: aiText, // ✅ Return raw Mistral response directly
        };
    } catch (error) {
        console.error("🚨 Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error", details: error.message }),
        };
    }
};
