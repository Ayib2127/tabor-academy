'use client';

import { useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronRight,
  Star,
  Users,
  Clock,
  Shield,
  Globe,
  Zap,
  BookOpen,
  CreditCard,
  Smartphone,
  Award
} from 'lucide-react';
import Link from 'next/link';

const faqCategories = [
  {
    id: 'general',
    title: 'General',
    icon: HelpCircle,
    color: 'bg-[#4ECDC4]/10 text-[#4ECDC4]',
    count: 8
  },
  {
    id: 'courses',
    title: 'Courses & Learning',
    icon: BookOpen,
    color: 'bg-[#FF6B35]/10 text-[#FF6B35]',
    count: 12
  },
  {
    id: 'pricing',
    title: 'Pricing & Billing',
    icon: CreditCard,
    color: 'bg-[#1B4D3E]/10 text-[#1B4D3E]',
    count: 6
  },
  {
    id: 'technical',
    title: 'Technical Support',
    icon: Smartphone,
    color: 'bg-purple-100 text-purple-600',
    count: 7
  },
  {
    id: 'certificates',
    title: 'Certificates & Credentials',
    icon: Award,
    color: 'bg-green-100 text-green-600',
    count: 5
  }
];

const faqs = [
  // General FAQs
  {
    id: 1,
    category: 'general',
    question: 'What is Tabor Academy?',
    answer: 'Tabor Academy is a mobile-first, project-based education platform designed specifically for entrepreneurs. We provide practical courses in digital marketing, no-code development, e-commerce, AI tools, and more, combined with mentorship and community support to help you launch real businesses.'
  },
  {
    id: 2,
    category: 'general',
    question: 'Who can join Tabor Academy?',
    answer: 'Tabor Academy is open to anyone interested in entrepreneurship and digital skills, with a special focus on entrepreneurs. Whether you\'re a complete beginner or looking to expand your existing business, our courses are designed to meet you where you are.'
  },
  {
    id: 3,
    category: 'general',
    question: 'What makes Tabor Academy different from other online learning platforms?',
    answer: 'We\'re specifically designed for Ethiopian markets with mobile-first learning, offline capabilities, AI-powered mentorship, and real-world project-based learning. Our content addresses unique Ethiopian business challenges and opportunities, and we provide ongoing community support.'
  },
  {
    id: 4,
    category: 'general',
    question: 'Do I need any prior experience to start?',
    answer: 'No prior experience is required! Our courses are designed for beginners and include step-by-step guidance. We start with fundamentals and gradually build up to more advanced concepts.'
  },
  {
    id: 5,
    category: 'general',
    question: 'What languages are courses available in?',
    answer: 'Currently, our courses are primarily available in English, with plans to expand to French, Swahili, and other Ethiopian languages based on demand.'
  },
  {
    id: 6,
    category: 'general',
    question: 'Can I access courses offline?',
    answer: 'Yes! Our mobile app allows you to download course content for offline viewing, making it perfect for areas with limited or expensive internet connectivity.'
  },
  {
    id: 7,
    category: 'general',
    question: 'How do I get started?',
    answer: 'Simply sign up for a free account, browse our course catalog, and start with any course that interests you. We recommend beginning with our "Entrepreneurship Fundamentals" course if you\'re new to business.'
  },
  {
    id: 8,
    category: 'general',
    question: 'Is there a mobile app?',
    answer: 'Yes! Our mobile app is available for both iOS and Android devices, optimized for learning on smartphones with features like offline content, progress tracking, and push notifications.'
  },

  // Courses & Learning FAQs
  {
    id: 9,
    category: 'courses',
    question: 'What types of courses do you offer?',
    answer: 'We offer courses in Digital Marketing, No-Code Development, E-commerce, AI Tools, Financial Literacy, Freelancing, Civil Engineering solutions, and Entrepreneurship fundamentals. All courses are project-based and designed for practical application.'
  },
  {
    id: 10,
    category: 'courses',
    question: 'How long does it take to complete a course?',
    answer: 'Course duration varies from 2-8 weeks depending on the complexity and your pace. Most students spend 3-5 hours per week and complete courses within 4-6 weeks.'
  },
  {
    id: 11,
    category: 'courses',
    question: 'Are the courses self-paced?',
    answer: 'Yes, all courses are self-paced. You can learn at your own speed and revisit content as many times as needed. However, we do provide suggested timelines and milestones to keep you on track.'
  },
  {
    id: 12,
    category: 'courses',
    question: 'Do I get access to instructors and mentors?',
    answer: 'Absolutely! Premium members get access to 1-on-1 mentorship sessions, live Q&A sessions with instructors, and our AI-powered mentor available 24/7. Free tier users have access to community forums and AI mentor.'
  },
  {
    id: 13,
    category: 'courses',
    question: 'What is project-based learning?',
    answer: 'Instead of just watching videos, you\'ll work on real projects that build actual businesses or solutions. For example, in our Digital Marketing course, you\'ll create and launch a real marketing campaign for a business idea.'
  },
  {
    id: 14,
    category: 'courses',
    question: 'Can I get help if I\'m stuck on a project?',
    answer: 'Yes! You can get help through our community forums, AI mentor, scheduled mentorship sessions (premium), and peer collaboration features. We ensure no one gets left behind.'
  },
  {
    id: 15,
    category: 'courses',
    question: 'Are course materials updated regularly?',
    answer: 'Yes, we update our courses quarterly to reflect the latest trends, tools, and market conditions. You\'ll always have access to the most current version of any course you\'ve enrolled in.'
  },
  {
    id: 16,
    category: 'courses',
    question: 'Can I suggest new course topics?',
    answer: 'Absolutely! We actively seek input from our community. You can submit course suggestions through our feedback form, and popular requests often become new courses.'
  },
  {
    id: 17,
    category: 'courses',
    question: 'Do you offer courses in local Ethiopian languages?',
    answer: 'We\'re working on expanding to local languages. Currently, courses are in English with plans for French and Swahili versions. We also provide cultural context and examples relevant to different Ethiopian markets.'
  },
  {
    id: 18,
    category: 'courses',
    question: 'What if I don\'t like a course after starting?',
    answer: 'We offer a 30-day money-back guarantee for all paid courses. If you\'re not satisfied within the first 30 days, we\'ll provide a full refund, no questions asked.'
  },
  {
    id: 19,
    category: 'courses',
    question: 'Can I access courses on multiple devices?',
    answer: 'Yes! Your account syncs across all devices - smartphone, tablet, laptop, or desktop. You can start a lesson on your phone and continue on your computer seamlessly.'
  },
  {
    id: 20,
    category: 'courses',
    question: 'Are there prerequisites for advanced courses?',
    answer: 'Some advanced courses have recommended prerequisites, which are clearly listed on the course page. However, motivated beginners can often succeed in advanced courses with extra effort and community support.'
  },

  // Pricing & Billing FAQs
  {
    id: 21,
    category: 'pricing',
    question: 'Is Tabor Academy really free?',
    answer: 'Yes! We offer a robust free tier that includes access to 3 introductory courses, community forums, AI mentor, and mobile app. Premium features like 1-on-1 mentorship and advanced courses require a subscription.'
  },
  {
    id: 22,
    category: 'pricing',
    question: 'What does the premium subscription include?',
    answer: 'Premium subscription ($29/month) includes access to all courses, 1-on-1 mentorship sessions, priority community support, certificates of completion, offline content access, and advanced project feedback.'
  },
  {
    id: 23,
    category: 'pricing',
    question: 'Are there any hidden fees?',
    answer: 'No hidden fees! Our pricing is transparent. The only costs are the optional premium subscription. All course materials, community access, and basic features are included in your chosen plan.'
  },
  {
    id: 24,
    category: 'pricing',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your premium subscription at any time. You\'ll continue to have premium access until the end of your current billing period, then automatically switch to the free tier.'
  },
  {
    id: 25,
    category: 'pricing',
    question: 'Do you offer student discounts?',
    answer: 'Yes! We offer 50% discounts for verified students and special pricing for educational institutions. Contact our support team with your student ID for verification.'
  },
  {
    id: 26,
    category: 'pricing',
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards, PayPal, and mobile money payments (M-Pesa, Airtel Money, etc.) to make payments accessible across Ethiopia.'
  },

  // Technical Support FAQs
  {
    id: 27,
    category: 'technical',
    question: 'What are the system requirements?',
    answer: 'Our platform works on any device with a modern web browser. For mobile apps: iOS 12+ or Android 8+. Minimum 2GB RAM recommended for optimal performance.'
  },
  {
    id: 28,
    category: 'technical',
    question: 'How much data does the mobile app use?',
    answer: 'We\'ve optimized for low data usage. Streaming a typical lesson uses about 10-15MB. Downloaded content for offline viewing is compressed to minimize storage space.'
  },
  {
    id: 29,
    category: 'technical',
    question: 'What if I have technical issues?',
    answer: 'Our technical support team is available via live chat, email, and phone. We also have a comprehensive help center with troubleshooting guides and video tutorials.'
  },
  {
    id: 30,
    category: 'technical',
    question: 'Can I use Tabor Academy with slow internet?',
    answer: 'Yes! Our platform is optimized for slow connections. You can download content when you have good connectivity and learn offline. Video quality automatically adjusts to your connection speed.'
  },
  {
    id: 31,
    category: 'technical',
    question: 'Is my data secure?',
    answer: 'Absolutely. We use enterprise-grade security, SSL encryption, and comply with international data protection standards. Your personal information and progress data are fully protected.'
  },
  {
    id: 32,
    category: 'technical',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a secure reset link. You can also contact support if you need additional help.'
  },
  {
    id: 33,
    category: 'technical',
    question: 'Why can\'t I access certain features?',
    answer: 'Some features are premium-only or may require course completion prerequisites. Check your account status and course progress, or contact support for clarification.'
  },

  // Certificates & Credentials FAQs
  {
    id: 34,
    category: 'certificates',
    question: 'Do I get certificates for completing courses?',
    answer: 'Yes! Premium members receive verified certificates of completion for all courses. Free tier users get completion badges that can be shared on social media.'
  },
  {
    id: 35,
    category: 'certificates',
    question: 'Are Tabor Academy certificates recognized by employers?',
    answer: 'Our certificates demonstrate practical skills and project completion. While recognition varies by employer, many of our graduates have successfully used their certificates to secure jobs or clients.'
  },
  {
    id: 36,
    category: 'certificates',
    question: 'Can I add certificates to my LinkedIn profile?',
    answer: 'Absolutely! Our certificates come with LinkedIn integration, making it easy to add them to your professional profile and showcase your new skills to potential employers or clients.'
  },
  {
    id: 37,
    category: 'certificates',
    question: 'What\'s the difference between certificates and badges?',
    answer: 'Certificates are formal completion credentials for premium members, while badges are achievement markers available to all users. Both demonstrate your learning progress and can be shared publicly.'
  },
  {
    id: 38,
    category: 'certificates',
    question: 'How long does it take to receive my certificate?',
    answer: 'Certificates are generated automatically upon course completion and final project approval. You\'ll typically receive your certificate within 24-48 hours of completing all requirements.'
  }
];

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setOpenItems([]); // Close all open items when switching categories
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-[#4ECDC4]/5 via-white to-[#FF6B35]/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-[#E5E8E8]">
              <HelpCircle className="w-4 h-4 text-[#4ECDC4]" />
              <span className="text-sm font-medium text-[#2C3E50]">Frequently Asked Questions</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#2C3E50] mb-6">
              How Can We
              <span className="block bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] bg-clip-text text-transparent">
                Help You?
              </span>
            </h1>
            
            <p className="text-xl text-[#2C3E50]/80 leading-relaxed mb-8">
              Find answers to common questions about Tabor Academy, our courses, pricing, and more. 
              Can't find what you're looking for? Our support team is here to help.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2C3E50]/40 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-[#E5E8E8] focus:border-[#4ECDC4] focus:ring-[#4ECDC4]/20 rounded-xl"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#4ECDC4]">{faqs.length}</div>
                <div className="text-sm text-[#2C3E50]/70">Total FAQs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF6B35]">24/7</div>
                <div className="text-sm text-[#2C3E50]/70">AI Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1B4D3E]">{'< 2h'}</div>
                <div className="text-sm text-[#2C3E50]/70">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2C3E50]">98%</div>
                <div className="text-sm text-[#2C3E50]/70">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 bg-white border-b border-[#E5E8E8]">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => handleCategorySelect('all')}
              className={selectedCategory === 'all' 
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white' 
                : 'border-[#E5E8E8] text-[#2C3E50] hover:border-[#4ECDC4]'
              }
            >
              All Categories
              <Badge variant="secondary" className="ml-2">
                {faqs.length}
              </Badge>
            </Button>
            
            {faqCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => handleCategorySelect(category.id)}
                  className={selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-[#FF6B35] to-[#4ECDC4] text-white' 
                    : 'border-[#E5E8E8] text-[#2C3E50] hover:border-[#4ECDC4]'
                  }
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.title}
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-[#F7F9F9]">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-[#E5E8E8] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-[#2C3E50]/40" />
                </div>
                <h3 className="text-2xl font-bold text-[#2C3E50] mb-4">
                  No results found
                </h3>
                <p className="text-[#2C3E50]/70 mb-6">
                  Try adjusting your search terms or browse different categories.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
                {filteredFAQs.map((faq) => (
                  <AccordionItem 
                    key={faq.id} 
                    value={faq.id.toString()}
                    className="border border-[#E5E8E8] rounded-lg mb-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                      <div className="flex items-start gap-4 text-left">
                        <div className="w-8 h-8 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-[#4ECDC4]/20 transition-colors">
                          <HelpCircle className="w-4 h-4 text-[#4ECDC4]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#2C3E50] group-hover:text-[#4ECDC4] transition-colors">
                            {faq.question}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className="mt-2 text-xs border-[#E5E8E8] text-[#2C3E50]/60"
                          >
                            {faqCategories.find(cat => cat.id === faq.category)?.title}
                          </Badge>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="pl-12">
                        <p className="text-[#2C3E50]/80 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#2C3E50] mb-6">
              Still Need Help?
            </h2>
            <p className="text-xl text-[#2C3E50]/80 mb-12">
              Our support team is here to help you succeed. Get in touch through any of these channels.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Live Chat */}
              <Card className="border-[#E5E8E8] hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-[#4ECDC4]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4ECDC4]/20 transition-colors">
                    <MessageCircle className="w-8 h-8 text-[#4ECDC4]" />
                  </div>
                  <CardTitle className="text-lg text-[#2C3E50]">Live Chat</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#2C3E50]/70 mb-4">
                    Get instant help from our support team. Available 24/7 for premium members.
                  </p>
                  <Button 
                    className="bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white"
                    asChild
                  >
                    <Link href="https://t.me/tabor_support">Start Chat</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Email Support */}
              <Card className="border-[#E5E8E8] hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF6B35]/20 transition-colors">
                    <Mail className="w-8 h-8 text-[#FF6B35]" />
                  </div>
                  <CardTitle className="text-lg text-[#2C3E50]">Email Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#2C3E50]/70 mb-4">
                    Send us a detailed message and we'll get back to you within 2 hours.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white"
                    asChild
                  >
                    <Link href="mailto:support@taboracademy.com">Send Email</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Phone Support */}
              <Card className="border-[#E5E8E8] hover:border-[#4ECDC4]/40 transition-all duration-300 hover:shadow-lg group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-[#1B4D3E]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1B4D3E]/20 transition-colors">
                    <Phone className="w-8 h-8 text-[#1B4D3E]" />
                  </div>
                  <CardTitle className="text-lg text-[#2C3E50]">Phone Support</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#2C3E50]/70 mb-4">
                    Speak directly with our team. Available Monday-Friday, 9AM-6PM EAT.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-[#1B4D3E] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white"
                    asChild
                  >
                    <Link href="tel:+254700000000">Call Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}