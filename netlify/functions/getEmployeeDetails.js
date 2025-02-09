const employees = {
    "Megan O'Neill": { hourlyWage: 40, maritalStatus: "single", otherSalary: 36,000 },
    "Aimee O'Neill": { hourlyWage: 40, maritalStatus: "single", otherSalary: 0 },
    "Joeann Hussey": { hourlyWage: 40, maritalStatus: "single", otherSalary: 40,0000 },
    "Ruth Cahill": { hourlyWage: 40, maritalStatus: "married", otherSalary: 0 },
    "Ciara McKenna": { hourlyWage: 40, maritalStatus: "single", otherSalary: 0 },
};

exports.handler = async function(event) {
    try {
        const { name } = JSON.parse(event.body);
        const employeeData = employees[name];

        if (!employeeData) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Employee not found" })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(employeeData)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server error" })
        };
    }
};
