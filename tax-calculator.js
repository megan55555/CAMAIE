<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Generate your monthly payslip with our AI-Powered Tax Calculator.">
    <title>AI-Powered Tax Calculator - Payslip Generator</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>AI-Powered Tax Calculator</h1>
            <p class="subtitle">Your smart solution for accurate payslip generation.</p>
        </div>
    </header>

    <main class="main-content">
        <div class="container">
            <section class="calculator-intro">
                <h2>Generate Your Monthly Payslip</h2>
                <p>Enter your details below to calculate your monthly tax and generate your payslip instantly.</p>
            </section>

            <section class="calculator-form">
                <form id="payslipForm" onsubmit="handleFormSubmit(event)">
                    <div class="form-group">
                        <label for="name">Employee Name:</label>
                        <input type="text" id="name" name="name" placeholder="Enter your full name" required>
                    </div>

                    <div class="form-group">
                        <label for="hoursWorked">Hours Worked (This Month):</label>
                        <input type="number" id="hoursWorked" name="hoursWorked" placeholder="Enter hours worked" required>
                    </div>

                    <div class="form-group">
                        <button type="submit" class="btn-generate">Generate Payslip</button>
                    </div>
                </form>
            </section>

            <section class="calculator-result">
                <h3>Your Payslip Details</h3>
                <div id="result" class="result-output"></div>
            </section>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 CAMAIE. All rights reserved.</p>
        </div>
    </footer>

    <script src="tax-calculator.js"></script>
</body>
</html>
