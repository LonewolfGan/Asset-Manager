export const JS_SAMPLES = {
  asyncFetch: `/**
 * Fetch and normalize user profile data
 */
async function fetchUserProfile(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const data = await response.json();
    return {
      id: data.id,
      displayName: data.name ?? 'Anonymous',
      email: data.email.toLowerCase(),
      isActive: Boolean(data.active),
      createdAt: new Date(data.created_at)
    };
  } catch (err) {
    console.error('Failed to load profile:', err.message);
    return null;
  }
}

// Example usage
fetchUserProfile(42).then((user) => console.log('Loaded:', user));`,

  dataProcessing: `/**
 * Group and aggregate sales metrics by region
 */
function aggregateSales(transactions) {
  return transactions
    .filter((tx) => tx.status === 'completed' && tx.amount > 0)
    .map((tx) => ({
      region: tx.region || 'global',
      revenue: Number(tx.amount),
      units: tx.quantity || 1
    }))
    .reduce((acc, curr) => {
      if (!acc[curr.region]) {
        acc[curr.region] = { totalRevenue: 0, totalUnits: 0 };
      }
      acc[curr.region].totalRevenue += curr.revenue;
      acc[curr.region].totalUnits += curr.units;
      return acc;
    }, {});
}`,

  debounceUtility: `/**
 * Creates a debounced function that delays invoking func
 */
function debounce(fn, wait = 300) {
  let timeoutId = null;

  return function (...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, wait);
  };
}

const onSearchInput = debounce((query) => {
  console.log('Searching for:', query);
}, 250);`,
};
