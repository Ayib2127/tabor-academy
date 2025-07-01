import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { businessIdea } = await request.json();

    if (!businessIdea || businessIdea.trim().length === 0) {
      return NextResponse.json(
        { error: 'Business idea is required' },
        { status: 400 }
      );
    }

    // Simulate AI processing with a realistic delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demo purposes, we'll use predefined responses based on keywords
    // In production, this would integrate with OpenAI or similar AI service
    const responses = {
      'food': 'Consider focusing on a specific cuisine or dietary need. For example: "A mobile food delivery service specializing in healthy, locally-sourced Ethiopian fusion meals for busy professionals in urban areas."',
      'tech': 'Narrow down your tech focus to solve a specific problem. For example: "A mobile app that connects rural farmers with urban buyers, featuring real-time pricing and logistics coordination."',
      'fashion': 'Define your target market and unique value proposition. For example: "An online marketplace for sustainable, locally-made Ethiopian fashion accessories targeting eco-conscious millennials."',
      'education': 'Specify your educational niche and delivery method. For example: "A mobile-first platform teaching digital marketing skills to small business owners in emerging markets through bite-sized video lessons."',
      'agriculture': 'Focus on a specific agricultural challenge. For example: "A subscription service providing organic farming consultation and supplies to small-scale farmers, delivered via WhatsApp and local distribution networks."',
      'health': 'Target a specific health need in your community. For example: "A telemedicine platform connecting rural communities with healthcare professionals, featuring local language support and mobile payment integration."',
      'finance': 'Address a specific financial gap. For example: "A micro-lending platform for women entrepreneurs, featuring group lending models and financial literacy training delivered through mobile apps."',
      'transport': 'Solve a specific transportation challenge. For example: "A ride-sharing service for rural areas using motorcycles, with offline booking capabilities and mobile money integration."'
    };

    // Find matching keywords and provide relevant response
    const lowerIdea = businessIdea.toLowerCase();
    let response = '';

    for (const [keyword, suggestion] of Object.entries(responses)) {
      if (lowerIdea.includes(keyword)) {
        response = suggestion;
        break;
      }
    }

    // Default response if no keywords match
    if (!response) {
      response = `Great start! To make "${businessIdea}" more compelling, consider: 1) Who specifically will benefit? 2) What unique value do you provide? 3) How will you reach your customers? For example: "A [specific solution] for [target audience] that [unique benefit] through [delivery method]."`;
    }

    return NextResponse.json({
      refinedIdea: response,
      originalIdea: businessIdea
    });

  } catch (error) {
    console.error('AI Demo API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process business idea' },
      { status: 500 }
    );
  }
}