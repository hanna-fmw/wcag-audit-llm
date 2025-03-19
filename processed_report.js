const axios = require('axios')
const fs = require('fs')

// Load the full Lighthouse report
const fullReport = JSON.parse(fs.readFileSync('report.json', 'utf8'))

// Extract relevant sections (Modify based on your needs)
const filteredReport = {
	performance: fullReport.categories?.performance?.score, // Overall performance score
	accessibility: fullReport.categories?.accessibility?.score, // Overall accessibility score
	seo: fullReport.categories?.seo?.score, // SEO score
	bestPractices: fullReport.categories?.['best-practices']?.score, // Best practices score
	audits: {
		'color-contrast': fullReport.audits?.['color-contrast'], // WCAG contrast issues
		'image-alt': fullReport.audits?.['image-alt'], // Missing alt attributes
		'meta-description': fullReport.audits?.['meta-description'], // Meta description issues
		'unload-listeners': fullReport.audits?.['unload-listeners'], // Performance issue
	},
}

// Convert to JSON string for the LLM
const reportString = JSON.stringify(filteredReport, null, 2)

async function generateReport() {
	const response = await axios.post('http://localhost:1234/v1/chat/completions', {
		model: 'llama-3.2-3b-instruct', // Use your LM Studio model name
		messages: [
			{ role: 'system', content: 'You are an expert in website accessibility and performance.' },
			{
				role: 'user',
				content: `Analyze this simplified Lighthouse report and generate a detailed, readable summary: ${reportString}`,
			},
		],
	})

	console.log(response.data.choices[0].message.content)
}

generateReport()
