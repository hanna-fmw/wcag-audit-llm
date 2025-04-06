import { NextResponse } from 'next/server'
import { execSync } from 'child_process'
import fs from 'fs'

export async function POST(request: Request) {
  const { url } = await request.json()

  if (!url) {
    return NextResponse.json(
      { error: 'URL is required' },
      { status: 400 }
    )
  }

  try {
    // Run Lighthouse
    execSync(`lighthouse ${url} --output=json --output-path=./lighthouse.json`, {
      stdio: 'inherit',
    })

    // Read and return the report
    const report = fs.readFileSync('./lighthouse.json', 'utf8')
    return NextResponse.json(JSON.parse(report))
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to generate Lighthouse report', details: message },
      { status: 500 }
    )
  }
}
