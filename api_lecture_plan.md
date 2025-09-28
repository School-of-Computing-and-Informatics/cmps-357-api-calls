# CMPS 357 Lecture Plan: API Patterns

This document outlines the lecture plan for introducing API patterns using the RSS 2 JSON demo.  
The sequence moves from simple examples to advanced topics, with live activities.

---

## 1. Foundations: The Simple Example
- **RSS â†’ JSON demo** (base case).
- **Display raw vs processed data**: toggle between raw JSON and formatted output.
- **Add more RSS sources** (sports, NASA, tech, local). Live swap during lecture.

---

## 2. Debugging and Robustness
- **Break the feed**: bad URL, offline/malformed RSS.
- **Simulate slow network**: throttling or artificial delay.
- **Inspect the network**: DevTools â†’ request, headers, status codes, timing.
- **Accessibility & UX**: ARIA labels, meaningful error messages.

---

## 3. Understanding the Data
- **JSON structure exploration**: walk through JSON fields and map to UI.
- **Change display logic**: surface author, date, categories, or other metadata.

---

## 4. Efficiency and Reuse
- **Caching**:
  - Store the last response and avoid re-fetching until user forces refresh.
  - Discuss TTL (time-to-live) and cache invalidation.
  - Introduce ETag / If-None-Match conceptually.

- **Memoization**:
  - Cache function results for repeated calls with the same input.
  - Show a simple memoization wrapper around `fetchFeed(url)`.
  - Useful when multiple parts of code request the same feed.

- **Client-side storage**:
  - Use `localStorage` or `sessionStorage` to persist data across reloads.
  - Example: keep last viewed feed for offline/refresh scenarios.
  - Discuss limits (size, security, when to clear).

---

## 5. Programming Patterns
- **Async styles**: contrast `.then()` vs `async/await`.
- **Code comments & highlighting**: step through fetch + error handling.
- **Add a feature as a group**: e.g., keyword filter, dark mode toggle.

---

## 6. API Constraints and Security
- **Rate limits**: simulate 429, discuss retry/backoff.
- **CORS issues**: attempt a blocked feed, explain policies.
- **API keys**: mock a key-protected API.
- **Security practices**: don't embed keys in frontend; show backend proxy.

---

## Suggested Timing (75--90 minutes)

| Segment       | Time  | Focus                                      |
|---------------|-------|--------------------------------------------|
| Foundations   | 15min | Base demo, raw vs processed, feed swap     |
| Debugging     | 15min | Broken feed, slow network, UX feedback     |
| Data          | 10min | JSON mapping                               |
| Efficiency    | 15min | Caching, memoization, client storage       |
| Patterns      | 20min | Async styles, annotated code, live feature |
| Constraints   | 15min | Rate limits, CORS, API keys, security      |
| Wrap-up       | 5min  | Q&A, recap                                |

---