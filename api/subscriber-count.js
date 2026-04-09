module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  const apiSecret = process.env.KIT_API_SECRET;
  const formId    = '9304604';

  if (!apiSecret) {
    return res.status(500).json({ error: 'KIT_API_SECRET not configured' });
  }

  try {
    const kitRes = await fetch(
      `https://api.kit.com/v4/forms/${formId}/subscribers?per_page=1`,
      { headers: { Authorization: `Bearer ${apiSecret}`, Accept: 'application/json' } }
    );

    if (!kitRes.ok) throw new Error(`Kit API error: ${kitRes.status}`);

    const data = await kitRes.json();
    console.log('Kit API response:', JSON.stringify(data));

    // Try all possible locations for total count
    const count =
      data?.pagination?.total ??
      data?.meta?.total_count ??
      data?.total_subscribers ??
      data?.subscribers?.length ??
      0;

    return res.status(200).json({ count });
  } catch (err) {
    console.error('subscriber-count error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
