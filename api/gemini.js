export default async function handler(req, res) {
  // Aapka Google AI Studio API Key (safe backend me stored)
  const API_KEY = "AIzaSyB2nmqjl639hmDOsvgUHeOnuRj_2-hbPzo";

  // POST request ke prompt data ko read karein
  let body = '';
  await new Promise(resolve => {
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', resolve);
  });

  const { prompt } = JSON.parse(body || '{}');

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    res.setHeader("Content-Type", "application/json");
    res.status(200).end(JSON.stringify(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
