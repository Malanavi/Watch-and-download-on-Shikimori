class HttpClient {
  async get(
    url: string,
    headers: Record<string, string> = {},
  ): Promise<Response> {
    return await fetch(url, { headers });
  }
}

export default HttpClient;
