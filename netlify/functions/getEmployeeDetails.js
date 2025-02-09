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
        const { name, hoursWorked } = JSON.parse(event.body);

        // Get employee details
        const employee = employees[name];
        if (!employee) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Employee not found" }),
            };
        }

        const grossSalary = employee.hourlyWage * hoursWorked;

        // 🛠️ Use the same endpoint as your other bots
        const aiResponse = await fetch("https://api.mistral.ai/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MISTRAL_API_KEY}`, // ✅ Using Netlify stored API key
            },
            body: JSON.stringify({
                model: "mistral-medium",  // Change to match the model used in your other bots
                prompt: `You are an Irish tax calculator. Given:
                - Gross salary: €${grossSalary}
                - Marital status: ${employee.maritalStatus}
                - Other income: €${employee.otherSalary}

                Calculate the net salary after applying Irish tax rules. Provide a breakdown of:
                - Income Tax
                - USC
                - PRSI
                - Net Salary`,
                max_tokens: 250,
            }),
        });

        if (!aiResponse.ok) {
            throw new Error(`Mistral API error: ${aiResponse.status}`);
        }

        const aiText = await aiResponse.text();
        console.log("Mistral API Response:", aiText); // Debugging line

        return {
            statusCode: 200,
            body: aiText, // Directly return Mistral's response
        };
    } catch (error) {
        console.error("Error:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error", details: error.message }),
        };
    }
};
