import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(request: Request) {
  const { report } = await request.json()

  if (!report) {
    return NextResponse.json(
      { error: 'Lighthouse report is required' },
      { status: 400 }
    )
  }

  try {
    const response = await axios.post('http://localhost:1234/v1/chat/completions', {
      model: 'llama-3.2-3b-instruct',
      messages: [
        { 
          role: 'system', 
          content: `You are an expert in website accessibility analyzing Lighthouse reports.
          - Lighthouse scores range from 0 to 1, where 1 is perfect (100%)
          - Convert scores to percentages by multiplying by 100
          - A score of 0.9 or above (90%) is generally good
          - Focus on actionable recommendations to improve accessibility`
        },
        {
          role: 'user',
          content: `Analyze this Lighthouse accessibility report and generate clear recommendations:
          - Accessibility Score: ${report.categories?.accessibility?.score ? Math.round(report.categories.accessibility.score * 100) : 'N/A'}%
          - Color Contrast Issues: ${report.audits?.['color-contrast']?.details?.items?.length || 0}
          - Missing Alt Attributes: ${report.audits?.['image-alt']?.details?.items?.length || 0}
          - Keyboard Accessibility Issues: ${report.audits?.['accesskeys']?.details?.items?.length || 0}
          - ARIA Attribute Issues: ${report.audits?.['aria-allowed-attr']?.details?.items?.length || 0}
          - Form Label Issues: ${report.audits?.['label']?.details?.items?.length || 0}
          - Heading Structure Issues: ${report.audits?.['heading-order']?.details?.items?.length || 0}`
        }
      ],
      max_tokens: 1000,
    })

    return NextResponse.json(response.data.choices[0].message.content)
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to analyze report', details: message },
      { status: 500 }
    )
  }
}
