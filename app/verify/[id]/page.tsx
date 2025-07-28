"use client"

import { useState, useEffect } from "react"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ChevronRight,
  Shield,
  CheckCircle,
  Download,
  Share2,
  FileText,
  Search,
  QrCode,
  Link as LinkIcon,
  AlertCircle,
  Code,
  Building2,
  Lock,
  ExternalLink,
  Clock
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "invalid" | "pending">("verified")
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // Mock certificate data
  const certificate = {
    id: id,
    title: "Digital Marketing Specialist",
    recipient: "Sarah Kimani",
    issuer: "Tabor Academy",
    issueDate: new Date(2024, 1, 15),
    grade: "A",
    blockchain: {
      network: "Ethereum",
      transactionHash: "0x1234...5678",
      timestamp: new Date(2024, 1, 15),
      smartContract: "0xabcd...efgh"
    },
    achievements: [
      "Completed 12 core modules",
      "Developed 3 campaign strategies",
      "Achieved 95% in final assessment"
    ],
    skills: [
      "Social Media Marketing",
      "Content Strategy",
      "Analytics & Reporting",
      "SEO Optimization"
    ],
    accreditation: {
      body: "Ethiopian Digital Skills Council",
      validUntil: new Date(2027, 1, 15),
      level: "Professional"
    }
  }

  const handleVerify = async () => {
    setIsVerifying(true)
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsVerifying(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 py-8">
        <div className="container px-4 md:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/certification" className="hover:text-foreground">Certifications</Link>
            <ChevronRight className="h-4 w-4" />
            <span>Verify Certificate</span>
          </div>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter gradient-text mb-2">
                Certificate Verification
              </h1>
              <p className="text-muted-foreground">
                Verify the authenticity of certificates using blockchain technology
              </p>
            </div>
            <Card className="p-6 w-full md:w-auto">
              <div className="flex items-center gap-4">
                {verificationStatus === "verified" ? (
                  <div className="bg-green-100 rounded-full p-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                ) : verificationStatus === "invalid" ? (
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                ) : (
                  <div className="bg-yellow-100 rounded-full p-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  </div>
                )}
                <div>
                  <h2 className="font-semibold">Status: {verificationStatus.charAt(0).toUpperCase() + verificationStatus.slice(1)}</h2>
                  <p className="text-sm text-muted-foreground">Last checked: Just now</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Certificate Display */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Certificate Details</h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg">
                    <div className="flex justify-between mb-4">
                      <Image
                        src="/logo.jpg"
                        alt="Tabor Academy"
                        width={100}
                        height={100}
                        className="h-16 w-auto"
                      />
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold">{certificate.title}</h3>
                      <p className="text-lg">This is to certify that</p>
                      <p className="text-2xl font-bold gradient-text">{certificate.recipient}</p>
                      <p className="text-lg">has successfully completed the requirements for</p>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Issue Date: {certificate.issueDate.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Certificate ID: {certificate.id}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Achievements</h3>
                      <div className="space-y-2">
                        {certificate.achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-3">Skills Certified</h3>
                      <div className="flex flex-wrap gap-2">
                        {certificate.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="text-sm px-3 py-1 rounded-full bg-accent"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Blockchain Verification */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Blockchain Verification</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-accent">
                      <p className="text-sm font-medium mb-1">Network</p>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-primary" />
                        <span>{certificate.blockchain.network}</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-accent">
                      <p className="text-sm font-medium mb-1">Timestamp</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>{certificate.blockchain.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Transaction Hash</p>
                    <code className="block p-3 rounded-lg bg-accent break-all">
                      {certificate.blockchain.transactionHash}
                    </code>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Smart Contract</p>
                    <code className="block p-3 rounded-lg bg-accent break-all">
                      {certificate.blockchain.smartContract}
                    </code>
                  </div>
                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="w-full"
                  >
                    {isVerifying ? (
                      <>Verifying...</>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Verify on Blockchain
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Accreditation Info */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Accreditation</h3>
                    <p className="text-sm text-muted-foreground">
                      Official recognition
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Accrediting Body</span>
                    <span className="text-sm font-medium">
                      {certificate.accreditation.body}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Valid Until</span>
                    <span className="text-sm font-medium">
                      {certificate.accreditation.validUntil.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Level</span>
                    <span className="text-sm font-medium">
                      {certificate.accreditation.level}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Verification Tools */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Verification Tools</h3>
                    <p className="text-sm text-muted-foreground">
                      For developers & institutions
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/api-docs">
                      <div className="flex items-center">
                        <Code className="mr-2 h-4 w-4" />
                        API Documentation
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-between" asChild>
                    <Link href="/verification/bulk">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Bulk Verification
                      </div>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Security Info */}
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Security Features</h3>
                    <p className="text-sm text-muted-foreground">
                      Anti-fraud measures
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Blockchain immutability
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Cryptographic signatures
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Tamper-evident design
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Real-time verification
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}