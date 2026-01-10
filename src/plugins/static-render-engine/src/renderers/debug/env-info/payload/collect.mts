type ProbeResult<T> = { ok: true; value: T } | { ok: false; error: string };

type ProbeMap = Record<string, ProbeResult<unknown>>;

function probeSync<T>(fn: () => T): ProbeResult<T> {
  try {
    return { ok: true, value: fn() };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function probeAsync<T>(fn: () => Promise<T>): Promise<ProbeResult<T>> {
  try {
    return { ok: true, value: await fn() };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function has(obj: unknown, key: string): boolean {
  return typeof obj === "object" && obj !== null && key in obj;
}

export async function collectEnvironmentInfo() {
  const failures: ProbeMap = {};

  // @ts-expect-error
  const nav = navigator as Record<string, unknown>;
  // @ts-expect-error
  const win = window as Record<string, unknown>;
  // const doc =
  //   // @ts-expect-error
  //   document as Record<string, unknown>;

  const ua = navigator.userAgent;

  const chromiumMajor = probeSync<number | null>(() => {
    const m = ua.match(/Chrome\/(\d+)/);
    return m ? Number(m[1]) : null;
  });

  if (!chromiumMajor.ok) failures.chromiumMajor = chromiumMajor;

  const deviceMemory = probeSync<number | null>(() => {
    return typeof nav["deviceMemory"] === "number" ? nav["deviceMemory"] : null;
  });

  if (!deviceMemory.ok) failures.deviceMemory = deviceMemory;

  const hardwareConcurrency = probeSync<number | null>(() => {
    return typeof navigator.hardwareConcurrency === "number"
      ? navigator.hardwareConcurrency
      : null;
  });

  if (!hardwareConcurrency.ok)
    failures.hardwareConcurrency = hardwareConcurrency;

  const timeZone = probeSync<string | null>(() => {
    if (!("Intl" in win)) return null;
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? null;
  });

  if (!timeZone.ok) failures.timeZone = timeZone;

  const userAgentData = probeSync<unknown | null>(() => {
    return has(nav, "userAgentData") ? nav["userAgentData"] : null;
  });

  if (!userAgentData.ok) failures.userAgentData = userAgentData;

  const sharedArrayBuffer = probeSync<boolean>(() => {
    return typeof (win as any)["SharedArrayBuffer"] === "function";
  });

  if (!sharedArrayBuffer.ok) failures.sharedArrayBuffer = sharedArrayBuffer;

  const webGL = probeSync<boolean>(() => {
    const canvas = document.createElement("canvas");
    return !!canvas.getContext("webgl");
  });

  if (!webGL.ok) failures.webGL = webGL;

  const storageEstimate = await probeAsync<number | null>(async () => {
    const storage = nav["storage"] as any;
    if (!storage?.estimate) return null;
    const e = await storage.estimate();
    return typeof e?.quota === "number" ? Math.round(e.quota / 1048576) : null;
  });

  if (!storageEstimate.ok) failures.storageEstimate = storageEstimate;

  const permissions = await probeAsync<Record<string, string> | null>(
    async () => {
      const perms = nav["permissions"] as any;
      if (!perms?.query) return null;

      const names = ["geolocation", "camera", "microphone"];
      const out: Record<string, string> = {};

      for (const name of names) {
        try {
          const r = await perms.query({ name });
          out[name] = r.state;
        } catch {
          out[name] = "unsupported";
        }
      }
      return out;
    },
  );

  if (!permissions.ok) failures.permissions = permissions;

  return {
    schemaVersion: "1.0.0",
    collectedAt: new Date().toISOString(),

    runtime: {
      userAgent: ua,
      platform: navigator.platform ?? null,
      language: navigator.language ?? null,
    },

    engine: {
      chromiumMajor: chromiumMajor.ok ? chromiumMajor.value : null,
    },

    limits: {
      deviceMemoryGB: deviceMemory.ok ? deviceMemory.value : null,
      hardwareConcurrency: hardwareConcurrency.ok
        ? hardwareConcurrency.value
        : null,
    },

    capabilities: {
      sharedArrayBuffer: sharedArrayBuffer.ok ? sharedArrayBuffer.value : false,
      webGL: webGL.ok ? webGL.value : false,
    },

    storage: {
      quotaEstimateMB: storageEstimate.ok ? storageEstimate.value : null,
    },

    permissions: permissions.ok ? permissions.value : null,

    diagnostics: {
      failedProbes: Object.keys(failures),
      failures,
    },

    // doc,
  };
}
