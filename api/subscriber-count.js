module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const apiSecret = process.env.KIT_API_SECRET;
  const formId    = '9304604';

  if (!apiSecret) {
    return res.status(500).json({ error: 'KIT_API_SECRET not configured' });
  }

  try {
    let count = 0;
    let page  = 1;

    // Page through all subscribers using v3 API
    while (true) {
      const url = `https://api.convertkit.com/v3/forms/${formId}/subscriptions?api_secret=${apiSecret}&page=${page}`;

      const kitRes = await fetch(url, { headers: { Accept: 'application/json' } });

      if (!kitRes.ok) throw new Error(`Kit API error: ${kitRes.status}`);

      const data = await kitRes.json();
      const subs = data.subscriptions || [];
      count += subs.length;

      if (subs.length < 50) break; // v3 returns max 50 per page
      page++;
    }

    return res.status(200).json({ count });
  } catch (err) {
    console.error('subscriber-count error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
