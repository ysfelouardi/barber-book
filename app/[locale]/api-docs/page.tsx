'use client'

import dynamic from 'next/dynamic'
import { useTranslations } from '@/hooks/useTranslations'
import 'swagger-ui-react/swagger-ui.css'

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">Loading API Documentation...</div>
  ),
})

export default function ApiDocsPage() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="inline-block" dir="ltr">
              💈
            </span>{' '}
            BarberBook API Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive API documentation for the BarberBook appointment system
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-6 flex justify-between items-center">
          <a
            href="../"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Home
          </a>
          <div className="flex space-x-4">
            <a href="../admin" className="text-blue-600 hover:text-blue-800 transition-colors">
              Admin Dashboard
            </a>
            <a href="../login" className="text-blue-600 hover:text-blue-800 transition-colors">
              Admin Login
            </a>
          </div>
        </div>

        {/* API Information Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Endpoints</h3>
            <p className="text-gray-600 text-sm">
              Complete documentation for all booking, appointment management, and time slot APIs
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 Schemas</h3>
            <p className="text-gray-600 text-sm">
              Detailed request/response schemas with validation rules and examples
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Try It Out</h3>
            <p className="text-gray-600 text-sm">
              Interactive API testing with real request/response examples
            </p>
          </div>
        </div>

        {/* Swagger UI Container */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="swagger-container">
            <SwaggerUI url="/api/swagger" deepLinking={true} tryItOutEnabled={true} />
          </div>
        </div>

        <style jsx global>{`
          .swagger-container .swagger-ui {
            font-family: inherit;
          }

          .swagger-container .swagger-ui .topbar {
            display: none;
          }

          .swagger-container .swagger-ui .info {
            margin: 2rem 0;
          }

          .swagger-container .swagger-ui .info .title {
            color: #1f2937;
            font-size: 1.5rem;
            font-weight: 600;
          }

          .swagger-container .swagger-ui .scheme-container {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            padding: 1rem;
            margin: 1rem 0;
          }

          .swagger-container .swagger-ui .opblock.opblock-post {
            border-color: #10b981;
            background: rgba(16, 185, 129, 0.1);
          }

          .swagger-container .swagger-ui .opblock.opblock-post .opblock-summary {
            border-color: #10b981;
          }

          .swagger-container .swagger-ui .opblock.opblock-get {
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
          }

          .swagger-container .swagger-ui .opblock.opblock-get .opblock-summary {
            border-color: #3b82f6;
          }

          .swagger-container .swagger-ui .opblock.opblock-patch {
            border-color: #f59e0b;
            background: rgba(245, 158, 11, 0.1);
          }

          .swagger-container .swagger-ui .opblock.opblock-patch .opblock-summary {
            border-color: #f59e0b;
          }

          .swagger-container .swagger-ui .opblock.opblock-delete {
            border-color: #ef4444;
            background: rgba(239, 68, 68, 0.1);
          }

          .swagger-container .swagger-ui .opblock.opblock-delete .opblock-summary {
            border-color: #ef4444;
          }

          .swagger-container .swagger-ui .btn.try-out__btn {
            background: #3b82f6;
            color: white;
            border-color: #3b82f6;
            border-radius: 0.375rem;
          }

          .swagger-container .swagger-ui .btn.execute {
            background: #10b981;
            color: white;
            border-color: #10b981;
            border-radius: 0.375rem;
          }

          .swagger-container .swagger-ui .parameter__name {
            font-weight: 600;
          }

          .swagger-container .swagger-ui .response-col_description {
            padding: 1rem;
          }

          .swagger-container .swagger-ui .model-box {
            background: #f9fafb;
            border-radius: 0.375rem;
            padding: 1rem;
          }
        `}</style>

        {/* Footer Information */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This documentation is automatically generated from the OpenAPI 3.0 specification.</p>
          <p className="mt-2">For technical support, please contact the development team.</p>
        </div>
      </div>
    </div>
  )
}
