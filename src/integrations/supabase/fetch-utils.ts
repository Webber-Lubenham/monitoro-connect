
/**
 * Helper function for retrying fetch requests
 */
export const retryFetch = async (
  url: RequestInfo | URL, 
  options: any, 
  maxRetries = 3, 
  retryDelay = 300
): Promise<Response> => {
  let lastError: Error | null = null;
  
  for (let retries = 0; retries <= maxRetries; retries++) {
    try {
      // Make sure url is treated correctly - convert to string if needed
      const urlString = typeof url === 'string' ? url : url.toString();
      const response = await fetch(urlString, options);
      
      // If response is not ok but has a 429 status (rate limit), wait longer before retry
      if (!response.ok) {
        if (response.status === 429 && retries < maxRetries) {
          const delay = retryDelay * Math.pow(2, retries) + Math.random() * 100;
          console.warn(`Rate limited (429). Waiting ${delay}ms before retry ${retries + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // For other non-OK responses that aren't 401 (auth), retry with backoff
        if (response.status !== 401 && retries < maxRetries) {
          const delay = retryDelay * Math.pow(2, retries);
          console.warn(`Fetch error (status ${response.status}): ${response.statusText}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      return response;
    } catch (err) {
      lastError = err as Error;
      if (retries < maxRetries) {
        const delay = retryDelay * Math.pow(2, retries);
        console.warn(`Network error (attempt ${retries + 1}/${maxRetries}):`, err);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('Max retries reached for fetch:', err);
      }
    }
  }
  
  throw lastError || new Error('Failed after max retries');
};
