import { IslandDemo } from "@/components/IslandDemo";
import { ShapesList } from "@/components/ShapesList";
import { SpringLab } from "@/components/SpringLab";
import { TuckDemo } from "@/components/TuckDemo";
import { DownloadActions } from "@/components/Download";
import { REPO_URL, RELEASES_URL, SITE_OWNER_URL } from "@/lib/repo";

const LISTENS = [
  {
    title: "Now playing",
    text: "Spotify, YouTube in Chrome or Edge, Apple Music, VLC and anything else that uses Windows media controls. Open takes you back to the exact browser tab, not just the browser.",
  },
  {
    title: "Timers",
    text: "A stopwatch and countdowns with a progress ring. They sit beside your music when both are running.",
  },
  {
    title: "System events",
    text: "Volume changes, the charger going in, a low battery, Bluetooth headphones connecting or leaving.",
  },
  {
    title: "Notifications",
    text: "Mirrors Windows notifications from every app with the real icon, sender and preview. Dismiss one in the island and it clears from Windows too.",
  },
  {
    title: "Quick controls",
    text: "Wi-Fi, Bluetooth, dark mode, volume, brightness, switching speakers and microphones, and mic mute, in a Control Center style panel.",
  },
  {
    title: "Camera and mic dots",
    text: "A dot appears inside the island only while your camera or microphone is really in use. A muted mic does not count.",
  },
  {
    title: "Out of your way",
    text: "It never steals focus, stays out of Alt+Tab and the taskbar, lets clicks pass through everywhere outside the pill, and hides during fullscreen games, videos and slideshows.",
  },
  {
    title: "Updates",
    text: "Checks GitHub for new releases at startup and every six hours. Settings can install one silently, after checking its size and SHA-256.",
  },
];

