import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Invalid request body',
        details: error instanceof Error ? error.message : 'Invalid JSON'
      },
      { status: 400 }
    );
  }

  const { url } = body;
  if (!url || typeof url !== 'string') {
    return NextResponse.json(
      { error: 'URL parameter is required and must be a string' },
      { status: 400 }
    );
  }

  const reportPath = path.join(process.cwd(), 'lighthouse-report.json')
  
  try {
    // Run Lighthouse with timeout
    const result = await new Promise((resolve, reject) => {
      const lighthouseProcess = spawn('lighthouse', [
        url,
        '--output=json',
        '--output-path=' + reportPath,
        '--quiet',
        '--chrome-flags="--headless --no-sandbox"',
        '--only-categories=accessibility'
      ])

      const timeout = setTimeout(() => {
        lighthouseProcess.kill()
        reject(new Error('Lighthouse analysis timed out after 60 seconds'))
      }, 60000)

      lighthouseProcess.on('close', (code) => {
        clearTimeout(timeout)
        if (code === 0) {
            try {
              const report = fs.readFileSync(reportPath, 'utf8')
              resolve(JSON.parse(report))
            } catch (error) {
              reject(new Error(`Failed to parse Lighthouse report: ${error instanceof Error ? error.message : 'Unknown error'}`))
          }
        } else {
          reject(new Error(`Lighthouse process exited with code ${code}`))
        }
      })
    })

    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to generate Lighthouse report', details: message },
      { status: 500 }
    )
  } finally {
    // Clean up report file
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath)
    }
  }
}
