"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { QRCodeSVG } from "qrcode.react"
import {
  Download,
  Mail,
  Printer,
  Share2,
  CheckCircle,
  Building,
  Phone,
  Globe,
  FileText
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function InvoicePage({ params }: { params: { id: string } }) {
  const [isDownloading, setIsDownloading] = useState(false)

  // Mock invoice data
  const invoice = {
    number: "INV-2024-001",
    date: "March 1, 2024",
    dueDate: "March 1, 2024",
    status: "paid",
    amount: 199.00,
    currency: "USD",
    customer: {
      name: "Sarah Kimani",
      email: "sarah.kimani@example.com",
      address: "123 Main Street, Nairobi, Kenya",
      phone: "+254 700 000000"
    },
    company: {
      name: "Tabor Digital Academy",
      address: "456 Business Avenue, Nairobi, Kenya",
      phone: "+254 700 111111",
      email: "billing@taboracademy.com",
      website: "www.taboracademy.com",
      registration: "REG123456789"
    },
    items: [
      {
        description: "Premium Mentorship Plan",
        quantity: 1,
        unitPrice: 199.00,
        total: 199.00
      }
    ],
    subtotal: 199.00,
    tax: 0,
    total: 199.00,
    paymentMethod: "Credit Card (**** 4242)",
    transactionId: "txn_123456789"
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsDownloading(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Actions Bar */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tighter gradient-text">
              Invoice #{invoice.number}
            </h1>
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? "Generating PDF..." : "Download PDF"}
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          <Card className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo.jpg"
                  alt="Tabor Digital Academy"
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
                <div>
                  <h2 className="text-2xl font-bold">{invoice.company.name}</h2>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      {invoice.company.address}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {invoice.company.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {invoice.company.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {invoice.company.website}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Paid
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Registration: {invoice.company.registration}
                </p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Bill To</h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{invoice.customer.name}</p>
                  <p>{invoice.customer.address}</p>
                  <p>{invoice.customer.phone}</p>
                  <p>{invoice.customer.email}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <span className="font-medium">{invoice.number}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Invoice Date:</span>
                    <span>{invoice.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Due Date:</span>
                    <span>{invoice.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Description</th>
                    <th className="text-right py-3">Quantity</th>
                    <th className="text-right py-3">Unit Price</th>
                    <th className="text-right py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4">{item.description}</td>
                      <td className="text-right py-4">{item.quantity}</td>
                      <td className="text-right py-4">${item.unitPrice.toFixed(2)}</td>
                      <td className="text-right py-4">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-between items-start mb-8">
              <div className="max-w-sm">
                <h3 className="font-semibold mb-2">Payment Information</h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Method:</span>{" "}
                    {invoice.paymentMethod}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Transaction ID:</span>{" "}
                    {invoice.transactionId}
                  </p>
                </div>
              </div>
              <div className="w-72">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${invoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${invoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold">
                    <span>Total</span>
                    <span>${invoice.total.toFixed(2)} {invoice.currency}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-8">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Thank you for choosing Tabor Digital Academy
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This is a computer-generated document and requires no signature
                  </p>
                </div>
                <QRCodeSVG
                  value={`https://taboracademy.com/verify/${invoice.number}`}
                  size={80}
                />
              </div>
            </div>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help with this invoice?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact our billing support
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}