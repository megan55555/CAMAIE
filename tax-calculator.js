async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form refresh

    const name = document.getElementById("name").value.trim();
    const hoursWorked = parseFloat(document.getElementById("hoursWorked").value);

    if (!name || isNaN(hoursWorked) || hoursWorked <= 0) {
        alert("❌ Please enter a valid name and hours worked.");
        return;
    }

    document.getElementById("result").innerHTML = "Generating payslip...";

    try {
        // Send data to the backend function
        const response = await fetch("/.netlify/functions/getEmployeeDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, hoursWorked }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const payslipData = await response.json();

        // Display the payslip
        displayPayslip(payslipData);
    } catch (error) {
        console.error("Error generating payslip:", error);
        alert("❌ Failed to generate payslip. Please try again.");
    }
}

function displayPayslip(data) {
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h4>Payslip for ${data.name}</h4>
        <p><strong>Gross Salary:</strong> €${data.grossSalary.toFixed(2)}</p>
        <p><strong>Income Tax:</strong> €${data.incomeTax.toFixed(2)}</p>
        <p><strong>USC:</strong> €${data.usc.toFixed(2)}</p>
        <p><strong>PRSI:</strong> €${data.prsi.toFixed(2)}</p>
        <p><strong>Net Salary:</strong> €${data.netSalary.toFixed(2)}</p>
    `;
}
