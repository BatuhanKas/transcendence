export function simpleHtml(title: string, message: string) {
    return `<!doctype html>
    <html lang="tr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <style>
          :root { color-scheme: light dark; }
          body { margin:0; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; display:grid; min-height: 100dvh; place-items: center; }
          .card { max-width: 520px; padding: 24px; border-radius: 12px; border: 1px solid rgba(0,0,0,.1); }
          h1 { margin: 0 0 8px; font-size: 20px; }
          p { margin: 0; line-height: 1.5; opacity: .85; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>${title}</h1>
          <p>${message}</p>
        </div>
      </body>
    </html>`;
}
