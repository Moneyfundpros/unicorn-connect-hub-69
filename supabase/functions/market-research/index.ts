import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const tavilyApiKey = Deno.env.get('TAVILY_API_KEY')!;
const googleApiKey = Deno.env.get('GOOGLE_API_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { scanId } = await req.json();
    
    if (!scanId) {
      throw new Error('Scan ID is required');
    }

    // Start background research
    EdgeRuntime.waitUntil(conductMarketResearch(scanId, authHeader));

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Market research started' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in market-research:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function conductMarketResearch(scanId: string, authHeader: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: authHeader } }
  });

  try {
    console.log(`Starting market research for scan ${scanId}`);

    // Get scan details and website content
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('url')
      .eq('id', scanId)
      .single();

    if (scanError) {
      throw scanError;
    }

    // Get website content for niche detection
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('title, content')
      .eq('scan_id', scanId)
      .limit(5); // Analyze first 5 pages for niche detection

    if (pagesError) {
      console.error('Error fetching pages:', pagesError);
    }

    const domain = new URL(scan.url).hostname;
    
    // Step 1: Detect niche/industry from website content
    const niche = await detectNicheFromContent(scan.url, pages || []);
    console.log(`Detected niche for ${domain}: ${niche}`);

    // Step 2: Generate niche-based search queries instead of domain-based ones
    const researchQueries = generateNicheBasedQueries(niche, domain);
    console.log(`Generated research queries:`, researchQueries);

    let allSources = [];
    let researchData = {};

    // Conduct research with Tavily using niche-based queries
    for (const query of researchQueries) {
      try {
        console.log(`Searching for: ${query}`);
        const tavilyResponse = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            api_key: tavilyApiKey,
            query: query,
            search_depth: "advanced",
            max_results: 5
          })
        });

        if (tavilyResponse.ok) {
          const data = await tavilyResponse.json();
          if (data.results) {
            allSources.push(...data.results);
            researchData[query] = data.results;
          }
        }
      } catch (error) {
        console.error(`Error with Tavily query "${query}":`, error);
      }
    }

    // Enhanced analysis with niche context
    const analysisPrompt = `
      Based on the following market research data for a ${niche} website (${scan.url}), provide comprehensive insights:

      Detected Industry/Niche: ${niche}
      Website Domain: ${domain}
      Research Data: ${JSON.stringify(researchData, null, 2)}

      Please analyze and provide insights in the following JSON format:
      {
        "detected_niche": "${niche}",
        "competitors": [
          {"name": "Competitor Name", "website": "url", "strengths": ["strength 1", "strength 2"], "key_features": ["feature 1"]}
        ],
        "trending_topics": ["current trend 1", "emerging trend 2"],
        "market_gaps": ["unmet need 1", "opportunity 2"],
        "content_opportunities": ["content idea 1", "content strategy 2"],
        "seo_keywords": ["high-value keyword 1", "long-tail keyword 2"],
        "industry_insights": ["market insight 1", "customer behavior insight 2"],
        "growth_strategies": ["strategy 1", "tactic 2"],
        "pricing_insights": ["pricing trend 1", "pricing strategy 2"]
      }

      Focus on actionable insights specific to the ${niche} industry that can help improve this website's competitive position.
      Include both established competitors and emerging players in the ${niche} space.
    `;

    try {
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: analysisPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 3072,
          }
        })
      });

      if (geminiResponse.ok) {
        const result = await geminiResponse.json();
        const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (analysisText) {
          let insights;
          try {
            const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              insights = JSON.parse(jsonMatch[0]);
              insights.detected_niche = niche; // Ensure niche is included
            } else {
              insights = { 
                detected_niche: niche,
                raw_analysis: analysisText 
              };
            }
          } catch (parseError) {
            insights = { 
              detected_niche: niche,
              raw_analysis: analysisText 
            };
          }

          // Store market insights with niche information
          await supabase
            .from('market_insights')
            .insert({
              scan_id: scanId,
              model: 'gemini-1.5-flash',
              insights: insights,
              sources: allSources
            });

          console.log(`Market research completed for scan ${scanId} in ${niche} niche`);
        }
      }

    } catch (apiError) {
      console.error(`Error with Gemini analysis:`, apiError);
    }

  } catch (error) {
    console.error(`Error in conductMarketResearch for scan ${scanId}:`, error);
  }
}