const FAQ = [
  {
    q: "Is Pill free?",
    a: "Yes. It is open source under the MIT license, and the full source is on GitHub.",
  },
  {
    q: "Which version of Windows do I need?",
    a: "Windows 10 version 2004 or newer, or Windows 11. There are installers for x64 and ARM64.",
  },
  {
    q: "Will it get in the way of games, video or my work?",
    a: "No. It never takes keyboard focus, it is hidden from Alt+Tab and the taskbar, and it hides itself while a game, video or slideshow runs fullscreen. When a maximized window reaches under the island, it tucks into a thin line and lets clicks through.",
  },
  {
    q: "Why are notification previews missing on my PC?",
    a: "On some Windows builds, reading notifications needs package identity (MSIX). If Windows refuses access, Pill turns that one feature off, writes the reason to its log, and everything else keeps working. MSIX packaging is on the roadmap.",
  },
  {
    q: "Does it use my location?",
    a: "No. It never lists nearby Wi-Fi networks, because that needs location access. It shows your current connection, and Join another network opens the Windows network list.",
  },
  {
    q: "Does it work on more than one monitor?",
    a: "Not yet. Pill lives on the primary monitor. Multi monitor support is on the roadmap.",
  },
  {
    q: "What does it send over the internet?",
    a: "Pill has no accounts. The update check against GitHub is the one thing it asks the internet for, and you can turn it off in Settings.",
  },
  {
    q: "Is this affiliated with Apple?",
    a: "No. Dynamic Island is an Apple trademark. Pill is an independent project that takes inspiration from the idea.",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <div className="wrap nav-row">
          <a className="brand" href="#top" aria-label="Pill, home">
            <span className="brand-mark" aria-hidden="true"><i /></span>
            Pill
          </a>
          <nav aria-label="Primary">
            <a href="#shapes">Shapes</a>
            <a href="#listens">Features</a>
            <a href="#springs">Springs</a>
            <a href="#install">Install</a>
            <a href={REPO_URL}>GitHub</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero wrap" id="top">
          <div className="hero-head">
            <h1>The Dynamic Island, now on Windows.</h1>
            <div className="hero-side">
              <p className="lede">
                Pill sits at the top of your screen and morphs between music, timers, notifications and system
                events with real spring physics. It never steals focus, and it costs nothing while idle.
              </p>
              <DownloadActions />
            </div>
          </div>
          <IslandDemo />
        </section>

        <section className="section wrap" id="shapes">
          <div className="section-head">
            <h2>One pill, five shapes</h2>
            <p>
              The island decides what to show with the same priority order as iOS: an open dashboard beats a toast,
              a toast beats a peek, a peek beats a live activity, and a live activity beats idle.
            </p>
          </div>
          <ShapesList />
        </section>

        <section className="section wrap" id="listens">
          <div className="section-head">
            <h2>What it listens to</h2>
            <p>Media, power, audio and Bluetooth arrive as push events, so Pill does not poll and does not wake your CPU for nothing.</p>
          </div>
          <dl className="listens">
            {LISTENS.map((l) => (
              <div key={l.title} className="listen">
                <dt>{l.title}</dt>
                <dd>{l.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="section wrap" id="springs">
          <div className="section-head">
            <h2>Springs, not easing curves</h2>
            <p>
              Every move is a damped spring using SwiftUI&apos;s own parameters, response and damping fraction. Retarget
              it mid flight and it keeps its velocity, so open, close and open again reverses smoothly instead of
              restarting. Drag the sliders and release the pill.
            </p>
          </div>
          <SpringLab />
          <dl className="facts">
            <div>
              <dt>The window never resizes</dt>
              <dd>It is a fixed 620 by 470 transparent canvas. Only the shape inside it moves, and clicks pass through the clear pixels.</dd>
            </div>
            <div>
              <dt>Frame rate independent</dt>
              <dd>Springs integrate in fixed 1/480 s steps, so motion is identical at 60, 120 and 144 Hz and survives dropped frames.</dd>
            </div>
            <div>
              <dt>Zero idle cost</dt>
              <dd>The render hook attaches only while something moves and detaches when every spring rests.</dd>
            </div>
          </dl>
        </section>

        <section className="section wrap" id="tuck">
          <div className="section-head">
            <h2>It gets out of your tabs</h2>
            <p>
              When the focused window reaches under the island, such as a maximized browser, Pill shrinks to a thin
              line at the top edge and becomes fully click through, blur included. Your tabs work as if it were not
              there. Hold the pointer over its spot for about 0.4 seconds and it returns. You can also choose Stay on top in Settings.
            </p>
          </div>
          <TuckDemo />
        </section>

        <section className="section wrap install" id="install">
          <div className="section-head">
            <h2>Install in a minute</h2>
          </div>
          <ol className="steps">
            <li>
              <h3>Download the installer</h3>
              <p>Pick x64 or ARM64 from the latest release. The portable zip works too.</p>
            </li>
            <li>
              <h3>Run it</h3>
              <p>Pill installs for your account, starts when you sign in, and appears at the top of your screen.</p>
            </li>
            <li>
              <h3>Open it from anywhere</h3>
              <p>
                Click the island, or press Ctrl+Alt+Space. If another app already owns that shortcut, Pill uses
                Alt+Shift+Space instead. Right click for the menu with timers, style and Start with Windows.
              </p>
            </li>
          </ol>
          <DownloadActions compact />

          <div className="source">
            <h3>Build from source</h3>
            <p>You need the .NET 8 SDK, which <code>winget install Microsoft.DotNet.SDK.8</code> installs.</p>
            <pre><code>{`git clone ${REPO_URL}.git
cd Pill
dotnet run --project src\\DynamicIsland -c Release`}</code></pre>
          </div>
        </section>

        <section className="section wrap" id="faq">
          <div className="section-head">
            <h2>Questions</h2>
          </div>
          <div className="faq">
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap foot-row">
          <div>
            <p className="foot-name">Pill</p>
            <p>
              Made by <a href={SITE_OWNER_URL}>Swastik Verma</a>. Released under the MIT license.
            </p>
            <p className="foot-small">
              Dynamic Island is a trademark of Apple Inc. Pill is an independent project and is not affiliated with or
              endorsed by Apple.
            </p>
          </div>
          <ul>
            <li><a href={REPO_URL}>Source on GitHub</a></li>
            <li><a href={RELEASES_URL}>Latest release</a></li>
            <li><a href={`${REPO_URL}/issues`}>Report a problem</a></li>
          </ul>
        </div>
      </footer>
    </>
  );
}
