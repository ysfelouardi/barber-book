import { NextResponse } from 'next/server'
import swaggerSpec from './swagger.json'

/**
 * Serves the OpenAPI specification for the BarberBook API.
 * @returns NextResponse - The OpenAPI JSON specification
 */
export async function GET() {
  return NextResponse.json(swaggerSpec)
}
