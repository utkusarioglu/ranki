type ProbeResult<T> = {
  ok: boolean;
  value: T | null;
  error: string | null;
};

function probe<T>(fn: () => T): ProbeResult<T> {
  try {
    return { ok: true, value: fn(), error: null };
  } catch (e) {
    return {
      ok: false,
      value: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function probeAsync<T>(fn: () => Promise<T>): Promise<ProbeResult<T>> {
  try {
    return { ok: true, value: await fn(), error: null };
  } catch (e) {
    return {
      ok: false,
      value: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function collectEnvironmentInfo() {
  const runtime = {
    userAgent: navigator.userAgent,
    platform: navigator.platform || null,
    vendor: navigator.vendor || null,
    language: navigator.language || null,
    languages: Array.isArray(navigator.languages)
      ? navigator.languages.slice()
      : null,
    cookieEnabled: navigator.cookieEnabled === true,
    onLine: navigator.onLine === true,
  };

  const engine = {
    chromium: probe<number | null>(() => {
      const m = navigator.userAgent.match(/Chrome\/(\d+)/);
      return m ? Number(m[1]) : null;
    }),
    webkit: probe<string | null>(() => {
      const m = navigator.userAgent.match(/AppleWebKit\/([\d.]+)/);
      return m ? m[1] : null;
    }),
    userAgentData: probe<object | null>(() => {
      return "userAgentData" in navigator
        ? (navigator as any).userAgentData
        : null;
    }),
  };

  const js = {
    bigint: typeof BigInt === "function",
    dynamicImport: probe<boolean>(() => {
      new Function("return import('data:text/javascript,')")();
      return true;
    }).ok,
    optionalChaining: probe<boolean>(() => {
      new Function("return ({a:1})?.a")();
      return true;
    }).ok,
    nullishCoalescing: probe<boolean>(() => {
      new Function("return null ?? 1")();
      return true;
    }).ok,
    weakRef: typeof (window as any).WeakRef === "function",
    finalizationRegistry:
      typeof (window as any).FinalizationRegistry === "function",
  };

  const sabExists = typeof (window as any).SharedArrayBuffer === "function";

  const sharedArrayBuffer = {
    exists: sabExists,
    crossOriginIsolated:
      typeof (window as any).crossOriginIsolated === "boolean"
        ? (window as any).crossOriginIsolated
        : null,
    usable: sabExists
      ? typeof (window as any).crossOriginIsolated === "boolean"
        ? (window as any).crossOriginIsolated
        : null
      : false,
  };

  function glContext(type: "webgl" | "webgl2") {
    return probe<boolean>(() => {
      const c = document.createElement("canvas");
      return !!c.getContext(type);
    });
  }

  const graphics = {
    canvas2D: probe<boolean>(() => {
      const c = document.createElement("canvas");
      return !!c.getContext("2d");
    }),
    webGL: glContext("webgl"),
    webGL2: glContext("webgl2"),
  };

  const storage = {
    localStorage: probe<boolean>(() => {
      localStorage.setItem("__t", "1");
      localStorage.removeItem("__t");
      return true;
    }),
    sessionStorage: probe<boolean>(() => {
      sessionStorage.setItem("__t", "1");
      sessionStorage.removeItem("__t");
      return true;
    }),
    indexedDB: probe<boolean>(() => !!indexedDB),
    quota: await probeAsync<number | null>(async () => {
      const s = (navigator as any).storage;
      if (!s?.estimate) return null;
      const e = await s.estimate();
      return typeof e.quota === "number" ? Math.round(e.quota / 1048576) : null;
    }),
  };

  const permissions = await probeAsync(async () => {
    const p = (navigator as any).permissions;
    if (!p?.query) return { apiExists: false };

    const names = ["geolocation", "camera", "microphone"];
    const results: Record<string, string> = {};

    for (const name of names) {
      try {
        const r = await p.query({ name });
        results[name] = r.state;
      } catch {
        results[name] = "unsupported";
      }
    }

    return {
      apiExists: true,
      results,
    };
  });

  const context = {
    isTopLevel: window.self === window.top,
    isIframe: window.self !== window.top,
    referrer: document.referrer || null,
    visibilityState: document.visibilityState || null,
    hasFocus: document.hasFocus(),
  };

  const env = {
    schemaVersion: "1.1.0",
    collectedAt: new Date().toISOString(),

    runtime,
    engine,
    js,
    sharedArrayBuffer,
    graphics,
    storage,
    permissions,
    context,
  };
  return env;
}
