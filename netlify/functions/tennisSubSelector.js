const formidable = require('formidable'); // Use formidable instead of formidable-serverless

exports.handler = async (event) => {
    try {
        const form = new formidable.IncomingForm();

        // Parse the uploaded file
        const parsed = await new Promise((resolve, reject) => {
            form.parse(event, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        // Example logic with parsed data
        const { files } = parsed;
        if (!files || !files.uploadedFile) {
            throw new Error('No file uploaded');
        }

        const uploadedFile = files.uploadedFile;

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully!', file: uploadedFile })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

