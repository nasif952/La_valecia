import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const { params: routeParams } = await params
  const [width, height] = routeParams
  
  const w = parseInt(width) || 400
  const h = parseInt(height) || 400
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)"/>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#90EE90;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#90EE90;stop-opacity:0.3" />
        </linearGradient>
      </defs>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#6b7280" text-anchor="middle" dy=".3em">
        ${w} × ${h}
      </text>
    </svg>
  `
  
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
