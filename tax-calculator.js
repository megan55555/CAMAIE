async function calculatePayslip() {
    const name = document.getElementById("name").value.trim();
    const hoursWorked = parseFloat(document.getElementById("hoursWorked").value);

    if (!name || isNaN(hoursWorked) || hoursWorked <= 0) {
        alert("Please enter a valid name and hours worked.");
        return;
    }

    try {
        // Fetch stored employee data from AI backend
        const response = await fetch("/.netlify/functions/getEmployeeDetails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name })
        });

        const employeeData = await response.json();

        if (!employeeData || !employeeData.hourlyWage) {
            alert("Employee details not found.");
            return;
        }

        const { hourlyWage, maritalStatus, otherSalary } = employeeData;

        // Calculate Gross Salary
        const grossMonthlySalary = hourlyWage * hoursWorked;

        // Irish Tax System (2024)
        let incomeTax = 0;
        let usc = 0;
        let prsi = 0;

        const taxFreeAllowance = maritalStatus === "married" ? 50000 / 12 : 40000 / 12;
        const totalIncome = grossMonthlySalary + (otherSalary || 0);

        if (totalIncome <= taxFreeAllowance) {
            incomeTax = totalIncome * 0.20;
        } else {
            incomeTax = (taxFreeAllowance * 0.20) + ((totalIncome - taxFreeAllowance) * 0.40);
        }

        if (totalIncome > 12012 / 12) {
            usc = totalIncome * 0.045;
        }

        if (totalIncome > 352) {
            prsi = totalIncome * 0.04;
        }

        const totalDeductions = incomeTax + usc + prsi;
        const netSalary = grossMonthlySalary - totalDeductions;

        // Generate Payslip PDF
        generatePayslipPDF(name, hoursWorked, grossMonthlySalary, incomeTax, usc, prsi, netSalary);

    } catch (error) {
        console.error("Error fetching employee data:", error);
        alert("Error retrieving payroll details.");
    }
}

// Generate Payslip as PDF
function generatePayslipPDF(name, hours, gross, tax, usc, prsi, net) {
    const pdfContent = `
        Payslip for ${name}
        --------------------------------------
        Hours Worked: ${hours}
        Gross Monthly Salary: €${gross.toFixed(2)}
        Income Tax: €${tax.toFixed(2)}
        USC: €${usc.toFixed(2)}
        PRSI: €${prsi.toFixed(2)}
        --------------------------------------
        Net Monthly Salary: €${net.toFixed(2)}
    `;

    const blob = new Blob([pdfContent], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Payslip_${name}.pdf`;
    link.click();
}
