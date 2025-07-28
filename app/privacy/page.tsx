"use client";

import { Shield, Eye, Lock, Users, Mail, Calendar } from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = 'December 15, 2024';
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Personal information you provide when contacting us (name, email, phone number)',
        'Information submitted through our contact forms and consultation requests',
        'Technical information about your device and browser when visiting our website',
        'Usage data and analytics to improve our website performance',
        'Cookies and similar tracking technologies for website functionality'
      ]
    },
    {
      icon: Users,
      title: 'How We Use Your Information',
      content: [
        'To respond to your inquiries and provide requested services',
        'To communicate about your projects and provide customer support',
        'To send you relevant updates about our services (with your consent)',
        'To improve our website functionality and user experience',
        'To comply with legal obligations and protect our legitimate interests'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures to protect your data',
        'All data transmission is encrypted using SSL/TLS protocols',
        'Access to personal information is restricted to authorized personnel only',
        'Regular security audits and updates to maintain data protection standards',
        'Secure data storage with backup and recovery procedures'
      ]
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        'Right to access your personal information we hold',
        'Right to correct or update inaccurate information',
        'Right to request deletion of your personal data',
        'Right to object to processing of your information',
        'Right to data portability and withdrawal of consent'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] via-[#1B4D3E] to-[#2C3E50] dark:from-[#1B4D3E] dark:via-[#2C3E50] dark:to-[#1B4D3E] py-12">
      <section className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B35] text-white rounded-full mb-6 shadow-lg">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/80 dark:text-white/70 mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <div className="flex items-center justify-center text-white/60 dark:text-white/50">
              <Calendar size={16} className="mr-2" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white/90 dark:bg-[#222c2e]/90 rounded-2xl shadow-xl p-8 md:p-12">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg text-[#2C3E50] dark:text-white leading-relaxed mb-6">
                At Tabor Academy, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p className="text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
                By using our website or services, you agree to the collection and use of information in accordance with this policy. 
                If you do not agree with our policies and practices, please do not use our services.
              </p>
            </div>

            {/* Main Sections */}
            <div className="space-y-12">
              {sections.map((section, index) => (
                <div key={index} className="bg-[#F8F9FA] dark:bg-[#1B4D3E]/40 rounded-lg p-8 shadow-md">
                  <div className="flex items-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FF6B35] text-white rounded-full mr-4 shadow">
                      <section.icon size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2C3E50] dark:text-[#4ECDC4]">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-[#2C3E50] dark:text-white/90">
                        <span className="w-2 h-2 bg-[#FF6B35] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Additional Sections */}
            <div className="mt-12 space-y-8">
              {/* Cookies */}
              <div>
                <h2 className="text-2xl font-bold text-[#2C3E50] dark:text-[#4ECDC4] mb-4">Cookies and Tracking Technologies</h2>
                <p className="text-[#2C3E50]/80 dark:text-white/80 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. 
                  Cookies are small data files stored on your device that help us provide better services.
                </p>
                <p className="text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
                  You can control cookie settings through your browser preferences. However, disabling cookies may affect the functionality of our website.
                </p>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2 className="text-2xl font-bold text-[#2C3E50] dark:text-[#4ECDC4] mb-4">Third-Party Services</h2>
                <p className="text-[#2C3E50]/80 dark:text-white/80 leading-relaxed mb-4">
                  We may use third-party services such as Google Analytics, social media plugins, and other tools to improve our services. 
                  These services may collect information about your use of our website according to their own privacy policies.
                </p>
                <p className="text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
                  We encourage you to review the privacy policies of any third-party services you interact with through our website.
                </p>
              </div>

              {/* Data Retention */}
              <div>
                <h2 className="text-2xl font-bold text-[#2C3E50] dark:text-[#4ECDC4] mb-4">Data Retention</h2>
                <p className="text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
                  We retain your personal information only for as long as necessary to fulfill the purposes outlined in this privacy policy, 
                  comply with legal obligations, resolve disputes, and enforce our agreements. When we no longer need your information, 
                  we will securely delete or anonymize it.
                </p>
              </div>

              {/* International Transfers */}
              <div>
                <h2 className="text-2xl font-bold text-[#2C3E50] dark:text-[#4ECDC4] mb-4">International Data Transfers</h2>
                <p className="text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers 
                  are conducted in accordance with applicable data protection laws and that appropriate safeguards are in place to protect your information.
                </p>
              </div>

              {/* Changes to Policy */}
              <div>
                <h2 className="text-2xl font-bold text-[#2C3E50] dark:text-[#4ECDC4] mb-4">Changes to This Privacy Policy</h2>
                <p className="text-[#2C3E50]/80 dark:text-white/80 leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. 
                  We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date. 
                  Your continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-12 bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] rounded-lg p-8 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Mail className="mr-3" size={24} />
                Contact Us About Privacy
              </h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> privacy@taboracademy.com</p>
                <p><strong>Phone:</strong> +251910083733</p>
                <p><strong>Address:</strong> Bole Road, Addis Ababa, Ethiopia</p>
              </div>
              <p className="mt-4 text-sm opacity-90">
                We will respond to your privacy-related inquiries within 30 days of receipt.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy; 