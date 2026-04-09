module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const apiSecret = process.env.KIT_API_SECRET;
  const formId    = '9304604';

  if (!apiSecret) {
    return res.status(500).json({ error: 'KIT_API_SECRET not configured' });
  }

  try {
    let count   = 0;
    let cursor  = null;
    let hasMore = true;

    // Page through all subscribers and count them
    while (hasMore) {
      const url = new URL(`https://api.kit.com/v4/forms/${formId}/subscribers`);
      url.searchParams.set('per_page', '500');
      if (cursor) url.searchParams.set('after', cursor);

      const kitRes = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiSecret}`, Accept: 'application/json' }
      });

      if (!kitRes.ok) throw new Error(`Kit API error: ${kitRes.status}`);

      const data = await kitRes.json();
      count  += (data.subscribers || []).length;
      hasMore = data.pagination?.has_next_page || false;
      cursor  = data.pagination?.end_cursor    || null;
    }

    return res.status(200).json({ count });
  } catch (err) {
    console.error('subscriber-count error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
