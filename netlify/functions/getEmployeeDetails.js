const fetch = require("node-fetch");

const employees = {
    "Megan O'Neill": { hourlyWage: 40, maritalStatus: "single", otherSalary: 36000 },
    "Aimee O'Neill": { hourlyWage: 40, maritalStatus: "single", otherSalary: 0 },
    "Joeann Hussey": { hourlyWage: 40, maritalStatus: "single", otherSalary: 40000 },
    "Ruth Cahill": { hourlyWage: 40, maritalStatus: "married", otherSalary: 0 },
    "Ciara McKenna": { hourlyWage: 40, maritalStatus: "single", otherSalary: 0 },
};

exports.handler = async function (event) {
    try {
        // Retrieve the Mistral API key from environment variables
        const mistralApiKey = process.env.MISTRAL_API_KEY;
        if (!mistralApiKey) {
            throw new Error("Mistral API key is not set in environment variables.");
        }

        const { name, hoursWorked } = JSON.parse(event.body);

        // Fetch employee details
        const employee = employees[name];
        if (!employee) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Employee not found" }),
            };
        }

        const grossSalary = employee.hourlyWage * hoursWorked;

        // Send data to the Mistral API for tax calculations
        const aiResponse = await fetch("https://api.mistral.ai/v1/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${mistralApiKey}`,
            },
            body: JSON.stringify({
                grossSalary,
                maritalStatus: employee.maritalStatus,
                otherSalary: employee.otherSalary,
                country: "Ireland",
            }),
        });

        if (!aiResponse.ok) {
            throw new Error(`Mistral API error: ${aiResponse.status}`);
        }

        const taxData = await aiResponse.json();

        return {
            statusCode: 200,
            body: JSON.stringify({
                name,
                grossSalary,
                ...taxData,
            }),
        };
    } catch (error) {
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error", details: error.message }),
        };
    }
};

