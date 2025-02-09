const employees = {
    "Megan O'Neill": { hourlyWage: 40, maritalStatus: "single", otherSalary: 36000 },
    "Aimee O'Neill": { hourlyWage: 40, maritalStatus: "single", otherSalary: 0 },
    "Joeann Hussey": { hourlyWage: 40, maritalStatus: "single", otherSalary: 40000 },
    "Ruth Cahill": { hourlyWage: 40, maritalStatus: "married", otherSalary: 0 },
    "Ciara McKenna": { hourlyWage: 40, maritalStatus: "single", otherSalary: 0 },
};

exports.handler = async function (event) {
    try {
        // Ensure the request method is POST
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method Not Allowed" }),
            };
        }

        // Ensure the request body exists
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing request body" }),
            };
        }

        // Parse the request body
        const { name } = JSON.parse(event.body);

        if (!name) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing 'name' in request body" }),
            };
        }

        // Check if the employee exists
        const employee = employees[name];
        if (!employee) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Employee not found" }),
            };
        }

        // Return the employee data
        return {
            statusCode: 200,
            body: JSON.stringify(employee),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error", details: error.message }),
        };
    }
};
