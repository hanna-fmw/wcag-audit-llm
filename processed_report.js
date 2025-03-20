const axios = require('axios')
const fs = require('fs')

// Load the full Lighthouse report
const fullReport = JSON.parse(fs.readFileSync('report.json', 'utf8'))

// Extract relevant sections (Modify based on your needs)
const filteredReport = {
	accessibility: fullReport.categories?.accessibility?.score,
	audits: {
		'color-contrast': {
			score: fullReport.audits?.['color-contrast']?.score,
			issues: fullReport.audits?.['color-contrast']?.details?.items?.length || 0
		},
		'image-alt': {
			score: fullReport.audits?.['image-alt']?.score,
			issues: fullReport.audits?.['image-alt']?.details?.items?.length || 0
		},
		'keyboard-accessibility': {
			score: fullReport.audits?.['accesskeys']?.score,
			issues: fullReport.audits?.['accesskeys']?.details?.items?.length || 0
		},
		'aria-attributes': {
			score: fullReport.audits?.['aria-allowed-attr']?.score,
			issues: fullReport.audits?.['aria-allowed-attr']?.details?.items?.length || 0
		},
		'form-labels': {
			score: fullReport.audits?.['label']?.score,
			issues: fullReport.audits?.['label']?.details?.items?.length || 0
		},
		'heading-structure': {
			score: fullReport.audits?.['heading-order']?.score,
			issues: fullReport.audits?.['heading-order']?.details?.items?.length || 0
		}
	}
}

// Convert to JSON string for the LLM
const reportString = JSON.stringify(filteredReport, null, 2)

async function generateReport() {
	try {
		const response = await axios.post('http://localhost:1234/v1/chat/completions', {
			model: 'llama-3.2-3b-instruct',
			messages: [
				{ role: 'system', content: 'You are an expert in website accessibility and performance.' },
				{
					role: 'user',
					content: `Analyze this Lighthouse accessibility report and generate recommendations:
					- Accessibility Score: ${filteredReport.accessibility}
					- Color Contrast Issues: ${filteredReport.audits['color-contrast'].issues}
					- Missing Alt Attributes: ${filteredReport.audits['image-alt'].issues}
					- Keyboard Accessibility Issues: ${filteredReport.audits['keyboard-accessibility'].issues}
					- ARIA Attribute Issues: ${filteredReport.audits['aria-attributes'].issues}
					- Form Label Issues: ${filteredReport.audits['form-labels'].issues}
					- Heading Structure Issues: ${filteredReport.audits['heading-structure'].issues}`
				},
			],
			max_tokens: 1000
		})

		console.log(response.data.choices[0].message.content)
	} catch (error) {
		console.error('Error generating report:', error.response?.data?.error || error.message)
	}
}

generateReport()