async function detectNicheFromContent(url: string, pages: any[]): Promise<string> {
  if (!pages || pages.length === 0) {
    // Fallback to domain-based niche detection
    return detectNicheFromDomain(url);
  }

  const contentSample = pages
    .map(page => `Title: ${page.title || ''}\nContent: ${page.content ? page.content.substring(0, 500) : ''}`)
    .join('\n\n');

  const nicheDetectionPrompt = `
    Analyze the following website content and determine the primary business niche/industry:

    Website URL: ${url}
    Content Sample:
    ${contentSample}

    Based on the content, respond with ONLY the primary industry/niche category from this list:
    - Fashion & Clothing
    - Food & Restaurant
    - Technology & Software
    - Health & Wellness
    - Finance & Banking
    - Real Estate
    - Education & Training
    - Travel & Tourism
    - Beauty & Cosmetics
    - Home & Garden
    - Sports & Fitness
    - Entertainment & Media
    - Professional Services
    - E-commerce & Retail
    - Automotive
    - Non-profit & Charity
    - B2B Services
    - Consulting
    - Manufacturing
    - Healthcare
    - Legal Services
    - Marketing & Advertising
    - Other

    Respond with only the category name, nothing else.
  `;

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: nicheDetectionPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 50,
        }
      })
    });

    if (geminiResponse.ok) {
      const result = await geminiResponse.json();
      const detectedNiche = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      
      if (detectedNiche && detectedNiche !== 'Other') {
        return detectedNiche;
      }
    }
  } catch (error) {
    console.error('Error in niche detection:', error);
  }

  // Fallback to domain-based detection
  return detectNicheFromDomain(url);
}

function detectNicheFromDomain(url: string): string {
  const domain = new URL(url).hostname.toLowerCase();
  
  // Domain-based niche detection patterns
  const nichePatterns = {
    'Fashion & Clothing': ['clothing', 'fashion', 'apparel', 'boutique', 'style', 'wear'],
    'Food & Restaurant': ['restaurant', 'food', 'cafe', 'dining', 'kitchen', 'recipe', 'cook'],
    'Technology & Software': ['tech', 'software', 'app', 'digital', 'code', 'dev', 'saas'],
    'Health & Wellness': ['health', 'wellness', 'medical', 'clinic', 'fitness', 'gym'],
    'Finance & Banking': ['bank', 'finance', 'money', 'invest', 'loan', 'credit'],
    'Real Estate': ['realty', 'property', 'homes', 'estate', 'realtor'],
    'Education & Training': ['edu', 'school', 'learning', 'course', 'training', 'academy'],
    'Travel & Tourism': ['travel', 'tour', 'hotel', 'vacation', 'trip'],
    'E-commerce & Retail': ['shop', 'store', 'buy', 'sell', 'market', 'retail']
  };

  for (const [niche, keywords] of Object.entries(nichePatterns)) {
    if (keywords.some(keyword => domain.includes(keyword))) {
      return niche;
    }
  }

  return 'E-commerce & Retail'; // Default fallback
}

function generateNicheBasedQueries(niche: string, domain: string): string[] {
  const baseQueries = {
    'Fashion & Clothing': [
      'best fashion clothing brands 2024',
      'online clothing store competitors',
      'fashion ecommerce trends 2024',
      'clothing brand marketing strategies',
      'fashion industry customer pain points'
    ],
    'Food & Restaurant': [
      'top restaurant chains 2024',
      'food industry trends and competitors',
      'restaurant marketing best practices',
      'food service industry insights',
      'restaurant customer experience trends'
    ],
    'Technology & Software': [
      'leading software companies 2024',
      'tech industry competitors and trends',
      'SaaS marketing strategies',
      'software development industry insights',
      'technology customer acquisition trends'
    ],
    'Health & Wellness': [
      'health wellness brands competitors',
      'healthcare industry trends 2024',
      'wellness market leaders',
      'health industry marketing strategies',
      'wellness customer engagement trends'
    ],
    'Finance & Banking': [
      'fintech companies competitors 2024',
      'financial services industry trends',
      'banking industry leaders',
      'finance marketing strategies',
      'financial services customer needs'
    ],
    'Real Estate': [
      'real estate industry leaders',
      'property market competitors 2024',
      'real estate marketing trends',
      'property industry insights',
      'real estate customer journey trends'
    ],
    'Education & Training': [
      'online education platforms competitors',
      'education industry trends 2024',
      'e-learning market leaders',
      'education marketing strategies',
      'online learning customer preferences'
    ],
    'Travel & Tourism': [
      'travel industry competitors 2024',
      'tourism market trends',
      'travel booking platforms',
      'hospitality industry insights',
      'travel customer experience trends'
    ],
    'E-commerce & Retail': [
      'top ecommerce platforms 2024',
      'online retail competitors',
      'ecommerce industry trends',
      'retail marketing strategies',
      'ecommerce customer behavior trends'
    ]
  };

  // Get niche-specific queries or fall back to generic ones
  const nicheQueries = baseQueries[niche] || [
    `best ${niche.toLowerCase()} companies 2024`,
    `${niche.toLowerCase()} industry competitors`,
    `${niche.toLowerCase()} market trends 2024`,
    `${niche.toLowerCase()} industry best practices`,
    `${niche.toLowerCase()} customer needs and pain points`
  ];

  // Also include the original domain-based query as a fallback
  nicheQueries.push(`competitors of ${domain}`);

  return nicheQueries;
}