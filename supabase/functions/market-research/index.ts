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

    // Get scan details
    const { data: scan, error: scanError } = await supabase
      .from('scans')
      .select('url')
      .eq('id', scanId)
      .single();

    if (scanError) {
      throw scanError;
    }

    const domain = new URL(scan.url).hostname;
    
    // Extract industry/niche from domain or content
    const researchQueries = [
      `competitors of ${domain}`,
      `${domain} industry trends 2024`,
      `best practices ${domain} industry`,
      `customer pain points ${domain} niche`
    ];

    let allSources = [];
    let researchData = {};

    // Conduct research with Tavily
    for (const query of researchQueries) {
      try {
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

    // Analyze research with Gemini
    const analysisPrompt = `
      Based on the following market research data, provide insights for the website ${scan.url}:

      Research Data: ${JSON.stringify(researchData, null, 2)}

      Please analyze and provide insights in the following JSON format:
      {
        "competitors": [
          {"name": "Competitor 1", "strengths": ["strength 1"], "website": "url"}
        ],
        "trending_topics": ["topic 1", "topic 2"],
        "market_gaps": ["gap 1", "gap 2"],
        "content_opportunities": ["opportunity 1", "opportunity 2"],
        "seo_keywords": ["keyword 1", "keyword 2"],
        "industry_insights": ["insight 1", "insight 2"]
      }

      Focus on actionable insights that can help improve the website's competitive position.
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
            maxOutputTokens: 2048,
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
            } else {
              insights = { raw_analysis: analysisText };
            }
          } catch (parseError) {
            insights = { raw_analysis: analysisText };
          }

          // Store market insights
          await supabase
            .from('market_insights')
            .insert({
              scan_id: scanId,
              model: 'gemini-1.5-flash',
              insights: insights,
              sources: allSources
            });

          console.log(`Market research completed for scan ${scanId}`);
        }
      }

    } catch (apiError) {
      console.error(`Error with Gemini analysis:`, apiError);
    }

  } catch (error) {
    console.error(`Error in conductMarketResearch for scan ${scanId}:`, error);
  }
}