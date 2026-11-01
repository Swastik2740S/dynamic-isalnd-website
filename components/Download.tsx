"use client";

import { useEffect, useState } from "react";
import { REPO, RELEASES_URL, REPO_URL } from "@/lib/repo";

type Release = { tag: string; x64?: string; arm64?: string };

let cache: Release | null | undefined;

function useRelease() {
  const [release, setRelease] = useState<Release | null>(cache ?? null);

  useEffect(() => {
    if (cache !== undefined) return;
    let alive = true;
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        const assets: { name: string; browser_download_url: string }[] = data.assets ?? [];
        const installers = assets.filter(
          (a) => /\.exe$/i.test(a.name) && a.browser_download_url.startsWith(`${REPO_URL}/releases/download/`),
        );
        const arm = installers.find((a) => /arm/i.test(a.name));
        const x64 = installers.find((a) => !/arm/i.test(a.name));
        cache = { tag: data.tag_name, x64: x64?.browser_download_url, arm64: arm?.browser_download_url };
        if (alive) setRelease(cache);
      })
      .catch(() => {
        cache = null;
      });
    return () => {
      alive = false;
    };
  }, []);

  return release;
}

export function DownloadActions({ compact = false }: { compact?: boolean }) {
  const release = useRelease();
  const main = release?.x64 ?? RELEASES_URL;

  return (
    <div className={compact ? "dl dl-compact" : "dl"}>
      <div className="dl-buttons">
        <a className="btn btn-primary" href={main}>
          Download for Windows
        </a>
        <a className="btn btn-quiet" href={REPO_URL}>
          View on GitHub
        </a>
      </div>
      <p className="dl-note">
        {release ? `Version ${release.tag}. ` : ""}
        Free and open source. Windows 10 (2004) or newer.
        {release?.arm64 ? (
          <>
            {" "}
            On an ARM PC, <a href={release.arm64}>get the ARM64 installer</a>.
          </>
        ) : (
          <>
            {" "}
            x64 and ARM64 builds are on the <a href={RELEASES_URL}>releases page</a>.
          </>
        )}
      </p>
    </div>
  );
}
